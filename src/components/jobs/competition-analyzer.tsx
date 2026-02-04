"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompetitionAnalyzerProps {
    estimatedApplicants: number;
    vacancies: number;
    successProbability: number; // 0 to 100
}

export function CompetitionAnalyzer({ estimatedApplicants, vacancies, successProbability }: CompetitionAnalyzerProps) {
    const ratio = (estimatedApplicants / vacancies).toFixed(1);

    return (
        <Card className="shadow-md border-purple-100 bg-gradient-to-br from-white to-purple-50/30">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-purple-600" /> Competition Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center text-center">
                    <div className="relative h-32 w-32 flex items-center justify-center">
                        <svg className="h-full w-full" viewBox="0 0 100 100">
                            <circle
                                className="text-muted stroke-current"
                                strokeWidth="8"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                            />
                            <motion.circle
                                className="text-purple-600 stroke-current"
                                strokeWidth="8"
                                strokeLinecap="round"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                                initial={{ strokeDasharray: "0 251.2" }}
                                animate={{ strokeDasharray: `${(successProbability * 251.2) / 100} 251.2` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-2xl font-bold">{successProbability}%</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">Success Rate</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded-xl border shadow-sm">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Ratio</p>
                        <p className="text-lg font-bold">1:{ratio}</p>
                        <p className="text-[10px] text-muted-foreground">Per Vacancy</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border shadow-sm">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Est. Apply</p>
                        <p className="text-lg font-bold">{(estimatedApplicants / 1000).toFixed(1)}K</p>
                        <p className="text-[10px] text-muted-foreground">Historical Data</p>
                    </div>
                </div>

                <div className="bg-white/50 p-3 rounded-lg border border-purple-100 flex items-start space-x-3">
                    <Target className="h-4 w-4 text-purple-600 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                        Competition is <strong>{parseFloat(ratio) > 50 ? "High" : "Moderate"}</strong>. Focus on Section A for maximum advantage.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
