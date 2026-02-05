"use client";

import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import {
    FolderOpen,
    Eye,
    Bot,
    Database,
    ArrowRight,
    Check,
    X,
    Cpu,
    Sparkles,
    Save,
    Trash2,
    Clock,
    TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// --- DATA: Architecture Steps ---
const archSteps = [
    {
        title: "1. Ingestion & Upload",
        icon: <FolderOpen className="w-8 h-8 text-blue-600" />,
        desc: "The interface where your admin team uploads the file. This is the entry point of the pipeline.",
        tech: [
            { name: "File Support", value: "PDF, JPG, PNG" },
            { name: "Frontend", value: "HTML5 File API / React Dropzone" },
            { name: "Validation", value: "Check file type & size client-side" }
        ],
        insight: "Allowing batch uploads (drag & drop 50 files at once) can speed up the workflow significantly before processing even begins."
    },
    {
        title: "2. OCR (Optical Character Recognition)",
        icon: <Eye className="w-8 h-8 text-indigo-600" />,
        desc: "If the upload is an image or scanned PDF, computers can't read the text directly. OCR converts pixels into selectable text.",
        tech: [
            { name: "Open Source", value: "Tesseract OCR (Python)" },
            { name: "Cloud API", value: "AWS Textract / Google Vision API" },
            { name: "Library", value: "PyMuPDF (for native PDFs)" }
        ],
        insight: "For native PDFs (generated from Word), use a text extractor library (fast/cheap). Only use heavy OCR for scanned images."
    },
    {
        title: "3. LLM Processing (The Brain)",
        icon: <Bot className="w-8 h-8 text-violet-600" />,
        desc: "The raw text is sent to a Large Language Model (LLM). We provide a 'System Prompt' telling the AI to extract specific JSON fields.",
        tech: [
            { name: "Model", value: "Gemini 1.5 Flash / GPT-4o-mini" },
            { name: "Format", value: "JSON Mode (Guaranteed Structure)" },
            { name: "Prompting", value: "Zero-shot extraction" }
        ],
        insight: "This is the game changer. Unlike regex, LLMs understand context. They know that '12 LPA' is a salary and 'Bangalore' is a location without rigid rules."
    },
    {
        title: "4. Database Storage",
        icon: <Database className="w-8 h-8 text-emerald-600" />,
        desc: "The structured JSON returned by the AI is mapped to your database schema and saved after a quick human approval.",
        tech: [
            { name: "Database", value: "PostgreSQL / MongoDB" },
            { name: "API", value: "REST / GraphQL Endpoint" },
            { name: "Action", value: "Upsert (Update if exists)" }
        ],
        insight: "Always include a 'Review Step' in the UI. Allow the user to edit the AI's suggestions before committing to the main database."
    }
];

// --- DATA: Mock Jobs for Simulation ---
const mockJobs = [
    {
        raw: `Hiring Notice: Senior React Developer
Company: TechNova Solutions Ltd.
Location: Bengaluru (Hybrid)

We are looking for an experienced frontend developer.
Salary Package: 12-18 LPA based on experience.
Experience Required: 3-5 years.

Key Responsibilities:
- Build SPAs using React.js and Tailwind.
- Optimize performance.

Deadline to apply: 25th March 2026.
Contact: hr@technova.com`,
        data: {
            title: "Senior React Developer",
            company: "TechNova Solutions Ltd.",
            location: "Bengaluru (Hybrid)",
            salary: "12-18 LPA",
            deadline: "2026-03-25",
            skills: ["React.js", "Tailwind", "Frontend", "SPA"]
        }
    },
    {
        raw: `URGENT OPENING: Data Analyst

Client: FinCorp Bank
Place: Mumbai, India

Role Description: Analyze financial trends using Python and SQL. Create dashboards in Tableau.

Comp: ₹8,00,000 - ₹12,00,000 per annum.
Immediate Joiners preferred.

Skills: Python, SQL, Tableau, Excel.
Apply by: 30 April 2026`,
        data: {
            title: "Data Analyst",
            company: "FinCorp Bank",
            location: "Mumbai, India",
            salary: "₹8L - ₹12L PA",
            deadline: "2026-04-30",
            skills: ["Python", "SQL", "Tableau", "Data Analysis"]
        }
    },
    {
        raw: `Role: Digital Marketing Executive
Agency: CreativePulse
Remote / Work from Home

Need someone to handle SEO and Google Ads.
Pay: $2000/month.
Contract duration: 6 months.

Send CV to jobs@creativepulse.agency`,
        data: {
            title: "Digital Marketing Executive",
            company: "CreativePulse",
            location: "Remote",
            salary: "$2000/month",
            deadline: "Open",
            skills: ["SEO", "Google Ads", "Marketing"]
        }
    }
];

export default function AutomationArchitectPage() {
    // --- STATE: Architecture ---
    const [activeStep, setActiveStep] = useState(0);

    // --- STATE: Simulation ---
    const [currentJobIndex, setCurrentJobIndex] = useState(0);
    const [rawInput, setRawInput] = useState(mockJobs[0].raw);
    const [extractedForm, setExtractedForm] = useState<any>({});
    const [isSimulating, setIsSimulating] = useState(false);

    // --- STATE: ROI ---
    const [jobsPerDay, setJobsPerDay] = useState(10);
    const [minsPerJob, setMinsPerJob] = useState(15);
    const [roiData, setRoiData] = useState<any[]>([]);

    // Load initial text
    useEffect(() => {
        setRawInput(mockJobs[currentJobIndex].raw);
        setExtractedForm({});
    }, [currentJobIndex]);

    // Recalculate ROI
    useEffect(() => {
        const days = 30;
        const autoMins = 1;
        const totalManual = jobsPerDay * minsPerJob * days;
        const totalAuto = jobsPerDay * autoMins * days;

        setRoiData([
            {
                name: 'Monthly Time (Minutes)',
                "Manual Entry": totalManual,
                "Automated Entry": totalAuto
            }
        ]);
    }, [jobsPerDay, minsPerJob]);

    // Helpers
    const handleScramble = () => {
        const nextIndex = (currentJobIndex + 1) % mockJobs.length;
        setCurrentJobIndex(nextIndex);
    };

    const runSimulation = () => {
        setIsSimulating(true);
        // Simulate network delay
        setTimeout(() => {
            setExtractedForm(mockJobs[currentJobIndex].data);
            setIsSimulating(false);
        }, 1500);
    };

    const savedHours = ((roiData[0]?.["Manual Entry"] - roiData[0]?.["Automated Entry"]) / 60)?.toFixed(1) || "0";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black font-sans text-slate-900 dark:text-slate-100 pb-20">

            {/* HER HERO SECTION */}
            <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
                        <Sparkles className="w-4 h-4" /> Architecture Overview
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                        Stop Manual Data Entry.<br />
                        Start <span className="text-blue-600 dark:text-blue-500">Automating</span>.
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Manually copying job data leads to errors and burnout.
                        See how our <strong>Sarkari Result Hub</strong> uses AI to transform raw PDF notifications into structured database entries instantly.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
                        {/* Problem Card */}
                        <div className="relative overflow-hidden bg-rose-50 dark:bg-rose-950/20 p-6 rounded-2xl border border-rose-100 dark:border-rose-900/50">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <X className="w-24 h-24 text-rose-600" />
                            </div>
                            <h3 className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2 mb-3">
                                <X className="w-5 h-5" /> Manual Process
                            </h3>
                            <ul className="space-y-2 text-sm text-rose-900/70 dark:text-rose-200/70 font-medium">
                                <li>• Download PDF & Read 10+ pages</li>
                                <li>• Copy/Paste distinct fields</li>
                                <li>• Risk of typos & missing dates</li>
                                <li>• <strong>Avg Time:</strong> 15-20 mins/job</li>
                            </ul>
                        </div>

                        {/* Solution Card */}
                        <div className="relative overflow-hidden bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Check className="w-24 h-24 text-emerald-600" />
                            </div>
                            <h3 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mb-3">
                                <Check className="w-5 h-5" /> Automated Solution
                            </h3>
                            <ul className="space-y-2 text-sm text-emerald-900/70 dark:text-emerald-200/70 font-medium">
                                <li>• Upload PDF to Portal</li>
                                <li>• AI Extracts Entities Automatically</li>
                                <li>• Quick Human Verification</li>
                                <li>• <strong>Avg Time:</strong> &lt; 1 min/job</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* INTERACTIVE ARCHITECTURE */}
            <section className="py-20 px-4 max-w-6xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">How It Works: The Pipeline</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Click on any stage to see the underlying technology powering the Job Portal.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Steps List */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        {archSteps.map((step, idx) => (
                            <div
                                key={idx}
                                onClick={() => setActiveStep(idx)}
                                className={`cursor-pointer group relative p-5 rounded-xl border transition-all duration-300 flex items-center justify-between
                                    ${activeStep === idx
                                        ? "bg-white dark:bg-slate-900 border-blue-500 shadow-lg scale-[1.02]"
                                        : "bg-white/50 dark:bg-slate-900/50 border-transparent hover:bg-white dark:hover:bg-slate-900 hover:shadow"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${activeStep === idx ? "bg-blue-100 dark:bg-blue-900/50" : "bg-slate-100 dark:bg-slate-800"}`}>
                                        {step.icon}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Step {idx + 1}</div>
                                        <h3 className={`font-bold ${activeStep === idx ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>
                                            {step.title.split('. ')[1]}
                                        </h3>
                                    </div>
                                </div>
                                {activeStep === idx && <ArrowRight className="w-5 h-5 text-blue-500 animate-pulse" />}
                            </div>
                        ))}
                    </div>

                    {/* Detail View */}
                    <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200 dark:shadow-none flex flex-col justify-center min-h-[400px]">
                        <div key={activeStep} className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                                    {archSteps[activeStep].icon}
                                </div>
                                <h3 className="text-2xl font-bold">{archSteps[activeStep].title}</h3>
                            </div>

                            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                {archSteps[activeStep].desc}
                            </p>

                            <div className="grid sm:grid-cols-3 gap-4 mb-8">
                                {archSteps[activeStep].tech.map((t, i) => (
                                    <div key={i} className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">{t.name}</div>
                                        <div className="font-semibold text-sm">{t.value}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    <span className="font-bold">💡 Pro Insight:</span> {archSteps[activeStep].insight}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LIVE SIMULATION */}
            <section className="bg-slate-900 text-white py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                            <div className="inline-block bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">Live Prototype</div>
                            <h2 className="text-3xl font-bold">Try the "Magic" Button</h2>
                            <p className="text-slate-400 mt-2 max-w-2xl">
                                Experience how our AI maps unstructured text to database fields instantly.
                            </p>
                        </div>
                        <Button variant="outline" onClick={handleScramble} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                            Next Sample Job
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* INPUT */}
                        <div className="space-y-4">
                            <Label className="text-slate-400 uppercase text-xs font-bold tracking-wider">Raw Job Text (Simulated PDF Content)</Label>
                            <div className="relative">
                                <Textarea
                                    value={rawInput}
                                    readOnly
                                    className="h-96 bg-slate-800 border-slate-700 text-slate-300 font-mono text-sm p-6 leading-relaxed resize-none focus:ring-0"
                                />
                                <div className="absolute bottom-4 right-4">
                                    <Button
                                        onClick={runSimulation}
                                        disabled={isSimulating}
                                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/50 transition-all hover:scale-105"
                                    >
                                        {isSimulating ? (
                                            <>
                                                <Cpu className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4 mr-2" /> Auto-Extract Info
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* OUTPUT */}
                        <div className="bg-white text-slate-900 rounded-xl p-6 relative overflow-hidden min-h-[500px] shadow-2xl">
                            {isSimulating && (
                                <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <div className="text-blue-600 font-bold animate-pulse">AI is reading the document...</div>
                                </div>
                            )}

                            <div className="flex items-center justify-between border-b pb-4 mb-6">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Database className="w-5 h-5 text-slate-400" /> Database Entry Preview
                                </h3>
                                <div className="text-xs font-bold text-slate-400 uppercase">Ready to Save</div>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-slate-500 font-bold">Job Title</Label>
                                        <Input value={extractedForm.title || ""} placeholder="Waiting for extraction..." readOnly className="bg-slate-50 border-slate-200 font-semibold text-slate-800" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-slate-500 font-bold">Company</Label>
                                        <Input value={extractedForm.company || ""} placeholder="..." readOnly className="bg-slate-50 border-slate-200 text-slate-600" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs uppercase text-slate-500 font-bold">Location</Label>
                                    <Input value={extractedForm.location || ""} placeholder="..." readOnly className="bg-slate-50 border-slate-200 text-slate-600" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-slate-500 font-bold">Salary</Label>
                                        <Input value={extractedForm.salary || ""} placeholder="..." readOnly className="bg-slate-50 border-slate-200 text-slate-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-slate-500 font-bold">Deadline</Label>
                                        <Input value={extractedForm.deadline || ""} placeholder="..." readOnly className="bg-slate-50 border-slate-200 text-slate-600" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 font-bold">Extracted Skill Tags</Label>
                                    <div className="min-h-[60px] p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap gap-2">
                                        {extractedForm.skills ? (
                                            extractedForm.skills.map((skill: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded border border-blue-200">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">No data extracted yet.</span>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3 mt-4 border-t border-slate-100">
                                    <Button variant="ghost" className="text-slate-400 hover:text-slate-600">
                                        <Trash2 className="w-4 h-4 mr-2" /> Discard
                                    </Button>
                                    <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200">
                                        <Save className="w-4 h-4 mr-2" /> Commit to Database
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ROI CALCULATOR */}
            <section className="py-20 px-4 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Controls */}
                    <div className="w-full md:w-1/3 space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Calculate Savings</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                Adjust the sliders to see how much time your team could save per month.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <Label>Jobs Posted / Day</Label>
                                        <span className="font-bold text-blue-600">{jobsPerDay}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1" max="50"
                                        value={jobsPerDay}
                                        onChange={(e) => setJobsPerDay(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <Label>Mins per Manual Entry</Label>
                                        <span className="font-bold text-blue-600">{minsPerJob} min</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="5" max="45"
                                        value={minsPerJob}
                                        onChange={(e) => setMinsPerJob(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3 mb-1">
                                    <Clock className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Time Saved</span>
                                </div>
                                <div className="text-4xl font-extrabold text-green-600 dark:text-green-500">
                                    {savedHours} <span className="text-lg text-slate-400 font-normal">hours / month</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="w-full md:w-2/3 h-[400px] bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={roiData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" hide />
                                <YAxis tickFormatter={(val) => `${val / 60}h`} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    formatter={(value: any) => [`${(Number(value || 0) / 60).toFixed(1)} hours`, 'Time Spent'] as [string, string]}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="Manual Entry" fill="#ef4444" radius={[6, 6, 0, 0]} name="Manual Process" />
                                <Bar dataKey="Automated Entry" fill="#10b981" radius={[6, 6, 0, 0]} name="Automated Process" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>
        </div>
    );
}
