'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to sign up');
            }

            // Successfully created and auto-logged in, store user and redirect to dashboard
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
            {/* Left Column - Form */}
            <div className="flex items-center justify-center p-8 bg-black/40 backdrop-blur-3xl border-r border-white/5 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.5)] z-10 order-2 lg:order-1">
                <div className="w-full max-w-sm space-y-8">
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">VC</span>
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-white">Scout</span>
                    </div>

                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Create an account</h1>
                        <p className="text-muted-foreground">Start discovering high-signal companies in minutes.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Jared Dunn"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-blue-500 h-12"
                                />
                            </div>
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
                                    Create Free Account
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-zinc-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Column - Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-zinc-950 p-12 text-zinc-400 relative overflow-hidden order-1 lg:order-2">
                <div className="absolute inset-0 bg-gradient-to-bl from-purple-600/20 via-transparent to-transparent opacity-50" />
                <div className="flex justify-end">
                    <Link href="/" className="relative z-10 flex items-center gap-2 text-white w-max">
                        <span className="font-semibold text-lg tracking-tight hover:text-purple-400 transition-colors">Scout</span>
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-sm">VC</span>
                        </div>
                    </Link>
                </div>

                <div className="relative z-10 text-right ms-auto">
                    <blockquote className="text-3xl font-medium leading-tight text-white mb-6">
                        "Enriching startups just got a whole lot easier. It's like having ten associates working 24/7."
                    </blockquote>
                    <div className="flex items-center justify-end gap-4">
                        <div className="text-right">
                            <div className="text-white font-medium">Monica Hall</div>
                            <div className="text-sm">Principal, Breyer Capital</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700 font-bold flex items-center justify-center text-white">
                            MH
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
