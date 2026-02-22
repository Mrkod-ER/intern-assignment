'use client';
import React from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Bookmark, Play, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function SavedSearchesPage() {
    const { savedSearches, removeSavedSearch } = useAppStore();
    const router = useRouter();

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">Saved Searches</h1>
                <p className="text-neutral-400">Quickly re-run your frequent discovery queries.</p>
            </div>

            <div className="space-y-4">
                {savedSearches.length === 0 ? (
                    <div className="text-center p-12 bg-neutral-900/50 rounded-xl border border-border border-dashed">
                        <Bookmark className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No saved searches</h3>
                        <p className="text-neutral-400 text-sm">You haven't saved any searches yet.</p>
                    </div>
                ) : (
                    savedSearches.map(search => (
                        <div key={search.id} className="bg-card p-6 rounded-xl border border-border flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {search.query || 'Wildcard Search'}
                                </h3>
                                <p className="text-sm text-neutral-500 mt-1">
                                    Filters: {Object.keys(search.filters).length > 0 ? JSON.stringify(search.filters) : 'None'}
                                </p>
                                <p className="text-xs text-neutral-600 mt-3">
                                    Saved on {format(new Date(search.createdAt), 'MMM dd, yyyy')}
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Button
                                    onClick={() => router.push(`/companies?q=${encodeURIComponent(search.query)}`)}
                                    className="bg-neutral-800 hover:bg-neutral-700 text-white border-0"
                                >
                                    <Play className="w-4 h-4 mr-2" /> Run Search
                                </Button>
                                <Button variant="ghost" onClick={() => removeSavedSearch(search.id)} className="text-neutral-500 hover:text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
