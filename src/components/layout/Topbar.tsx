'use client';
import React, { useState } from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function Topbar({ className }: { className?: string }) {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/companies?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <header className={cn("h-16 flex items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur z-10", className)}>
            <div className="flex-1 max-w-xl">
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Search companies, domains, or keywords... (CMD+K)"
                        className="w-full bg-neutral-900 border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all font-medium placeholder:text-neutral-500"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-2 text-neutral-400 hover:text-white transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                </button>
                <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                    <Settings className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 cursor-pointer border border-neutral-700"></div>
            </div>
        </header>
    );
}

