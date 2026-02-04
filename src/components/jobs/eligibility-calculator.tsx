"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calculator, CheckCircle2, XCircle } from "lucide-react";

interface EligibilityCalculatorProps {
    jobCriteria: {
        minAge: number;
        maxAge: number;
        qualification: string[];
        experienceMonths: number;
        relaxations: Record<string, number>;
    };
}

export function EligibilityCalculator({ jobCriteria }: EligibilityCalculatorProps) {
    const [age, setAge] = React.useState<string>("");
    const [category, setCategory] = React.useState<string>("UR");
    const [qualification, setQualification] = React.useState<string>("");
    const [experience, setExperience] = React.useState<string>("0");
    const [result, setResult] = React.useState<{ eligible: boolean; reasons: string[] } | null>(null);

    const calculateEligibility = () => {
        const reasons: string[] = [];
        const userAge = parseInt(age);
        const userExp = parseInt(experience);
        const relaxation = jobCriteria.relaxations[category] || 0;
        const effectiveMaxAge = jobCriteria.maxAge + relaxation;

        if (isNaN(userAge)) {
            reasons.push("Please enter a valid age.");
        } else {
            if (userAge < jobCriteria.minAge) reasons.push(`Minimum age required is ${jobCriteria.minAge}.`);
            if (userAge > effectiveMaxAge) reasons.push(`Maximum age for ${category} is ${effectiveMaxAge}.`);
        }

        if (userExp < jobCriteria.experienceMonths) {
            reasons.push(`Minimum experience required is ${jobCriteria.experienceMonths} months.`);
        }

        const isEligible = reasons.length === 0;
        setResult({ eligible: isEligible, reasons });
    };

    return (
        <Card className="border-primary/20 shadow-md">
            <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-lg flex items-center">
                    <Calculator className="mr-2 h-5 w-5 text-primary" /> Eligibility Checker
                </CardTitle>
                <CardDescription>
                    Check if you qualify for this position instantly.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Your Age</label>
                        <Input type="number" placeholder="Enter age" value={age} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Category</label>
                        <Select onValueChange={setCategory} defaultValue="UR">
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="UR">UR / General</SelectItem>
                                <SelectItem value="OBC">OBC</SelectItem>
                                <SelectItem value="SC">SC</SelectItem>
                                <SelectItem value="ST">ST</SelectItem>
                                <SelectItem value="EWS">EWS</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Experience (Months)</label>
                    <Input type="number" placeholder="0" value={experience} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExperience(e.target.value)} />
                </div>

                <Button className="w-full" onClick={calculateEligibility}>
                    Check Eligibility
                </Button>

                {result && (
                    <div className={`mt-4 p-4 rounded-xl border ${result.eligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center space-x-2">
                            {result.eligible ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span className={`font-bold ${result.eligible ? 'text-green-800' : 'text-red-800'}`}>
                                {result.eligible ? "You are eligible!" : "Not Eligible"}
                            </span>
                        </div>
                        {!result.eligible && (
                            <ul className="mt-2 space-y-1">
                                {result.reasons.map((r, i) => (
                                    <li key={i} className="text-xs text-red-700 flex items-start">
                                        • {r}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {result.eligible && (
                            <p className="text-xs text-green-700 mt-1">
                                You meet all the basic criteria for this job.
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
