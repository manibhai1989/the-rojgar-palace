"use client";

import * as React from "react";
import {
    ChevronRight,
    ChevronDown,
    CheckCircle2,
    Circle,
    PlayCircle,
    FileText,
    BookOpen,
    HelpCircle,
    MoreHorizontal,
    Star,
    Zap,
    Scale
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Layers } from "lucide-react";

const syllabusData = [
    {
        id: "1",
        subject: "Quantitative Aptitude",
        icon: Zap,
        topics: [
            {
                id: "1-1",
                title: "Number System",
                completed: 100,
                weightage: "High",
                difficulty: "Medium",
                timeEst: "6h",
                subtopics: ["HCF & LCM", "Divisibility Rules", "Surds & Indices"]
            },
            {
                id: "1-2",
                title: "Arithmetic",
                completed: 45,
                weightage: "Very High",
                difficulty: "Easy",
                timeEst: "12h",
                subtopics: ["Percentage", "Profit & Loss", "Simple & Compound Interest", "Ratio & Proportion"]
            },
            {
                id: "1-3",
                title: "Geometry",
                completed: 10,
                weightage: "Medium",
                difficulty: "Hard",
                timeEst: "15h",
                subtopics: ["Lines & Angles", "Triangles", "Circles", "Polygons"]
            }
        ]
    },
    {
        id: "2",
        subject: "General Awareness",
        icon: BookOpen,
        topics: [
            {
                id: "2-1",
                title: "Indian Polity",
                completed: 85,
                weightage: "High",
                difficulty: "Medium",
                timeEst: "20h",
                subtopics: ["Constitution", "Fundamental Rights", "Parliament", "Judiciary"]
            },
            {
                id: "2-2",
                title: "Ancient History",
                completed: 0,
                weightage: "Medium",
                difficulty: "Easy",
                timeEst: "8h",
                subtopics: ["Indus Valley", "Vedic Age", "Mauryan Empire"]
            }
        ]
    }
];

export function SyllabusViewer() {
    return (
        <div className="space-y-6">
            {syllabusData.map((subject, idx) => (
                <div key={subject.id} className="space-y-4">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                            <subject.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black italic tracking-tighter">{subject.subject}</h3>
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                {subject.topics.length} Major Sections • {subject.topics.reduce((acc, t) => acc + t.subtopics.length, 0)} Topics
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {subject.topics.map((topic) => (
                            <TopicCard key={topic.id} topic={topic} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function TopicCard({ topic }: { topic: any }) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden group">
            <CardContent className="p-0">
                <div
                    className="p-6 flex items-center justify-between cursor-pointer select-none"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center space-x-4 flex-1">
                        <div className={cn(
                            "h-5 w-5 rounded-full flex items-center justify-center transition-colors border-2",
                            topic.completed === 100
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-muted-foreground/30 text-transparent"
                        )}>
                            <CheckCircle2 className="h-3 w-3" />
                        </div>
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center space-x-2">
                                <h4 className="font-black text-sm group-hover:text-primary transition-colors">{topic.title}</h4>
                                <Badge variant="outline" className={cn(
                                    "text-[8px] font-black uppercase px-1.5 py-0 border-none",
                                    topic.weightage.includes("Very High") ? "bg-red-50 text-red-600" :
                                        topic.weightage.includes("High") ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                                )}>
                                    <Scale className="h-2 w-2 mr-1" /> {topic.weightage} Weightage
                                </Badge>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Progress value={topic.completed} className="h-1 flex-1 bg-muted" />
                                <span className="text-[10px] font-black tabular-nums text-muted-foreground w-8">{topic.completed}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 ml-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Est. Time</p>
                            <p className="text-xs font-black italic">{topic.timeEst}</p>
                        </div>
                        <div className={cn(
                            "h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center transition-transform",
                            isExpanded && "rotate-180"
                        )}>
                            <ChevronDown className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-muted/10 border-t"
                        >
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Subtopics Checklist */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground flex items-center">
                                            <Layers className="h-3 w-3 mr-2" /> Breakdown
                                        </p>
                                        <div className="space-y-2">
                                            {topic.subtopics.map((sub: string, i: number) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-transparent hover:border-primary/20 transition-all group/item cursor-pointer">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-5 w-5 rounded-lg border-2 border-muted flex items-center justify-center group-hover/item:bg-primary group-hover/item:border-primary transition-all">
                                                            <CheckCircle2 className="h-3.5 w-3.5 text-white opacity-0 group-hover/item:opacity-100" />
                                                        </div>
                                                        <span className="text-xs font-bold text-muted-foreground group-hover/item:text-foreground">{sub}</span>
                                                    </div>
                                                    <Star className="h-3 w-3 text-muted-foreground/30 hover:text-orange-400" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Topic Specific Tools */}
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground">Topic Resources</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button variant="outline" className="h-16 rounded-2xl flex-col space-y-1 items-start px-4 border-dashed hover:border-primary group/btn">
                                                <PlayCircle className="h-4 w-4 text-red-500" />
                                                <span className="text-[9px] font-black uppercase text-muted-foreground group-hover/btn:text-primary">Watch Videos</span>
                                            </Button>
                                            <Button variant="outline" className="h-16 rounded-2xl flex-col space-y-1 items-start px-4 border-dashed hover:border-primary group/btn">
                                                <FileText className="h-4 w-4 text-blue-500" />
                                                <span className="text-[9px] font-black uppercase text-muted-foreground group-hover/btn:text-primary">Read Notes</span>
                                            </Button>
                                            <Button variant="outline" className="h-16 rounded-2xl flex-col space-y-1 items-start px-4 border-dashed hover:border-primary group/btn">
                                                <HelpCircle className="h-4 w-4 text-purple-500" />
                                                <span className="text-[9px] font-black uppercase text-muted-foreground group-hover/btn:text-primary">Solve MCQs</span>
                                            </Button>
                                            <Button variant="outline" className="h-16 rounded-2xl flex-col space-y-1 items-start px-4 border-dashed hover:border-primary group/btn">
                                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-[9px] font-black uppercase text-muted-foreground group-hover/btn:text-primary">Discussion</span>
                                            </Button>
                                        </div>
                                        <div className="p-4 bg-primary/5 rounded-2xl space-y-2">
                                            <p className="text-[9px] font-black uppercase text-primary">Mastery Strategy</p>
                                            <p className="text-[11px] font-medium text-muted-foreground italic leading-relaxed">
                                                "Focus on 'Divisibility' – often appears in 2-3 direct questions per year."
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
