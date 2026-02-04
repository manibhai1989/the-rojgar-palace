"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Briefcase, FileText, IdCard, Key, Phone, BookOpen, GraduationCap } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

import { CommandMenu } from "@/components/ui/command-menu";
import { UserNav } from "@/components/layout/user-nav";

const navItems = [
    { title: "Home", href: "/", icon: Home },
    { title: "Jobs", href: "/jobs", icon: Briefcase },
    { title: "Results", href: "/results", icon: FileText },
    { title: "Admit Card", href: "/admit-cards", icon: IdCard },
    { title: "Syllabus", href: "/syllabus", icon: BookOpen },
    { title: "Answer Key", href: "/answer-keys", icon: Key },
    { title: "Admissions", href: "/admissions", icon: GraduationCap },
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    return (
        <header
            className="sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300 border-slate-200 bg-white/80 dark:bg-slate-950/80 dark:border-blue-800/50"
        >
            <div className="container mx-auto">
                <div className="flex h-16 items-center justify-between px-4 lg:px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 shrink-0">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-orange-500/20 ring-2 ring-white/10 dark:ring-white/10">
                            RP
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-black text-xl tracking-tight leading-tight whitespace-nowrap">
                                <span className="text-slate-800 dark:text-white">The</span>{" "}
                                <span className="text-amber-600 dark:text-amber-400">Rojgar</span>{" "}
                                <span className="text-orange-600 dark:text-orange-400 italic">Palace</span>
                            </span>
                            <span className="text-[9px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-300 font-bold whitespace-nowrap mt-0.5">
                                No.1 Govt Job Portal
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    {/* Desktop Navigation */}
                    <nav className="hidden xl:flex items-center gap-6 mx-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="group relative flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors whitespace-nowrap"
                            >
                                <item.icon className="h-4 w-4 text-slate-500 dark:text-cyan-400 group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors" />
                                {item.title}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-600 dark:bg-white transition-all duration-300 ease-in-out group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="hidden md:block">
                            <CommandMenu />
                        </div>
                        <UserNav />
                        <div className="hidden sm:block">
                            <ThemeToggle />
                        </div>

                        {/* Mobile Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden border-t border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-lg"
                    >
                        <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-cyan-500/10 flex items-center justify-center border border-blue-100 dark:border-cyan-500/20">
                                        <item.icon className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                                    </div>
                                    {item.title}
                                </Link>
                            ))}
                            <div className="mt-2 pt-4 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between px-4">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Theme</span>
                                <ThemeToggle />
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
