'use client';
import React, { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { mockCompanies } from '@/data/mockCompanies';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, BookmarkPlus } from 'lucide-react';

function CompaniesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [search, setSearch] = useState(initialQuery);
    const [industryFilter, setIndustryFilter] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const filteredCompanies = useMemo(() => {
        return mockCompanies.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.description.toLowerCase().includes(search.toLowerCase());
            const matchesIndustry = industryFilter ? c.industry === industryFilter : true;
            return matchesSearch && matchesIndustry;
        });
    }, [search, industryFilter]);

    const paginatedCompanies = filteredCompanies.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

    const industries = Array.from(new Set(mockCompanies.map(c => c.industry)));

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Discover Companies</h1>
                    <p className="text-neutral-400 mt-1">Found {filteredCompanies.length} companies matching your criteria.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => useAppStore.getState().saveSearch(search, industryFilter ? { industry: industryFilter } : {})}>
                        <BookmarkPlus className="w-4 h-4 mr-2" /> Save Search
                    </Button>
                    <Button onClick={() => router.push('/lists')}>Create List</Button>
                </div>
            </div>

            <div className="flex gap-4 items-center bg-card p-4 rounded-xl border border-border">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <Input
                        placeholder="Search name or description..."
                        className="pl-9 bg-background border-transparent"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <div className="h-8 w-px bg-border"></div>
                <div className="flex-1">
                    <select
                        className="w-full bg-background border border-transparent rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-neutral-200"
                        value={industryFilter}
                        onChange={(e) => { setIndustryFilter(e.target.value); setPage(1); }}
                    >
                        <option value="">All Industries</option>
                        {industries.map(ind => (
                            <option key={ind} value={ind}>{ind}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-medium">Company</TableHead>
                            <TableHead className="font-medium">Industry</TableHead>
                            <TableHead className="font-medium">Stage</TableHead>
                            <TableHead className="font-medium">Location</TableHead>
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
                                    <div className="font-medium text-foreground group-hover:text-blue-500 transition-colors">{company.name}</div>
                                    <div className="text-muted-foreground text-xs mt-1 max-w-xs truncate">{company.description}</div>
                                </TableCell>
                                <TableCell><Badge variant="outline">{company.industry}</Badge></TableCell>
                                <TableCell className="text-muted-foreground">{company.stage}</TableCell>
                                <TableCell className="text-muted-foreground">{company.hq}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={company.status === 'new' ? 'default' : company.status === 'contacted' ? 'secondary' : 'outline'}>
                                        {company.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        {paginatedCompanies.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No companies found matching your filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border">
                    <p className="text-sm text-neutral-400">
                        Showing <span className="text-white font-medium">{(page - 1) * itemsPerPage + 1}</span> to <span className="text-white font-medium">{Math.min(page * itemsPerPage, filteredCompanies.length)}</span> of <span className="text-white font-medium">{filteredCompanies.length}</span> results
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
        <Suspense fallback={<div className="p-8 text-neutral-400">Loading companies...</div>}>
            <CompaniesContent />
        </Suspense>
    );
}
