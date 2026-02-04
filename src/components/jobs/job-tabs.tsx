"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
    Info,
    Calendar,
    ClipboardList,
    BookOpen,
    FileText,
    UserCheck,
    Download,
    BellRing,
    CalendarPlus,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface JobTabsProps {
    data: {
        basicDetails: any;
        timeline: any;
        process: any;
        pattern: any;
        syllabus: any;
        selection: any;
    };
}

export function JobTabs({ data }: JobTabsProps) {
    return (
        <Tabs defaultValue="basic" className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto gap-1 bg-transparent border-b rounded-none p-0 overflow-x-auto justify-start">
                <TabsTrigger value="basic" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent py-3">
                    <Info className="mr-2 h-4 w-4" /> Basic Details
                </TabsTrigger>
                <TabsTrigger value="dates" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent py-3">
                    <Calendar className="mr-2 h-4 w-4" /> Dates
                </TabsTrigger>
                <TabsTrigger value="process" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent py-3">
                    <ClipboardList className="mr-2 h-4 w-4" /> Process
                </TabsTrigger>
                <TabsTrigger value="pattern" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent py-3">
                    <BookOpen className="mr-2 h-4 w-4" /> Pattern
                </TabsTrigger>
                <TabsTrigger value="syllabus" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent py-3">
                    <FileText className="mr-2 h-4 w-4" /> Syllabus
                </TabsTrigger>
                <TabsTrigger value="selection" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent py-3">
                    <UserCheck className="mr-2 h-4 w-4" /> Selection
                </TabsTrigger>
            </TabsList>

            {/* Basic Details Content */}
            <TabsContent value="basic" className="mt-6">
                <Card>
                    <CardContent className="p-6 space-y-8">
                        {/* Eligibility Table */}
                        <div>
                            <h3 className="text-lg font-bold mb-4">Eligibility Criteria</h3>
                            <div className="overflow-x-auto border rounded-xl">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-bold">
                                        <tr>
                                            <th className="px-4 py-3">Category</th>
                                            <th className="px-4 py-3">Requirement</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Education</td>
                                            <td className="px-4 py-3">{data.basicDetails.education}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Age Limit</td>
                                            <td className="px-4 py-3">{data.basicDetails.ageLimit}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Experience</td>
                                            <td className="px-4 py-3">{data.basicDetails.experience || "Not Required"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Salary Structure */}
                        <div>
                            <h3 className="text-lg font-bold mb-4">Salary Structure</h3>
                            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                <p className="text-lg font-semibold text-primary">{data.basicDetails.salary}</p>
                                <p className="text-sm text-muted-foreground mt-1">Pay Matrix Level: {data.basicDetails.payLevel}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Timeline Content */}
            <TabsContent value="dates" className="mt-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Important Dates Timeline</h3>
                            <Button variant="outline" size="sm">
                                <BellRing className="mr-2 h-4 w-4" /> Set Reminders
                            </Button>
                        </div>
                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                            {data.timeline.map((event: any, index: number) => (
                                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        <div className={cn(
                                            "h-3 w-3 rounded-full",
                                            event.completed ? "bg-green-500" : "bg-primary"
                                        )} />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-foreground">{event.title}</div>
                                            <time className="font-hindi text-sm text-primary font-bold">{event.date}</time>
                                        </div>
                                        <div className="text-muted-foreground text-sm flex items-center justify-between">
                                            <span>{event.description}</span>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                <CalendarPlus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Simplified Syllabus Tab */}
            <TabsContent value="syllabus" className="mt-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Detailed Syllabus</h3>
                            <Button variant="primary" size="sm" className="bg-red-600 hover:bg-red-700">
                                <Download className="mr-2 h-4 w-4" /> Download PDF
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {data.syllabus.map((subject: any, idx: number) => (
                                <div key={idx} className="border rounded-xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-primary">{subject.name}</h4>
                                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full font-bold">Weightage: {subject.weightage}</span>
                                    </div>
                                    <ul className="text-sm text-muted-foreground list-disc list-inside grid grid-cols-1 md:grid-cols-2 gap-1">
                                        {subject.topics.map((topic: string, tidx: number) => (
                                            <li key={tidx}>{topic}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Other tabs placeholders for the skeleton */}
            <TabsContent value="process" className="mt-6">
                <Card>
                    <CardContent className="p-6 space-y-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Application Step-by-Step</h3>
                            <Badge variant="secondary">Official Guide 2024</Badge>
                        </div>

                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-muted">
                            {data.process?.steps?.map((step: any, idx: number) => (
                                <div key={idx} className="relative flex items-start space-x-6">
                                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold relative z-10 shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <h4 className="font-bold text-foreground">{step.title}</h4>
                                            <p className="text-sm text-muted-foreground">{step.description}</p>
                                        </div>
                                        <div className="aspect-video w-full bg-muted/30 rounded-xl border-2 border-dashed border-muted flex items-center justify-center group hover:bg-muted/50 transition-colors cursor-pointer">
                                            <div className="text-center">
                                                <Info className="h-6 w-6 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                                                <span className="text-[10px] font-bold text-muted-foreground mt-2 block uppercase">View Screenshot</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                            <h4 className="font-bold text-orange-800 text-sm flex items-center mb-2">
                                <AlertCircle className="mr-2 h-4 w-4" /> Common Mistakes to Avoid
                            </h4>
                            <ul className="text-xs text-orange-700 space-y-1.5 list-disc list-inside">
                                {data.process?.mistakes?.map((mistake: string, idx: number) => (
                                    <li key={idx}>{mistake}</li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="pattern" className="mt-6">
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <h3 className="text-lg font-bold">Exam Pattern & Marks Distribution</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.pattern.sections.map((section: any, idx: number) => (
                                <div key={idx} className="p-4 border rounded-xl bg-muted/20">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold">{section.name}</h4>
                                        <Badge variant="outline">{section.marks} Marks</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{section.details}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 text-sm">
                            <Info className="mr-2 h-4 w-4" />
                            <strong>Negative Marking:</strong> {data.pattern.negativeMarking}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="selection" className="mt-6">
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-6">Selection Stages</h3>
                        <div className="space-y-4">
                            {data.selection.stages.map((stage: any, idx: number) => (
                                <div key={idx} className="flex space-x-4">
                                    <div className="flex flex-col items-center">
                                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                            {idx + 1}
                                        </div>
                                        {idx !== data.selection.stages.length - 1 && <div className="w-0.5 grow bg-border my-1" />}
                                    </div>
                                    <div className="pb-8">
                                        <h4 className="font-bold text-lg">{stage.name}</h4>
                                        <p className="text-sm text-muted-foreground">{stage.description}</p>
                                        <div className="mt-2 text-xs font-medium text-primary">
                                            Weightage: {stage.weightage}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
