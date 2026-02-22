import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Company } from '@/data/mockCompanies';

export interface CompanyList {
    id: string;
    name: string;
    companyIds: string[];
    createdAt: number;
}

export interface SavedSearch {
    id: string;
    query: string;
    filters: Record<string, string>;
    createdAt: number;
}

export interface FundThesis {
    fundName: string;
    description: string;
    stages: string[];
    industries: string[];
    geography: string;
    checkSizeMin: string;
    checkSizeMax: string;
}

const DEFAULT_THESIS: FundThesis = {
    fundName: '',
    description: '',
    stages: [],
    industries: [],
    geography: '',
    checkSizeMin: '',
    checkSizeMax: '',
};

interface AppState {
    user: { id: string; email: string; name: string } | null;
    setUser: (user: { id: string; email: string; name: string } | null) => void;
    thesis: FundThesis;
    setThesis: (thesis: FundThesis) => void;
    lists: CompanyList[];
    savedSearches: SavedSearch[];
    notes: Record<string, string>;
    companyStatuses: Record<string, 'new' | 'viewed' | 'contacted'>;
    customCompanies: Company[];
    dbSynced: boolean;

    // DB-synced actions
    initializeFromDB: () => Promise<void>;
    addList: (name: string) => Promise<void>;
    removeList: (id: string) => Promise<void>;
    addCompanyToList: (listId: string, companyId: string) => Promise<void>;
    removeCompanyFromList: (listId: string, companyId: string) => Promise<void>;
    saveSearch: (query: string, filters: Record<string, string>) => Promise<void>;
    removeSavedSearch: (id: string) => Promise<void>;
    saveNote: (companyId: string, note: string) => Promise<void>;
    updateCompanyStatus: (companyId: string, status: 'new' | 'viewed' | 'contacted') => void;
    addCustomCompany: (company: Company, enrichmentData?: Record<string, unknown>) => Promise<void>;
    removeCustomCompany: (id: string) => Promise<void>;
    saveThesisToDB: (thesis: FundThesis) => Promise<void>;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: null,
            setUser: (user) => set({ user }),
            thesis: DEFAULT_THESIS,
            setThesis: (thesis) => set({ thesis }),
            lists: [],
            savedSearches: [],
            customCompanies: [],
            notes: {},
            companyStatuses: {},
            dbSynced: false,

            initializeFromDB: async () => {
                if (get().dbSynced) return;
                try {
                    const [listsRes, searchesRes, thesisRes, customRes] = await Promise.all([
                        fetch('/api/lists'),
                        fetch('/api/saved-searches'),
                        fetch('/api/thesis'),
                        fetch('/api/custom-companies'),
                    ]);

                    if (listsRes.ok) {
                        const lists = await listsRes.json();
                        set({ lists });
                    }
                    if (searchesRes.ok) {
                        const savedSearches = await searchesRes.json();
                        set({ savedSearches });
                    }
                    if (thesisRes.ok) {
                        const thesisData = await thesisRes.json();
                        if (thesisData.description) set({ thesis: thesisData });
                    }
                    if (customRes.ok) {
                        const customCompanies = await customRes.json();
                        set({ customCompanies });
                    }
                    set({ dbSynced: true });
                } catch {
                    // If offline, continue with cached localStorage data
                }
            },

            addList: async (name) => {
                try {
                    const res = await fetch('/api/lists', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name }),
                    });
                    if (res.ok) {
                        const list = await res.json();
                        set(state => ({ lists: [list, ...state.lists] }));
                        return;
                    }
                } catch { /* fall through */ }
                // Offline fallback
                set(state => ({
                    lists: [{ id: Date.now().toString(), name, companyIds: [], createdAt: Date.now() }, ...state.lists]
                }));
            },

            removeList: async (id) => {
                // Optimistic update
                set(state => ({ lists: state.lists.filter(l => l.id !== id) }));
                try {
                    await fetch(`/api/lists/${id}`, { method: 'DELETE' });
                } catch { /* no-op */ }
            },

            addCompanyToList: async (listId, companyId) => {
                // Optimistic
                set(state => ({
                    lists: state.lists.map(list =>
                        list.id === listId && !list.companyIds.includes(companyId)
                            ? { ...list, companyIds: [...list.companyIds, companyId] }
                            : list
                    )
                }));
                try {
                    await fetch(`/api/lists/${listId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ companyId, action: 'add' }),
                    });
                } catch { /* no-op */ }
            },

            removeCompanyFromList: async (listId, companyId) => {
                // Optimistic
                set(state => ({
                    lists: state.lists.map(list =>
                        list.id === listId
                            ? { ...list, companyIds: list.companyIds.filter(id => id !== companyId) }
                            : list
                    )
                }));
                try {
                    await fetch(`/api/lists/${listId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ companyId, action: 'remove' }),
                    });
                } catch { /* no-op */ }
            },

            saveSearch: async (query, filters) => {
                try {
                    const res = await fetch('/api/saved-searches', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query, filters }),
                    });
                    if (res.ok) {
                        const search = await res.json();
                        set(state => ({ savedSearches: [search, ...state.savedSearches] }));
                        return;
                    }
                } catch { /* fall through */ }
                set(state => ({
                    savedSearches: [{ id: Date.now().toString(), query, filters, createdAt: Date.now() }, ...state.savedSearches]
                }));
            },

            removeSavedSearch: async (id) => {
                set(state => ({ savedSearches: state.savedSearches.filter(s => s.id !== id) }));
                try {
                    await fetch('/api/saved-searches', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id }),
                    });
                } catch { /* no-op */ }
            },

            saveNote: async (companyId, note) => {
                set(state => ({ notes: { ...state.notes, [companyId]: note } }));
                try {
                    await fetch(`/api/notes/${companyId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content: note }),
                    });
                } catch { /* no-op */ }
            },

            updateCompanyStatus: (companyId, status) => {
                set(state => ({
                    companyStatuses: { ...state.companyStatuses, [companyId]: status }
                }));
            },

            addCustomCompany: async (company, enrichmentData) => {
                // Optimistic local update first
                set(state => ({
                    customCompanies: [company, ...state.customCompanies.filter(c => c.id !== company.id)]
                }));
                try {
                    await fetch('/api/custom-companies', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ company, enrichmentData: enrichmentData || {} }),
                    });
                } catch { /* no-op */ }
            },

            removeCustomCompany: async (id) => {
                set(state => ({ customCompanies: state.customCompanies.filter(c => c.id !== id) }));
                try {
                    await fetch('/api/custom-companies', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id }),
                    });
                } catch { /* no-op */ }
            },

            saveThesisToDB: async (thesis) => {
                set({ thesis });
                try {
                    await fetch('/api/thesis', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(thesis),
                    });
                } catch { /* no-op */ }
            },
        }),
        {
            name: 'vc-scout-storage',
            // Only cache non-sensitive fast-access data locally
            partialize: (state) => ({
                thesis: state.thesis,
                notes: state.notes,
                companyStatuses: state.companyStatuses,
                dbSynced: false, // Always re-sync on fresh session
            }),
        }
    )
);
