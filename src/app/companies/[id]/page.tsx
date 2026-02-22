'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockCompanies } from '@/data/mockCompanies';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, Building2, ExternalLink, Sparkles, Loader2, BookmarkPlus, MapPin, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function CompanyProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const company = mockCompanies.find(c => c.id === id);
    const { lists, addCompanyToList, removeCompanyFromList, notes, saveNote } = useAppStore();
    const [enriching, setEnriching] = useState(false);
    const [enrichedData, setEnrichedData] = useState<any>(null);
    const [localNote, setLocalNote] = useState('');

    useEffect(() => {
        if (company && notes[company.id]) {
            setLocalNote(notes[company.id]);
        }
    }, [company, notes]);

    useEffect(() => {
        if (id) {
            const cached = localStorage.getItem(`enrichment_${id}`);
            if (cached) {
                setEnrichedData(JSON.parse(cached));
            }
        }
    }, [id]);

    if (!company) {
        return <div className="p-8 text-center text-muted-foreground">Company not found.</div>;
    }

    const handleEnrich = async () => {
        setEnriching(true);
        try {
            const res = await fetch('/api/enrich', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: company.website.replace('https://', '').replace('http://', '') })
            });
            const data = await res.json();
            if (res.ok) {
                setEnrichedData(data);
                localStorage.setItem(`enrichment_${id}`, JSON.stringify(data));
            } else {
                alert('Enrichment failed: ' + data.error);
            }
        } catch (err) {
            alert('Network error during enrichment.');
        } finally {
            setEnriching(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground mb-5 -ml-2 hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Discover
                </Button>

                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-5">
                        <div className="w-16 h-16 bg-muted rounded-xl border border-border flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-muted-foreground">
                                <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center hover:text-foreground transition-colors">
                                    {company.website.replace('https://', '')} <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                                <span>&bull;</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{company.hq}</span>
                                <span>&bull;</span>
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Founded {company.founded}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Save to List Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <BookmarkPlus className="w-4 h-4 mr-2" />
                                    {lists.length > 0 ? 'Save to List' : 'Create List'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                                {lists.length > 0 ? (
                                    <>
                                        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Your Lists</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {lists.map(list => {
                                            const isSaved = list.companyIds.includes(company.id);
                                            return (
                                                <DropdownMenuItem
                                                    key={list.id}
                                                    onClick={() => isSaved ? removeCompanyFromList(list.id, company.id) : addCompanyToList(list.id, company.id)}
                                                    className="cursor-pointer justify-between"
                                                >
                                                    <span className="truncate mr-2">{list.name}</span>
                                                    {isSaved && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                                                </DropdownMenuItem>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <DropdownMenuItem onClick={() => router.push('/lists')} className="cursor-pointer">
                                        Create a new list
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button onClick={handleEnrich} disabled={enriching} className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                            {enriching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                            {enriching ? 'Enriching...' : 'Live Enrich'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="col-span-2 space-y-6">
                    {/* Overview Card */}
                    <Card className="border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                {enrichedData?.summary || company.description}
                            </p>
                            <Separator />
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{company.industry}</Badge>
                                <Badge variant="secondary">{company.stage}</Badge>
                                {enrichedData?.keywords?.map((kw: string) => (
                                    <Badge key={kw} variant="outline" className="text-muted-foreground">{kw}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Enrichment Panel */}
                    {enrichedData && (
                        <Card className="border-blue-900/40 bg-[#0f1015] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 blur-[60px] -mr-10 -mt-10 rounded-full pointer-events-none" />
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-semibold flex items-center gap-2 text-blue-100">
                                        <Sparkles className="w-4 h-4 text-blue-400" /> What they do
                                    </CardTitle>
                                    <Badge variant="secondary" className="text-xs bg-blue-900/30 text-blue-300 border-blue-800/50">AI Enriched</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {enrichedData.whatTheyDo?.map((bullet: string, i: number) => (
                                        <li key={i} className="flex items-start text-sm text-blue-50/70">
                                            <span className="text-blue-500 mr-3 mt-1 text-xs flex-shrink-0">◆</span>
                                            <span className="leading-relaxed">{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Timeline & Signals Card */}
                    <Card className="border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Timeline &amp; Signals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {enrichedData?.derivedSignals?.map((signal: string, i: number) => (
                                    <div key={i} className="flex relative items-start">
                                        <div className="absolute left-2.5 top-5 bottom-[-1.5rem] w-px bg-border" />
                                        <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5 z-10">
                                            <Sparkles className="w-3 h-3 text-blue-400" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-blue-100">Derived Signal</p>
                                            <p className="text-sm text-muted-foreground mt-1">{signal}</p>
                                            <p className="text-xs text-muted-foreground/60 mt-2 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Found via Live Scrape
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex items-start">
                                    <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-foreground">Added to system</p>
                                        <p className="text-xs text-muted-foreground mt-1">Found via internal database</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Sources Card */}
                    <Card className="border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">Sources</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {enrichedData?.sources ? (
                                <div className="space-y-3">
                                    {enrichedData.sources.map((src: any, i: number) => (
                                        <div key={i} className="text-xs">
                                            <a href={src.url.replace('https://r.jina.ai/', 'https://')} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline truncate block">
                                                {src.url.replace('https://r.jina.ai/', '')}
                                            </a>
                                            <p className="text-muted-foreground/70 mt-1">{format(new Date(src.timestamp), 'MMM dd, yyyy HH:mm')}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground">No external sources scanned yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Notes Card */}
                    <Card className="border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Textarea
                                className="h-28 resize-none bg-background text-sm placeholder:text-muted-foreground/60 focus-visible:ring-1"
                                placeholder="Add your thesis thoughts here..."
                                value={localNote}
                                onChange={(e) => setLocalNote(e.target.value)}
                            />
                            <Button size="sm" variant="secondary" className="w-full" onClick={() => saveNote(company.id, localNote)}>
                                Save Note
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
