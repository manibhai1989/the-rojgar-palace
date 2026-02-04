"use client";

import { useState, useRef } from "react";
import {
    Upload,
    FileText,
    Trash2,
    Move,
    Download,
    Settings,
    ArrowLeft,
    CheckCircle2,
    Zap,
    Shield,
    Layers,
    RefreshCcw,
    GripVertical,
    FileImage
} from "lucide-react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";

interface ImageFile {
    id: string;
    file: File;
    previewUrl: string;
    width: number;
    height: number;
}

export default function JpgToPdfPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Settings
    const [pageSize, setPageSize] = useState("a4");
    const [orientation, setOrientation] = useState("portrait");
    const [margin, setMargin] = useState("medium"); // small, medium, large, none
    const [imageFit, setImageFit] = useState("fit"); // fit, fill, actual
    const [showPageNumbers, setShowPageNumbers] = useState(true);

    // Handle File Upload
    const handleFile = (files: FileList | null) => {
        if (!files) return;

        const newImages: ImageFile[] = [];
        let skipped = 0;

        Array.from(files).forEach((file) => {
            if (!file.type.startsWith("image/")) {
                skipped++;
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    setImages((prev) => [
                        ...prev,
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            file,
                            previewUrl: e.target?.result as string,
                            width: img.width,
                            height: img.height
                        }
                    ]);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });

        if (skipped > 0) {
            toast.warning(`Skipped ${skipped} invalid files.`);
        } else {
            toast.success("Images added successfully.");
        }
    };

    const removeImage = (id: string) => {
        setImages((prev) => prev.filter((img) => img.id !== id));
    };

    const clearAll = () => {
        if (confirm("Are you sure you want to remove all images?")) {
            setImages([]);
            toast.info("All images removed.");
        }
    };

    // PDF Generation
    const generatePdf = async () => {
        if (images.length === 0) return;
        setIsGenerating(true);

        try {
            // Delay to allow UI to update
            await new Promise(resolve => setTimeout(resolve, 100));

            const doc = new jsPDF({
                orientation: orientation as "p" | "l",
                unit: "mm",
                format: pageSize
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Margins (mm)
            const margins = {
                none: 0,
                small: 10,
                medium: 20,
                large: 30
            };
            const marginSize = margins[margin as keyof typeof margins];

            for (let i = 0; i < images.length; i++) {
                if (i > 0) doc.addPage();

                const img = images[i];
                const contentWidth = pageWidth - (marginSize * 2);
                const contentHeight = pageHeight - (marginSize * 2);

                let targetW = contentWidth;
                let targetH = contentHeight;

                // Calculate dimensions based on fit mode
                if (imageFit === "fit") {
                    const ratio = Math.min(contentWidth / img.width, contentHeight / img.height);
                    targetW = img.width * ratio;
                    targetH = img.height * ratio;
                } else if (imageFit === "actual") {
                    // Convert px to mm (approx 96 DPI)
                    targetW = img.width * 0.264583;
                    targetH = img.height * 0.264583;
                    // Cap at page size if larger
                    if (targetW > contentWidth) {
                        const ratio = contentWidth / targetW;
                        targetW = contentWidth;
                        targetH = targetH * ratio;
                    }
                }
                // "fill" uses full contentWidth/Height (already set)

                // Center image
                const x = marginSize + (contentWidth - targetW) / 2;
                const y = marginSize + (contentHeight - targetH) / 2;

                doc.addImage(
                    img.previewUrl,
                    "JPEG",
                    x,
                    y,
                    targetW,
                    targetH
                );

                if (showPageNumbers) {
                    doc.setFontSize(10);
                    doc.setTextColor(150);
                    doc.text(
                        `Page ${i + 1} of ${images.length}`,
                        pageWidth - 20,
                        pageHeight - 10,
                        { align: "right" }
                    );
                }
            }

            doc.save("images-converted.pdf");
            toast.success("PDF Generated Successfully!");

        } catch (error) {
            console.error(error);
            toast.error("Failed to generate PDF");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header (Premium Red/Orange Theme) */}
            <header className="relative flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-900 pt-16 pb-12 px-4 shadow-xl z-20 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div className="absolute inset-0 z-0 select-none">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-100/50 dark:from-red-500/10 via-white dark:via-slate-900 to-white dark:to-slate-900"></div>
                </div>

                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
                        <div className="text-left flex-1">
                            <Link href="/tools" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-4 text-sm font-medium">
                                <ArrowLeft className="w-4 h-4" /> Back to Tools
                            </Link>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-red-100/50 dark:bg-red-500/20 rounded-lg border border-red-200 dark:border-red-500/30">
                                    <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                JPG to PDF
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 max-w-lg text-base leading-relaxed">
                                Convert and merge multiple images into a single, professional PDF document in seconds.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto max-w-7xl px-4 -mt-6 relative z-30">
                {/* 1. UPLOAD SECTION */}
                <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-1">
                    <div
                        className={cn(
                            "rounded-xl p-8 text-center cursor-pointer transition-all duration-300 border-2 border-dashed",
                            isDragging
                                ? "border-red-500 bg-red-50/50 dark:bg-red-900/20"
                                : "border-slate-300/60 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 hover:border-red-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            if (e.dataTransfer.files) handleFile(e.dataTransfer.files);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                <Layers className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                                {images.length > 0 ? "Add More Images" : "Upload Images"}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                                Drag & drop JPG, PNG, or WebP files here. Reorder them below before converting.
                            </p>
                            <Button size="lg" className="rounded-full px-8 bg-red-600 hover:bg-red-700 text-white shadow-red-500/25 shadow-lg">
                                Select Files
                            </Button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleFile(e.target.files)}
                        />
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            {images.length > 0 && (
                <div className="container mx-auto max-w-7xl px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* LEFT: Image List (Reorderable) */}
                        <div className="lg:col-span-8">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        <FileImage className="w-5 h-5 text-red-500" />
                                        Images ({images.length})
                                    </h2>
                                    <Button variant="ghost" size="sm" onClick={clearAll} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                                        <Trash2 className="w-4 h-4 mr-2" /> Clear All
                                    </Button>
                                </div>

                                <div className="min-h-[200px]">
                                    <Reorder.Group axis="y" values={images} onReorder={setImages} className="space-y-3">
                                        <AnimatePresence>
                                            {images.map((img, index) => (
                                                <Reorder.Item key={img.id} value={img}>
                                                    <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 group hover:border-red-300 dark:hover:border-red-900/50 transition-colors cursor-move">
                                                        <div className="text-slate-400">
                                                            <GripVertical className="w-5 h-5" />
                                                        </div>
                                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
                                                            <img src={img.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-slate-700 dark:text-slate-200 truncate">{img.file.name}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                Page {index + 1} • {(img.file.size / 1024).toFixed(0)} KB
                                                            </p>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeImage(img.id)}
                                                            className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </Reorder.Item>
                                            ))}
                                        </AnimatePresence>
                                    </Reorder.Group>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Settings & Action */}
                        <div className="lg:col-span-4 space-y-6 sticky top-6">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <Settings className="w-5 h-5 text-red-500" /> PDF Settings
                                </h2>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Page Size</Label>
                                        <Select value={pageSize} onValueChange={setPageSize}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="a4">A4 (210 x 297 mm)</SelectItem>
                                                <SelectItem value="letter">Letter (8.5 x 11 in)</SelectItem>
                                                <SelectItem value="legal">Legal (8.5 x 14 in)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Orientation</Label>
                                        <RadioGroup value={orientation} onValueChange={setOrientation} className="flex gap-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="portrait" id="p" />
                                                <Label htmlFor="p">Portrait</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="landscape" id="l" />
                                                <Label htmlFor="l">Landscape</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Image Fit</Label>
                                        <Select value={imageFit} onValueChange={setImageFit}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fit">Fit (Whole Image)</SelectItem>
                                                <SelectItem value="fill">Fill (No Margins)</SelectItem>
                                                <SelectItem value="actual">Actual Size</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Margins</Label>
                                        <Select value={margin} onValueChange={setMargin}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="small">Small</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="large">Large</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <Label>Page Numbers</Label>
                                        <Switch checked={showPageNumbers} onCheckedChange={setShowPageNumbers} />
                                    </div>

                                    <Button
                                        size="lg"
                                        className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"
                                        onClick={generatePdf}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? (
                                            <>Converting...</>
                                        ) : (
                                            <><Download className="w-4 h-4 mr-2" /> Generate PDF</>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* FEATURES SECTION (Empty state or bottom) */}
            <div className="container mx-auto max-w-7xl px-4 py-16 border-t border-slate-200 dark:border-slate-800 mt-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">Why Use Our Converter?</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Simple, fast, and secure tool to create professional PDFs from your images.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Layers className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Merge Images</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Combine as many images as you want into a single, organized PDF file.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Privacy First</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Files are processed in your browser. No images are uploaded to any server.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Move className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Easy Reorder</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Simply drag and drop your images to change their order in the final PDF.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Settings className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Customize</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Set page size, orientation, and margins to fit your document needs perfectly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
