import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface AppState {
    lists: CompanyList[];
    savedSearches: SavedSearch[];
    notes: Record<string, string>;
    addList: (name: string) => void;
    removeList: (id: string) => void;
    addCompanyToList: (listId: string, companyId: string) => void;
    removeCompanyFromList: (listId: string, companyId: string) => void;
    saveSearch: (query: string, filters: Record<string, string>) => void;
    removeSavedSearch: (id: string) => void;
    saveNote: (companyId: string, note: string) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            lists: [],
            savedSearches: [],
            notes: {},

            addList: (name) => set((state) => ({
                lists: [...state.lists, { id: Date.now().toString(), name, companyIds: [], createdAt: Date.now() }]
            })),

            removeList: (id) => set((state) => ({
                lists: state.lists.filter((l) => l.id !== id)
            })),

            addCompanyToList: (listId, companyId) => set((state) => ({
                lists: state.lists.map(list =>
                    list.id === listId && !list.companyIds.includes(companyId)
                        ? { ...list, companyIds: [...list.companyIds, companyId] }
                        : list
                )
            })),

            removeCompanyFromList: (listId, companyId) => set((state) => ({
                lists: state.lists.map(list =>
                    list.id === listId
                        ? { ...list, companyIds: list.companyIds.filter(id => id !== companyId) }
                        : list
                )
            })),

            saveSearch: (query, filters) => set((state) => ({
                savedSearches: [...state.savedSearches, { id: Date.now().toString(), query, filters, createdAt: Date.now() }]
            })),

            removeSavedSearch: (id) => set((state) => ({
                savedSearches: state.savedSearches.filter((s) => s.id !== id)
            })),

            saveNote: (companyId, note) => set((state) => ({
                notes: { ...state.notes, [companyId]: note }
            }))
        }),
        {
            name: 'vc-scout-storage',
        }
    )
);
