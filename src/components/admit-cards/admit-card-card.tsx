"use client";

import * as React from "react";
import {
    Download,
    Calendar,
    MapPin,
    Clock,
    CheckCircle,
    ArrowRight,
    LucideIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdmitCardViewer } from "@/components/admit-cards/admit-card-viewer";

interface AdmitCardProps {
    card: {
        id: string;
        examTitle: string;
        org: string;
        rollNo: string;
        examDate: string;
        center: string;
        status: string;
        isDownloaded: boolean;
        countdown: number;
    };
}

export function AdmitCardCard({ card }: AdmitCardProps) {
    const [viewerOpen, setViewerOpen] = React.useState(false);

    return (
        <>
            <Card className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                <CardContent className="p-0">
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <Badge className="bg-muted text-muted-foreground hover:bg-muted border-none text-[9px] font-black uppercase tracking-widest">
                                    {card.org} • Roll: {card.rollNo}
                                </Badge>
                                <h3 className="text-lg font-black leading-tight group-hover:text-primary transition-colors">
                                    {card.examTitle}
                                </h3>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                <Download className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="text-xs font-bold tabular-nums">{card.examDate}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="text-xs font-bold truncate">{card.center}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-dashed">
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-wide text-green-600">
                                    {card.status}
                                </span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                                <Clock className="h-3 w-3" />
                                <span>{card.countdown} Days Left</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2">
                        <Button
                            variant="ghost"
                            className="rounded-none border-t border-r h-12 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5"
                            onClick={() => setViewerOpen(true)}
                        >
                            <ArrowRight className="mr-2 h-3.5 w-3.5" /> Interactive View
                        </Button>
                        <Button
                            className="rounded-none border-t h-12 bg-primary hover:bg-primary/90 text-[10px] font-black uppercase tracking-widest"
                        >
                            {card.isDownloaded ? (
                                <span className="flex items-center"><CheckCircle className="mr-2 h-3.5 w-3.5" /> Redownload</span>
                            ) : (
                                <span className="flex items-center"><Download className="mr-2 h-3.5 w-3.5" /> Secure Download</span>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <AdmitCardViewer
                open={viewerOpen}
                onOpenChange={setViewerOpen}
                cardData={card}
            />
        </>
    );
}
