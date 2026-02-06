"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, ExternalLink, School, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ClientOnly from "@/components/shared/ClientOnly";
import { format } from "date-fns";
import { getAdmissions, createAdmission, deleteAdmission } from "./actions";


interface AdmissionItem {
    id: string;
    title: string;
    organization: string;
    link: string;
    createdAt: Date;
}

export default function AdmissionsAdminPage() {
    const [items, setItems] = useState<AdmissionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ title: "", organization: "", link: "" });

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getAdmissions();
            if (res && res.success && res.items) {
                setItems(res.items as any[]);
            }
        } catch (e) {
            toast.error("Failed to load admissions");
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.link) {
            toast.error("Title and Link are required");
            return;
        }

        setIsSaving(true);
        const res = await createAdmission(formData);
        if (res.success) {
            toast.success("Admission added");
            setFormData({ title: "", organization: "", link: "" });
            fetchData();
        } else {
            toast.error("Failed to add: " + res.error);
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const res = await deleteAdmission(id);
        if (res.success) {
            toast.success("Deleted");
            setItems(prev => prev.filter(i => i.id !== id));
        }
    };

    return (
        <ClientOnly>
            <div className="min-h-screen bg-background text-foreground p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">Manage Admissions</h1>
                    <p className="text-muted-foreground">Publish college and university admission links.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="bg-card/40 border-border h-fit">
                        <CardHeader>
                            <CardTitle>Add New Admission</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-muted-foreground font-bold">Title</label>
                                    <Input
                                        className="bg-background/50 border-border"
                                        placeholder="e.g. DU B.Tech Admission 2024"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-muted-foreground font-bold">University/Org</label>
                                    <Input
                                        className="bg-background/50 border-border"
                                        placeholder="e.g. Delhi University"
                                        value={formData.organization}
                                        onChange={e => setFormData({ ...formData, organization: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-muted-foreground font-bold">Link</label>
                                    <Input
                                        className="bg-background/50 border-border"
                                        placeholder="https://admission.uod.ac.in/"
                                        value={formData.link}
                                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                                    />
                                </div>
                                <Button
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                    disabled={isSaving}
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                    Publish link
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2 space-y-4">
                        {isLoading ? (
                            <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
                        ) : items.length > 0 ? (
                            items.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-xl hover:border-primary/20 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <School className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-sm">{item.title}</h3>
                                            <p className="text-[10px] text-muted-foreground uppercase">{item.organization} • {format(new Date(item.createdAt), "dd MMM yyyy")}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                            </a>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center opacity-50 italic">No admission links added yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </ClientOnly>
    );
}
