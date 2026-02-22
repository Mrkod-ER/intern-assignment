'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Bookmark, ListVideo, Layers } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';

const navItems = [
    { name: 'Discover', href: '/companies', icon: LayoutGrid },
    { name: 'Lists', href: '/lists', icon: ListVideo },
    { name: 'Saved Searches', href: '/saved', icon: Bookmark },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild tooltip="ScoutAI">
                            <Link href="/companies">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Layers className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-bold tracking-tight">Scout<span className="text-muted-foreground font-normal">AI</span></span>
                                    <span className="text-xs text-muted-foreground">VC Intelligence</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.name}
                                        >
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarSeparator />

            <SidebarFooter>
                <Card className="border-sidebar-border bg-sidebar-accent/40">
                    <CardContent className="p-3">
                        <p className="text-xs font-semibold text-sidebar-foreground mb-1">Fund II Thesis</p>
                        <p className="text-xs text-sidebar-foreground/60">AI apps, developer tools, and modern infrastructure.</p>
                    </CardContent>
                </Card>
            </SidebarFooter>
        </Sidebar>
    );
}
