"use client";

import React from "react";
import { usePhotoEditor } from "../context/PhotoEditorContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sliders, Sparkles, Crop, UserSquare2, ShieldCheck,
    Download, Redo2, Trash2, Maximize, LayoutGrid, ChevronRight, Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Cropper from "react-easy-crop";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface EditorShellProps {
    children: React.ReactNode;
}

export function EditorShell({ children }: EditorShellProps) {
    const {
        image, setImage, fileName, isProcessing,
        currentImageInfo, bgColor, aspect, crop, setCrop, zoom, setZoom,
        showCropper, onCropComplete,
        handleDownload, fileInputRef, handleFileChange,
        filterString, transformString, idData
    } = usePhotoEditor() as any;

    const pathname = usePathname();

    const navItems = [
        { label: "Image Enhancer", path: "/tools/photo-editor/adjust", icon: Sliders },
        { label: "AI BG Removal", path: "/tools/photo-editor/ai-background", icon: Sparkles },
        { label: "Crop & Erase", path: "/tools/photo-editor/crop", icon: Crop },
        { label: "Student ID", path: "/tools/photo-editor/id-maker", icon: UserSquare2 },
        { label: "Compliance", path: "/tools/photo-editor/compliance", icon: ShieldCheck },
    ];

    if (!image) {
        const handleFileUpload = (files: FileList | null) => {
            if (!files || files.length === 0) return;
            const file = files[0];
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file');
                return;
            }
            handleFileChange({ target: { files } } as any);
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex-1 overflow-y-auto custom-scrollbar"
            >
                <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 lg:p-12 mb-8">
                    <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-1 rounded-3xl shadow-2xl max-w-2xl w-full relative overflow-hidden group">
                        {/* Animated Glow Background */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-500/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-700" />

                        <div
                            className="relative z-10 rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 border-2 border-dashed border-slate-300 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-50/10 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-slate-50/20"
                            onDragOver={(e) => { e.preventDefault(); }}
                            onDrop={(e) => {
                                e.preventDefault();
                                handleFileUpload(e.dataTransfer.files);
                            }}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse-glow" />
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                        <Upload className="w-10 h-10" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-400 dark:via-purple-400 dark:to-emerald-400 pb-2 tracking-tight">
                                        Upload Your Masterpiece
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-medium">
                                        Drag & drop high-res images to begin your creative journey.
                                        <br /><span className="text-xs uppercase tracking-widest opacity-70 font-bold">JPG • PNG • WEBP • RAW</span>
                                    </p>
                                </div>

                                <Button className="mt-4 px-8 py-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold uppercase tracking-widest text-xs border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform shadow-xl">
                                    Browse Files
                                </Button>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e.target.files)}
                            />
                        </div>
                    </div>
                </div>

                {/* Advanced Tool Suite Features */}
                <div className="max-w-5xl mx-auto px-6 pb-20">
                    <div className="text-center space-y-4 mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                            <Sparkles className="w-3 h-3" /> Professional Photo Engine
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Advanced Tool Suite</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                            Professional-grade image processing with neural edge extraction and regional compliance validation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Fast Processing",
                                desc: "Real-time browser-based engine. No waiting queues or server uploads.",
                                icon: Sliders,
                                color: "from-emerald-400 to-green-500"
                            },
                            {
                                title: "Privacy Focused",
                                desc: "All processing happens locally. Your images never leave your device.",
                                icon: ShieldCheck,
                                color: "from-blue-400 to-indigo-500"
                            },
                            {
                                title: "Smart Quality",
                                desc: "Advanced algorithms optimize file size while preserving visible details.",
                                icon: Sparkles,
                                color: "from-purple-400 to-pink-500"
                            },
                            {
                                title: "Web Optimized",
                                desc: "Perfect for forms and applications. Auto-corrects DPI and aspect ratio.",
                                icon: LayoutGrid,
                                color: "from-orange-400 to-red-500"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group relative p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 shadow-sm hover:shadow-lg dark:shadow-none">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/0 group-hover:via-white/5 group-hover:to-white/0 rounded-2xl transition-all" />
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30 transition-colors duration-300">
            {/* Ambient Background Lights */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 dark:bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 dark:bg-cyan-600/10 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] dark:opacity-[0.2] pointer-events-none" />

            {/* Main Layout Container */}
            <div className="relative z-10 container mx-auto px-4 py-4 h-[calc(100vh-80px)] flex flex-col gap-4 overflow-hidden">

                {/* Top Navigation Menu */}
                {image && (
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="premium-glass rounded-2xl p-2 flex items-center justify-center gap-2 overflow-x-auto custom-scrollbar shadow-xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl shrink-0"
                    >
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link key={item.path} href={item.path} className="relative group shrink-0">
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTopNav"
                                            className="absolute inset-0 bg-blue-600 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <div className={cn(
                                        "px-4 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-300 relative z-10",
                                        isActive
                                            ? "text-white"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                                    )}>
                                        <item.icon className={cn("w-4 h-4", isActive && "text-blue-200")} />
                                        <span className={cn(
                                            "text-xs font-bold uppercase tracking-wider whitespace-nowrap",
                                            isActive ? "text-white" : "text-slate-600 dark:text-slate-400"
                                        )}>{item.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">

                    {/* Left Canvas / Workspace Area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-8 relative flex flex-col gap-4 h-full min-h-0"
                    >
                        {/* Top Bar Info */}
                        <div className="flex justify-between items-center premium-glass rounded-xl p-3 px-4 shrink-0 bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10">
                            <div className="flex items-center gap-4">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    {fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName}
                                </span>
                            </div>
                            {currentImageInfo && (
                                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-500">
                                    {currentImageInfo.width}px × {currentImageInfo.height}px
                                </div>
                            )}
                        </div>

                        {/* The Stage */}
                        <div className="flex-1 premium-glass rounded-2xl relative overflow-hidden flex items-center justify-center p-6 group/workspace min-h-0 bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10">
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 dark:opacity-10" />

                            <AnimatePresence mode="wait">
                                {!showCropper ? (
                                    <motion.div
                                        key="preview"
                                        className="relative z-10 w-full h-full transition-transform duration-500"
                                        layoutId="imagePreview"
                                    >
                                        <div
                                            className="relative shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-white/10 h-full w-full flex items-center justify-center rounded-xl"
                                            style={{ backgroundColor: bgColor }}
                                        >
                                            <img
                                                src={image}
                                                alt="Preview"
                                                className="max-h-full max-w-full object-contain"
                                                style={{
                                                    filter: filterString,
                                                    transform: transformString,
                                                }}
                                            />
                                            {(idData.showName || idData.showDOB) && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-white p-3 text-center text-black border-t border-slate-200">
                                                    {idData.showName && <div className="text-sm font-black uppercase tracking-tight leading-none mb-1">{idData.studentName}</div>}
                                                    {idData.showDOB && <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">DOB: {idData.studentDOB}</div>}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="cropper"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-20"
                                    >
                                        <Cropper
                                            image={image}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={aspect}
                                            onCropChange={setCrop}
                                            onCropComplete={onCropComplete}
                                            onZoomChange={setZoom}
                                            classes={{
                                                containerClassName: "rounded-2xl",
                                                mediaClassName: "",
                                                cropAreaClassName: "border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.8)]"
                                            }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Floating Toolbar - Auto-Hide Glass Pill */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 shadow-2xl z-40 transition-all duration-500 ease-out opacity-0 translate-y-10 scale-90 group-hover/workspace:opacity-100 group-hover/workspace:translate-y-0 group-hover/workspace:scale-100">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8 hover:bg-white/10 rounded-full text-white/90 hover:text-blue-400 transition-colors"
                                    onClick={() => setZoom(Math.max(1, zoom - 0.2))}
                                >
                                    -
                                </Button>
                                <span className="text-xs font-black font-mono self-center text-white/90 min-w-[3ch] text-center select-none">
                                    {(zoom * 100).toFixed(0)}%
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8 hover:bg-white/10 rounded-full text-white/90 hover:text-blue-400 transition-colors"
                                    onClick={() => setZoom(Math.min(3, zoom + 0.2))}
                                >
                                    +
                                </Button>
                                <div className="w-px h-4 bg-white/20 self-center mx-1" />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8 hover:bg-red-500/20 text-white/80 hover:text-red-400 rounded-full transition-colors"
                                    onClick={() => setImage(null)}
                                    title="Close Image"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="grid grid-cols-2 gap-4 shrink-0">
                            <Button
                                variant="outline"
                                className="h-10 border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 font-bold uppercase tracking-wider rounded-xl hover:border-white/20"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Redo2 className="w-4 h-4 mr-2" /> Replace
                            </Button>
                            <Button
                                className="h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/20 group/dl"
                                onClick={handleDownload}
                                disabled={isProcessing}
                            >
                                <Download className="w-4 h-4 mr-2 group-hover/dl:-translate-y-0.5 transition-transform" />
                                {isProcessing ? 'Processing...' : 'Export'}
                            </Button>
                        </div>
                    </motion.div>

                    {/* Right Controls Panel */}
                    <div className="lg:col-span-4 h-full overflow-hidden flex flex-col min-h-0">
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="premium-glass rounded-2xl flex-1 flex flex-col overflow-hidden"
                        >
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={pathname}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {children}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}

