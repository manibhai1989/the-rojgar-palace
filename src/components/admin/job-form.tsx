"use client";

import { useState, useEffect } from "react";
import {
    UploadCloud,
    FileText,
    Loader2,
    Sparkles,
    Calendar,
    IndianRupee,
    Save,
    Plus,
    Trash2
} from "lucide-react";
import { DynamicTable } from "@/components/admin/dynamic-table"; // Newly created component
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { ApiUsageWidget } from "@/components/admin/api-usage-widget";
import { supabase } from "@/lib/supabase"; // Import Supabase Client


// Data Types
export type JobFormData = {
    postName: string;
    advtNo: string;
    shortInfo: string;
    applicationBegin: string;
    lastDateApply: string;
    lastDateFee: string;
    examDate: string;
    minAge: string;
    maxAge: string;
    totalVacancy: string;
    feesObj: { category: string; amount: string }[];
    vacancyObj: { postName: string; category: string; count: any }[];
    importantLinks: { title: string; url: string }[];
    extraDetails: { title: string; content: string }[];
    customDates: { label: string; value: string }[];
    ageLimitDetails: { calculateDate: string; relaxation: string };
    selectionStages: string[];
    educationalQualification: string;
};

interface JobFormProps {
    initialData?: JobFormData;
    onSubmit: (data: JobFormData) => Promise<{ success: boolean; error?: string }>;
    submitLabel?: string;
    isEditMode?: boolean;
}

export default function JobForm({ initialData, onSubmit, submitLabel = "Publish Job", isEditMode = false }: JobFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null); // New: Preview URL
    const [viewMode, setViewMode] = useState<"standard" | "split">("standard"); // New: View Mode
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [apiRequestCount, setApiRequestCount] = useState(0); // Trigger for widget

    const defaultState: JobFormData = {
        postName: "",
        advtNo: "",
        shortInfo: "",
        applicationBegin: "",
        lastDateApply: "",
        lastDateFee: "",
        examDate: "Notify Soon",
        minAge: "",
        maxAge: "",
        totalVacancy: "",
        feesObj: [
            { category: "General / OBC / EWS", amount: "0" },
            { category: "SC / ST / PH", amount: "0" }
        ],
        vacancyObj: [
            { postName: "Post Name", category: "UR", count: 0 }
        ],
        importantLinks: [
            { title: "Apply Online", url: "#" },
            { title: "Download Notification", url: "#" },
            { title: "Official Website", url: "#" }
        ],
        extraDetails: [],
        customDates: [],
        ageLimitDetails: { calculateDate: "", relaxation: "" },
        selectionStages: [],
        educationalQualification: ""
    };

    const [formData, setFormData] = useState<JobFormData>(initialData || defaultState);

    // If initialData changes (e.g. after fetch), update state
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const [lastError, setLastError] = useState<string | null>(null);

    // Clean up blob URL
    useEffect(() => {
        return () => {
            if (fileUrl) URL.revokeObjectURL(fileUrl);
        };
    }, [fileUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setLastError(null);

            // Auto-switch to split view with preview
            const url = URL.createObjectURL(selectedFile);
            setFileUrl(url);
            setViewMode("split");
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        // Vercel Serverless Function Limit (4.5MB). Safety buffer 4MB.
        if (file.size > 4 * 1024 * 1024) {
            const msg = `File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max 4MB allowed for AI Analysis.`;
            toast.error(msg);
            setLastError(msg);
            return;
        }

        setIsAnalyzing(true);
        setLastError(null); // Clear previous errors
        const loadingToast = toast.loading("Processing...");
        setApiRequestCount(prev => prev + 1);

        try {
            // 2. Analyze with AI
            toast.loading("Analyzing Notification with AI...", { id: loadingToast });
            const data = new FormData();
            data.append("file", file);

            const response = await fetch("/api/admin/parse-notification", {
                method: "POST",
                body: data,
            });

            let result;
            try {
                result = await response.json();
            } catch (jsonErr) {
                const text = await response.text().catch(() => "No response body");
                console.error("API Response (Text):", text);
                throw new Error(`Server Error (${response.status}): ${response.statusText}`);
            }

            if (!response.ok) {
                console.error(`API Error (${response.status}):`, result);
                const errorMessage = result.userMessage || result.message || result.error || `Analysis failed with status ${response.status}`;
                setLastError(errorMessage);
                throw new Error(errorMessage);
            }

            // 2. Merge AI Result
            let aiLinks: any[] = Array.isArray(result.data.importantLinks) ? result.data.importantLinks : (formData.importantLinks || []);

            // PRESERVE EXISTING NOTIFICATION LINK (from manual upload)
            const existingNotificationLink = formData.importantLinks.find(
                (l: { title: string; url: string }) => l.title.toLowerCase().includes("notification") && l.url.startsWith("http")
            );

            if (existingNotificationLink) {
                const aiNotificationIndex = aiLinks.findIndex((l: any) => l.title.toLowerCase().includes("notification"));
                if (aiNotificationIndex >= 0) {
                    aiLinks[aiNotificationIndex].url = existingNotificationLink.url;
                } else {
                    aiLinks.push(existingNotificationLink);
                }
            }

            // Safe State Updates
            setFormData(prev => ({
                ...prev,
                feesObj: Array.isArray(result.data.feesObj) ? result.data.feesObj : (prev.feesObj || []),
                vacancyObj: Array.isArray(result.data.vacancyObj) ? result.data.vacancyObj : (prev.vacancyObj || []),
                importantLinks: aiLinks,
                extraDetails: Array.isArray(result.data.extraDetails) ? result.data.extraDetails : (prev.extraDetails || []),
                customDates: Array.isArray(result.data.customDates) ? result.data.customDates : (prev.customDates || []),
                selectionStages: Array.isArray(result.data.selectionStages) ? result.data.selectionStages : (prev.selectionStages || []),
                ageLimitDetails: result.data.ageLimitDetails || prev.ageLimitDetails,
                educationalQualification: result.data.educationalQualification || prev.educationalQualification,
                postName: result.data.postName || prev.postName,
                shortInfo: result.data.shortInfo || prev.shortInfo,
                totalVacancy: result.data.totalVacancy || prev.totalVacancy,
                minAge: result.data.minAge || prev.minAge,
                maxAge: result.data.maxAge || prev.maxAge,
                applicationBegin: result.data.applicationBegin || prev.applicationBegin,
                lastDateApply: result.data.lastDateApply || prev.lastDateApply,
                lastDateFee: result.data.lastDateFee || prev.lastDateFee,
                examDate: result.data.examDate || prev.examDate,
            }));

            toast.success("Uploaded & Analyzed Successfully!", { id: loadingToast });
        } catch (error: any) {
            console.error(error);
            const msg = error.message || "Failed to analyze notification";
            setLastError(msg);
            toast.error(msg, { id: loadingToast, duration: 5000 });
        } finally {
            setIsAnalyzing(false);
        }
    };


    // Generic Handler for PDF Uploads (Notification, Syllabus, etc.)
    const handleUploadPDF = async (uploadFile: File, linkTitle: string) => {
        const loadingToast = toast.loading(`Uploading ${linkTitle}...`);

        try {
            const fileName = `${Date.now()}_${uploadFile.name.replace(/\s+/g, '_')}`;

            const { error: uploadError } = await supabase.storage
                .from('pdfs')
                .upload(fileName, uploadFile);

            if (uploadError) throw new Error(`Upload Failed: ${uploadError.message}`);

            const { data: urlData } = supabase.storage
                .from('pdfs')
                .getPublicUrl(fileName);

            const publicUrl = urlData.publicUrl;

            // Add/Update Link
            setFormData(prev => {
                const newLinks = [...prev.importantLinks];
                // Check if a link with this specific title already exists (case-insensitive partial match for safety, or exact?)
                // Let's go with exact start match or strict inclusion to differentiate "Download Notification" vs "Download Syllabus"
                const existingIndex = newLinks.findIndex(l => l.title.toLowerCase() === linkTitle.toLowerCase());

                if (existingIndex >= 0) {
                    newLinks[existingIndex].url = publicUrl;
                } else {
                    newLinks.push({ title: linkTitle, url: publicUrl });
                }

                return { ...prev, importantLinks: newLinks };
            });

            toast.success(`${linkTitle} Linked!`, { id: loadingToast });
        } catch (error: any) {
            console.error(error);
            toast.error(error.message, { id: loadingToast });
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = async () => {
        if (!formData.postName) {
            toast.error("At least Post Name is required");
            return;
        }

        setIsSubmitting(true);
        const loadingToast = toast.loading("Saving job...");

        try {
            const result = await onSubmit(formData);

            if (result.success) {
                toast.success("Job Saved Successfully!", { id: loadingToast });
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(`Failed to save: ${error.message}`, { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof JobFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // For nested objects (ageLimitDetails)
    const handleNestedChange = (parent: keyof JobFormData, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...(prev[parent] as any),
                [field]: value
            }
        }));
    };

    // --- List Managers ---
    const updateFeeInfo = (index: number, field: string, val: string) => {
        const newFees = [...formData.feesObj];
        (newFees[index] as any)[field] = val;
        setFormData(prev => ({ ...prev, feesObj: newFees }));
    };
    const addFeeRow = () => setFormData(prev => ({ ...prev, feesObj: [...prev.feesObj, { category: "", amount: "" }] }));
    const removeFeeRow = (idx: number) => setFormData(prev => ({ ...prev, feesObj: prev.feesObj.filter((_, i) => i !== idx) }));

    const updateVacancy = (index: number, field: string, val: string) => {
        const newVac = [...formData.vacancyObj];
        (newVac[index] as any)[field] = val;
        setFormData(prev => ({ ...prev, vacancyObj: newVac }));
    };
    const addVacancyRow = () => setFormData(prev => ({ ...prev, vacancyObj: [...prev.vacancyObj, { postName: "", category: "", count: 0 }] }));
    const removeVacancyRow = (idx: number) => setFormData(prev => ({ ...prev, vacancyObj: prev.vacancyObj.filter((_, i) => i !== idx) }));

    const updateLink = (index: number, field: string, val: string) => {
        const newLinks = [...formData.importantLinks];
        (newLinks[index] as any)[field] = val;
        setFormData(prev => ({ ...prev, importantLinks: newLinks }));
    };
    const addLinkRow = () => setFormData(prev => ({ ...prev, importantLinks: [...prev.importantLinks, { title: "", url: "" }] }));
    const removeLinkRow = (idx: number) => setFormData(prev => ({ ...prev, importantLinks: prev.importantLinks.filter((_, i) => i !== idx) }));

    const updateExtraDetail = (index: number, field: string, val: string) => {
        const newDetails = [...formData.extraDetails];
        (newDetails[index] as any)[field] = val;
        setFormData(prev => ({ ...prev, extraDetails: newDetails }));
    };
    const addExtraDetail = () => setFormData(prev => ({ ...prev, extraDetails: [...prev.extraDetails, { title: "", content: "" }] }));
    const removeExtraDetail = (idx: number) => setFormData(prev => ({ ...prev, extraDetails: prev.extraDetails.filter((_, i) => i !== idx) }));

    const updateCustomDate = (index: number, field: string, val: string) => {
        const newDates = [...formData.customDates];
        (newDates[index] as any)[field] = val;
        setFormData(prev => ({ ...prev, customDates: newDates }));
    };
    const addCustomDate = () => setFormData(prev => ({ ...prev, customDates: [...prev.customDates, { label: "", value: "" }] }));
    const removeCustomDate = (idx: number) => setFormData(prev => ({ ...prev, customDates: prev.customDates.filter((_, i) => i !== idx) }));

    const updateStage = (index: number, val: string) => {
        const newStages = [...formData.selectionStages];
        newStages[index] = val;
        setFormData(prev => ({ ...prev, selectionStages: newStages }));
    };
    const addStage = () => setFormData(prev => ({ ...prev, selectionStages: [...prev.selectionStages, ""] }));
    const removeStage = (idx: number) => setFormData(prev => ({ ...prev, selectionStages: prev.selectionStages.filter((_, i) => i !== idx) }));




    return (
        <div className={`space-y-6 ${viewMode === "split" ? "h-[calc(100vh-100px)] overflow-hidden flex flex-col" : ""}`}>

            {/* HEADER: Mode Switcher & Actions */}
            <div className="flex justify-between items-center bg-card/60 p-4 rounded-xl shadow-sm border border-border shrink-0 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-emerald-500 dark:text-emerald-400">
                        {isEditMode ? "Edit Job" : "Create New Job"}
                    </h2>

                    {/* View Mode Toggle */}
                    <div className="flex bg-muted rounded-lg p-1 border border-border">
                        <button
                            onClick={() => setViewMode("standard")}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === "standard" ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Standard View
                        </button>
                        <button
                            onClick={() => setViewMode("split")}
                            disabled={!file}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === "split" ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"} ${!file ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            Workbench (Split)
                        </button>
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    <ApiUsageWidget incrementTrigger={apiRequestCount} />
                    <div className="relative">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            id="file-upload"
                        />
                        <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                            <UploadCloud className="w-4 h-4 mr-2" />
                            {file ? "Change PDF" : "Upload PDF"}
                        </Button>
                    </div>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        {submitLabel}
                    </Button>
                </div>
            </div>

            {/* MAIN LAYOUT: Split or Single */}
            <div className={`grid gap-6 ${viewMode === "split" ? "grid-cols-12 h-full overflow-hidden pb-4" : "grid-cols-1"}`}>

                {/* LEFT PANE: PDF Viewer (Only in Split Mode) */}
                {viewMode === "split" && (
                    <div className="col-span-6 h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-xl flex flex-col">
                        <div className="bg-slate-800 p-2 text-center text-xs text-slate-400 font-mono border-b border-slate-700 shrink-0">
                            Document Viewer: {file ? file.name : "No file selected"}
                        </div>
                        {fileUrl ? (
                            <iframe
                                src={fileUrl}
                                className="w-full h-full bg-slate-800"
                                title="PDF Preview"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                <FileText className="w-12 h-12 mb-2 opacity-20" />
                                <p>Select a PDF to preview</p>
                            </div>
                        )}
                    </div>
                )}

                {/* RIGHT PANE: The Form */}
                <div className={`${viewMode === "split" ? "col-span-6 h-full overflow-y-auto pr-2 pb-20 custom-scrollbar" : "col-span-1"}`}>

                    {/* ORIGINAL FORM CONTENT STARTS HERE */}
                    <div className="space-y-6">

                        {/* AI ANALYSIS SECTION */}
                        <div className={`p-6 bg-card/40 border border-border rounded-xl transition-all ${isAnalyzing ? "opacity-70 pointer-events-none" : ""}`}>
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <div className="flex-1 w-full">
                                    <Label htmlFor="notification-file" className="text-blue-500 dark:text-blue-400 font-semibold mb-2 block">
                                        Upload Official Notification (PDF)
                                    </Label>
                                    <p className="text-xs text-muted-foreground mb-2">
                                        Analysis works best with original PDFs. Scanned copies may have lower accuracy.
                                    </p>
                                </div>
                                <Button
                                    onClick={handleAnalyze}
                                    disabled={!file || isAnalyzing}
                                    size="lg"
                                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:scale-105"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 mr-2" /> Auto-Extract Data
                                        </>
                                    )}
                                </Button>
                            </div>
                            {lastError && (
                                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
                                    <strong>Analysis Error:</strong> {lastError}
                                </div>
                            )}
                        </div>

                        <Separator className="my-4" />

                        <div className={`grid gap-8 ${viewMode === 'split' ? 'grid-cols-1' : 'lg:grid-cols-3'}`}>
                            {/* LEFT COLUMN: Basic Info */}
                            <div className={`${viewMode === 'split' ? '' : 'lg:col-span-1'} space-y-6`}>
                                <Card className="bg-card/40 border-border">
                                    <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-1">
                                            <Label>Post Name / Title</Label>
                                            <Input value={formData.postName} onChange={(e) => handleChange("postName", e.target.value)} placeholder="e.g. RRB Technician Grade I" className="bg-background/50 border-border text-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Advt No.</Label>
                                            <Input value={formData.advtNo} onChange={(e) => handleChange("advtNo", e.target.value)} placeholder="e.g. CEN 01/2026" className="bg-background/50 border-border text-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Short Information</Label>
                                            <Textarea value={formData.shortInfo} onChange={(e) => handleChange("shortInfo", e.target.value)} placeholder="Brief summary..." rows={4} className="bg-background/50 border-border text-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Total Vacancy</Label>
                                            <Input value={formData.totalVacancy} onChange={(e) => handleChange("totalVacancy", e.target.value)} placeholder="e.g. 9144" className="bg-background/50 border-border text-foreground" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-card/40 border-border">
                                    <CardHeader><CardTitle>Important Dates</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-1">
                                            <Label>Application Begin</Label>
                                            <Input type="date" value={formData.applicationBegin} onChange={(e) => handleChange("applicationBegin", e.target.value)} className="bg-background/50 border-border text-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Last Date Apply</Label>
                                            <Input type="date" value={formData.lastDateApply} onChange={(e) => handleChange("lastDateApply", e.target.value)} className="bg-background/50 border-border text-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Last Date Fee</Label>
                                            <Input type="date" value={formData.lastDateFee} onChange={(e) => handleChange("lastDateFee", e.target.value)} className="bg-background/50 border-border text-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Exam Date</Label>
                                            <Input value={formData.examDate} onChange={(e) => handleChange("examDate", e.target.value)} placeholder="Notify Soon" className="bg-background/50 border-border text-foreground" />
                                        </div>

                                        <Separator />

                                        {/* Custom Dates */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-xs text-muted-foreground uppercase font-bold">Custom Dates</Label>
                                                <Button size="sm" variant="ghost" onClick={addCustomDate} className="h-6 text-xs text-blue-600 dark:text-blue-400"><Plus className="w-3 h-3" /> Add</Button>
                                            </div>
                                            {formData.customDates.map((date, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <Input placeholder="Label e.g. Re-Open" value={date.label} onChange={(e) => updateCustomDate(i, "label", e.target.value)} className="bg-background/50 border-border text-xs h-8" />
                                                    <Input placeholder="Value" value={date.value} onChange={(e) => updateCustomDate(i, "value", e.target.value)} className="bg-background/50 border-border text-xs h-8" />
                                                    <Button size="icon" variant="ghost" onClick={() => removeCustomDate(i)} className="h-8 w-8 text-destructive hover:text-destructive/80"><Trash2 className="w-3 h-3" /></Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* CENTER & RIGHT: Tables */}
                            <div className={`${viewMode === 'split' ? '' : 'lg:col-span-2'} space-y-8`}>

                                {/* DYNAMIC: Application Fees */}
                                <DynamicTable
                                    title="Application Fees"
                                    description="Auto-detected columns (e.g. Category, Amount, Refund Amount)"
                                    data={formData.feesObj}
                                    onChange={(newData) => handleChange("feesObj", newData)}
                                />

                                {/* Age Limit (Static for now, but could be dynamic if needed) */}
                                <div className="p-5 bg-card/40 rounded-xl border border-border">
                                    <h3 className="font-semibold text-blue-500 dark:text-blue-400 mb-4">Age Limit</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label>Min Age</Label>
                                            <Input value={formData.minAge} onChange={(e) => handleChange("minAge", e.target.value)} className="bg-background/50 border-border" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Max Age</Label>
                                            <Input value={formData.maxAge} onChange={(e) => handleChange("maxAge", e.target.value)} className="bg-background/50 border-border" />
                                        </div>
                                        <div className="col-span-2 pt-2 text-xs text-muted-foreground space-y-2">
                                            <div className="space-y-1">
                                                <Label>Age as on</Label>
                                                <Input value={formData.ageLimitDetails?.calculateDate} onChange={(e) => handleNestedChange("ageLimitDetails", "calculateDate", e.target.value)} className="bg-background/50 border-border" placeholder="01/01/2026" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Relaxation Rules</Label>
                                                <Input value={formData.ageLimitDetails?.relaxation} onChange={(e) => handleNestedChange("ageLimitDetails", "relaxation", e.target.value)} className="bg-background/50 border-border" placeholder="As per rules" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Educational Qualification */}
                                <div className="p-6 bg-card/40 rounded-xl border border-border">
                                    <h3 className="font-semibold text-indigo-500 dark:text-indigo-400 text-lg mb-2">Educational Qualification & Eligibility</h3>
                                    <Textarea
                                        value={formData.educationalQualification}
                                        onChange={(e) => handleChange("educationalQualification", e.target.value)}
                                        className="bg-background/50 border-border h-32"
                                        placeholder="Enter detailed eligibility..."
                                    />
                                </div>

                                {/* Selection Process */}
                                <div className="p-6 bg-card/40 rounded-xl border border-border">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-yellow-500 dark:text-yellow-400 text-lg">Selection Process Stages</h3>
                                        <Button size="sm" variant="outline" onClick={addStage} className="border-yellow-500/30 text-yellow-500 dark:text-yellow-400 hover:bg-yellow-500/10">
                                            <Plus className="w-4 h-4 mr-2" /> Add Stage
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.selectionStages.map((stage, i) => (
                                            <div key={i} className="flex gap-2">
                                                <span className="p-2 bg-muted rounded text-xs font-bold text-muted-foreground w-8 text-center">{i + 1}</span>
                                                <Input value={stage} onChange={(e) => updateStage(i, e.target.value)} className="bg-background/50 border-border flex-1" />
                                                <Button size="icon" variant="ghost" onClick={() => removeStage(i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* DYNAMIC: Vacancy Details */}
                                <DynamicTable
                                    title="Vacancy Details"
                                    description="Auto-detected columns (Post Name, Category, Total, Pay Scale, Zone, etc.)"
                                    data={formData.vacancyObj}
                                    onChange={(newData) => handleChange("vacancyObj", newData)}
                                />

                                {/* EXTRA DETAILS */}
                                <div className="p-6 bg-card/40 rounded-xl border border-border">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-purple-500 dark:text-purple-400 text-lg">Other Details (e.g. Physical Standards)</h3>
                                        <Button size="sm" variant="outline" onClick={addExtraDetail} className="border-purple-500/30 text-purple-500 dark:text-purple-400 hover:bg-purple-500/10">
                                            <Plus className="w-4 h-4 mr-2" /> Add Section
                                        </Button>
                                    </div>
                                    <div className="space-y-4">
                                        {formData.extraDetails.map((detail, i) => (
                                            <div key={i} className="flex flex-col gap-2 p-3 bg-muted/40 rounded-lg border border-border relative">
                                                <div className="flex gap-2">
                                                    <Input value={detail.title} onChange={(e) => updateExtraDetail(i, "title", e.target.value)} className="bg-transparent border-border font-bold" placeholder="Section Title (e.g. Physical Standards)" />
                                                    <Button size="icon" variant="ghost" onClick={() => removeExtraDetail(i)} className="text-muted-foreground hover:text-destructive absolute right-2 top-2"><Trash2 className="w-4 h-4" /></Button>
                                                </div>
                                                <Textarea value={detail.content} onChange={(e) => updateExtraDetail(i, "content", e.target.value)} className="bg-transparent border-border min-h-[80px]" placeholder="Enter detailed info..." />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* IMPORTANT LINKS */}
                                <div className="p-6 bg-card/40 rounded-xl border border-border">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-orange-500 dark:text-orange-400 text-lg">Important Links</h3>
                                        <div className="flex gap-2">
                                            {/* Manual Upload Button for Notification */}
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    onChange={(e) => {
                                                        if (e.target.files?.[0]) handleUploadPDF(e.target.files[0], "Download Notification");
                                                    }}
                                                />
                                                <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-500 dark:text-blue-400 hover:bg-blue-500/10">
                                                    <UploadCloud className="w-4 h-4 mr-2" /> Notification
                                                </Button>
                                            </div>

                                            {/* Manual Upload Button for Syllabus */}
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    onChange={(e) => {
                                                        if (e.target.files?.[0]) handleUploadPDF(e.target.files[0], "Download Syllabus");
                                                    }}
                                                />
                                                <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-500 dark:text-purple-400 hover:bg-purple-500/10">
                                                    <UploadCloud className="w-4 h-4 mr-2" /> Syllabus
                                                </Button>
                                            </div>

                                            <Button size="sm" variant="outline" onClick={addLinkRow} className="border-orange-500/30 text-orange-500 dark:text-orange-400 hover:bg-orange-500/10">
                                                <Plus className="w-4 h-4 mr-2" /> Add Link
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.importantLinks.map((link, i) => (
                                            <div key={i} className="flex gap-3 items-center">
                                                <Input value={link.title} onChange={(e) => updateLink(i, "title", e.target.value)} className="bg-background/50 border-border flex-1" placeholder="Link Title" />
                                                <Input value={link.url} onChange={(e) => updateLink(i, "url", e.target.value)} className="bg-background/50 border-border flex-1" placeholder="https://" />
                                                <Button size="icon" variant="ghost" onClick={() => removeLinkRow(i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
