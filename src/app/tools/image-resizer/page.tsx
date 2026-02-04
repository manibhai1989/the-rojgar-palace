"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    Image as ImageIcon,
    Trash2,
    RotateCw,
    RefreshCcw,
    Download,
    Copy,
    Code,
    Maximize2,
    Minimize2,
    Sliders,
    Check,
    AlertCircle,
    FileImage,
    Settings,
    ArrowLeft,
    Sparkles,
    Crop,
    Zap,
    Move,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ImageResizerPage() {
    // const { toast } = useToast(); // Removed
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    // File Info
    const [fileInfo, setFileInfo] = useState({
        name: "",
        size: 0,
        type: "",
        originalWidth: 0,
        originalHeight: 0
    });

    // Settings
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [resizePercentage, setResizePercentage] = useState(100);
    const [quality, setQuality] = useState(90);
    const [format, setFormat] = useState<"original" | "jpeg" | "png" | "webp">("original");
    const [rotation, setRotation] = useState(0);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [isDragging, setIsDragging] = useState(false);

    // Initial Load Sample
    useEffect(() => {
        // Optional: Load sample on mount if desired, user requested it but typically clean state is better.
        // Uncomment below to load sample automatically
        // loadSampleImage();
    }, []);

    // Update dimensions when percentage changes
    const handlePercentageChange = (value: number[]) => {
        const pct = value[0];
        setResizePercentage(pct);
        if (fileInfo.originalWidth > 0) {
            setDimensions({
                width: Math.round(fileInfo.originalWidth * (pct / 100)),
                height: Math.round(fileInfo.originalHeight * (pct / 100))
            });
        }
    };

    // Update dimensions manually
    const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>, type: "width" | "height") => {
        const val = parseInt(e.target.value) || 0;
        if (val <= 0) return;

        let newWidth = dimensions.width;
        let newHeight = dimensions.height;

        if (type === "width") {
            newWidth = val;
            if (maintainAspectRatio && fileInfo.originalWidth > 0) {
                const ratio = fileInfo.originalHeight / fileInfo.originalWidth;
                newHeight = Math.round(val * ratio);
            }
        } else {
            newHeight = val;
            if (maintainAspectRatio && fileInfo.originalHeight > 0) {
                const ratio = fileInfo.originalWidth / fileInfo.originalHeight;
                newWidth = Math.round(val * ratio);
            }
        }

        setDimensions({ width: newWidth, height: newHeight });
        // Update percentage roughly
        if (fileInfo.originalWidth > 0) {
            setResizePercentage(Math.round((newWidth / fileInfo.originalWidth) * 100));
        }
    };

    // Handle File Upload
    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Invalid file type", {
                description: "Please upload an image file (JPG, PNG, WebP, GIF)."
            });
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File too large", {
                description: "Image size should be less than 10MB."
            });
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
                    originalWidth: img.width,
                    originalHeight: img.height
                });
                setDimensions({ width: img.width, height: img.height });
                setResizePercentage(100);
                setRotation(0);
                setFormat("original");

                toast.success("Image Uploaded", {
                    description: "Image loaded successfully. You can now resize it."
                });
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const loadSampleImage = () => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            setImage(img);
            setFileInfo({
                name: "sample-image.jpg",
                size: 1024 * 500, // Dummy size
                type: "image/jpeg",
                originalWidth: img.width,
                originalHeight: img.height
            });
            setDimensions({ width: img.width, height: img.height });
            setResizePercentage(100);
            setRotation(0);
            setFormat("jpeg"); // Sample is usually jpeg
            toast.success("Sample Loaded", {
                description: "Sample image loaded for testing."
            });
        };
        img.src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80";
    };

    // Render Preview Logic
    useEffect(() => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Calculate target dimensions handling rotation
        // If rotated 90 or 270, swap width/height logic for the canvas/rendering context
        const isRotatedSwapped = rotation === 90 || rotation === 270;

        let targetWidth = dimensions.width;
        let targetHeight = dimensions.height;

        // When displaying in canvas, we want the canvas size to match the final output dimensions
        // If rotated 90deg, the output width is actually the input height relative to the image

        if (isRotatedSwapped) {
            canvas.width = targetHeight;
            canvas.height = targetWidth;
        } else {
            canvas.width = targetWidth;
            canvas.height = targetHeight;
        }

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        // Draw centered
        // If rotated 90deg (swapped), drawing commands still use original w/h context
        ctx.drawImage(
            image,
            -targetWidth / 2,
            -targetHeight / 2,
            targetWidth,
            targetHeight
        );
        ctx.restore();

        const pUrl = canvas.toDataURL(
            format === "original" ? (fileInfo.type || "image/jpeg") : `image/${format}`,
            quality / 100
        );
        setPreviewUrl(pUrl);

    }, [image, dimensions, rotation, format, quality, fileInfo.type]);


    // Actions
    const handleDownload = () => {
        if (!previewUrl) return;
        const link = document.createElement("a");
        link.href = previewUrl;

        // Determine extension
        let ext = "jpg";
        if (format !== "original") ext = format;
        else if (fileInfo.type.includes("png")) ext = "png";
        else if (fileInfo.type.includes("webp")) ext = "webp";

        link.download = `resized-image.${ext}`;
        link.click();

        toast.success("Downloaded", {
            description: "Image saved to your device."
        });
    };

    const handleCopy = async () => {
        if (!canvasRef.current) return;
        try {
            canvasRef.current.toBlob(async (blob) => {
                if (!blob) return;
                await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
                toast.success("Copied!", {
                    description: "Image copied to clipboard."
                });
            });
        } catch (err) {
            toast.error("Copy Failed", {
                description: "Could not copy image to clipboard."
            });
        }
    };

    const handleEmbedCode = () => {
        if (!image) return;
        const code = `<img src="your-image-path.jpg" width="${dimensions.width}" height="${dimensions.height}" alt="Resized Image" />`;
        navigator.clipboard.writeText(code);
        toast.success("Code Copied", {
            description: "HTML Embed code copied to clipboard."
        });
    };

    const reset = () => {
        if (!image) return;
        setDimensions({ width: fileInfo.originalWidth, height: fileInfo.originalHeight });
        setResizePercentage(100);
        setRotation(0);
        setQuality(90);
        setFormat("original");
        toast.info("Reset", { description: "All settings restored to default." });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header (Compact & Premium) */}
            <header className="relative flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-900 pt-16 pb-12 px-4 shadow-xl z-20 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0 select-none">
                    <img
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80"
                        alt=""
                        className="w-full h-full object-cover opacity-10 dark:opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-slate-50 dark:from-slate-900/95 dark:via-slate-900/80 dark:to-slate-950"></div>
                </div>

                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
                        <div className="text-left flex-1">
                            <Link href="/tools" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-4 text-sm font-medium">
                                <ArrowLeft className="w-4 h-4" /> Back to Tools
                            </Link>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-blue-100/50 dark:bg-blue-500/20 rounded-lg border border-blue-200 dark:border-blue-500/30">
                                    <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                Image Resizer
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 max-w-lg text-base leading-relaxed">
                                Securely resize, crop, and convert images directly in your browser. No constraints.
                            </p>
                        </div>

                        {/* Compact Badges */}
                        <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-3">
                            <div className="flex items-center gap-1.5 bg-white/60 dark:bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 text-xs text-blue-700 dark:text-blue-100/80 shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-300" /> High Quality
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/60 dark:bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 text-xs text-blue-700 dark:text-blue-100/80 shadow-sm">
                                <Zap className="w-3.5 h-3.5 text-orange-500 dark:text-orange-300" /> Instant
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto max-w-7xl px-4 -mt-6 relative z-30">
                {/* 1. UPLOAD SECTION (Full Width & Prominent) */}
                <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-1">
                    <div
                        className={cn(
                            "rounded-xl p-8 text-center cursor-pointer transition-all duration-300 border-2 border-dashed",
                            isDragging
                                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                                : "border-slate-300/60 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
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
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                <Upload className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                                {image ? "Change Image" : "Upload Image"}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                                Drop your image here or click to browse. Supports JPG, PNG, WEBP.
                            </p>
                            <Button size="lg" className="rounded-full px-8 shadow-blue-500/25 shadow-lg">
                                Select File
                            </Button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        />
                    </div>
                </div>

                {/* File Info Bar (If uploaded) */}
                {fileInfo.name && (
                    <div className="max-w-4xl mx-auto mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-sm">
                        <div className="text-center md:text-left">
                            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">File Name</p>
                            <p className="font-medium truncate" title={fileInfo.name}>{fileInfo.name}</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Original Size</p>
                            <p className="font-medium">{formatFileSize(fileInfo.size)}</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Dimensions</p>
                            <p className="font-medium">{fileInfo.originalWidth} x {fileInfo.originalHeight}</p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={loadSampleImage} title="Load Sample Image">
                                <Settings className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { setImage(null); setPreviewUrl(""); }} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* WORKSPACE AREA */}
            <div className={cn(
                "container mx-auto max-w-7xl px-4 py-8 transition-all duration-500 ease-in-out",
                image ? "opacity-100 translate-y-0" : "opacity-40 translate-y-10 grayscale pointer-events-none blur-sm"
            )}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: Controls (4 Col) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <Sliders className="w-5 h-5 text-blue-500" /> Settings
                            </h2>

                            <div className="space-y-8">
                                {/* Resize Slider */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Scale</Label>
                                        <span className="text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded text-sm min-w-[50px] text-center">
                                            {resizePercentage}%
                                        </span>
                                    </div>
                                    <Slider
                                        value={[resizePercentage]}
                                        min={10}
                                        max={200}
                                        step={1}
                                        onValueChange={handlePercentageChange}
                                        className="py-2"
                                    />
                                </div>

                                {/* Custom Dimensions */}
                                <div className="space-y-4">
                                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dimensions</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate-500">W (px)</Label>
                                            <Input
                                                type="number"
                                                className="h-9"
                                                value={dimensions.width || ""}
                                                onChange={(e) => handleDimensionChange(e, "width")}
                                                disabled={!image}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate-500">H (px)</Label>
                                            <Input
                                                type="number"
                                                className="h-9"
                                                value={dimensions.height || ""}
                                                onChange={(e) => handleDimensionChange(e, "height")}
                                                disabled={!image}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="aspect-ratio"
                                            checked={maintainAspectRatio}
                                            onCheckedChange={setMaintainAspectRatio}
                                        />
                                        <Label htmlFor="aspect-ratio" className="text-sm text-slate-600">Lock Aspect Ratio</Label>
                                    </div>
                                </div>

                                {/* Quality */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quality</Label>
                                        <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded text-sm min-w-[50px] text-center">
                                            {quality}%
                                        </span>
                                    </div>
                                    <Slider
                                        value={[quality]}
                                        min={10}
                                        max={100}
                                        step={1}
                                        onValueChange={(val) => setQuality(val[0])}
                                        className="py-2"
                                    />
                                </div>

                                {/* Format */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Format</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(["original", "jpeg", "png", "webp"] as const).map((fmt) => (
                                            <Button
                                                key={fmt}
                                                variant={format === fmt ? "primary" : "outline"}
                                                size="sm"
                                                onClick={() => setFormat(fmt)}
                                                className={cn(
                                                    "capitalize h-8 text-xs",
                                                    format === fmt && "bg-blue-600 hover:bg-blue-700"
                                                )}
                                            >
                                                {fmt === "original" ? "Original" : fmt.toUpperCase()}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Rotation & Reset */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
                                    <Button variant="secondary" size="sm" onClick={() => setRotation((r) => (r + 90) % 360)} className="bg-orange-50 text-orange-700 hover:bg-orange-100 h-9">
                                        <RotateCw className="w-3.5 h-3.5 mr-2" /> Rotate
                                    </Button>
                                    <Button variant="secondary" size="sm" onClick={reset} className="bg-slate-100 text-slate-700 hover:bg-slate-200 h-9">
                                        <RefreshCcw className="w-3.5 h-3.5 mr-2" /> Reset
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Preview (8 Col) - Larger Viewport */}
                    <div className="lg:col-span-8 relative">
                        <div className="sticky top-6">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-1 flex flex-col mb-6">
                                <div className="bg-slate-100 dark:bg-black/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center relative overflow-hidden min-h-[400px] lg:min-h-[600px] p-8">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-w-full max-h-[600px] object-contain shadow-2xl rounded"
                                        />
                                    ) : (
                                        <div className="text-center text-slate-400">
                                            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                            <p className="text-base font-medium opacity-50">Preview will appear here</p>
                                        </div>
                                    )}
                                    <canvas ref={canvasRef} className="hidden" />
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 w-full sm:w-auto justify-center sm:justify-start">
                                    {image ? (
                                        <>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-slate-400">Dim</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{dimensions.width} x {dimensions.height}</span>
                                            </div>
                                            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-slate-400">Fmt</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{format === "original" ? (fileInfo.type.split("/")[1] || "ORIG") : format}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="italic">Ready to process</span>
                                    )}
                                </div>

                                <div className="flex gap-3 w-full sm:w-auto">
                                    <Button variant="outline" size="lg" className="flex-1 sm:flex-none" onClick={handleCopy} disabled={!image}>
                                        <Copy className="w-4 h-4 mr-2" /> Copy
                                    </Button>
                                    <Button variant="primary" size="lg" className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white min-w-[140px] shadow-lg shadow-blue-600/20" onClick={handleDownload} disabled={!image}>
                                        <Download className="w-4 h-4 mr-2" /> Download Image
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* FEATURES SECTION */}
            <div className="container mx-auto max-w-7xl px-4 py-16 border-t border-slate-200 dark:border-slate-800 mt-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">Why Use Our Image Resizer?</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Powerful features designed to make image resizing easy, fast, and secure.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Zap className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Fast Processing</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Resize images in seconds with our optimized browser-based engine. No waiting queues.
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
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">High Quality</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Advanced algorithms ensure your resized images stay crisp and clear, even when scaling down.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Minimize2 className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Web Optimized</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Perfect for websites, blogs, and apps. Optimize dimensions for any platform effortlessly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
