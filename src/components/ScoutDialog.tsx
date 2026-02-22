'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Company } from '@/data/mockCompanies';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Sparkles, Globe, PlusCircle, CheckCircle2 } from 'lucide-react';

interface ScoutDialogProps {
    children: React.ReactNode;
}

type Step = 'input' | 'enriching' | 'done' | 'error';

export function ScoutDialog({ children }: ScoutDialogProps) {
    const router = useRouter();
    const { addCustomCompany } = useAppStore();

    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [website, setWebsite] = useState('');
    const [industry, setIndustry] = useState('');
    const [stage, setStage] = useState('');
    const [step, setStep] = useState<Step>('input');
    const [errorMsg, setErrorMsg] = useState('');
    const [createdCompany, setCreatedCompany] = useState<Company | null>(null);
    const [enrichedPreview, setEnrichedPreview] = useState<string>('');

    const reset = () => {
        setName(''); setWebsite(''); setIndustry(''); setStage('');
        setStep('input'); setErrorMsg(''); setCreatedCompany(null); setEnrichedPreview('');
    };

    const handleClose = (o: boolean) => {
        if (!o) reset();
        setOpen(o);
    };

    const normalizeUrl = (url: string) => {
        let u = url.trim();
        if (!u.startsWith('http')) u = 'https://' + u;
        return u;
    };

    const handleScout = async () => {
        if (!name.trim() || !website.trim()) return;

        setStep('enriching');
        setErrorMsg('');

        const normalizedUrl = normalizeUrl(website);
        const urlForJina = normalizedUrl.replace('https://', '').replace('http://', '');

        try {
            const res = await fetch('/api/enrich', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: urlForJina }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.error || 'Enrichment failed.');
                setStep('error');
                return;
            }

            // Build the company object
            const id = `custom_${Date.now()}`;
            const company: Company = {
                id,
                name: name.trim(),
                website: normalizedUrl,
                description: data.summary || `Scouted company: ${name.trim()}`,
                industry: industry.trim() || (data.keywords?.[0] ? data.keywords[0] : 'Unknown'),
                stage: stage.trim() || 'Unknown',
                founded: 'Unknown',
                hq: 'Unknown',
                status: 'new',
                tags: data.keywords?.slice(0, 5) || [],
            };

            addCustomCompany(company);

            // Pre-cache enrichment in localStorage
            localStorage.setItem(`enrichment_${id}`, JSON.stringify(data));

            setEnrichedPreview(data.summary || '');
            setCreatedCompany(company);
            setStep('done');

        } catch {
            setErrorMsg('Network error — please try again.');
            setStep('error');
        }
    };

    const handleViewProfile = () => {
        if (createdCompany) {
            setOpen(false);
            reset();
            router.push(`/companies/${createdCompany.id}`);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        Scout Any Company
                    </DialogTitle>
                    <DialogDescription>
                        Enter a company name and website. We'll scrape the site and build a full AI profile instantly.
                    </DialogDescription>
                </DialogHeader>

                {step === 'input' && (
                    <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label htmlFor="scout-name">Company Name <span className="text-destructive">*</span></Label>
                            <Input
                                id="scout-name"
                                placeholder="e.g., Notion"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleScout()}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="scout-url">Website URL <span className="text-destructive">*</span></Label>
                            <Input
                                id="scout-url"
                                placeholder="e.g., notion.so or https://notion.so"
                                value={website}
                                onChange={e => setWebsite(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleScout()}
                            />
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="scout-industry">Industry <span className="text-muted-foreground text-xs">(optional)</span></Label>
                                <Input
                                    id="scout-industry"
                                    placeholder="e.g., SaaS, AI"
                                    value={industry}
                                    onChange={e => setIndustry(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="scout-stage">Stage <span className="text-muted-foreground text-xs">(optional)</span></Label>
                                <Input
                                    id="scout-stage"
                                    placeholder="e.g., Series A"
                                    value={stage}
                                    onChange={e => setStage(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button
                            className="w-full"
                            onClick={handleScout}
                            disabled={!name.trim() || !website.trim()}
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Scout &amp; Enrich
                        </Button>
                    </div>
                )}

                {step === 'enriching' && (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <div className="relative">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
                        </div>
                        <div className="text-center">
                            <p className="font-medium text-sm">Scraping {name}…</p>
                            <p className="text-xs text-muted-foreground mt-1">Reading website → Gemini AI is analyzing</p>
                        </div>
                    </div>
                )}

                {step === 'done' && createdCompany && (
                    <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-green-400">{name} has been scouted!</p>
                                {enrichedPreview && (
                                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{enrichedPreview}</p>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            The company has been added to your Discover feed. You can now view the full profile, score it against your thesis, and save it to a list.
                        </p>
                        <div className="flex gap-3">
                            <Button className="flex-1" onClick={handleViewProfile}>
                                View Full Profile →
                            </Button>
                            <Button variant="outline" onClick={() => { setOpen(false); reset(); }}>
                                Done
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'error' && (
                    <div className="space-y-4 pt-2">
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm text-destructive">
                            {errorMsg}
                        </div>
                        <Button variant="outline" className="w-full" onClick={() => setStep('input')}>
                            Try Again
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
