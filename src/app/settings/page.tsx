'use client';
import React, { useState } from 'react';
import { useAppStore, FundThesis } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Settings, Sparkles, X } from 'lucide-react';

const ALL_STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D', 'Late Stage', 'Public'];
const ALL_INDUSTRIES = [
    'AI', 'Developer Tools', 'Fintech', 'SaaS', 'Infrastructure', 'Security',
    'Healthcare', 'Climate', 'Productivity', 'Data & Analytics', 'E-commerce', 'EdTech',
];

export default function SettingsPage() {
    const { thesis, setThesis } = useAppStore();
    const [form, setForm] = useState<FundThesis>(thesis);
    const [saved, setSaved] = useState(false);

    const toggleStage = (stage: string) => {
        setForm(f => ({
            ...f,
            stages: f.stages.includes(stage) ? f.stages.filter(s => s !== stage) : [...f.stages, stage],
        }));
    };

    const toggleIndustry = (industry: string) => {
        setForm(f => ({
            ...f,
            industries: f.industries.includes(industry) ? f.industries.filter(i => i !== industry) : [...f.industries, industry],
        }));
    };

    const handleSave = () => {
        setThesis(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const isThesisConfigured = form.description.trim().length > 10 && (form.stages.length > 0 || form.industries.length > 0);

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-8">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <Settings className="w-5 h-5 text-muted-foreground" />
                    <h1 className="text-2xl font-bold tracking-tight">Fund Settings</h1>
                </div>
                <p className="text-muted-foreground">
                    Configure your fund's investment thesis. This is used to score and explain every company match.
                </p>
            </div>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="text-base">Fund Identity</CardTitle>
                    <CardDescription>Basic information about your fund.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fundName">Fund Name</Label>
                        <Input
                            id="fundName"
                            placeholder="e.g., Accel Growth Fund IV"
                            value={form.fundName}
                            onChange={e => setForm(f => ({ ...f, fundName: e.target.value }))}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        Investment Thesis
                    </CardTitle>
                    <CardDescription>
                        Describe your thesis in plain language. The AI uses this verbatim to score and explain every company.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        rows={5}
                        placeholder={`e.g., We invest in AI-native B2B SaaS companies at Seed to Series A. We look for strong developer adoption, usage-based pricing, and a clear wedge into large existing workflows. Ideal ARR is $0–$3M with fast growth. We avoid pure infrastructure bets without an application layer.`}
                        className="resize-none bg-background focus-visible:ring-1"
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    />
                </CardContent>
            </Card>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="text-base">Preferred Stages</CardTitle>
                    <CardDescription>Select all stages you actively invest in.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {ALL_STAGES.map(stage => {
                            const active = form.stages.includes(stage);
                            return (
                                <button
                                    key={stage}
                                    onClick={() => toggleStage(stage)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${active
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                                        }`}
                                >
                                    {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    {stage}
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="text-base">Target Industries</CardTitle>
                    <CardDescription>Select industries within your investment mandate.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {ALL_INDUSTRIES.map(industry => {
                            const active = form.industries.includes(industry);
                            return (
                                <button
                                    key={industry}
                                    onClick={() => toggleIndustry(industry)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${active
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                                        }`}
                                >
                                    {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    {industry}
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="text-base">Geography &amp; Check Size</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="geography">Geography Focus</Label>
                        <Input
                            id="geography"
                            placeholder="e.g., US, Europe, Global"
                            value={form.geography}
                            onChange={e => setForm(f => ({ ...f, geography: e.target.value }))}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="checkMin">Check Size Min</Label>
                            <Input
                                id="checkMin"
                                placeholder="e.g., $500K"
                                value={form.checkSizeMin}
                                onChange={e => setForm(f => ({ ...f, checkSizeMin: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="checkMax">Check Size Max</Label>
                            <Input
                                id="checkMax"
                                placeholder="e.g., $3M"
                                value={form.checkSizeMax}
                                onChange={e => setForm(f => ({ ...f, checkSizeMax: e.target.value }))}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            <div className="flex items-center justify-between">
                <div>
                    {isThesisConfigured ? (
                        <div className="flex items-center gap-2 text-sm text-green-500">
                            <CheckCircle2 className="w-4 h-4" />
                            Thesis configured — scoring is enabled on company profiles
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Add a thesis description + at least one stage or industry to enable scoring.
                        </p>
                    )}
                </div>
                <Button onClick={handleSave} className="min-w-32">
                    {saved ? (
                        <><CheckCircle2 className="w-4 h-4 mr-2" /> Saved!</>
                    ) : (
                        'Save Thesis'
                    )}
                </Button>
            </div>
        </div>
    );
}
