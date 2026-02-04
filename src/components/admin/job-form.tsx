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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        const loadingToast = toast.loading("Processing...");
        setApiRequestCount(prev => prev + 1);

        try {
            // 1. Analyze with AI (No Upload to Supabase yet)


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
                // Prioritize user-friendly message from backend
                const errorMessage = result.userMessage || result.message || result.error || `Analysis failed with status ${response.status}`;
                throw new Error(errorMessage);
            }

            // 2. Merge AI Result
            let aiLinks = result.data.importantLinks || formData.importantLinks;

            // PRESERVE EXISTING NOTIFICATION LINK (from manual upload)
            const existingNotificationLink = formData.importantLinks.find(
                (l: { title: string; url: string }) => l.title.toLowerCase().includes("notification") && l.url.startsWith("http")
            );

            if (existingNotificationLink) {
                // Check if AI found a notification link
                const aiNotificationIndex = aiLinks.findIndex((l: any) => l.title.toLowerCase().includes("notification"));

                if (aiNotificationIndex >= 0) {
                    // Overwrite AI's likely broken link with our good Uploaded URL
                    aiLinks[aiNotificationIndex].url = existingNotificationLink.url;
                } else {
                    // Add our link if AI didn't find one
                    aiLinks.push(existingNotificationLink);
                }
            }

            setFormData(prev => ({
                ...prev,
                ...result.data,
                feesObj: result.data.feesObj || prev.feesObj,
                vacancyObj: result.data.vacancyObj || prev.vacancyObj,
                importantLinks: aiLinks,
                extraDetails: result.data.extraDetails || prev.extraDetails,
                customDates: result.data.customDates || prev.customDates,
                ageLimitDetails: result.data.ageLimitDetails || prev.ageLimitDetails,
                selectionStages: result.data.selectionStages || prev.selectionStages,
                educationalQualification: result.data.educationalQualification || prev.educationalQualification
            }));

            toast.success("Uploaded & Analyzed Successfully!", { id: loadingToast });
        } catch (error: any) {
            console.error(error);
            toast.error(error.message, { id: loadingToast, duration: 5000 });
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Separate Handler for Public Notification Upload
    const handleUploadNotification = async (uploadFile: File) => {
        const loadingToast = toast.loading("Uploading Notification...");

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
                const existingIndex = newLinks.findIndex(l => l.title.toLowerCase().includes("notification"));

                if (existingIndex >= 0) {
                    newLinks[existingIndex].url = publicUrl;
                } else {
                    newLinks.push({ title: "Download Notification", url: publicUrl });
                }

                return { ...prev, importantLinks: newLinks };
            });

            toast.success("Notification Uploaded & Linked!", { id: loadingToast });
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

    const handleChange = (field: keyof JobFormData, value: string) => {
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
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <ApiUsageWidget incrementTrigger={apiRequestCount} />

            <header className="mb-8 flex justify-between items-center sticky top-0 bg-slate-950/80 backdrop-blur-md z-50 py-4 border-b border-white/10">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        {isEditMode ? "Edit Job Post" : "Post New Job (Sarkari Style)"}
                    </h1>
                    <p className="text-slate-400">Structured data entry for premium templates.</p>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg shadow-emerald-500/20"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {submitLabel}
                </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: Upload & Basic */}
                <div className="space-y-6">
                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-lg">1. Upload Notification</CardTitle>
                            <CardDescription>Auto-fill from PDF</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl p-6 text-center group relative mb-4 transition-colors">
                                <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-blue-400 mx-auto mb-2 transition-colors" />
                                <p className="text-sm font-medium text-slate-300">{file ? file.name : "Drag & Drop PDF"}</p>
                            </div>
                            <Button onClick={handleAnalyze} disabled={!file || isAnalyzing} className="w-full bg-blue-600">
                                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                Auto-Extract Data
                            </Button>
                        </CardContent>
                    </Card>

                    {/* NEW: Upload Official Notification */}
                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-lg">2. Official Notification</CardTitle>
                            <CardDescription>Upload the public PDF for users.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 items-center">
                                <Input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) handleUploadNotification(e.target.files[0]);
                                    }}
                                    className="bg-black/20 border-white/10 text-xs"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                                Automatically generates "Download Notification" link.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="space-y-4 p-4 bg-slate-900/40 rounded-xl border border-white/5">
                        <h3 className="font-semibold text-slate-200">Basic Info</h3>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label>Post Name</Label>
                                <Input value={formData.postName} onChange={(e) => handleChange("postName", e.target.value)} className="bg-black/20 border-white/10" />
                            </div>
                            <div className="space-y-1">
                                <Label>Total Vacancy</Label>
                                <Input value={formData.totalVacancy} onChange={(e) => handleChange("totalVacancy", e.target.value)} className="bg-black/20 border-white/10" />
                            </div>
                            <div className="space-y-1">
                                <Label>Short Description</Label>
                                <Textarea value={formData.shortInfo} onChange={(e) => handleChange("shortInfo", e.target.value)} className="bg-black/20 border-white/10 h-24" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 p-4 bg-slate-900/40 rounded-xl border border-white/5">
                        <h3 className="font-semibold text-slate-200">Dates</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">App Begin</Label>
                                <Input value={formData.applicationBegin} onChange={(e) => handleChange("applicationBegin", e.target.value)} className="bg-black/20 border-white/10 text-sm" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">App End</Label>
                                <Input value={formData.lastDateApply} onChange={(e) => handleChange("lastDateApply", e.target.value)} className="bg-black/20 border-white/10 text-sm" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Pay Last Date</Label>
                                <Input value={formData.lastDateFee} onChange={(e) => handleChange("lastDateFee", e.target.value)} className="bg-black/20 border-white/10 text-sm" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Exam Date</Label>
                                <Input value={formData.examDate} onChange={(e) => handleChange("examDate", e.target.value)} className="bg-black/20 border-white/10 text-sm" />
                            </div>
                        </div>

                        <Separator className="bg-white/10 my-2" />

                        {/* CUSTOM DATES */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs text-blue-400">Custom Dates</Label>
                                <Button size="sm" variant="ghost" onClick={addCustomDate} className="h-5 w-5 p-0"><Plus className="w-3 h-3" /></Button>
                            </div>
                            {formData.customDates.map((date, i) => (
                                <div key={i} className="flex gap-2">
                                    <Input placeholder="Label e.g. Re-Open" value={date.label} onChange={(e) => updateCustomDate(i, "label", e.target.value)} className="bg-black/20 border-white/10 text-xs h-8" />
                                    <Input placeholder="Value" value={date.value} onChange={(e) => updateCustomDate(i, "value", e.target.value)} className="bg-black/20 border-white/10 text-xs h-8" />
                                    <Button size="icon" variant="ghost" onClick={() => removeCustomDate(i)} className="h-8 w-8 text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3" /></Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CENTER & RIGHT: Tables */}
                <div className="lg:col-span-2 space-y-8">

                    {/* FEES & AGE */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-5 bg-slate-900/40 rounded-xl border border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-pink-400">Application Fees</h3>
                                <Button size="sm" variant="ghost" onClick={addFeeRow} className="h-6 w-6 p-0"><Plus className="w-4 h-4" /></Button>
                            </div>
                            <div className="space-y-2">
                                {formData.feesObj.map((fee, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input placeholder="Category" value={fee.category} onChange={(e) => updateFeeInfo(i, "category", e.target.value)} className="bg-black/20 border-white/10 flex-1" />
                                        <Input placeholder="₹" value={fee.amount} onChange={(e) => updateFeeInfo(i, "amount", e.target.value)} className="bg-black/20 border-white/10 w-24" />
                                        <Button size="icon" variant="ghost" onClick={() => removeFeeRow(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-5 bg-slate-900/40 rounded-xl border border-white/5">
                            <h3 className="font-semibold text-blue-400 mb-4">Age Limit</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Min Age</Label>
                                    <Input value={formData.minAge} onChange={(e) => handleChange("minAge", e.target.value)} className="bg-black/20 border-white/10" />
                                </div>
                                <div className="space-y-1">
                                    <Label>Max Age</Label>
                                    <Input value={formData.maxAge} onChange={(e) => handleChange("maxAge", e.target.value)} className="bg-black/20 border-white/10" />
                                </div>
                                <div className="col-span-2 pt-2 text-xs text-slate-400 space-y-2">
                                    <div className="space-y-1">
                                        <Label>Age as on</Label>
                                        <Input value={formData.ageLimitDetails?.calculateDate} onChange={(e) => handleNestedChange("ageLimitDetails", "calculateDate", e.target.value)} className="bg-black/20 border-white/10" placeholder="01/01/2026" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Relaxation Rules</Label>
                                        <Input value={formData.ageLimitDetails?.relaxation} onChange={(e) => handleNestedChange("ageLimitDetails", "relaxation", e.target.value)} className="bg-black/20 border-white/10" placeholder="As per rules" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Educational Qualification */}
                    <div className="p-6 bg-slate-900/40 rounded-xl border border-white/5">
                        <h3 className="font-semibold text-indigo-400 text-lg mb-2">Educational Qualification & Eligibility</h3>
                        <Textarea
                            value={formData.educationalQualification}
                            onChange={(e) => handleChange("educationalQualification", e.target.value)}
                            className="bg-black/20 border-white/10 h-32"
                            placeholder="Enter detailed eligibility..."
                        />
                    </div>

                    {/* Selection Process */}
                    <div className="p-6 bg-slate-900/40 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-yellow-400 text-lg">Selection Process Stages</h3>
                            <Button size="sm" variant="outline" onClick={addStage} className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                                <Plus className="w-4 h-4 mr-2" /> Add Stage
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {formData.selectionStages.map((stage, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="p-2 bg-white/5 rounded text-xs font-bold text-slate-400 w-8 text-center">{i + 1}</span>
                                    <Input value={stage} onChange={(e) => updateStage(i, e.target.value)} className="bg-black/20 border-white/10 flex-1" />
                                    <Button size="icon" variant="ghost" onClick={() => removeStage(i)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* VACANCY DETAILS */}
                    <div className="p-6 bg-slate-900/40 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-emerald-400 text-lg">Vacancy Details</h3>
                            <Button size="sm" variant="outline" onClick={addVacancyRow} className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                                <Plus className="w-4 h-4 mr-2" /> Add Post
                            </Button>
                        </div>
                        <div className="bg-black/20 rounded-lg border border-white/5 overflow-hidden">
                            <div className="grid grid-cols-12 gap-2 p-3 bg-white/5 text-xs uppercase tracking-wider font-semibold text-slate-400">
                                <div className="col-span-5">Post Name</div>
                                <div className="col-span-4">Category</div>
                                <div className="col-span-2">Total</div>
                                <div className="col-span-1"></div>
                            </div>
                            <div className="divide-y divide-white/5">
                                {formData.vacancyObj.map((vac, i) => (
                                    <div key={i} className="grid grid-cols-12 gap-2 p-2 items-center">
                                        <div className="col-span-5">
                                            <Input value={vac.postName} onChange={(e) => updateVacancy(i, "postName", e.target.value)} className="bg-transparent border-transparent focus:bg-black/40" placeholder="Post Name" />
                                        </div>
                                        <div className="col-span-4">
                                            <Input value={vac.category} onChange={(e) => updateVacancy(i, "category", e.target.value)} className="bg-transparent border-transparent focus:bg-black/40" placeholder="UR/OBC/etc" />
                                        </div>
                                        <div className="col-span-2">
                                            <Input value={vac.count} onChange={(e) => updateVacancy(i, "count", e.target.value)} className="bg-transparent border-transparent focus:bg-black/40" placeholder="0" />
                                        </div>
                                        <div className="col-span-1 text-center">
                                            <Button size="icon" variant="ghost" onClick={() => removeVacancyRow(i)} className="h-6 w-6 text-slate-600 hover:text-red-400"><Trash2 className="w-3 h-3" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* EXTRA DETAILS */}
                    <div className="p-6 bg-slate-900/40 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-purple-400 text-lg">Other Details (e.g. Physical Standards)</h3>
                            <Button size="sm" variant="outline" onClick={addExtraDetail} className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                                <Plus className="w-4 h-4 mr-2" /> Add Section
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {formData.extraDetails.map((detail, i) => (
                                <div key={i} className="flex flex-col gap-2 p-3 bg-black/20 rounded-lg border border-white/5 relative">
                                    <div className="flex gap-2">
                                        <Input value={detail.title} onChange={(e) => updateExtraDetail(i, "title", e.target.value)} className="bg-transparent border-white/10 font-bold" placeholder="Section Title (e.g. Physical Standards)" />
                                        <Button size="icon" variant="ghost" onClick={() => removeExtraDetail(i)} className="text-slate-500 hover:text-red-400 absolute right-2 top-2"><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                    <Textarea value={detail.content} onChange={(e) => updateExtraDetail(i, "content", e.target.value)} className="bg-transparent border-white/10 min-h-[80px]" placeholder="Enter detailed info..." />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* IMPORTANT LINKS */}
                    <div className="p-6 bg-slate-900/40 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-orange-400 text-lg">Important Links</h3>
                            <Button size="sm" variant="outline" onClick={addLinkRow} className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                                <Plus className="w-4 h-4 mr-2" /> Add Link
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {formData.importantLinks.map((link, i) => (
                                <div key={i} className="flex gap-3 items-center">
                                    <Input value={link.title} onChange={(e) => updateLink(i, "title", e.target.value)} className="bg-black/20 border-white/10 flex-1" placeholder="Link Title" />
                                    <Input value={link.url} onChange={(e) => updateLink(i, "url", e.target.value)} className="bg-black/20 border-white/10 flex-1" placeholder="https://" />
                                    <Button size="icon" variant="ghost" onClick={() => removeLinkRow(i)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
