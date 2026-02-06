"use client";

import { useEffect, useState } from "react";
import {
    Search,
    Trash2,
    MoreVertical,
    AlertCircle,
    Loader2,
    User,
    Briefcase,
    Calendar,
    CheckCircle2,
    Clock,
    FileCheck,
    Download,
    Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ClientOnly from "@/components/shared/ClientOnly";
import { format } from "date-fns";
import { getApplications, updateApplicationStatus, deleteApplication } from "./actions";

const statusConfig = {
    STARTED: { label: "Started", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: Clock },
    APPLIED: { label: "Applied", color: "bg-green-500/10 text-green-400 border-green-500/20", icon: CheckCircle2 },
    DOCUMENTS_SUBMITTED: { label: "Documents Submitted", color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: FileCheck },
    ADMIT_CARD_DOWNLOADED: { label: "Admit Card Downloaded", color: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: Download },
    RESULT_CHECKED: { label: "Result Checked", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: Eye },
};

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const fetchApplications = async () => {
        setIsLoading(true);
        const result = await getApplications();
        if (result.success) {
            setApplications(result.applications);
        } else {
            toast.error("Failed to load applications");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusChange = async (applicationId: string, newStatus: string) => {
        const loadingToast = toast.loading("Updating status...");
        const result = await updateApplicationStatus(applicationId, newStatus);

        if (result.success) {
            toast.success("Status updated", { id: loadingToast });
            setApplications(applications.map(app =>
                app.id === applicationId ? { ...app, status: newStatus } : app
            ));
        } else {
            toast.error("Failed to update status", { id: loadingToast });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this application?")) return;

        const loadingToast = toast.loading("Deleting application...");
        const result = await deleteApplication(id);

        if (result.success) {
            toast.success("Application deleted", { id: loadingToast });
            setApplications(applications.filter(app => app.id !== id));
        } else {
            toast.error("Failed to delete", { id: loadingToast });
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch =
            app.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.job.organization.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <ClientOnly>
            <div className="min-h-screen bg-background text-foreground p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">Job Applications</h1>
                    <p className="text-muted-foreground">Track and manage user job applications.</p>
                </header>

                <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by user, email, or job..."
                            className="pl-10 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[200px] bg-background/50 border-border text-foreground">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border text-popover-foreground">
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            {Object.entries(statusConfig).map(([key, config]) => (
                                <SelectItem key={key} value={key}>
                                    {config.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                        <p>Loading applications...</p>
                    </div>
                ) : filteredApplications.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredApplications.map((app) => {
                            const StatusIcon = statusConfig[app.status as keyof typeof statusConfig]?.icon || Clock;
                            return (
                                <Card key={app.id} className="bg-card/40 border-border backdrop-blur-md hover:border-primary/30 transition-all">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <User className="w-4 h-4 text-muted-foreground" />
                                                    <span className="font-medium">{app.user.name || "Anonymous"}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{app.user.email}</p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
                                                    <DropdownMenuItem
                                                        className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                                                        onClick={() => handleDelete(app.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2 text-sm">
                                                <Briefcase className="w-4 h-4 text-muted-foreground mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-foreground">{app.job.title}</p>
                                                    <p className="text-muted-foreground">{app.job.organization}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                <span>Applied: {format(new Date(app.createdAt), "dd MMM yyyy")}</span>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-border">
                                            <label className="text-xs text-muted-foreground mb-2 block">Application Status</label>
                                            <Select value={app.status} onValueChange={(value) => handleStatusChange(app.id, value)}>
                                                <SelectTrigger className="w-full bg-background/50 border-border text-foreground">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-popover border-border text-popover-foreground">
                                                    {Object.entries(statusConfig).map(([key, config]) => (
                                                        <SelectItem key={key} value={key}>
                                                            <div className="flex items-center gap-2">
                                                                <config.icon className="w-4 h-4" />
                                                                {config.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Badge className={statusConfig[app.status as keyof typeof statusConfig]?.color || "bg-muted/10 text-muted-foreground"}>
                                            <StatusIcon className="w-3 h-3 mr-1" />
                                            {statusConfig[app.status as keyof typeof statusConfig]?.label || app.status}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-medium">No applications found</h3>
                        <p className="text-muted-foreground mt-2">
                            {searchQuery || statusFilter !== "ALL"
                                ? "Try adjusting your filters."
                                : "No users have applied for jobs yet."}
                        </p>
                    </div>
                )}
            </div>
        </ClientOnly>
    );
}
