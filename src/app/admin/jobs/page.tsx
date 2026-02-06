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
    MoreVertical,
    AlertCircle,
    Loader2,
    Edit
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
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import ClientOnly from "@/components/shared/ClientOnly";
import { format } from "date-fns";
import { getJobs, deleteJob } from "./actions";

export default function AdminJobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchJobs = async () => {
        setIsLoading(true);
        const result = await getJobs();
        if (result.success) {
            setJobs(result.data || []);
        } else {
            toast.error(result.error || "Failed to load jobs");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job?")) return;

        const loadingToast = toast.loading("Deleting job...");
        const result = await deleteJob(id);

        if (result.success) {
            toast.success("Job deleted", { id: loadingToast });
            setJobs(jobs.filter(job => job.id !== id));
        } else {
            toast.error(result.error || "Failed to delete", { id: loadingToast });
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.organization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ClientOnly>
            <div className="min-h-screen bg-background text-foreground p-8">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Manage Job Postings</h1>
                        <p className="text-muted-foreground">View and manage all active job notifications.</p>
                    </div>
                    <Link href="/admin/jobs/new">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                            <Plus className="w-4 h-4" /> Post New Job
                        </Button>
                    </Link>
                </header>

                <div className="mb-6 relative max-w-md">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search jobs by title or organization..."
                        className="pl-10 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                        <p>Loading your jobs...</p>
                    </div>
                ) : filteredJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map((job) => (
                            <Card key={job.id} className="bg-card/40 border-border backdrop-blur-md hover:border-primary/30 transition-all group">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 mb-2">
                                            {job.category}
                                        </Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
                                                <Link href={`/jobs/${job.slug}`} target="_blank">
                                                    <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-accent focus:text-accent-foreground">
                                                        <ExternalLink className="w-4 h-4" /> View Live
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/admin/jobs/${job.id}/edit`}>
                                                    <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-accent focus:text-accent-foreground">
                                                        <Edit className="w-4 h-4" /> Edit Job
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem
                                                    className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                                                    onClick={() => handleDelete(job.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <CardTitle className="text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                        {job.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            <span>{job.organization}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>Deadline: {format(new Date(job.endDate), "dd MMM yyyy")}</span>
                                        </div>
                                    </div>

                                    <div className="pt-2 flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground">
                                            Posted on {format(new Date(job.createdAt), "dd MMM")}
                                        </span>
                                        <div className="flex gap-1">
                                            {job.isUrgent && <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] uppercase">Urgent</Badge>}
                                            {job.isNew && <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] uppercase">New</Badge>}
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
                        <h3 className="text-xl font-medium">No jobs found</h3>
                        <p className="text-muted-foreground mt-2">Try adjusting your search or create a new job posting.</p>
                        <Link href="/admin/jobs/new">
                            <Button variant="link" className="text-primary mt-2">Post your first job</Button>
                        </Link>
                    </div>
                )}
            </div>
        </ClientOnly>
    );
}
