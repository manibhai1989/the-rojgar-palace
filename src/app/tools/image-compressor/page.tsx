"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    Image as ImageIcon,
    Trash2,
    Download,
    Copy,
    Settings,
    ArrowLeft,
    Sparkles,
    Zap,
    Minimize2,
    CheckCircle2,
    FileBarChart
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ImageCompressorPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    // File Info
    const [fileInfo, setFileInfo] = useState({
        name: "",
        size: 0,
        type: "",
        width: 0,
        height: 0
    });

    // Compression State
    const [compressedSize, setCompressedSize] = useState(0);
    const [quality, setQuality] = useState(80);
    const [isCompressing, setIsCompressing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [format, setFormat] = useState<"original" | "jpeg" | "png" | "webp">("jpeg");

    // Load Sample Image
    const loadSampleImage = () => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            setImage(img);
            setFileInfo({
                name: "sample-photo.jpg",
                size: 2500000, // ~2.5MB simulated
                type: "image/jpeg",
                width: img.width,
                height: img.height
            });
            handleCompression(img, 80, "jpeg");
            toast.success("Sample Loaded", { description: "Ready to compress." });
        };
        img.src = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000&q=80"; // Heavy mountain image
    };

    // Handle File Upload
    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Invalid file", { description: "Please upload an image file." });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setFileInfo({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    width: img.width,
                    height: img.height
                });
                // Initial compression
                setQuality(80);
                const initFormat = file.type === "image/webp" ? "webp" : (file.type === "image/png" ? "png" : "jpeg");
                setFormat(initFormat);
                handleCompression(img, 80, initFormat);

                toast.success("Image Uploaded", { description: "Adjust quality to compress." });
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    // Core Compression Logic (Canvas)
    const handleCompression = (img: HTMLImageElement, q: number, fmt: "original" | "jpeg" | "png" | "webp") => {
        setIsCompressing(true);

        // Use requestAnimationFrame to prevent UI blocking
        requestAnimationFrame(() => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                setIsCompressing(false);
                return;
            }

            // Fill white background for JPEGs (transparency fix) - only if JPEG
            if (fmt === "jpeg") {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);

            // Compress
            let mimeType = "image/jpeg";
            if (fmt === "webp") mimeType = "image/webp";
            if (fmt === "png") mimeType = "image/png";
            if (fmt === "original") mimeType = fileInfo.type;

            const dataUrl = canvas.toDataURL(mimeType, q / 100);

            setPreviewUrl(dataUrl);

            // Calculate estimated size
            const head = `data:${mimeType};base64,`;
            const size = Math.round((dataUrl.length - head.length) * 3 / 4);
            setCompressedSize(size);

            setIsCompressing(false);
        });
    };

    // Trigger compression on change
    useEffect(() => {
        if (image) {
            handleCompression(image, quality, format);
        }
    }, [quality, format]); // eslint-disable-line react-hooks/exhaustive-deps

    // Utility
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getSavings = () => {
        if (!fileInfo.size || !compressedSize) return 0;
        const saved = fileInfo.size - compressedSize;
        const pct = Math.round((saved / fileInfo.size) * 100);
        return pct > 0 ? pct : 0;
    };

    // Actions
    const handleDownload = () => {
        if (!previewUrl) return;
        const link = document.createElement("a");
        link.href = previewUrl;
        link.download = `compressed-${fileInfo.name.split('.')[0]}.${format === "jpeg" ? "jpg" : "webp"}`;
        link.click();
        toast.success("Downloaded", { description: "Compressed image saved." });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header (Premium Animated) */}
            <header className="relative flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-900 pt-16 pb-12 px-4 shadow-xl z-20 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div className="absolute inset-0 z-0 select-none">
                    <img
                        src="https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&q=80"
                        alt=""
                        className="w-full h-full object-cover opacity-10 dark:opacity-20 translate-y-[-20%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-slate-50 dark:from-slate-900/95 dark:via-slate-900/80 dark:to-slate-950"></div>
                </div>

                {/* Animated Shapes */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ duration: 1 }}
                        className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-400/20 dark:bg-emerald-600/30 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
                    />
                    <motion.div
                        animate={{ y: [0, 40, 0], scale: [1, 1.05, 1] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-400/20 dark:bg-cyan-600/30 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
                    />
                </div>

                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    {/* Nav & Title */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
                        <div className="text-left flex-1">
                            <Link href="/tools" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-4 text-sm font-medium">
                                <ArrowLeft className="w-4 h-4" /> Back to Tools
                            </Link>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-emerald-100/50 dark:bg-emerald-500/20 rounded-lg border border-emerald-200 dark:border-emerald-500/30">
                                    <Minimize2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                Image Compressor
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 max-w-lg text-base leading-relaxed">
                                Reduce file size intelligenty without losing visible quality.
                            </p>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-3">
                            <div className="flex items-center gap-1.5 bg-white/60 dark:bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 text-xs text-blue-700 dark:text-blue-100/80 shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-300" /> Lossless Option
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/60 dark:bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 text-xs text-blue-700 dark:text-blue-100/80 shadow-sm">
                                <Zap className="w-3.5 h-3.5 text-orange-500 dark:text-orange-300" /> Instant
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Container (Upload Section) */}
            <div className="container mx-auto max-w-7xl px-4 -mt-6 relative z-30">
                {/* 1. UPLOAD SECTION */}
                <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-1">
                    <div
                        className={cn(
                            "rounded-xl p-8 text-center cursor-pointer transition-all duration-300 border-2 border-dashed",
                            isDragging
                                ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20"
                                : "border-slate-300/60 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                <Upload className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                                {image ? "Change Image" : "Upload Image"}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                                Drop your image here to compress. Works best with JPG & PNG.
                            </p>
                            <Button size="lg" className="rounded-full px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25 shadow-lg">
                                Select File
                            </Button>
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                    </div>
                </div>
            </div>

            {/* WORKSPACE */}
            <div className={cn(
                "container mx-auto max-w-7xl px-4 py-8 transition-all duration-500 ease-in-out",
                image ? "opacity-100 translate-y-0" : "opacity-40 translate-y-10 grayscale pointer-events-none blur-sm"
            )}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT: Controls (4 Col) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <Settings className="w-5 h-5 text-emerald-500" /> Compression Level
                            </h2>

                            {/* Stats Card */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-8 border border-slate-100 dark:border-slate-700">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Size</span>
                                    <span className={cn("text-lg font-bold", getSavings() > 50 ? "text-emerald-500" : "text-slate-700 dark:text-slate-200")}>
                                        {formatFileSize(compressedSize)}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${(compressedSize / (fileInfo.size || 1)) * 100}%` }}
                                    />
                                </div>
                                <div className="mt-2 text-right">
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                                        -{getSavings()}% Saved
                                    </span>
                                </div>
                            </div>

                            {/* Quality Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className={cn("text-sm font-semibold", (format === "png" || (format === "original" && fileInfo.type === "image/png")) && "text-slate-400")}>
                                        Quality
                                    </Label>
                                    <span className={cn(
                                        "font-bold px-2 py-0.5 rounded text-sm min-w-[50px] text-center",
                                        (format === "png" || (format === "original" && fileInfo.type === "image/png"))
                                            ? "text-slate-400 bg-slate-100 dark:bg-slate-800"
                                            : "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30"
                                    )}>
                                        {(format === "png" || (format === "original" && fileInfo.type === "image/png")) ? "N/A" : `${quality}%`}
                                    </span>
                                </div>
                                <Slider
                                    value={[quality]}
                                    min={10}
                                    max={100}
                                    step={5}
                                    onValueChange={(val) => setQuality(val[0])}
                                    disabled={format === "png" || (format === "original" && fileInfo.type === "image/png")}
                                    className={cn("py-2", (format === "png" || (format === "original" && fileInfo.type === "image/png")) && "opacity-50 cursor-not-allowed")}
                                />
                                {(format === "png" || (format === "original" && fileInfo.type === "image/png")) ? (
                                    <p className="text-xs text-amber-500 font-medium flex items-center gap-1">
                                        <Zap className="w-3 h-3" /> PNG is lossless. Use WebP for compression.
                                    </p>
                                ) : (
                                    <p className="text-xs text-slate-400">Lower quality = Smaller file size</p>
                                )}
                            </div>

                            {/* Format */}
                            <div className="mt-8 space-y-3">
                                <Label className="text-sm font-semibold">Output Format</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(["original", "jpeg", "png", "webp"] as const).map((fmt) => (
                                        <Button
                                            key={fmt}
                                            variant={format === fmt ? "primary" : "outline"}
                                            size="sm"
                                            onClick={() => setFormat(fmt)}
                                            className={cn(
                                                "capitalize h-8 text-xs",
                                                format === fmt && "bg-emerald-600 hover:bg-emerald-700"
                                            )}
                                        >
                                            {fmt === "original" ? "Original" : fmt.toUpperCase()}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <Button size="lg" className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20" onClick={handleDownload} disabled={!image}>
                                <Download className="w-4 h-4 mr-2" /> Download Compressed
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT: Preview (8 Col) */}
                    <div className="lg:col-span-8">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-1">
                            <Tabs defaultValue="compare" className="w-full">
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                        <FileBarChart className="w-4 h-4" /> Comparison
                                    </h3>
                                    <TabsList className="grid w-[200px] grid-cols-2">
                                        <TabsTrigger value="compare">Side-by-Side</TabsTrigger>
                                        <TabsTrigger value="single">Preview</TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="p-4 min-h-[500px] bg-slate-50 dark:bg-black/20 flex flex-col justify-center">
                                    <TabsContent value="compare" className="mt-0 h-full">
                                        <div className="grid grid-cols-2 gap-4 h-full">
                                            {/* Original */}
                                            <div className="space-y-2">
                                                <div className="bg-white dark:bg-slate-800 rounded-lg p-2 text-center shadow-sm">
                                                    <span className="text-xs font-bold text-slate-500 uppercase">Original</span>
                                                    <p className="text-sm font-bold">{formatFileSize(fileInfo.size)}</p>
                                                </div>
                                                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-[3/4] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
                                                    {image && <img src={image.src} className="w-full h-full object-contain" alt="Original" />}
                                                </div>
                                            </div>

                                            {/* Compressed */}
                                            <div className="space-y-2">
                                                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2 text-center shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                                                    <span className="text-xs font-bold text-emerald-600 uppercase">Compressed</span>
                                                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{formatFileSize(compressedSize)}</p>
                                                </div>
                                                <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500/20 aspect-[3/4] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
                                                    {previewUrl ? (
                                                        <img src={previewUrl} className="w-full h-full object-contain" alt="Compressed" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-slate-300">
                                                            <Minimize2 className="w-12 h-12 animate-pulse" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="single" className="mt-0 h-full flex items-center justify-center">
                                        {previewUrl && <img src={previewUrl} className="max-h-[500px] object-contain rounded-lg shadow-lg" alt="Result" />}
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </div>

                </div>
            </div>

            {/* FEATURES SECTION (From User Request) */}
            <div className="container mx-auto max-w-7xl px-4 py-16 border-t border-slate-200 dark:border-slate-800 mt-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">Why Use Our Image Compressor?</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Powerful features designed to make image optimization easy, fast, and secure.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Zap className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Fast Processing</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Compress images in seconds with our optimized browser-based engine. No waiting queues.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Privacy Focused</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            All processing happens locally in your browser. Your images are never uploaded to our servers.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Smart Quality</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Advanced algorithms reduce file size significantly while preserving visible image quality.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Minimize2 className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Web Optimized</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Perfect for websites, blogs, and apps. Improve load times and SEO scores effortlessly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
