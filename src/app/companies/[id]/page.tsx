'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockCompanies } from '@/data/mockCompanies';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Building2, ExternalLink, Sparkles, Loader2, BookmarkPlus, MapPin, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
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

    // Use localStorage to cache enrichment data for the session
    useEffect(() => {
        if (id) {
            const cached = localStorage.getItem(`enrichment_${id}`);
            if (cached) {
                setEnrichedData(JSON.parse(cached));
            }
        }
    }, [id]);

    if (!company) {
        return <div className="p-8 text-center text-neutral-400">Company not found.</div>;
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
                <button onClick={() => router.back()} className="text-neutral-500 hover:text-white flex items-center text-sm mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Discover
                </button>

                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-5">
                        <div className="w-16 h-16 bg-neutral-800 rounded-xl border border-border flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-neutral-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
                            <div className="flex items-center space-x-3 mt-2 text-sm text-neutral-400">
                                <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center hover:text-blue-400 transition-colors">
                                    {company.website.replace('https://', '')} <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                                <span>&bull;</span>
                                <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" />{company.hq}</span>
                                <span>&bull;</span>
                                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />Founded {company.founded}</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 relative">
                            {lists.length > 0 ? (
                                <div className="relative group">
                                    <Button variant="outline"><BookmarkPlus className="w-4 h-4 mr-2" /> Save to List</Button>
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                                        <div className="p-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Your Lists</div>
                                        <ul className="max-h-64 overflow-y-auto">
                                            {lists.map(list => {
                                                const isSaved = list.companyIds.includes(company.id);
                                                return (
                                                    <li key={list.id}>
                                                        <button
                                                            onClick={() => isSaved ? removeCompanyFromList(list.id, company.id) : addCompanyToList(list.id, company.id)}
                                                            className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-800 transition-colors flex items-center justify-between"
                                                        >
                                                            <span className="truncate mr-2">{list.name}</span>
                                                            {isSaved && <span className="text-blue-400 text-xs flex-shrink-0">Saved</span>}
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <Button variant="outline" onClick={() => router.push('/lists')}><BookmarkPlus className="w-4 h-4 mr-2" /> Create List</Button>
                            )}
                            <Button onClick={handleEnrich} disabled={enriching} className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                                {enriching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                {enriching ? 'Enriching...' : 'Live Enrich'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="col-span-2 space-y-6">
                    <div className="bg-card p-6 rounded-xl border border-border">
                        <h2 className="text-lg font-semibold mb-4">Overview</h2>
                        <p className="text-neutral-300 leading-relaxed text-sm">
                            {enrichedData?.summary || company.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-6">
                            <Badge variant="secondary">{company.industry}</Badge>
                            <Badge variant="secondary">{company.stage}</Badge>
                            {enrichedData?.keywords?.map((kw: string) => (
                                <Badge key={kw} variant="outline" className="text-neutral-400 border-neutral-700">{kw}</Badge>
                            ))}
                        </div>
                    </div>

                    {enrichedData && (
                        <div className="bg-[#0f1015] p-6 rounded-xl border border-blue-900/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[50px] -mr-10 -mt-10 rounded-full pointer-events-none"></div>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-semibold flex items-center text-blue-100">
                                    <Sparkles className="w-4 h-4 mr-2 text-blue-400" /> What they do
                                </h2>
                                <div className="text-xs text-neutral-500 font-medium">AI Enriched</div>
                            </div>
                            <ul className="space-y-3">
                                {enrichedData.whatTheyDo?.map((bullet: string, i: number) => (
                                    <li key={i} className="flex items-start text-sm text-blue-50/70">
                                        <span className="text-blue-500 mr-3 mt-1 text-xs">◆</span>
                                        <span className="leading-relaxed">{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="bg-card p-6 rounded-xl border border-border">
                        <h2 className="text-lg font-semibold mb-5">Timeline & Signals</h2>
                        <div className="space-y-6">
                            {enrichedData?.derivedSignals?.map((signal: string, i: number) => (
                                <div key={i} className="flex relative items-start">
                                    <div className="absolute left-2.5 top-5 bottom-[-1.5rem] w-px bg-border group-last:hidden"></div>
                                    <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5 z-10">
                                        <Sparkles className="w-3 h-3 text-blue-400" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-blue-100">Derived Signal</p>
                                        <p className="text-sm text-neutral-400 mt-1">{signal}</p>
                                        <p className="text-xs text-neutral-600 mt-2 flex items-center">
                                            <Clock className="w-3 h-3 mr-1" /> Found via Live Scrape
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <div className="flex relative items-start">
                                <div className="absolute left-2.5 top-5 bottom-[-1.5rem] w-px bg-border last:hidden"></div>
                                <div className="w-5 h-5 rounded-full bg-neutral-800 border border-border flex items-center justify-center shrink-0 mt-0.5 z-10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-500"></div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-white">Added to system</p>
                                    <p className="text-xs text-neutral-500 mt-1">Found via internal database</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar constraints */}
                <div className="space-y-6">
                    <div className="bg-card p-5 rounded-xl border border-border">
                        <h3 className="text-sm font-semibold mb-3 text-neutral-200">Sources</h3>
                        {enrichedData?.sources ? (
                            <div className="space-y-3">
                                {enrichedData.sources.map((src: any, i: number) => (
                                    <div key={i} className="text-xs">
                                        <a href={src.url.replace('https://r.jina.ai/', 'https://')} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline truncate block">
                                            {src.url.replace('https://r.jina.ai/', '')}
                                        </a>
                                        <p className="text-neutral-500 mt-1">{format(new Date(src.timestamp), 'MMM dd, yyyy HH:mm')}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-neutral-500">No external sources scanned yet.</p>
                        )}
                    </div>

                    <div className="bg-card p-5 rounded-xl border border-border">
                        <h3 className="text-sm font-semibold mb-3 text-neutral-200">Notes</h3>
                        <textarea
                            className="w-full h-24 bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-700 resize-none placeholder:text-neutral-600"
                            placeholder="Add your thesis thoughts here..."
                            value={localNote}
                            onChange={(e) => setLocalNote(e.target.value)}
                        ></textarea>
                        <div className="mt-3 flex justify-end">
                            <Button size="sm" variant="secondary" onClick={() => saveNote(company.id, localNote)}>Save Note</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

