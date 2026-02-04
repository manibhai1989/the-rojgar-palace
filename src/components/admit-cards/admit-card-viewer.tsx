"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ZoomIn,
    ZoomOut,
    Printer,
    Share2,
    Smartphone,
    MapPin,
    AlertCircle,
    Download,
    Eye,
    Maximize2,
    X,
    CheckCircle2,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface ViewerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cardData: any;
}

export function AdmitCardViewer({ open, onOpenChange, cardData }: ViewerProps) {
    const [zoom, setZoom] = React.useState(1);
    const [showVerification, setShowVerification] = React.useState(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden flex flex-col border-none shadow-2xl">
                {/* Custom Header */}
                <div className="flex items-center justify-between p-4 border-b bg-white z-10">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Eye className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-black">{cardData.examTitle}</DialogTitle>
                            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                High-Resolution Interactive Preview
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center border rounded-lg bg-muted/30 p-1 mr-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}>
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                            <span className="px-3 text-xs font-black tabular-nums">{Math.round(zoom * 100)}%</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(2, zoom + 0.25))}>
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button variant="outline" size="sm" className="hidden md:flex">
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Main Preview Area */}
                    <div className="flex-1 bg-muted/20 relative overflow-auto p-8 flex justify-center items-start">
                        <motion.div
                            style={{ scale: zoom }}
                            className="bg-white shadow-2xl rounded-sm p-12 min-w-[800px] relative origin-top transition-transform duration-200"
                        >
                            {/* Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] rotate-[-45deg] pointer-events-none select-none">
                                <span className="text-9xl font-black uppercase whitespace-nowrap">AUTHENTIC DOCUMENT • hubsarkariresult</span>
                            </div>

                            {/* Admit Card Header */}
                            <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-8">
                                <div className="space-y-4">
                                    <h4 className="text-3xl font-black uppercase underline tabular-nums tracking-tighter">Hall Ticket / Admit Card</h4>
                                    <div className="space-y-1">
                                        <p className="text-xl font-bold">{cardData.org}</p>
                                        <p className="text-sm font-medium text-muted-foreground">{cardData.examTitle}</p>
                                    </div>
                                </div>
                                <div className="h-32 w-32 border-2 border-black p-1 flex items-center justify-center bg-gray-50">
                                    <div className="text-center">
                                        <QRCodeSVG value={`AUTHENTIC:${cardData.rollNo}`} size={100} />
                                        <p className="text-[8px] font-black uppercase mt-1">Scan to Verify</p>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-12 text-sm">
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="font-black text-[10px] uppercase text-muted-foreground">Candidate's Name</p>
                                        <p className="text-lg font-black underline underline-offset-4">John Doe Candidate</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-black text-[10px] uppercase text-muted-foreground">Roll Number</p>
                                        <p className="text-xl font-black tabular-nums">{cardData.rollNo}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-black text-[10px] uppercase text-muted-foreground">Registration Number</p>
                                        <p className="text-lg font-bold tabular-nums">20240985421</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="h-40 w-32 border-2 border-black bg-gray-100 flex items-center justify-center ml-auto">
                                        <p className="text-[10px] text-muted-foreground uppercase font-black transform -rotate-45">Photo Box</p>
                                    </div>
                                    <div className="h-12 w-48 border-2 border-black border-dashed flex items-center justify-center ml-auto">
                                        <p className="text-[10px] text-muted-foreground uppercase font-black">Signature</p>
                                    </div>
                                </div>
                            </div>

                            {/* Exam Info */}
                            <div className="mt-12 border-2 border-black p-6 bg-gray-50/50">
                                <div className="grid grid-cols-3 gap-8">
                                    <div className="space-y-1">
                                        <p className="font-black text-[10px] uppercase">Exam Date</p>
                                        <p className="font-black text-lg">{cardData.examDate}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-black text-[10px] uppercase">Reporting Time</p>
                                        <p className="font-black text-lg">08:30 AM</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-black text-[10px] uppercase">Gate Closure</p>
                                        <p className="font-black text-lg text-red-600">09:15 AM</p>
                                    </div>
                                </div>
                                <div className="mt-6 space-y-1 border-t-2 border-black/10 pt-4">
                                    <p className="font-black text-[10px] uppercase">Exam Center Address</p>
                                    <p className="font-bold text-lg">{cardData.center}</p>
                                    <p className="text-sm">Sector 62, Noida, Uttar Pradesh - 201309</p>
                                </div>
                            </div>

                            {/* Important Instructions (Fine Print) */}
                            <div className="mt-8 text-[10px] leading-relaxed text-gray-700 italic border-l-4 border-primary pl-4">
                                <p className="font-black uppercase mb-1">Mandatory Instructions:</p>
                                <ol className="list-decimal pl-4 space-y-0.5">
                                    <li>Carry original ID Proof (Aadhar/Voter ID) mandatory.</li>
                                    <li>Entry will not be allowed after Gate Closure Time.</li>
                                    <li>Calculators, Mobile Phones, and Digital Watches are strictly prohibited.</li>
                                    <li>Wear a mask and maintain social distancing at the center.</li>
                                </ol>
                            </div>

                            {/* Digital Stamp */}
                            <div className="absolute bottom-12 right-12 opacity-20 transform -rotate-12 border-4 border-primary rounded-full p-4 flex flex-col items-center">
                                <CheckCircle2 className="h-12 w-12 text-primary" />
                                <p className="text-[8px] font-black uppercase text-primary">Digitally Verified</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar: Interactive Insights */}
                    <div className="w-80 border-l bg-white hidden lg:flex flex-col">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h5 className="font-black uppercase text-xs tracking-wider">Smart Assistant</h5>
                            <Badge variant="outline" className="text-[9px] font-bold text-orange-600 bg-orange-50 border-orange-200 italic">5d Remaining</Badge>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase text-muted-foreground">Exam Center Assistant</p>
                                <div className="rounded-2xl border p-4 hover:border-primary transition-all cursor-pointer group">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <p className="text-xs font-bold leading-none">View on Google Maps</p>
                                    </div>
                                    <div className="h-24 w-full bg-muted rounded-lg overflow-hidden relative">
                                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                            <Maximize2 className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full text-xs font-bold rounded-xl" size="sm">
                                    <Smartphone className="mr-2 h-4 w-4" /> Save Region Offline
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase text-muted-foreground">Mandatory Checklist</p>
                                <div className="space-y-2">
                                    {[
                                        "Admit Card (Color Print)",
                                        "Aadhar Card (Original)",
                                        "2 Passport Photos",
                                        "Blue/Black Ball Pen"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center space-x-3 text-xs">
                                            <div className="h-4 w-4 rounded border border-muted-foreground/30" />
                                            <span className="font-medium text-muted-foreground">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Card className="bg-red-50/50 border-red-100 shadow-none">
                                <CardContent className="p-4 space-y-2">
                                    <div className="flex items-center space-x-2 text-red-600">
                                        <AlertCircle className="h-4 w-4" />
                                        <p className="text-[10px] font-black uppercase">Emergency Contact</p>
                                    </div>
                                    <p className="text-lg font-black tabular-nums">+91 011-23385271</p>
                                    <p className="text-[9px] text-muted-foreground font-medium uppercase italic">24/7 UPSC Help Desk For Examination Day</p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="p-4 border-t bg-muted/5">
                            <Button className="w-full bg-black text-white hover:bg-black/90 font-black uppercase text-[10px] tracking-widest h-11" asChild>
                                <Link href="/admit-cards/1/assistant">
                                    Launch Exam Day Planner <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

import Link from "next/link";
