"use client";

import * as React from "react";
import {
    Youtube,
    Book,
    FileText,
    ExternalLink,
    Star,
    Clock,
    ArrowRight,
    Play,
    Download,
    Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const resources = [
    {
        title: "Quantitative Aptitude Complete Playlist",
        provider: "Abhinay Maths",
        type: "YouTube",
        icon: Youtube,
        color: "text-red-600",
        bg: "bg-red-50",
        duration: "120+ Videos",
        rating: 4.9,
        action: "Watch Series"
    },
    {
        title: "Indian Polity by M. Laxmikanth",
        provider: "McGraw Hill",
        type: "Book",
        icon: Book,
        color: "text-blue-600",
        bg: "bg-blue-50",
        duration: "6th Edition",
        rating: 4.8,
        action: "Get Book"
    },
    {
        title: "Previous Year Question Bank (2018-2023)",
        provider: "SarkariResultHub",
        type: "PDF",
        icon: FileText,
        color: "text-purple-600",
        bg: "bg-purple-50",
        duration: "5000+ Questions",
        rating: 4.7,
        action: "Download PDF"
    }
];

export function ResourceGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <Card className="group h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden flex flex-col">
                        <CardHeader className="p-6 pb-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`h-12 w-12 rounded-2xl ${res.bg} flex items-center justify-center ${res.color} group-hover:scale-110 transition-transform`}>
                                    <res.icon className="h-6 w-6" />
                                </div>
                                <Badge variant="outline" className="text-[10px] font-black uppercase border-muted-foreground/10 h-6">
                                    {res.type}
                                </Badge>
                            </div>
                            <CardTitle className="text-base font-black leading-tight group-hover:text-primary transition-colors">
                                {res.title}
                            </CardTitle>
                            <CardDescription className="text-xs font-bold text-muted-foreground pt-1">
                                {res.provider}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 flex-1 flex flex-col justify-between space-y-6">
                            <div className="flex items-center justify-between pt-4 border-t border-dashed">
                                <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{res.duration}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-[10px] font-black uppercase text-orange-500">
                                    <Star className="h-3 w-3 fill-current" />
                                    <span>{res.rating}</span>
                                </div>
                            </div>
                            <Button className="w-full bg-muted text-foreground hover:bg-primary hover:text-white transition-all rounded-xl font-black uppercase text-[10px] tracking-widest h-10">
                                {res.action} <ArrowRight className="ml-2 h-3 w-3" />
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
