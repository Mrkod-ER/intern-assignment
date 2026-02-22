'use client';
import React from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Play, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

function buildSearchUrl(query: string, filters: Record<string, string>): string {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    return `/companies?${params.toString()}`;
}

function FilterDisplay({ filters }: { filters: Record<string, string> }) {
    const chips: string[] = [];
    if (filters.stages) filters.stages.split(',').filter(Boolean).forEach(s => chips.push(`Stage: ${s}`));
    if (filters.industries) filters.industries.split(',').filter(Boolean).forEach(i => chips.push(`Industry: ${i}`));
    if (filters.hq) chips.push(`HQ: ${filters.hq}`);
    if (chips.length === 0) return <span className="text-xs text-muted-foreground">No filters applied</span>;
    return (
        <div className="flex flex-wrap gap-1.5 mt-2">
            {chips.map((chip, i) => (
                <Badge key={i} variant="secondary" className="text-xs font-normal">{chip}</Badge>
            ))}
        </div>
    );
}

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
                        <p className="text-muted-foreground text-sm">Save a search from the Discover page to see it here.</p>
                    </div>
                ) : (
                    savedSearches.map(search => (
                        <Card key={search.id} className="border-border">
                            <CardContent className="p-5 flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-foreground">
                                        {search.query ? `"${search.query}"` : 'All Companies'}
                                    </h3>
                                    <FilterDisplay filters={search.filters} />
                                    <p className="text-xs text-muted-foreground mt-3">
                                        Saved {format(new Date(search.createdAt), 'MMM dd, yyyy · h:mm a')}
                                    </p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <Button
                                        size="sm"
                                        onClick={() => router.push(buildSearchUrl(search.query, search.filters))}
                                    >
                                        <Play className="w-3.5 h-3.5 mr-1.5" /> Run
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeSavedSearch(search.id)}
                                        className="text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
