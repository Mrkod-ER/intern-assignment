'use client';
import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
                <p className="text-neutral-400">Curate and export companies for outreach or further diligence.</p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
                <form onSubmit={handleCreateList} className="flex gap-4 items-center">
                    <Input
                        placeholder="New list name (e.g., Q3 AI Deals)"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="max-w-xs"
                    />
                    <Button type="submit">Create List</Button>
                </form>
            </div>

            <div className="space-y-6">
                {lists.length === 0 ? (
                    <div className="text-center p-12 bg-neutral-900/50 rounded-xl border border-border border-dashed">
                        <ListVideo className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No lists created</h3>
                        <p className="text-neutral-400 text-sm">Create a list above to start saving companies.</p>
                    </div>
                ) : (
                    lists.map(list => (
                        <div key={list.id} className="bg-card rounded-xl border border-border overflow-hidden">
                            <div className="p-4 border-b border-border flex justify-between items-center bg-neutral-900/50">
                                <h2 className="text-lg font-semibold">{list.name}</h2>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Export CSV</Button>
                                    <Button variant="ghost" size="sm" onClick={() => removeList(list.id)} className="text-red-400 hover:text-red-300">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {list.companyIds.length === 0 ? (
                                <div className="p-8 text-center text-sm text-neutral-500">
                                    This list is empty. Add companies from the Discover page.
                                </div>
                            ) : (
                                <ul className="divide-y divide-border">
                                    {list.companyIds.map(companyId => {
                                        const company = mockCompanies.find(c => c.id === companyId);
                                        if (!company) return null;
                                        return (
                                            <li key={company.id} className="p-4 flex items-center justify-between hover:bg-neutral-800/30">
                                                <div>
                                                    <p className="font-medium text-blue-100">{company.name}</p>
                                                    <p className="text-xs text-neutral-500 mt-1">{company.industry} &bull; {company.stage}</p>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => removeCompanyFromList(list.id, company.id)} className="text-neutral-500 hover:text-red-400">
                                                    Remove
                                                </Button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
