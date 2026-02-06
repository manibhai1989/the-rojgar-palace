"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    Trash2,
    ExternalLink,
    Building2,
    Calendar,
    AlertCircle,
    Loader2,
    BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { toast } from "sonner";
import ClientOnly from "@/components/shared/ClientOnly";
import { format } from "date-fns";
import { getAdminSyllabus, deleteSyllabus } from "./actions";

export default function AdminSyllabusPage() {
    const [syllabusList, setSyllabusList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchSyllabus = async () => {
        setIsLoading(true);
        const result = await getAdminSyllabus();
        if (result.success) {
            setSyllabusList(result.data || []);
        } else {
            toast.error(result.error || "Failed to load syllabus");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchSyllabus();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this syllabus?")) return;

        const loadingToast = toast.loading("Deleting syllabus...");
        const result = await deleteSyllabus(id);

        if (result.success) {
            toast.success("Syllabus deleted", { id: loadingToast });
            setSyllabusList(syllabusList.filter(item => item.id !== id));
        } else {
            toast.error(result.error || "Failed to delete", { id: loadingToast });
        }
    };

    const filteredList = syllabusList.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.organization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ClientOnly>
            <div className="min-h-screen bg-background text-foreground p-8">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <BookOpen className="w-8 h-8 text-primary" />
                            Manage Syllabus
                        </h1>
                        <p className="text-muted-foreground">View and delete syllabus entries that are no longer needed.</p>
                    </div>
                </header>

                <div className="mb-6 relative max-w-md">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search syllabus by title..."
                        className="pl-10 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                        <p>Loading syllabus...</p>
                    </div>
                ) : filteredList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredList.map((item) => (
                            <Card key={item.id} className="bg-card/40 border-border backdrop-blur-md hover:border-primary/30 transition-all group">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary mb-2">
                                            <BookOpen className="w-4 h-4" />
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={item.link} target="_blank">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                        {item.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            <span>{item.organization}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>Added: {format(new Date(item.createdAt), "dd MMM yyyy")}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-medium">No syllabus found</h3>
                        <p className="text-muted-foreground mt-2">There are no syllabus entries in the database.</p>
                    </div>
                )}
            </div>
        </ClientOnly>
    );
}
