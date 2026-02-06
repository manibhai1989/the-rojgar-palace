"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Users,
    Briefcase,
    FileText,
    Activity,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Bell,
    Menu,
    Plus,
    Settings,
    LayoutDashboard,
    LogOut,
    MoreVertical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

// Mock Data for Chart
const trafficData = [
    { name: "Mon", visitors: 4000, applications: 2400 },
    { name: "Tue", visitors: 3000, applications: 1398 },
    { name: "Wed", visitors: 2000, applications: 9800 },
    { name: "Thu", visitors: 2780, applications: 3908 },
    { name: "Fri", visitors: 1890, applications: 4800 },
    { name: "Sat", visitors: 2390, applications: 3800 },
    { name: "Sun", visitors: 3490, applications: 4300 },
];

const adminStats = [
    {
        title: "Total Seekers",
        value: "24.5k",
        change: "+12%",
        isPositive: true,
        icon: Users,
        color: "from-blue-500/20 to-blue-600/20",
        textColor: "text-blue-500",
        borderColor: "border-blue-500/30"
    },
    {
        title: "Active Jobs",
        value: "142",
        change: "+5",
        isPositive: true,
        icon: Briefcase,
        color: "from-orange-500/20 to-orange-600/20",
        textColor: "text-orange-500",
        borderColor: "border-orange-500/30"
    },
    {
        title: "Applications",
        value: "8,902",
        change: "-3%",
        isPositive: false,
        icon: FileText,
        color: "from-purple-500/20 to-purple-600/20",
        textColor: "text-purple-500",
        borderColor: "border-purple-500/30"
    },
    {
        title: "Revenue",
        value: "$12.4k",
        change: "+18%",
        isPositive: true,
        icon: Activity,
        color: "from-emerald-500/20 to-emerald-600/20",
        textColor: "text-emerald-500",
        borderColor: "border-emerald-500/30"
    },
];



import ClientOnly from "@/components/shared/ClientOnly";

import { getDashboardStats, DashboardStats } from "@/actions/admin/get-stats";
import { useEffect } from "react";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalSeekers: 0,
        activeJobs: 0,
        applications: 0,
        revenue: 0,
        recentActivities: [],
        systemHealth: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const query = e.currentTarget.value;
            if (query.trim()) {
                router.push(`/admin/jobs?search=${encodeURIComponent(query)}`);
            }
        }
    };

    const realAdminStats = [
        {
            title: "Total Seekers",
            value: loading ? "..." : stats.totalSeekers.toLocaleString(),
            change: "+12%", // Placeholder trend
            isPositive: true,
            icon: Users,
            color: "from-blue-500/20 to-blue-600/20",
            textColor: "text-blue-500",
            borderColor: "border-blue-500/30"
        },
        {
            title: "Active Jobs",
            value: loading ? "..." : stats.activeJobs.toLocaleString(),
            change: "Real Time",
            isPositive: true,
            icon: Briefcase,
            color: "from-orange-500/20 to-orange-600/20",
            textColor: "text-orange-500",
            borderColor: "border-orange-500/30"
        },
        {
            title: "Applications",
            value: loading ? "..." : stats.applications.toLocaleString(),
            change: "Total",
            isPositive: true,
            icon: FileText,
            color: "from-purple-500/20 to-purple-600/20",
            textColor: "text-purple-500",
            borderColor: "border-purple-500/30"
        },
        {
            title: "Revenue",
            value: "$0.00",
            change: "N/A",
            isPositive: true,
            icon: Activity,
            color: "from-emerald-500/20 to-emerald-600/20",
            textColor: "text-emerald-500",
            borderColor: "border-emerald-500/30"
        },
    ];

    return (
        <ClientOnly>
            <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
                {/* SIDEBAR */}
                <motion.aside
                    initial={false}
                    animate={{ width: isSidebarOpen ? 280 : 80 }}
                    className="hidden md:flex flex-col border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0 z-30"
                >
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        {isSidebarOpen && <span className="font-bold text-xl tracking-tight">Admin<span className="text-primary">Panel</span></span>}
                    </div>

                    <nav className="flex-1 px-4 space-y-2 mt-4">
                        {[
                            { icon: LayoutDashboard, label: "Overview", href: "/admin", active: true },
                            { icon: Users, label: "Candidates", href: "/admin/users" },
                            { icon: Briefcase, label: "Jobs", href: "/admin/jobs" },
                            { icon: FileText, label: "Applications", href: "/admin/applications" },
                            { icon: Activity, label: "Analytics", href: "/admin/analytics" },
                            { icon: Settings, label: "Settings", href: "/admin/settings" },
                        ].map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                    item.active
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-blue-500/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-border">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all">
                            <LogOut className="w-5 h-5" />
                            {isSidebarOpen && <span className="font-medium text-sm text-foreground">Logout</span>}
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="w-full mt-2 flex items-center justify-center p-2 text-muted-foreground hover:text-foreground"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </motion.aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto h-screen relative bg-background">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-0 w-full h-[500px] bg-blue-500/10 dark:bg-blue-900/20 blur-[120px] pointer-events-none" />

                    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative z-10">

                        {/* Header */}
                        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">Dashboard</h1>
                                <p className="text-muted-foreground text-sm">Welcome back, Admin</p>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search jobs..."
                                        className="pl-10 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background"
                                        onKeyDown={handleSearch}
                                    />
                                </div>

                                <Link href="/admin/jobs/new">
                                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-blue-500/20">
                                        <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Job</span>
                                    </Button>
                                </Link>
                            </div>
                        </header>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {realAdminStats.map((stat, i) => (
                                <motion.div
                                    key={stat.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Card className={cn("bg-card/50 border-border backdrop-blur-sm relative overflow-hidden group hover:border-primary/50 transition-colors", stat.borderColor)}>
                                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity", stat.color)} />
                                        <CardContent className="p-6 relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={cn("p-2 rounded-lg bg-background", stat.textColor)}>
                                                    <stat.icon className="w-5 h-5" />
                                                </div>
                                                <span className={cn(
                                                    "flex items-center text-xs font-bold px-2 py-1 rounded-full bg-background",
                                                    stat.isPositive ? "text-emerald-500" : "text-destructive"
                                                )}>
                                                    {stat.change}
                                                    {stat.isPositive ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">{stat.title}</p>
                                                <h3 className="text-2xl font-bold mt-1 text-foreground">{stat.value}</h3>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Chart & Activity Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Chart */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="lg:col-span-2"
                            >
                                <Card className="bg-card/50 border-border backdrop-blur-md h-full">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-primary" />
                                            Traffic Overview
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={trafficData}>
                                                <defs>
                                                    <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                                                    itemStyle={{ color: 'var(--foreground)' }}
                                                />
                                                <Area type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVis)" />
                                                <Area type="monotone" dataKey="applications" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorApp)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Recent Activity */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Card className="bg-card/50 border-border backdrop-blur-md h-full">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {loading ? (
                                            <div className="text-center py-8 text-muted-foreground">Loading activities...</div>
                                        ) : stats.recentActivities.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">No recent activity</div>
                                        ) : (
                                            stats.recentActivities.map((item) => (
                                                <div key={item.id} className="group">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="font-medium text-foreground">{item.action}</span>
                                                        <span className="text-xs text-muted-foreground">{new Date(item.time).toLocaleTimeString()}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                                                        <span>{item.target}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-emerald-500"
                                                            style={{ width: "100%" }}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        )}

                                        <div className="pt-4 mt-6 border-t border-border">
                                            <div className={cn(
                                                "p-4 rounded-xl border",
                                                stats.systemHealth || loading
                                                    ? "bg-blue-500/10 border-blue-500/20 dark:bg-blue-900/20"
                                                    : "bg-red-500/10 border-red-500/20 dark:bg-red-900/20"
                                            )}>
                                                <h4 className="text-sm font-bold text-foreground mb-1">System Health</h4>
                                                <p className="text-xs text-muted-foreground mb-3">
                                                    {loading ? "Checking system status..." : stats.systemHealth ? "All systems operational. Database connected." : "System Warning: Database issue detected."}
                                                </p>
                                                <Button size="sm" variant="outline" className="w-full border-blue-500/30 text-blue-500 hover:bg-blue-500/10">
                                                    View System Logs
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </main>
            </div>
        </ClientOnly>
    );
}
