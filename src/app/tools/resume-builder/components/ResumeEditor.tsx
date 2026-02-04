"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useResume } from "../context/ResumeContext";
import { Button } from "@/components/ui/button";
import { Printer, Download, Save, ChevronRight, User, GraduationCap, Briefcase, Code, Trophy } from "lucide-react";
import { FileText, Target } from "lucide-react";
import { PersonalForm } from "./PersonalForm";
import { EducationForm } from "./EducationForm";
import { ExperienceForm } from "./ExperienceForm";
import { SkillsForm } from "./SkillsForm";
import { JobDescriptionForm } from "./JobDescriptionForm";
import { AnalysisPanel } from "./AnalysisPanel";
import { ResumePreview } from "./ResumePreview";
import { cn } from "@/lib/utils";

export function ResumeEditor() {
    const { resumeData, atsScore, templateId, setTemplateId } = useResume();

    // Sections Configuration
    type SectionId = 'personal' | 'education' | 'experience' | 'skills' | 'job';

    const sections: { id: SectionId; label: string; icon: any }[] = [
        { id: "personal", label: "Personal", icon: User },
        { id: "education", label: "Education", icon: GraduationCap },
        { id: "experience", label: "Experience", icon: Briefcase },
        { id: "skills", label: "Skills", icon: Code },
        { id: "job", label: "Target Job", icon: Target },
    ];

    const [activeSection, setActiveSection] = useState<SectionId>("personal");
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = () => {
        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 100);
    };

    // Clean Print View - Removes all complex layout/transforms
    if (isPrinting) {
        return (
            <div id="print-root" className="bg-white text-black">
                <ResumePreview />
            </div>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-400 border-emerald-500/50 shadow-emerald-500/20";
        if (score >= 60) return "text-yellow-400 border-yellow-500/50 shadow-yellow-500/20";
        return "text-red-400 border-red-500/50 shadow-red-500/20";
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Main Editor Wrapper - Z-Index 20 to sit ABOVE the Footer */}
            <div className="container mx-auto max-w-7xl px-4 lg:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full relative z-20">

                {/* LEFT: Editor Panel (Flows naturally) */}
                <div className="lg:col-span-5 flex flex-col gap-6 pb-10">

                    {/* Header with Score */}
                    <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-black bg-white dark:bg-slate-900 shadow-xl transition-all duration-500",
                                getScoreColor(atsScore)
                            )}>
                                {atsScore}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">ATS Builder</h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Real-time Optimization</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={templateId}
                                onChange={(e) => setTemplateId(e.target.value)}
                                className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/20 rounded-lg text-sm text-slate-900 dark:text-white px-3 py-2 outline-none focus:border-blue-500"
                            >
                                <option value="classic" className="bg-white dark:bg-slate-900">Harvard (Classic)</option>
                                <option value="modern" className="bg-white dark:bg-slate-900">Modern Minimal</option>
                            </select>
                            <Button onClick={handlePrint} size="icon" className="bg-blue-600 hover:bg-blue-500">
                                <Download className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap outline-none focus:ring-2 focus:ring-blue-500/50",
                                    activeSection === section.id
                                        ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 shadow-lg"
                                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-white/5"
                                )}
                            >
                                <section.icon className="w-4 h-4" />
                                <section.label>
                                    {section.label}
                                </section.label>
                            </button>
                        ))}
                    </div>

                    {/* Form Area (No Scrollbar, expands page) */}
                    <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 relative flex flex-col gap-6 shadow-sm">
                        {activeSection !== 'job' && <AnalysisPanel />}

                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeSection === "personal" && <PersonalForm />}
                            {activeSection === "education" && <EducationForm />}
                            {activeSection === "experience" && <ExperienceForm />}
                            {activeSection === "skills" && <SkillsForm />}
                            {activeSection === "job" && <JobDescriptionForm />}
                        </motion.div>
                    </div>
                </div>

                {/* RIGHT: Live Preview (Sticky Window Window) */}
                <div className="hidden lg:block lg:col-span-7">
                    <div className="sticky top-28 bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-3xl border border-slate-300/50 dark:border-white/5 rounded-2xl p-8 flex justify-center shadow-2xl">
                        <div id="preview-wrapper" className="w-[210mm] min-h-[297mm] bg-white text-black shadow-2xl origin-top transform scale-[0.45] sm:scale-[0.55] md:scale-[0.65] lg:scale-[0.8] xl:scale-[0.9] 2xl:scale-100 transition-transform duration-500">
                            <ResumePreview />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
