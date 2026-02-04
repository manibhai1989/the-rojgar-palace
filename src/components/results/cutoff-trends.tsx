"use client";

import * as React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LineChart,
    Line
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Search,
    History,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const historicalData = [
    { year: '2020', cutoff: 132.5 },
    { year: '2021', cutoff: 141.2 },
    { year: '2022', cutoff: 138.0 },
    { year: '2023', cutoff: 147.5 },
    { year: '2024 (Exp)', cutoff: 152.0 },
];

const categoryCutoffs = [
    { category: 'UR (General)', current: 152.0, py: 147.5, diff: '+4.5' },
    { category: 'OBC', current: 146.5, py: 142.0, diff: '+4.5' },
    { category: 'EWS', current: 143.0, py: 139.5, diff: '+3.5' },
    { category: 'SC', current: 124.0, py: 119.0, diff: '+5.0' },
    { category: 'ST', current: 115.5, py: 112.0, diff: '+3.5' },
];

export function CutoffTrends() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Historical Graph */}
                <Card className="border-none shadow-xl bg-white overflow-hidden">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-black tracking-tighter">Cutoff <span className="text-primary italic">Trajectory</span></CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase">5-Year Historical Trend Analysis</CardDescription>
                            </div>
                            <Badge variant="outline" className="h-6 text-[8px] font-black uppercase border-dashed">High Volatility</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[250px] p-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historicalData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} domain={[100, 160]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    labelStyle={{ fontWeight: 900, fontSize: '12px' }}
                                />
                                <Line
                                    type="stepAfter"
                                    dataKey="cutoff"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: 'white', strokeWidth: 3, stroke: 'hsl(var(--primary))' }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Category Table */}
                <Card className="border-none shadow-xl bg-white overflow-hidden">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-black tracking-tighter">Category-wise <span className="text-primary">Variations</span></CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase">Performance delta vs Previous Year</CardDescription>
                    </CardHeader>
                    <div className="px-6 py-2">
                        <div className="rounded-2xl border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="font-black text-[9px] uppercase">Category</TableHead>
                                        <TableHead className="font-black text-[9px] uppercase text-center">2024 Exp</TableHead>
                                        <TableHead className="font-black text-[9px] uppercase text-center">2023</TableHead>
                                        <TableHead className="font-black text-[9px] uppercase text-right">Change</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categoryCutoffs.map((item) => (
                                        <TableRow key={item.category} className="group hover:bg-muted/20 transition-colors border-muted/50">
                                            <TableCell className="font-black text-[11px]">{item.category}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge className="bg-primary/5 text-primary border-none text-[10px] font-black">
                                                    {item.current}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center text-[10px] font-bold text-muted-foreground">{item.py}</TableCell>
                                            <TableCell className="text-right">
                                                <span className="text-[10px] font-black text-red-500">{item.diff}</span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Prediction Model Alert */}
            <div className="p-6 rounded-[2rem] bg-indigo-50 border-2 border-dashed border-indigo-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <TrendingUp className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-black text-lg tracking-tighter uppercase italic leading-none">AI Cutoff Predictor</h4>
                            <p className="text-xs font-bold text-indigo-700/70">
                                Model suggests <strong>+3.5 marks</strong> deviation due to higher vacancy-to-candidate ratio this year.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="flex-1 md:flex-none h-12 rounded-2xl px-6 bg-white font-black uppercase text-xs">
                            Data Methodology
                        </Button>
                        <Button className="flex-1 md:flex-none h-12 bg-indigo-600 text-white rounded-2xl px-8 font-black uppercase text-xs shadow-xl shadow-indigo-600/20">
                            View Detailed Model
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
