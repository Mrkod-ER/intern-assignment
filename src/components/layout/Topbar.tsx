'use client';
import React, { useState } from 'react';
import { Search, Bell, Settings, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';

export function Topbar({ className }: { className?: string }) {
    const [query, setQuery] = useState('');
    const router = useRouter();
    const user = useAppStore(state => state.user);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/companies?q=${encodeURIComponent(query)}`);
        }
    };

    const getInitials = (name: string) => {
        return name ? name.substring(0, 2).toUpperCase() : 'U';
    };

    return (
        <header className={cn("h-16 flex items-center justify-between px-4 border-b border-border bg-background/95 backdrop-blur z-10", className)}>
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="h-4" />
                <form onSubmit={handleSearch} className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Input
                        type="text"
                        placeholder="Search companies... (CMD+K)"
                        className="pl-10 rounded-full bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:border-border transition-all"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>
            </div>

            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                </Button>
                <Link href="/settings">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <Settings className="w-5 h-5" />
                    </Button>
                </Link>
            </div>
        </header>
    );
}

