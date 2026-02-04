"use client";

import { motion } from "framer-motion";
import {
    ImageIcon,
    Maximize2,
    Minimize2,
    FileText,
    Calculator,
    Keyboard,
    FileCheck,
    FileType,
    Crop,
    ArrowRight,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const tools = [
    {
        title: "Image Resizer",
        desc: "Resize photos to specific dimensions (perfect for passport size).",
        icon: Maximize2,
        color: "blue",
        href: "/tools/image-resizer",
        popular: true
    },
    {
        title: "Image Compressor",
        desc: "Reduce file size (kb/mb) without losing quality.",
        icon: Minimize2,
        color: "emerald",
        href: "/tools/image-compressor",
        popular: true
    },
    {
        title: "JPG to PDF",
        desc: "Convert your document images into a single PDF file.",
        icon: FileType,
        color: "red",
        href: "/tools/jpg-to-pdf",
        popular: false
    },
    {
        title: "Age Calculator",
        desc: "Calculate your exact age for exam eligibility criteria.",
        icon: Calculator,
        color: "purple",
        href: "/tools/age-calculator",
        popular: true
    },
    {
        title: "Typing Test",
        desc: "Practice typing speed for various government exams.",
        icon: Keyboard,
        color: "orange",
        href: "/tools/typing-test",
        popular: false
    },
    {
        title: "Resume Builder",
        desc: "Create a professional resume for job applications.",
        icon: FileCheck,
        color: "cyan",
        href: "/tools/resume-builder",
        popular: false
    },
    {
        title: "Advanced Photo Editor",
        desc: "Advanced AI tools to crop, remove backgrounds, and create Student ID photos.",
        icon: Sparkles,
        color: "pink",
        href: "/tools/photo-editor",
        popular: true,
        badge: "Student ID"
    },
    {
        title: "PDF Merger",
        desc: "Combine multiple PDF files into one document.",
        icon: FileText,
        color: "indigo",
        href: "/tools/pdf-merger",
        popular: false
    }
];

export default function ToolsPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header Section */}
            <header className="relative flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-900 pt-12 pb-10 px-4 shadow-xl z-20 transition-colors duration-300">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0 select-none">
                    <img
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80"
                        alt=""
                        className="w-full h-full object-cover opacity-10 dark:opacity-20 translate-y-[-10%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-slate-50 dark:from-slate-900/95 dark:via-slate-900/80 dark:to-slate-950"></div>
                </div>

                {/* Animated Floating Shapes */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ duration: 1 }}
                        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-400/20 dark:bg-cyan-600/30 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
                    />
                    <motion.div
                        animate={{
                            y: [0, 50, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-400/20 dark:bg-blue-600/30 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white drop-shadow-sm">
                            Essential <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500">Tools</span>
                        </h1>
                        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            A curated suite of powerful utilities. Secure, fast, and effectively designed for your productivity.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Tools Grid */}
            <section className="container mx-auto px-4 -mt-6 relative z-30">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={tool.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                            <Link href={tool.href} className="block h-full">
                                <div className={cn(
                                    "h-full p-4 rounded-xl border bg-white dark:bg-card/50 backdrop-blur-sm transition-all duration-300 group hover:shadow-2xl relative overflow-hidden",
                                    "hover:-translate-y-1 shadow-sm",
                                    tool.color === "blue" && "border-slate-200 dark:border-blue-500/20 hover:border-blue-500/50 hover:shadow-blue-500/10",
                                    tool.color === "emerald" && "border-slate-200 dark:border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-emerald-500/10",
                                    tool.color === "red" && "border-slate-200 dark:border-red-500/20 hover:border-red-500/50 hover:shadow-red-500/10",
                                    tool.color === "purple" && "border-slate-200 dark:border-purple-500/20 hover:border-purple-500/50 hover:shadow-purple-500/10",
                                    tool.color === "orange" && "border-slate-200 dark:border-orange-500/20 hover:border-orange-500/50 hover:shadow-orange-500/10",
                                    tool.color === "cyan" && "border-slate-200 dark:border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/10",
                                    tool.color === "pink" && "border-slate-200 dark:border-pink-500/20 hover:border-pink-500/50 hover:shadow-pink-500/10",
                                    tool.color === "indigo" && "border-slate-200 dark:border-indigo-500/20 hover:border-indigo-500/50 hover:shadow-indigo-500/10"
                                )}>
                                    {/* Popular & Feature Tags */}
                                    <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                                        {tool.popular && (
                                            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
                                                Popular
                                            </span>
                                        )}
                                        {"badge" in tool && tool.badge && (
                                            <span className="bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-md">
                                                {tool.badge as string}
                                            </span>
                                        )}
                                    </div>

                                    {/* Icon Background Blob */}
                                    <div className={cn(
                                        "absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-2xl",
                                        `bg-${tool.color}-500`
                                    )} />

                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110",
                                        tool.color === "blue" && "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500",
                                        tool.color === "emerald" && "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
                                        tool.color === "red" && "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500",
                                        tool.color === "purple" && "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-500",
                                        tool.color === "orange" && "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500",
                                        tool.color === "cyan" && "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-500",
                                        tool.color === "pink" && "bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-500",
                                        tool.color === "indigo" && "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-500"
                                    )}>
                                        <tool.icon className="w-5 h-5" />
                                    </div>

                                    <h3 className="text-base font-bold mb-1.5 text-slate-900 dark:text-white group-hover:text-primary transition-colors">{tool.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-3 line-clamp-2">
                                        {tool.desc}
                                    </p>

                                    <div className={cn(
                                        "flex items-center text-xs font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 uppercase tracking-wide",
                                        tool.color === "blue" && "text-blue-600 dark:text-blue-500",
                                        tool.color === "emerald" && "text-emerald-600 dark:text-emerald-500",
                                        tool.color === "red" && "text-red-600 dark:text-red-500",
                                        tool.color === "purple" && "text-purple-600 dark:text-purple-500",
                                        tool.color === "orange" && "text-orange-600 dark:text-orange-500",
                                        tool.color === "cyan" && "text-cyan-600 dark:text-cyan-500",
                                        tool.color === "pink" && "text-pink-600 dark:text-pink-500",
                                        tool.color === "indigo" && "text-indigo-600 dark:text-indigo-500"
                                    )}>
                                        Launch Tool <ArrowRight className="ml-1 w-3 h-3" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
