'use client';
import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { mockCompanies } from '@/data/mockCompanies';
import { ListVideo, Trash2 } from 'lucide-react';

export default function ListsPage() {
    const { lists, addList, removeList, removeCompanyFromList } = useAppStore();
    const [newListName, setNewListName] = useState('');

    const handleCreateList = (e: React.FormEvent) => {
        e.preventDefault();
        if (newListName.trim()) {
            addList(newListName.trim());
            setNewListName('');
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">My Lists</h1>
                <p className="text-muted-foreground">Curate and export companies for outreach or further diligence.</p>
            </div>

            <Card className="border-border">
                <CardContent className="pt-6">
                    <form onSubmit={handleCreateList} className="flex gap-4 items-center">
                        <Input
                            placeholder="New list name (e.g., Q3 AI Deals)"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            className="max-w-xs focus-visible:ring-1"
                        />
                        <Button type="submit">Create List</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-6">
                {lists.length === 0 ? (
                    <div className="text-center p-12 bg-muted/30 rounded-xl border border-border border-dashed">
                        <ListVideo className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No lists created</h3>
                        <p className="text-muted-foreground text-sm">Create a list above to start saving companies.</p>
                    </div>
                ) : (
                    lists.map(list => (
                        <Card key={list.id} className="overflow-hidden border-border bg-card">
                            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                                <h2 className="text-lg font-semibold">{list.name}</h2>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Export CSV</Button>
                                    <Button variant="ghost" size="sm" onClick={() => removeList(list.id)} className="text-destructive hover:text-destructive/80">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {list.companyIds.length === 0 ? (
                                <div className="p-8 text-center text-sm text-muted-foreground">
                                    This list is empty. Add companies from the Discover page.
                                </div>
                            ) : (
                                <ul className="divide-y divide-border">
                                    {list.companyIds.map(companyId => {
                                        const company = mockCompanies.find(c => c.id === companyId);
                                        if (!company) return null;
                                        return (
                                            <li key={company.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                                                <div>
                                                    <p className="font-medium text-foreground">{company.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{company.industry} &bull; {company.stage}</p>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => removeCompanyFromList(list.id, company.id)} className="text-muted-foreground hover:text-destructive">
                                                    Remove
                                                </Button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
