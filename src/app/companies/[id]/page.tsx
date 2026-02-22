'use client';
import React, { useState, useEffect, useMemo } from 'react';
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
import { ArrowLeft, Building2, ExternalLink, Sparkles, Loader2, BookmarkPlus, MapPin, Calendar, Clock, CheckCircle2, AlertTriangle, Target } from 'lucide-react';
import { format } from 'date-fns';

type ScoreData = {
    score: number;
    verdict: string;
    reasons: string[];
    redFlags: string[];
};

const VERDICT_COLORS: Record<string, string> = {
    'Strong Fit': 'text-green-400',
    'Good Fit': 'text-emerald-400',
    'Partial Fit': 'text-yellow-400',
    'Weak Fit': 'text-orange-400',
    'Not a Fit': 'text-red-400',
};

const SCORE_BG = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-emerald-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-red-500';
};

export default function CompanyProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { lists, addCompanyToList, removeCompanyFromList, notes, saveNote, thesis, customCompanies, companyStatuses, updateCompanyStatus } = useAppStore();
    const company = useMemo(
        () => customCompanies.find(c => c.id === id) || mockCompanies.find(c => c.id === id),
        [id, customCompanies]
    );
    const [enriching, setEnriching] = useState(false);
    const [scoring, setScoring] = useState(false);
    const [enrichedData, setEnrichedData] = useState<any>(null);
    const [scoreData, setScoreData] = useState<ScoreData | null>(null);
    const [localNote, setLocalNote] = useState('');

    useEffect(() => {
        if (company && notes[company.id]) setLocalNote(notes[company.id]);
    }, [company, notes]);

    useEffect(() => {
        if (id) {
            const cached = localStorage.getItem(`enrichment_${id}`);
            if (cached) setEnrichedData(JSON.parse(cached));
            const cachedScore = localStorage.getItem(`score_${id}`);
            if (cachedScore) setScoreData(JSON.parse(cachedScore));
        }
    }, [id]);

    // Auto-mark as viewed when profile is opened
    useEffect(() => {
        if (id && typeof id === 'string') {
            const currentStatus = companyStatuses[id];
            if (!currentStatus || currentStatus === 'new') {
                updateCompanyStatus(id, 'viewed');
            }
        }
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!company) return <div className="p-8 text-center text-muted-foreground">Company not found.</div>;

    const currentStatus = companyStatuses[typeof id === 'string' ? id : ''] || 'viewed';
    const thesisConfigured = thesis.description?.trim().length > 10;

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
        } catch {
            alert('Network error during enrichment.');
        } finally {
            setEnriching(false);
        }
    };

    const handleScore = async () => {
        setScoring(true);
        try {
            const res = await fetch('/api/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company, enrichedData, thesis })
            });
            const data = await res.json();
            if (res.ok) {
                setScoreData(data);
                localStorage.setItem(`score_${id}`, JSON.stringify(data));
            } else {
                alert('Scoring failed: ' + data.error);
            }
        } catch {
            alert('Network error during scoring.');
        } finally {
            setScoring(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground mb-5 -ml-2">
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
                        {/* Status selector */}
                        <div className="flex items-center bg-muted rounded-lg p-1 gap-1">
                            {(['new', 'viewed', 'contacted'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => updateCompanyStatus(typeof id === 'string' ? id : '', s)}
                                    className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${currentStatus === s
                                            ? s === 'contacted' ? 'bg-green-600 text-white'
                                                : s === 'viewed' ? 'bg-blue-600 text-white'
                                                    : 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
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
                    {/* Overview */}
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
                                {company.tags?.map(t => (
                                    <Badge key={t} variant="outline" className="font-mono text-xs text-muted-foreground">{t}</Badge>
                                ))}
                                {enrichedData?.keywords?.map((kw: string) => (
                                    <Badge key={kw} variant="outline" className="text-muted-foreground">{kw}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI What They Do */}
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

                    {/* Derived Signals */}
                    {enrichedData?.derivedSignals?.length > 0 && (
                        <Card className="border-border">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">Timeline &amp; Signals</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {enrichedData.derivedSignals.map((signal: string, i: number) => (
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
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Thesis-Fit Score Card */}
                    <Card className="border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Target className="w-4 h-4 text-primary" />
                                Thesis-Fit Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!thesisConfigured ? (
                                <div className="text-center py-4">
                                    <p className="text-xs text-muted-foreground mb-3">No thesis configured.</p>
                                    <Button size="sm" variant="outline" onClick={() => router.push('/settings')} className="w-full text-xs">
                                        Configure Thesis →
                                    </Button>
                                </div>
                            ) : scoreData ? (
                                <>
                                    {/* Score Meter */}
                                    <div className="space-y-2">
                                        <div className="flex items-end justify-between">
                                            <span className={`text-3xl font-bold ${VERDICT_COLORS[scoreData.verdict] || 'text-foreground'}`}>
                                                {scoreData.score}
                                            </span>
                                            <span className="text-sm text-muted-foreground">/100</span>
                                        </div>
                                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${SCORE_BG(scoreData.score)}`}
                                                style={{ width: `${scoreData.score}%` }}
                                            />
                                        </div>
                                        <Badge variant="outline" className={`text-xs ${VERDICT_COLORS[scoreData.verdict] || ''}`}>
                                            {scoreData.verdict}
                                        </Badge>
                                    </div>

                                    <Separator />

                                    {scoreData.reasons?.length > 0 && (
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Why it fits</p>
                                            <ul className="space-y-1.5">
                                                {scoreData.reasons.map((r, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                                        <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                                        {r}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {scoreData.redFlags?.length > 0 && (
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Red Flags</p>
                                            <ul className="space-y-1.5">
                                                {scoreData.redFlags.map((r, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                                        <AlertTriangle className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />
                                                        {r}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <Button size="sm" variant="ghost" onClick={handleScore} disabled={scoring} className="w-full text-xs text-muted-foreground">
                                        {scoring ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
                                        Re-score
                                    </Button>
                                </>
                            ) : (
                                <div className="text-center py-2">
                                    <p className="text-xs text-muted-foreground mb-3">
                                        {enrichedData ? 'Using enriched + static data for scoring.' : 'Run Live Enrich first for the best score accuracy.'}
                                    </p>
                                    <Button size="sm" onClick={handleScore} disabled={scoring} className="w-full">
                                        {scoring ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Target className="w-4 h-4 mr-2" />}
                                        {scoring ? 'Scoring...' : 'Score vs. Thesis'}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Sources */}
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

                    {/* Notes */}
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
