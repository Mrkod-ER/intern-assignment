'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        useAppStore.getState().setUser(null);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to login');
            }

            useAppStore.getState().setUser(data.user);
            router.push('/companies');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background">
            {/* Left Column - Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-zinc-950 p-12 text-zinc-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-transparent opacity-50" />
                <Link href="/" className="relative z-10 flex items-center gap-2 text-white w-max">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-sm">VC</span>
                    </div>
                    <span className="font-semibold text-lg tracking-tight hover:text-blue-400 transition-colors">Scout</span>
                </Link>

                <div className="relative z-10">
                    <blockquote className="text-3xl font-medium leading-tight text-white mb-6">
                        "VC Scout transformed our thesis from a Google Doc into an always-on pipeline. We're seeing signal before anyone else."
                    </blockquote>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700 font-bold flex items-center justify-center text-white">
                            RS
                        </div>
                        <div>
                            <div className="text-white font-medium">Roelof Sequoia</div>
                            <div className="text-sm">Partner, Sequoia Capital</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="flex items-center justify-center p-8 bg-black/40 backdrop-blur-3xl border-l border-white/5 shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.5)] z-10">
                <div className="w-full max-w-sm space-y-8">
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">VC</span>
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-white">Scout</span>
                    </div>

                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
                        <p className="text-muted-foreground">Sign in to your dashboard to continue scouting.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-300">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="analyst@fund.com"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-blue-500 h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-blue-500 h-12"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-center font-medium animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-all group">
                            {loading ? (
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            ) : (
                                <>
                                    Sign in to Dashboard
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-zinc-400">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
