"use client";

import * as React from "react";
import {
    ChevronLeft,
    MapPin,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Navigation,
    Bus,
    ParkingCircle,
    Coffee,
    CloudSun,
    Calendar,
    ArrowRight,
    Smartphone,
    Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { CenterInfo } from "@/components/admit-cards/center-info";
import { motion } from "framer-motion";

const daySchedule = [
    { time: "06:00 AM", task: "Wake up & Final Document Check", status: "Upcoming", icon: Clock },
    { time: "07:00 AM", task: "Breakfast & Departure", status: "Upcoming", icon: Coffee },
    { time: "08:15 AM", task: "Target Arrival at Center", status: "Recommended", icon: MapPin },
    { time: "08:30 AM", task: "Reporting Starts", status: "Mandatory", icon: CheckCircle2 },
    { time: "09:15 AM", task: "Gate Closure", status: "CRITICAL", icon: AlertTriangle },
    { time: "10:00 AM", task: "Exam Commencement", status: "Main Event", icon: Calendar },
];

const checklist = [
    { id: 1, item: "Admit Card (Color Copy)", priority: "Immediate" },
    { id: 2, item: "Original Aadhar Card", priority: "Immediate" },
    { id: 3, item: "2 Passport Size Photos", priority: "High" },
    { id: 4, item: "Black Ball Point Pen", priority: "Medium" },
    { id: 5, item: "Water Bottle (Transparent)", priority: "Low" },
];

export default function ExamDayAssistantPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl space-y-12 pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <Button variant="ghost" size="sm" className="pl-0 text-muted-foreground hover:text-primary" asChild>
                        <Link href="/admit-cards">
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Admit Cards
                        </Link>
                    </Button>
                    <h1 className="text-4xl font-black tracking-tighter">Exam Day <span className="text-primary italic">Assistant</span></h1>
                    <p className="text-muted-foreground font-medium max-w-lg">
                        Everything you need for a stress-free exam experience.
                        Live traffic, checklist management, and emergency planners.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl border-dashed">
                        <Share2 className="mr-2 h-4 w-4" /> Share with Family
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20">
                        <Smartphone className="mr-2 h-4 w-4" /> Sync to Calendar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Route & Center */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center tracking-tight">
                                <Navigation className="mr-3 h-6 w-6 text-primary" /> Route & Transit Planner
                            </h2>
                            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 uppercase font-black text-[9px]">Live Traffic Data</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="border-none shadow-sm bg-muted/20 group hover:bg-muted/30 transition-colors cursor-pointer">
                                <CardContent className="p-6 text-center space-y-3">
                                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                                        <Navigation className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <p className="font-bold text-sm">Google Maps</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-black italic">35 mins delay</p>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-sm bg-muted/20 group hover:bg-muted/30 transition-colors cursor-pointer">
                                <CardContent className="p-6 text-center space-y-3">
                                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                                        <Bus className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <p className="font-bold text-sm">Public Transport</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-black italic">Bus 342, Metro Blue</p>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-sm bg-muted/20 group hover:bg-muted/30 transition-colors cursor-pointer">
                                <CardContent className="p-6 text-center space-y-3">
                                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                                        <ParkingCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <p className="font-bold text-sm">Parking Info</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-black italic">Limited Availability</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-none shadow-lg overflow-hidden bg-white">
                            <div className="h-64 bg-muted relative group overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=28.6139,77.2090&zoom=14&size=800x400')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Button variant="secondary" className="bg-white/90 backdrop-blur-md rounded-full px-8 shadow-2xl font-black uppercase text-xs">
                                        Interactive Map View
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground">Exam Center</p>
                                        <p className="text-xl font-black italic">iON Digital Zone iDZ 1, Sector 62</p>
                                    </div>
                                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                                        <CloudSun className="h-5 w-5 text-orange-400" />
                                        <span className="font-medium">28°C • Partly Cloudy (Ideal for travel)</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-muted/20 space-y-1">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground">Est. Fare</p>
                                        <p className="text-lg font-black tabular-nums">₹120-250</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/20 space-y-1">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground">Confidence</p>
                                        <p className="text-lg font-black tabular-nums text-green-600">High</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="pt-8">
                            <CenterInfo />
                        </div>
                    </section>
                </div>

                {/* Right Column: Schedule & Checklist */}
                <div className="space-y-8">
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-tight">Day Schedule</h2>
                            <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="relative space-y-4 pl-8 border-l-2 border-primary/20">
                            {daySchedule.map((item, idx) => (
                                <div key={idx} className="relative">
                                    <div className={cn(
                                        "absolute -left-[41px] top-1 h-6 w-6 rounded-full border-4 bg-white flex items-center justify-center transition-all duration-500",
                                        item.status === "CRITICAL" ? "border-red-500 scale-125 shadow-red-200" : "border-primary"
                                    )}>
                                        <item.icon className={cn(
                                            "h-2.5 w-2.5",
                                            item.status === "CRITICAL" ? "text-red-500 animate-pulse" : "text-primary"
                                        )} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black tabular-nums uppercase text-primary tracking-widest leading-none">{item.time}</p>
                                            <Badge className={cn(
                                                "text-[8px] px-1.5 py-0 rounded-full font-black uppercase tracking-tighter",
                                                item.status === "CRITICAL" ? "bg-red-100 text-red-600" : "bg-muted text-muted-foreground"
                                            )}>{item.status}</Badge>
                                        </div>
                                        <p className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">{item.task}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <Card className="border-none shadow-sm bg-muted/30">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center">
                                <CheckCircle2 className="mr-2 h-5 w-5 text-primary" /> Checklist
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {checklist.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-transparent hover:border-primary/20 transition-all group">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-5 w-5 rounded border-2 border-primary/20 flex items-center justify-center group-hover:bg-primary transition-all">
                                            <CheckCircle2 className="h-3 w-3 text-white opacity-0 group-hover:opacity-100" />
                                        </div>
                                        <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">{item.item}</span>
                                    </div>
                                    <Badge variant="outline" className="text-[8px] font-bold border-muted-foreground/20">{item.priority}</Badge>
                                </div>
                            ))}
                            <div className="pt-4 border-t space-y-2">
                                <div className="flex justify-between text-[10px] uppercase font-black">
                                    <span>Preparation Ready</span>
                                    <span>60%</span>
                                </div>
                                <Progress value={60} className="h-1.5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bottom Sticky Action for Mobile */}
            <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-xl border-t z-50 md:hidden">
                <Button className="w-full bg-primary hover:bg-primary/90 h-12 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/30">
                    Get Driving Directions <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
