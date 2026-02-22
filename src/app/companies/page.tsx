'use client';
import React, { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { mockCompanies } from '@/data/mockCompanies';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Search, ChevronLeft, ChevronRight, BookmarkPlus, X, SlidersHorizontal } from 'lucide-react';

const ALL_STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D', 'Late Stage', 'Public'];
const ALL_INDUSTRIES = Array.from(new Set(mockCompanies.map(c => c.industry))).sort();
const ALL_HQ = Array.from(new Set(mockCompanies.map(c => c.hq))).sort();

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {label}
            <button onClick={onRemove} className="hover:text-foreground transition-colors ml-0.5">
                <X className="w-3 h-3" />
            </button>
        </span>
    );
}

function CompaniesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [search, setSearch] = useState(initialQuery);
    const [selectedStages, setSelectedStages] = useState<string[]>([]);
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
    const [selectedHq, setSelectedHq] = useState('');
    const [foundedFrom, setFoundedFrom] = useState('');
    const [foundedTo, setFoundedTo] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const toggleStage = (s: string) => {
        setSelectedStages(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
        setPage(1);
    };
    const toggleIndustry = (i: string) => {
        setSelectedIndustries(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
        setPage(1);
    };

    const filteredCompanies = useMemo(() => {
        return mockCompanies.filter(c => {
            const matchSearch = !search ||
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.description.toLowerCase().includes(search.toLowerCase()) ||
                (c.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
            const matchStage = selectedStages.length === 0 || selectedStages.includes(c.stage);
            const matchIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(c.industry);
            const matchHq = !selectedHq || c.hq.toLowerCase().includes(selectedHq.toLowerCase());
            const matchFrom = !foundedFrom || parseInt(c.founded) >= parseInt(foundedFrom);
            const matchTo = !foundedTo || parseInt(c.founded) <= parseInt(foundedTo);
            return matchSearch && matchStage && matchIndustry && matchHq && matchFrom && matchTo;
        });
    }, [search, selectedStages, selectedIndustries, selectedHq, foundedFrom, foundedTo]);

    const paginatedCompanies = filteredCompanies.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

    const activeFilters = [
        ...selectedStages.map(s => ({ label: `Stage: ${s}`, remove: () => toggleStage(s) })),
        ...selectedIndustries.map(i => ({ label: `Industry: ${i}`, remove: () => toggleIndustry(i) })),
        ...(selectedHq ? [{ label: `HQ: ${selectedHq}`, remove: () => setSelectedHq('') }] : []),
        ...(foundedFrom ? [{ label: `Founded ≥ ${foundedFrom}`, remove: () => setFoundedFrom('') }] : []),
        ...(foundedTo ? [{ label: `Founded ≤ ${foundedTo}`, remove: () => setFoundedTo('') }] : []),
    ];

    const clearAll = () => {
        setSelectedStages([]); setSelectedIndustries([]); setSelectedHq('');
        setFoundedFrom(''); setFoundedTo(''); setPage(1);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Discover Companies</h1>
                    <p className="text-muted-foreground mt-1">
                        {filteredCompanies.length} of {mockCompanies.length} companies match your criteria.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => useAppStore.getState().saveSearch(search, {
                        stages: selectedStages.join(','),
                        industries: selectedIndustries.join(','),
                        hq: selectedHq,
                    })}>
                        <BookmarkPlus className="w-4 h-4 mr-2" /> Save Search
                    </Button>
                    <Button onClick={() => router.push('/lists')}>Create List</Button>
                </div>
            </div>

            {/* Search + Filter Toggle */}
            <div className="flex gap-3 items-center">
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search name, description, tags..."
                        className="pl-9 bg-muted/30 border-border"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <Button
                    variant={showFilters ? 'secondary' : 'outline'}
                    onClick={() => setShowFilters(f => !f)}
                    className="gap-2"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilters.length > 0 && (
                        <span className="ml-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                            {activeFilters.length}
                        </span>
                    )}
                </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-card border border-border rounded-xl p-5 space-y-5">
                    {/* Stage */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Stage</p>
                        <div className="flex flex-wrap gap-2">
                            {ALL_STAGES.map(s => (
                                <button
                                    key={s}
                                    onClick={() => toggleStage(s)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${selectedStages.includes(s)
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Industry */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Industry</p>
                        <div className="flex flex-wrap gap-2">
                            {ALL_INDUSTRIES.map(i => (
                                <button
                                    key={i}
                                    onClick={() => toggleIndustry(i)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${selectedIndustries.includes(i)
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                                        }`}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* HQ + Founded */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">HQ / Location</p>
                            <Input
                                placeholder="e.g., New York"
                                value={selectedHq}
                                onChange={e => { setSelectedHq(e.target.value); setPage(1); }}
                                className="bg-background border-border"
                            />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Founded From</p>
                            <Input
                                placeholder="e.g., 2019"
                                type="number"
                                value={foundedFrom}
                                onChange={e => { setFoundedFrom(e.target.value); setPage(1); }}
                                className="bg-background border-border"
                            />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Founded To</p>
                            <Input
                                placeholder="e.g., 2023"
                                type="number"
                                value={foundedTo}
                                onChange={e => { setFoundedTo(e.target.value); setPage(1); }}
                                className="bg-background border-border"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Active Filter Chips */}
            {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">Active filters:</span>
                    {activeFilters.map((f, i) => <FilterChip key={i} label={f.label} onRemove={f.remove} />)}
                    <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 ml-1">
                        Clear all
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-medium">Company</TableHead>
                            <TableHead className="font-medium">Industry</TableHead>
                            <TableHead className="font-medium">Stage</TableHead>
                            <TableHead className="font-medium">Location</TableHead>
                            <TableHead className="font-medium">Founded</TableHead>
                            <TableHead className="font-medium text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedCompanies.map((company) => (
                            <TableRow
                                key={company.id}
                                onClick={() => router.push(`/companies/${company.id}`)}
                                className="cursor-pointer group hover:bg-muted/50 transition-colors"
                            >
                                <TableCell>
                                    <div className="font-medium text-foreground group-hover:text-primary transition-colors">{company.name}</div>
                                    <div className="text-muted-foreground text-xs mt-0.5 max-w-xs truncate">{company.description}</div>
                                    {company.tags && company.tags.length > 0 && (
                                        <div className="flex gap-1 mt-1.5 flex-wrap">
                                            {company.tags.slice(0, 3).map(t => (
                                                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell><Badge variant="outline">{company.industry}</Badge></TableCell>
                                <TableCell className="text-muted-foreground text-sm">{company.stage}</TableCell>
                                <TableCell className="text-muted-foreground text-sm">{company.hq}</TableCell>
                                <TableCell className="text-muted-foreground text-sm">{company.founded}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={
                                        company.status === 'new' ? 'default' :
                                            company.status === 'contacted' ? 'secondary' : 'outline'
                                    }>
                                        {company.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        {paginatedCompanies.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    No companies match the current filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border">
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="text-foreground font-medium">{(page - 1) * itemsPerPage + 1}</span>–
                        <span className="text-foreground font-medium">{Math.min(page * itemsPerPage, filteredCompanies.length)}</span> of{' '}
                        <span className="text-foreground font-medium">{filteredCompanies.length}</span>
                    </p>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                            Next <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CompaniesPage() {
    return (
        <Suspense fallback={<div className="p-8 text-muted-foreground">Loading companies...</div>}>
            <CompaniesContent />
        </Suspense>
    );
}
