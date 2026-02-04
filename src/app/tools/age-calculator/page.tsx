"use client";

import { useState, useEffect } from "react";
import {
    Calculator,
    Calendar,
    RefreshCcw,
    CheckCircle2,
    XCircle,
    Info,
    ArrowLeft,
    Sparkles,
    Zap,
    Check,
    Clock,
    Lock,
    Minimize2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function AgeCalculatorPage() {
    // State
    const [birthDate, setBirthDate] = useState("2000-01-01");
    const [targetDate, setTargetDate] = useState("");
    const [calculationMode, setCalculationMode] = useState("exact");

    // Eligibility State
    const [requiredAge, setRequiredAge] = useState<number>(18);
    const [requiredUnit, setRequiredUnit] = useState("years");

    // Results
    const [age, setAge] = useState<{
        years: number;
        months: number;
        days: number;
        totalMonths: number;
        totalWeeks: number;
        totalDays: number;
    } | null>(null);

    // Initialize target date to today
    useEffect(() => {
        setTargetDate(new Date().toISOString().split('T')[0]);
    }, []);

    // Core Calculation Logic
    const calculateAge = () => {
        if (!birthDate || !targetDate) return;

        const start = new Date(birthDate);
        const end = new Date(targetDate);

        // Exact Age
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        if (days < 0) {
            months--;
            const prevMonthLastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
            days += prevMonthLastDay;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Totals
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = (years * 12) + months;

        setAge({ years, months, days, totalMonths, totalWeeks, totalDays });
    };

    // Eligibility Check Helper
    const checkEligibility = () => {
        if (!age) return null;

        let userVal = 0;
        let reqVal = requiredAge;

        if (requiredUnit === "years") {
            userVal = age.years;
        } else if (requiredUnit === "months") {
            userVal = age.totalMonths;
        } else {
            userVal = age.totalDays;
        }

        const isEligible = userVal >= reqVal;

        return { isEligible, userVal, reqVal, unit: requiredUnit };
    };

    const reset = () => {
        setBirthDate("2000-01-01");
        setTargetDate(new Date().toISOString().split('T')[0]);
        setCalculationMode("exact");
        setRequiredAge(18);
        setRequiredUnit("years");
        setAge(null);
    };

    const eligibility = checkEligibility();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header (Premium Purple/Blue Theme - Copied pattern) */}
            <header className="relative flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-900 pt-16 pb-12 px-4 shadow-xl z-20 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div className="absolute inset-0 z-0 select-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-100/50 dark:from-purple-500/10 via-white dark:via-slate-900 to-white dark:to-slate-900"></div>
                </div>

                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
                        <div className="text-left flex-1">
                            <Link href="/tools" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-4 text-sm font-medium">
                                <ArrowLeft className="w-4 h-4" /> Back to Tools
                            </Link>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-purple-100/50 dark:bg-purple-500/20 rounded-lg border border-purple-200 dark:border-purple-500/30">
                                    <Calculator className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                Versatile Age Calculator
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 max-w-lg text-base leading-relaxed">
                                Calculate exact age and check exam eligibility instantly.
                            </p>
                        </div>

                        {/* Compact Badges (Matched Image Resizer) */}
                        <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-3">
                            <div className="flex items-center gap-1.5 bg-white/60 dark:bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 text-xs text-purple-700 dark:text-purple-100/80 shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-300" /> Exact Results
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/60 dark:bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 text-xs text-blue-700 dark:text-blue-100/80 shadow-sm">
                                <Zap className="w-3.5 h-3.5 text-blue-500 dark:text-blue-300" /> Instant
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* WORKSPACE AREA (Properly spaced from header) */}
            <div className="container mx-auto max-w-7xl px-4 mt-8 relative z-30 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                    {/* LEFT: Inputs (4 Cols - Matched Sidebar) */}
                    <div className="lg:col-span-4 flex flex-col">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex-1 flex flex-col overflow-hidden">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <Calculator className="w-5 h-5 text-purple-500" /> Input Details
                                </h2>
                            </div>

                            <div className="p-8 space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 dark:text-slate-300">Date of Birth</Label>
                                    <Input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="h-10 w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-700 dark:text-slate-300">Target Date</Label>
                                    <Input
                                        type="date"
                                        value={targetDate}
                                        onChange={(e) => setTargetDate(e.target.value)}
                                        className="h-10 w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-700 dark:text-slate-300">Mode</Label>
                                    <Select value={calculationMode} onValueChange={setCalculationMode}>
                                        <SelectTrigger className="h-10 w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="exact">Exact (Y/M/D)</SelectItem>
                                            <SelectItem value="months">Total Months</SelectItem>
                                            <SelectItem value="weeks">Total Weeks</SelectItem>
                                            <SelectItem value="days">Total Days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>



                                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <Button variant="secondary" onClick={reset} className="flex-1">
                                        <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                                    </Button>
                                    <Button onClick={calculateAge} className="flex-[2] bg-purple-600 hover:bg-purple-700 text-white">
                                        Calculate
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Results (8 Cols - Matched Main Content) */}
                    <div className="lg:col-span-8 flex flex-col">
                        {age ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex-1 flex flex-col"
                            >
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 text-center border-b border-slate-100 dark:border-slate-800 relative">
                                    <span className="text-xs font-bold tracking-widest text-purple-500 uppercase mb-2 block">Calculated Age</span>

                                    {calculationMode === "exact" && (
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            <div className="flex items-baseline gap-2">
                                                <h2 className="text-6xl font-black text-slate-800 dark:text-slate-100">{age.years}</h2>
                                                <span className="text-xl font-medium text-slate-400">Years</span>
                                            </div>
                                            <p className="text-lg text-slate-500 font-medium">
                                                {age.months} Months, {age.days} Days
                                            </p>
                                        </div>
                                    )}
                                    {calculationMode === "months" && (
                                        <div className="flex items-baseline justify-center gap-2">
                                            <h2 className="text-6xl font-black text-slate-800 dark:text-slate-100">{age.totalMonths}</h2>
                                            <span className="text-xl font-medium text-slate-400">Total Months</span>
                                        </div>
                                    )}
                                    {calculationMode === "weeks" && (
                                        <div className="flex items-baseline justify-center gap-2">
                                            <h2 className="text-6xl font-black text-slate-800 dark:text-slate-100">{age.totalWeeks}</h2>
                                            <span className="text-xl font-medium text-slate-400">Total Weeks</span>
                                        </div>
                                    )}
                                    {calculationMode === "days" && (
                                        <div className="flex items-baseline justify-center gap-2">
                                            <h2 className="text-6xl font-black text-slate-800 dark:text-slate-100">{age.totalDays}</h2>
                                            <span className="text-xl font-medium text-slate-400">Total Days</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-8">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Complete Breakdown</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center border border-slate-100 dark:border-slate-800">
                                            <div className="text-3xl font-black text-slate-800 dark:text-slate-100">{age.years}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Years</div>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center border border-slate-100 dark:border-slate-800">
                                            <div className="text-3xl font-black text-slate-800 dark:text-slate-100">{age.months}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Months</div>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center border border-slate-100 dark:border-slate-800">
                                            <div className="text-3xl font-black text-slate-800 dark:text-slate-100">{age.days}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Days</div>
                                        </div>
                                    </div>


                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center flex-1 flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-300">
                                    <Calculator className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Ready to Calculate</h3>
                                <p className="text-slate-400 max-w-sm mx-auto">
                                    Enter your birth date in the panel to the left and click 'Calculate' to see detailed results.
                                </p>
                            </div>
                        )}
                    </div>

                </div>

                {/* INFO SECTION - Matched Footer Style */}
                {/* FEATURES SECTION (Matches Image Compressor Style) */}
                <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">Why Use Our Age Calculator?</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                            Fast, accurate, and private age calculations designed for candidates and professionals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Fast Processing</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                Get instant age results as you type. Optimized for speed to save you time.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Privacy Focused</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                All calculations happen locally. Your dates are never uploaded or stored on our servers.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-7 h-7" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Always Accurate</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                Precise results considering leap years and varying month days for 100% accuracy.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Calculator className="w-7 h-7" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Complete Breakdown</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                Get a full breakdown of your age in years, months, weeks, and days in one view.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
