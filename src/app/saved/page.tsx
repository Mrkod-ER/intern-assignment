'use client';
import React from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
                <p className="text-muted-foreground">Quickly re-run your frequent discovery queries.</p>
            </div>

            <div className="space-y-4">
                {savedSearches.length === 0 ? (
                    <div className="text-center p-12 bg-muted/30 rounded-xl border border-border border-dashed">
                        <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No saved searches</h3>
                        <p className="text-muted-foreground text-sm">You haven't saved any searches yet.</p>
                    </div>
                ) : (
                    savedSearches.map(search => (
                        <Card key={search.id} className="p-6 border-border flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    {search.query || 'Wildcard Search'}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Filters: {Object.keys(search.filters).length > 0 ? JSON.stringify(search.filters) : 'None'}
                                </p>
                                <p className="text-xs text-muted-foreground mt-3">
                                    Saved on {format(new Date(search.createdAt), 'MMM dd, yyyy')}
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Button
                                    onClick={() => router.push(`/companies?q=${encodeURIComponent(search.query)}`)}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                                >
                                    <Play className="w-4 h-4 mr-2" /> Run Search
                                </Button>
                                <Button variant="ghost" onClick={() => removeSavedSearch(search.id)} className="text-muted-foreground hover:text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
