'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

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

            // Immediately redirect to login
            router.push('/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md shadow-2xl border-border">
                <CardHeader className="space-y-3 text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-xl">VC</span>
                    </div>
                    <CardTitle className="text-3xl font-extrabold text-foreground">Create an account</CardTitle>
                    <CardDescription className="text-muted-foreground pt-1">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-blue-500 hover:text-blue-400">
                            Sign in
                        </Link>
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Gilfoyle"
                                className="bg-muted focus-visible:ring-1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-muted-foreground">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="analyst@sequoia.com"
                                className="bg-muted focus-visible:ring-1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="bg-muted focus-visible:ring-1"
                            />
                        </div>

                        {error && (
                            <div className="text-destructive text-sm bg-destructive/10 border border-destructive/20 p-3 rounded-lg text-center font-medium">
                                {error}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter>
                        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {loading ? 'Creating account...' : 'Sign up'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
