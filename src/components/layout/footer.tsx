"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Mail, ArrowRight, Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative bg-white dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-black border-t border-slate-200 dark:border-cyan-500/20 mt-auto overflow-hidden transition-colors duration-300">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl opacity-50 dark:opacity-100" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-blue-500/5 rounded-full blur-3xl opacity-50 dark:opacity-100" />
            </div>

            <div className="container mx-auto px-4 py-16 md:py-20 relative z-10 max-w-6xl">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Section */}
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-3 mb-6 group">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-extrabold text-xl shadow-xl shadow-orange-500/20 dark:shadow-orange-500/30 group-hover:shadow-orange-500/40 dark:group-hover:shadow-orange-500/50 transition-all group-hover:scale-105 ring-1 ring-black/5 dark:ring-2 dark:ring-white/10">
                                RP
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-xl tracking-tight">
                                    <span className="text-slate-900 dark:text-white">The</span>{" "}
                                    <span className="text-amber-600 dark:text-amber-400">Job</span>{" "}
                                    <span className="text-orange-600 dark:text-orange-400 italic">Palace</span>
                                </span>
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed max-w-sm">
                            Your trusted source for the latest government jobs, admit cards, and exam results.
                            Empowering millions of aspirants across India.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-6 tracking-tight relative inline-block group">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-500 group-hover:w-full transition-all duration-300" />
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: "Latest Jobs", href: "/jobs" },
                                { name: "Admit Cards", href: "/admit-cards" },
                                { name: "Results", href: "/results" },
                                { name: "Syllabus", href: "/syllabus" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-base flex items-center gap-2 group">
                                        <ArrowRight className="h-0 w-0 opacity-0 group-hover:h-4 group-hover:w-4 group-hover:opacity-100 transition-all text-amber-500 dark:text-amber-400" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-6 tracking-tight relative inline-block group">
                            Support
                            <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-600 group-hover:w-full transition-all duration-300" />
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: "About Us", href: "/about" },
                                { name: "Contact", href: "/contact" },
                                { name: "Privacy Policy", href: "/privacy" },
                                { name: "Terms of Service", href: "/terms" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-base flex items-center gap-2 group">
                                        <ArrowRight className="h-0 w-0 opacity-0 group-hover:h-4 group-hover:w-4 group-hover:opacity-100 transition-all text-orange-500 dark:text-orange-400" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-6 tracking-tight relative inline-block group">
                            Connect
                            <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 dark:from-orange-400 dark:to-pink-500 group-hover:w-full transition-all duration-300" />
                        </h3>
                        <div className="flex space-x-4 mb-6">
                            {[
                                { Icon: Facebook, color: "hover:bg-blue-600 hover:border-blue-500" },
                                { Icon: Twitter, color: "hover:bg-sky-500 hover:border-sky-400" },
                                { Icon: Instagram, color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:border-pink-400" },
                                { Icon: Linkedin, color: "hover:bg-blue-700 hover:border-blue-600" }
                            ].map(({ Icon, color }, idx) => (
                                <motion.a
                                    key={idx}
                                    href={Icon === Linkedin ? "https://www.linkedin.com/in/manish-singh-13923610" : "#"}
                                    whileHover={{ scale: 1.1, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`h-10 w-10 rounded-lg bg-slate-100 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white transition-all ${color} hover:shadow-lg`}
                                >
                                    <Icon className="h-5 w-5" />
                                </motion.a>
                            ))}
                        </div>
                        <a href="mailto:manish.icst@gmail.com" className="flex items-center text-slate-600 dark:text-slate-400 group cursor-pointer">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center mr-3 group-hover:border-amber-500/50 group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all">
                                <Mail className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">manish.icst@gmail.com</span>
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                {/* Bottom Bar - Centered & Premium */}
                <div className="border-t border-slate-200 dark:border-white/10 mt-16 pt-8 flex flex-col items-center gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-2 text-sm font-medium text-center">
                        <span className="text-slate-500 dark:text-slate-400">© {new Date().getFullYear()}</span>

                        <span className="hidden md:inline text-slate-300 dark:text-slate-600">|</span>

                        {/* Brand Name with Gradient */}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 font-bold text-base">
                            The Job Palace
                        </span>

                        <span className="hidden md:inline text-slate-300 dark:text-slate-600">|</span>

                        {/* "Made with Love" Badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 shadow-sm">
                            <span>Made with</span>
                            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse" />
                            <span>in India</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                        <Link href="/privacy" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs uppercase tracking-widest font-semibold hover:underline decoration-blue-500/30 underline-offset-4">Privacy</Link>
                        <Link href="/terms" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs uppercase tracking-widest font-semibold hover:underline decoration-blue-500/30 underline-offset-4">Terms</Link>
                        <Link href="/site-map" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs uppercase tracking-widest font-semibold hover:underline decoration-blue-500/30 underline-offset-4">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
