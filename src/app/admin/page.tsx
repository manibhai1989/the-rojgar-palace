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

const recentActivities = [
    { id: 1, action: "New Job Posted", target: "UPSC CSE 2024", width: "100%", status: "success", time: "2m ago" },
    { id: 2, action: "Server Alert", target: "High CPU Usage", width: "80%", status: "warning", time: "15m ago" },
    { id: 3, action: "User Report", target: "Login Issue", width: "40%", status: "error", time: "1h ago" },
    { id: 4, action: "Database Backup", target: "Daily Snapshot", width: "100%", status: "success", time: "3h ago" },
];

import ClientOnly from "@/components/shared/ClientOnly";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const query = e.currentTarget.value;
            if (query.trim()) {
                router.push(`/admin/jobs?search=${encodeURIComponent(query)}`);
            }
        }
    };

    return (
        <ClientOnly>
            <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
                {/* SIDEBAR */}
                <motion.aside
                    initial={false}
                    animate={{ width: isSidebarOpen ? 280 : 80 }}
                    className="hidden md:flex flex-col border-r border-white/10 bg-slate-900/50 backdrop-blur-xl h-screen sticky top-0 z-30"
                >
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        {isSidebarOpen && <span className="font-bold text-xl tracking-tight">Admin<span className="text-white">Panel</span></span>}
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
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-white/10">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                            <LogOut className="w-5 h-5" />
                            {isSidebarOpen && <span className="font-medium text-sm text-white">Logout</span>}
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="w-full mt-2 flex items-center justify-center p-2 text-slate-500 hover:text-slate-200"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </motion.aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto h-screen relative">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-0 w-full h-[500px] bg-blue-900/20 blur-[120px] pointer-events-none" />

                    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative z-10">

                        {/* Header */}
                        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                                <p className="text-slate-400 text-sm">Welcome back, Admin</p>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Search jobs..."
                                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10"
                                        onKeyDown={handleSearch}
                                    />
                                </div>

                                <Link href="/admin/jobs/new">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-500/20">
                                        <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Job</span>
                                    </Button>
                                </Link>
                            </div>
                        </header>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {adminStats.map((stat, i) => (
                                <motion.div
                                    key={stat.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Card className={cn("bg-white/5 border backdrop-blur-sm relative overflow-hidden group", stat.borderColor)}>
                                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity", stat.color)} />
                                        <CardContent className="p-6 relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={cn("p-2 rounded-lg bg-white/5", stat.textColor)}>
                                                    <stat.icon className="w-5 h-5" />
                                                </div>
                                                <span className={cn(
                                                    "flex items-center text-xs font-bold px-2 py-1 rounded-full bg-white/5",
                                                    stat.isPositive ? "text-emerald-400" : "text-red-400"
                                                )}>
                                                    {stat.change}
                                                    {stat.isPositive ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{stat.title}</p>
                                                <h3 className="text-2xl font-bold mt-1 text-white">{stat.value}</h3>
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
                                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md h-full">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-blue-500" />
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
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                                    itemStyle={{ color: '#e2e8f0' }}
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
                                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md h-full">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {recentActivities.map((item) => (
                                            <div key={item.id} className="group">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="font-medium text-slate-200">{item.action}</span>
                                                    <span className="text-xs text-slate-500">{item.time}</span>
                                                </div>
                                                <div className="flex justify-between text-xs text-slate-400 mb-2">
                                                    <span>{item.target}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full",
                                                            item.status === "success" ? "bg-emerald-500" :
                                                                item.status === "warning" ? "bg-amber-500" : "bg-red-500"
                                                        )}
                                                        style={{ width: item.width }}
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        <div className="pt-4 mt-6 border-t border-white/5">
                                            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20">
                                                <h4 className="text-sm font-bold text-white mb-1">System Health</h4>
                                                <p className="text-xs text-slate-400 mb-3">All systems operational. No major incidents reported.</p>
                                                <Button size="sm" variant="outline" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300">
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
