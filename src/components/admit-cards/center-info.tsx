"use client";

import * as React from "react";
import {
    Maximize2,
    Star,
    Wind,
    Wifi,
    Soup,
    ShieldCheck,
    ArrowRight,
    MapPin,
    Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";

const facilities = [
    { name: "Air Conditioned", icon: Wind },
    { name: "Free Drinking Water", icon: Soup },
    { name: "Locker Facility", icon: ShieldCheck },
    { name: "CCTV Surveillance", icon: Wifi },
];

const reviews = [
    { user: "Aman Gupta", rating: 5, date: "SSC CHSL Oct 2023", comment: "Very well managed. Staff was helpful and the computers were in great condition." },
    { user: "Rohan V.", rating: 4, date: "UPSC CDS Feb 2024", comment: "Good facilities. Drinking water was available. Entry process took some time though." },
];

export function CenterInfo() {
    return (
        <Card className="border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-muted/10 pb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-black italic tracking-tighter">Exam Center <span className="text-primary tracking-normal not-italic">Visualization</span></CardTitle>
                        <CardDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                            Preview your destination before you travel
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x border-border">
                    {/* 360 View Placeholder */}
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase text-muted-foreground">360° Virtual Preview</p>
                            <Badge className="bg-blue-100 text-blue-600 border-none font-black text-[9px] uppercase">Highly Immersive</Badge>
                        </div>
                        <div className="aspect-video rounded-3xl bg-muted relative overflow-hidden group">
                            <motion.div
                                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                                initial={{ x: -20 }}
                                animate={{ x: 20 }}
                                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                                <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/40 shadow-2xl">
                                    <Maximize2 className="h-8 w-8 text-white" />
                                </div>
                                <p className="text-white font-black uppercase text-[10px] tracking-widest drop-shadow-md">Click to Enter 360° Panorama</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-muted/30 flex items-center space-x-3 transition-transform hover:scale-105">
                                <MapPin className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground">Location</p>
                                    <p className="text-xs font-bold truncate italic">Near Metro Pillar 62</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-muted/30 flex items-center space-x-3 transition-transform hover:scale-105">
                                <Users className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground">Crowd Level</p>
                                    <p className="text-xs font-bold truncate italic">Moderate-High</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Facilities & Reviews */}
                    <div className="p-8 space-y-8">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase text-muted-foreground">Available Facilities</p>
                            <div className="grid grid-cols-2 gap-4">
                                {facilities.map((fac, i) => (
                                    <div key={i} className="flex items-center space-x-3 p-3 rounded-xl border border-dashed hover:bg-muted/10 transition-colors">
                                        <fac.icon className="h-4 w-4 text-primary" />
                                        <span className="text-xs font-bold text-muted-foreground">{fac.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black uppercase text-muted-foreground">Candidate Reviews</p>
                                <div className="flex items-center text-orange-500">
                                    <Star className="h-3 w-3 fill-current" />
                                    <span className="ml-1 text-xs font-black tabular-nums">4.2 (128)</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {reviews.map((rev, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-muted/10 space-y-2 border border-transparent hover:border-primary/10 transition-all">
                                        <div className="flex justify-between items-start">
                                            <p className="text-xs font-black">{rev.user}</p>
                                            <p className="text-[9px] font-black uppercase text-primary italic">{rev.date}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed italic">"{rev.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button className="w-full bg-black text-white hover:bg-black/90 h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest" asChild>
                            <Link href="/">
                                View Detailed Arrangement <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

import Link from "next/link";
