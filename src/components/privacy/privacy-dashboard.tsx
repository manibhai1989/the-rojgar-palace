"use client";

import * as React from "react";
import { Download, Trash2, ShieldAlert, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { TwoFactorSetup } from "@/components/auth/two-factor-setup";

export function PrivacyDashboard() {
    const [isExporting, setIsExporting] = React.useState(false);

    const handleExportData = async () => {
        setIsExporting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const data = {
                user: { name: "User", email: "user@example.com" },
                applications: [],
                bookmarks: []
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "my-sarkari-data.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            toast.success("Data export started successfully");
        } catch (error) {
            toast.error("Failed to export data");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <ShieldAlert className="mr-2 h-5 w-5 text-orange-500" />
                            Account Security
                        </CardTitle>
                        <CardDescription>
                            Manage your login methods and security preferences.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TwoFactorSetup />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FileJson className="mr-2 h-5 w-5 text-blue-500" />
                            Data Privacy
                        </CardTitle>
                        <CardDescription>
                            Control your personal data usage and portability.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-semibold">Export Your Data</h4>
                                <p className="text-sm text-muted-foreground">Download a copy of your activity.</p>
                            </div>
                            <Button variant="outline" onClick={handleExportData} disabled={isExporting}>
                                {isExporting ? "Exporting..." : <><Download className="mr-2 h-4 w-4" /> Export JSON</>}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
                            <div>
                                <h4 className="font-semibold text-red-900">Delete Account</h4>
                                <p className="text-sm text-red-700">Permanently remove all your data.</p>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="destructive">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                                        <DialogDescription>
                                            This action cannot be undone. This will permanently delete your account
                                            and remove your data from our servers.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="outline">Cancel</Button>
                                        <Button variant="destructive">Yes, delete my account</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
