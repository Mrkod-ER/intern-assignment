'use client';
import React, { useState } from 'react';
import { Search, Bell, Settings, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function Topbar({ className }: { className?: string }) {
    const [query, setQuery] = useState('');
    const router = useRouter();
    const user = useAppStore(state => state.user);
    const setUser = useAppStore(state => state.setUser);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/companies?q=${encodeURIComponent(query)}`);
        }
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Failed to logout', error);
        } finally {
            setLoggingOut(false);
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
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Settings className="w-5 h-5" />
                </Button>
                <div className="flex items-center ml-2 pl-4 border-l border-border">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="outline-none focus:ring-2 focus:ring-ring rounded-full ring-offset-2 ring-offset-background">
                                    <Avatar className="w-8 h-8 border border-border cursor-pointer transition-opacity hover:opacity-80">
                                        <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel className="font-medium">{user.name || 'My Account'}</DropdownMenuLabel>
                                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground -mt-2 truncate">
                                    {user.email}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} disabled={loggingOut} className="text-red-500 focus:text-red-500 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : null}
                </div>
            </div>
        </header>
    );
}

