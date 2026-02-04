"use client";

import { motion } from "framer-motion";
import {
    Users,
    UserCheck,
    UserPlus,
    MessageSquare,
    Search,
    Mail,
    Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const userStats = [
    { label: "Total Users", value: "24,512", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Today", value: "1,240", icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
    { label: "New Signups", value: "85", icon: UserPlus, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Support Queries", value: "12", icon: MessageSquare, color: "text-red-600", bg: "bg-red-50" },
];

const mockUsers = [
    { id: "1", name: "Rahul Sharma", email: "rahul.s@example.com", role: "User", joined: "2 hours ago", status: "Active" },
    { id: "2", name: "Priya Patel", email: "priya.p@example.com", role: "Verifier", joined: "1 day ago", status: "Active" },
    { id: "3", name: "Amit Kumar", email: "amit.k@example.com", role: "User", joined: "3 days ago", status: "Inactive" },
    { id: "4", name: "Sneha Reddy", email: "sneha.r@example.com", role: "Admin", joined: "1 week ago", status: "Active" },
];

export default function UserInsightsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Insights</h1>
                <p className="text-muted-foreground">Monitor community growth and manage user roles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {userStats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="border-none shadow-sm">
                            <CardContent className="p-6 flex items-center space-x-4">
                                <div className={`${stat.bg} p-3 rounded-2xl`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>User Directory</CardTitle>
                            <CardDescription>A list of all registered portal members.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search name, email or ID..." className="pl-9" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/20">
                                    <th className="px-6 py-4 text-left font-bold uppercase text-[10px] text-muted-foreground">Name & Email</th>
                                    <th className="px-6 py-4 text-left font-bold uppercase text-[10px] text-muted-foreground">Role</th>
                                    <th className="px-6 py-4 text-left font-bold uppercase text-[10px] text-muted-foreground">Status</th>
                                    <th className="px-6 py-4 text-left font-bold uppercase text-[10px] text-muted-foreground">Joined</th>
                                    <th className="px-6 py-4 text-right font-bold uppercase text-[10px] text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {mockUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="text-[10px] font-bold uppercase">
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <div className={cn(
                                                    "h-2 w-2 rounded-full",
                                                    user.status === "Active" ? "bg-green-500" : "bg-muted"
                                                )} />
                                                <span className="text-xs">{user.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground tabular-nums">
                                            {user.joined}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                    <Mail className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                    <Shield className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

import { cn } from "@/lib/utils";
