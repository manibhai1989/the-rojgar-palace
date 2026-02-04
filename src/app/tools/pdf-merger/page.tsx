"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, Trash2, ArrowRight, Download, FileText, GripVertical, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link"; // Added missing import
import { ArrowLeft } from "lucide-react"; // Added missing import
import { cn } from "@/lib/utils";

interface FileWithMeta {
    id: string; // unique id for list keys
    file: File;
    pageCount: number;
}

export default function PdfMergerPage() {
    const [files, setFiles] = useState<FileWithMeta[]>([]);
    const [isMerging, setIsMerging] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
            const rawFiles = Array.from(e.target.files).filter(f => allowedTypes.includes(f.type));

            if (rawFiles.length < e.target.files.length) {
                toast.error("Some files were skipped. Only PDF, PNG, and JPG are supported.");
            }

            const processedFiles: FileWithMeta[] = [];

            for (const file of rawFiles) {
                let count = 1;
                if (file.type === "application/pdf") {
                    try {
                        const buffer = await file.arrayBuffer();
                        const pdf = await PDFDocument.load(buffer);
                        count = pdf.getPageCount();
                    } catch (err) {
                        console.error("Error reading PDF page count", err);
                        toast.error(`Could not read pages of ${file.name}`);
                    }
                }

                processedFiles.push({
                    id: Math.random().toString(36).substr(2, 9),
                    file: file,
                    pageCount: count
                });
            }

            setFiles(prev => [...prev, ...processedFiles]);
            setDownloadUrl(null);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setDownloadUrl(null);
    };

    const moveFile = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === files.length - 1) return;

        const newFiles = [...files];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newFiles[index], newFiles[swapIndex]] = [newFiles[swapIndex], newFiles[index]];
        setFiles(newFiles);
        setDownloadUrl(null);
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            toast.error("Please select at least 2 files to merge.");
            return;
        }

        setIsMerging(true);
        try {
            const mergedPdf = await PDFDocument.create();

            for (const meta of files) {
                const file = meta.file;
                const fileBuffer = await file.arrayBuffer();

                if (file.type === "application/pdf") {
                    // Handle PDF
                    const pdf = await PDFDocument.load(fileBuffer);
                    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    copiedPages.forEach((page) => mergedPdf.addPage(page));
                } else {
                    // Handle Image (JPG/PNG)
                    let image;
                    if (file.type === "image/jpeg" || file.type === "image/jpg") {
                        image = await mergedPdf.embedJpg(fileBuffer);
                    } else {
                        image = await mergedPdf.embedPng(fileBuffer);
                    }

                    // Create A4 Page (Standard Size)
                    const page = mergedPdf.addPage([595.28, 841.89]); // A4 in points
                    const { width, height } = image.scale(1);

                    // Logic to fit image within A4 margins (e.g. 20px margin)
                    const maxWidth = 595.28 - 40;
                    const maxHeight = 841.89 - 40;

                    const scaleFactor = Math.min(maxWidth / width, maxHeight / height, 1); // No upscale

                    const scaledWidth = width * scaleFactor;
                    const scaledHeight = height * scaleFactor;

                    page.drawImage(image, {
                        x: (595.28 - scaledWidth) / 2, // Center X
                        y: (841.89 - scaledHeight) / 2, // Center Y
                        width: scaledWidth,
                        height: scaledHeight,
                    });
                }
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes as any], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            toast.success("Merged Successfully!", { description: `${files.length} files combined.` });
        } catch (error) {
            console.error(error);
            toast.error("Merge Failed", { description: "Ensure files are valid PDFs or Images." });
        } finally {
            setIsMerging(false);
        }
    };

    const totalPages = files.reduce((acc, curr) => acc + curr.pageCount, 0);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
            {/* Header */}
            <header className="relative flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-900 pt-16 pb-12 px-4 shadow-xl z-20 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-blue-100/50 dark:bg-blue-600/10 mix-blend-multiply dark:mix-blend-overlay"></div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/20 to-transparent"></div>
                </div>

                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
                        <div className="text-left flex-1">
                            <Link href="/tools" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-4 text-sm font-medium">
                                <ArrowLeft className="w-4 h-4" /> Back to Tools
                            </Link>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-blue-100/50 dark:bg-blue-500/20 rounded-lg border border-blue-200 dark:border-blue-500/30">
                                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                PDF Combiner Pro
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 max-w-lg text-base leading-relaxed">
                                Merge multiple PDF files into one distinct document. Secure, fast, and local.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto max-w-4xl px-4 -mt-8 relative z-30">
                {/* Upload Section */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center transition-all hover:border-blue-500/50">
                    <input
                        type="file"
                        id="pdf-upload"
                        multiple
                        accept="application/pdf,image/png,image/jpeg,image/jpg"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="pdf-upload"
                        className="cursor-pointer flex flex-col items-center justify-center gap-4 py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <FileUp className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Click to Upload Files</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Combine PDFs and Images into one</p>
                        </div>
                    </label>
                </div>

                {/* File List */}
                <AnimatePresence>
                    {files.length > 0 && (
                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <h3 className="font-semibold text-slate-700 dark:text-slate-300">Selected Files ({files.length})</h3>
                                <div className="text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full">
                                    Total Pages: {totalPages}
                                </div>
                                <button onClick={() => { setFiles([]); setDownloadUrl(null); }} className="text-sm text-red-500 hover:text-red-400 font-medium ml-auto">Clear All</button>
                            </div>

                            <motion.div layout className="space-y-3">
                                {files.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4"
                                    >
                                        <div className="text-slate-400">
                                            <GripVertical className="w-5 h-5" />
                                        </div>
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center",
                                            item.file.type.startsWith("image/")
                                                ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-500"
                                                : "bg-red-100 dark:bg-red-900/20 text-red-500"
                                        )}>
                                            {item.file.type.startsWith("image/") ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium truncate text-slate-800 dark:text-slate-200">{item.file.name}</p>
                                                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                                    {item.pageCount} pg
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col gap-1 mr-2">
                                                <button onClick={() => moveFile(index, 'up')} disabled={index === 0} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 disabled:opacity-30">▲</button>
                                                <button onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 disabled:opacity-30">▼</button>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Action Area */}
                            <div className="flex flex-col items-center gap-6 mt-8 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                                {!downloadUrl ? (
                                    <Button
                                        size="lg"
                                        onClick={handleMerge}
                                        disabled={isMerging || files.length < 2}
                                        className="w-full max-w-md h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                                    >
                                        {isMerging ? "Merging PDFs..." : `Merge ${files.length} Files`}
                                        {!isMerging && <ArrowRight className="w-5 h-5 ml-2" />}
                                    </Button>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 w-full animate-in fade-in slide-in-from-bottom-4">
                                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-lg">
                                            <CheckCircle2 className="w-6 h-6" /> Success!
                                        </div>
                                        <a href={downloadUrl} download="merged-document.pdf" className="w-full max-w-md">
                                            <Button size="lg" className="w-full h-12 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20">
                                                <Download className="w-5 h-5 mr-2" /> Download Merged PDF
                                            </Button>
                                        </a>
                                        <button onClick={() => setDownloadUrl(null)} className="text-sm text-slate-500 underline">Merge Different Files</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
