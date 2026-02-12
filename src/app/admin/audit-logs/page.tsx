"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { format } from "date-fns";

interface AuditLog {
    id: string;
    action: string;
    userId: string | null;
    details: string | null;
    createdAt: Date;
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLogs() {
            try {
                const response = await fetch('/api/admin/audit-logs');
                if (response.ok) {
                    const data = await response.json();
                    setLogs(data);
                }
            } catch (error) {
                console.error('Failed to fetch audit logs:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchLogs();
    }, []);

    const getActionIcon = (action: string) => {
        if (action.includes('error') || action.includes('fail')) {
            return <XCircle className="w-4 h-4 text-red-500" />;
        }
        if (action.includes('success') || action.includes('create')) {
            return <CheckCircle className="w-4 h-4 text-green-500" />;
        }
        if (action.includes('warning')) {
            return <AlertCircle className="w-4 h-4 text-yellow-500" />;
        }
        return <Info className="w-4 h-4 text-blue-500" />;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                    <Activity className="w-7 h-7" />
                    System Audit Logs
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Complete system activity history and events
                </p>
            </div>

            <Card className="bg-card/50 border-border backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Loading audit logs...
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No audit logs found
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border hover:bg-background transition-colors"
                                >
                                    <div className="mt-0.5">
                                        {getActionIcon(log.action)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-foreground">
                                                {log.action}
                                            </span>
                                            {log.userId && (
                                                <Badge variant="outline" className="text-xs">
                                                    User: {log.userId.substring(0, 8)}...
                                                </Badge>
                                            )}
                                        </div>
                                        {log.details && (
                                            <p className="text-sm text-muted-foreground">
                                                {log.details}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {format(new Date(log.createdAt), 'PPpp')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
