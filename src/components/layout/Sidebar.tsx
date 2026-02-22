'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Bookmark, ListVideo, Layers } from 'lucide-react';

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    const navItems = [
        { name: 'Discover', href: '/companies', icon: <LayoutGrid className="w-5 h-5 mr-3" /> },
        { name: 'Lists', href: '/lists', icon: <ListVideo className="w-5 h-5 mr-3" /> },
        { name: 'Saved Searches', href: '/saved', icon: <Bookmark className="w-5 h-5 mr-3" /> },
    ];

    return (
        <aside className={cn("flex flex-col bg-[#0f0f12] border-r border-border h-full", className)}>
            <div className="p-6 flex items-center mb-4">
                <Layers className="w-6 h-6 mr-3 text-primary" />
                <span className="font-bold text-lg tracking-tight">Scout<span className="text-neutral-500">AI</span></span>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-neutral-800/50",
                                isActive ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"
                            )}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="bg-neutral-900/50 rounded-lg p-4 border border-border">
                    <p className="text-xs text-neutral-400 font-medium mb-1">Fund II Thesis</p>
                    <p className="text-xs text-neutral-500">AI apps, developer tools, and modern infrastructure.</p>
                </div>
            </div>
        </aside>
    );
}
