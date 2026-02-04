"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, Users, Briefcase, FileText, Clock } from "lucide-react";
import ClientOnly from "@/components/shared/ClientOnly";

export default function AdminAnalyticsPage() {
    return (
        <ClientOnly>
            <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Activity className="w-8 h-8 text-purple-500" />
                        Analytics
                    </h1>
                    <p className="text-slate-400">Track performance metrics and insights.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                Traffic Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-emerald-400">+24.5%</p>
                            <p className="text-sm text-slate-400 mt-2">Compared to last month</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-500" />
                                User Engagement
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-blue-400">89.2%</p>
                            <p className="text-sm text-slate-400 mt-2">Average engagement rate</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-orange-500" />
                                Job Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-orange-400">142</p>
                            <p className="text-sm text-slate-400 mt-2">Active job postings</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-500" />
                                Applications
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-purple-400">8,902</p>
                            <p className="text-sm text-slate-400 mt-2">Total applications received</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="w-5 h-5 text-cyan-500" />
                                Avg. Response Time
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-cyan-400">2.4h</p>
                            <p className="text-sm text-slate-400 mt-2">Average admin response time</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8 text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-white/5">
                    <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium">Advanced Analytics Coming Soon</h3>
                    <p className="text-slate-500 mt-2">Detailed charts and reports will be available here.</p>
                </div>
            </div>
        </ClientOnly>
    );
}
