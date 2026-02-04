"use client";

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import { Area, Point } from "react-easy-crop";
import { toast } from "sonner";
import { removeBackground } from "@imgly/background-removal";
import { getCroppedImg, getDeletedImg } from "../lib/image-utils";

interface PhotoEditorContextType {
    image: string | null;
    setImage: (image: string | null) => void;
    fileName: string;
    isProcessing: boolean;
    processingProgress: number;
    currentImageInfo: { width: number; height: number; size: number } | null;
    filters: any;
    setFilters: React.Dispatch<React.SetStateAction<any>>;
    updateFilter: (key: any, value: number) => void;
    transforms: any;
    setTransforms: React.Dispatch<React.SetStateAction<any>>;
    updateTransform: (key: any, value: number | boolean) => void;
    idData: any;
    setIdData: React.Dispatch<React.SetStateAction<any>>;
    complianceData: any;
    setComplianceData: React.Dispatch<React.SetStateAction<any>>;
    bgColor: string;
    setBgColor: (color: string) => void;
    aspect: number | undefined;
    setAspect: (aspect: number | undefined) => void;
    crop: Point;
    setCrop: (crop: Point) => void;
    zoom: number;
    setZoom: (zoom: number) => void;
    showCropper: boolean;
    setShowCropper: (show: boolean) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    resetAll: () => void;
    resetComplianceToDefaults: () => void;
    onCropComplete: (_croppedArea: Area, croppedAreaPixels: Area) => void;
    handleRemoveBackground: () => Promise<void>;
    handleApplyCrop: () => Promise<void>;
    handleDeleteSelection: () => Promise<void>;
    handleProcess: () => Promise<void>;
    handleDownload: () => Promise<void>;
    filterString: string;
    transformString: string;
    validationResults: { message: string; status: 'pass' | 'fail' | 'warning' }[];
    isEraserActive: boolean;
    setIsEraserActive: (isActive: boolean) => void;
}

const PhotoEditorContext = createContext<PhotoEditorContextType | undefined>(undefined);

export function PhotoEditorProvider({ children }: { children: React.ReactNode }) {
    const [image, setImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);
    const [currentImageInfo, setCurrentImageInfo] = useState<{ width: number; height: number; size: number } | null>(null);

    const [filters, setFilters] = useState({
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
    });

    const [transforms, setTransforms] = useState({
        scaleH: 100,
        scaleV: 100,
        skewH: 0,
        skewV: 0,
        rotation: 0,
        flipH: 1,
        flipV: 1,
        lockAspectRatio: true,
    });

    const [idData, setIdData] = useState({
        studentName: "John Doe",
        studentDOB: "15-08-1998",
        showName: false,
        showDOB: false,
        dateFormat: "DD-MM-YYYY",
        applyWhiteBG: false,
    });

    const [complianceData, setComplianceData] = useState({
        preset: "Custom",
        fileType: "photo" as "photo" | "signature",
        width: 320,
        height: 400,
        minSize: 30,
        maxSize: 100,
        minDPI: 72,
        maxDPI: 150,
        strictMode: true,
        autoOptimize: true,
        faceDetection: false,
    });

    const [validationResults, setValidationResults] = useState<{ message: string; status: 'pass' | 'fail' | 'warning' }[]>([]);

    const [bgColor, setBgColor] = useState("transparent");
    const [aspect, setAspect] = useState<number | undefined>(1);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [isEraserActive, setIsEraserActive] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!image) {
            setCurrentImageInfo(null);
            setValidationResults([]);
            return;
        }

        const img = new Image();
        img.onload = () => {
            fetch(image)
                .then(res => res.blob())
                .then(blob => {
                    const info = {
                        width: img.width,
                        height: img.height,
                        size: blob.size
                    };
                    setCurrentImageInfo(info);
                    validateImage(info);
                });
        };
        img.src = image;
    }, [image, complianceData]); // Re-validate when image or compliance data changes

    const validateImage = (info: { width: number; height: number; size: number }) => {
        const results: { message: string; status: 'pass' | 'fail' | 'warning' }[] = [];
        const { width, height, minSize, maxSize, strictMode, fileType, minDPI, maxDPI } = complianceData;

        // 1. Dimensions
        // Allow slight tolerance unless strict mode is on
        const tolerance = strictMode ? 0 : 5;
        const widthMatch = Math.abs(info.width - width) <= tolerance;
        const heightMatch = Math.abs(info.height - height) <= tolerance;

        if (!widthMatch || !heightMatch) {
            results.push({
                message: `Dimensions should be ${width}×${height}px (Current: ${info.width}×${info.height}px)`,
                status: 'fail'
            });
        } else {
            results.push({ message: `Dimensions correct: ${info.width}×${info.height}px`, status: 'pass' });
        }

        // 2. File Size
        const sizeKB = info.size / 1024;
        if (sizeKB < minSize) {
            results.push({ message: `File size too small: ${sizeKB.toFixed(1)}KB (Min: ${minSize}KB)`, status: 'fail' });
        } else if (sizeKB > maxSize) {
            results.push({ message: `File size too large: ${sizeKB.toFixed(1)}KB (Max: ${maxSize}KB)`, status: 'fail' });
        } else {
            results.push({ message: `File size correct: ${sizeKB.toFixed(1)}KB`, status: 'pass' });
        }

        // 3. Aspect Ratio
        const expectedRatio = width / height;
        const actualRatio = info.width / info.height;
        if (Math.abs(actualRatio - expectedRatio) > 0.05) {
            results.push({ message: `Aspect ratio mismatch (Expected: ${expectedRatio.toFixed(2)}, Actual: ${actualRatio.toFixed(2)})`, status: 'warning' });
        } else {
            results.push({ message: `Aspect ratio correct`, status: 'pass' });
        }

        // 4. File Type Specific
        if (fileType === 'photo') {
            if (info.width < 100 || info.height < 100) {
                results.push({ message: 'Image too small for a detailed photograph', status: 'warning' });
            }
        }

        // 5. DPI (Simulated for this context as browser Image API doesn't give DPI directly without parsing bytes)
        // We'll trust the process step to fix DPI, but here we can't reliably check it without a library like 'exif-js'
        // results.push({ message: `DPI validation requires processing`, status: 'warning' });

        setValidationResults(results);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
                resetAll();
                if (complianceData.autoOptimize) {
                    setTimeout(() => handleProcess(), 500);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const resetAll = () => {
        setFilters({ brightness: 100, contrast: 100, saturation: 100, blur: 0 });
        setTransforms({
            scaleH: 100, scaleV: 100, skewH: 0, skewV: 0,
            rotation: 0, flipH: 1, flipV: 1, lockAspectRatio: true
        });
        setBgColor("transparent");
        setIsEraserActive(false);
    };

    const resetComplianceToDefaults = () => {
        setComplianceData({
            preset: "Custom",
            fileType: "photo" as "photo" | "signature",
            width: 320,
            height: 400,
            minSize: 30,
            maxSize: 100,
            minDPI: 72,
            maxDPI: 150,
            strictMode: true,
            autoOptimize: true,
            faceDetection: false,
        });
        toast.info("Requirements reset to defaults");
    };

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleRemoveBackground = async () => {
        if (!image) return;
        setIsProcessing(true);
        setProcessingProgress(10);

        try {
            toast.loading("AI is analyzing image...");
            const blob = await fetch(image).then(res => res.blob());

            setProcessingProgress(30);
            const resultBlob = await removeBackground(blob, {
                progress: (step: string, total: number) => {
                    const currentStep = parseInt(step) || 0;
                    const prog = Math.round((currentStep / total) * 100);
                    setProcessingProgress(30 + (prog * 0.6));
                }
            });

            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
                setIsProcessing(false);
                setProcessingProgress(0);
                toast.dismiss();
                toast.success("Background removed successfully!");
            };
            reader.readAsDataURL(resultBlob);
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
            setProcessingProgress(0);
            toast.dismiss();
            toast.error("Failed to remove background.");
        }
    };

    const handleApplyCrop = async () => {
        if (!image || !croppedAreaPixels) return;
        try {
            const croppedImage = await getCroppedImg(
                image,
                croppedAreaPixels,
                0,
                { horizontal: transforms.flipH, vertical: transforms.flipV }
            );
            setImage(croppedImage);
            setShowCropper(false);
            setTransforms(prev => ({ ...prev, rotation: 0, flipH: 1, flipV: 1 }));
            toast.success("Image cropped!");
        } catch (e) {
            toast.error("Failed to crop image.");
        }
    };

    const handleDeleteSelection = async () => {
        if (!image || !croppedAreaPixels) return;
        setIsProcessing(true);
        try {
            const erasedImage = await getDeletedImg(image, croppedAreaPixels);
            setImage(erasedImage);
            setShowCropper(false);
            setIsEraserActive(false);
            toast.success("Area erased!");
        } catch (e) {
            toast.error("Failed to delete selection.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleProcess = async () => {
        if (!image) return;
        setIsProcessing(true);
        const tid = toast.loading("Processing for compliance...");

        try {
            const img = new Image();
            img.src = image;
            await new Promise(resolve => img.onload = resolve);

            const canvas = document.createElement("canvas");
            canvas.width = complianceData.width;
            canvas.height = complianceData.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas context failed");

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            let quality = 0.95;
            let blob: Blob | null = null;
            let currentSizeKB = 0;

            for (let i = 0; i < 10; i++) {
                blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
                if (!blob) break;
                currentSizeKB = blob.size / 1024;

                if (currentSizeKB <= complianceData.maxSize && currentSizeKB >= complianceData.minSize) {
                    break;
                }

                if (currentSizeKB > complianceData.maxSize) {
                    quality -= 0.15;
                } else if (currentSizeKB < complianceData.minSize) {
                    quality = Math.min(1.0, quality + 0.05);
                    if (quality >= 1.0) break;
                }
                if (quality < 0.1) break;
            }

            if (blob) {
                const objectUrl = URL.createObjectURL(blob);
                setImage(objectUrl);
                toast.dismiss(tid);
                toast.success("Image optimized for compliance!");
            }
        } catch (e) {
            console.error(e);
            toast.dismiss(tid);
            toast.error("Processing failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = async () => {
        if (!image) return;

        setIsProcessing(true);
        try {
            const img = new Image();
            img.src = image;
            await new Promise(resolve => img.onload = resolve);

            const canvas = document.createElement("canvas");

            let finalWidth = img.width * (transforms.scaleH / 100);
            let finalHeight = img.height * (transforms.scaleV / 100);
            let padding = 0;
            let textStripHeight = 0;

            if (idData.applyWhiteBG) {
                padding = Math.round(finalWidth * 0.05);
                finalWidth += (padding * 2);
                finalHeight += (padding * 2);
            }

            if (idData.showName || idData.showDOB) {
                textStripHeight = Math.round(finalHeight * 0.10);
                finalHeight += textStripHeight;
            }

            canvas.width = finalWidth;
            canvas.height = finalHeight;
            const ctx = canvas.getContext("2d");

            if (!ctx) return;

            if (bgColor !== "transparent") {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px)`;
            ctx.save();
            const imgCenterX = canvas.width / 2;
            const imgCenterY = (canvas.height - textStripHeight) / 2;
            ctx.translate(imgCenterX, imgCenterY);
            ctx.scale(transforms.flipH * (transforms.scaleH / 100), transforms.flipV * (transforms.scaleV / 100));
            ctx.rotate((transforms.rotation * Math.PI) / 180);
            ctx.transform(1, Math.tan((transforms.skewV * Math.PI) / 180), Math.tan((transforms.skewH * Math.PI) / 180), 1, 0, 0);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            ctx.restore();

            if (idData.showName || idData.showDOB) {
                const stripY = canvas.height - textStripHeight;
                ctx.fillStyle = "white";
                ctx.fillRect(0, stripY, canvas.width, textStripHeight);
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                if (idData.showName && idData.showDOB) {
                    ctx.font = `900 ${Math.round(textStripHeight * 0.45)}px Inter, sans-serif`;
                    ctx.fillStyle = "#000000";
                    ctx.fillText(idData.studentName.toUpperCase(), canvas.width / 2, stripY + (textStripHeight * 0.4));
                    ctx.font = `600 ${Math.round(textStripHeight * 0.25)}px Inter, sans-serif`;
                    ctx.fillText(idData.studentDOB, canvas.width / 2, stripY + (textStripHeight * 0.75));
                } else if (idData.showName) {
                    ctx.font = `900 ${Math.round(textStripHeight * 0.5)}px Inter, sans-serif`;
                    ctx.fillStyle = "#000000";
                    ctx.fillText(idData.studentName.toUpperCase(), canvas.width / 2, stripY + (textStripHeight * 0.5));
                } else if (idData.showDOB) {
                    ctx.font = `600 ${Math.round(textStripHeight * 0.5)}px Inter, sans-serif`;
                    ctx.fillStyle = "#000000";
                    ctx.fillText(idData.studentDOB, canvas.width / 2, stripY + (textStripHeight * 0.5));
                }
            }

            const result = canvas.toDataURL("image/jpeg", 0.95);
            const link = document.createElement("a");
            link.download = `photo-edit-${Date.now()}.jpg`;
            link.href = result;
            link.click();
            toast.success("Downloaded successfully!");
        } catch (e) {
            toast.error("Download failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    const updateFilter = (key: keyof typeof filters, value: number) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const updateTransform = (key: keyof typeof transforms, value: number | boolean) => {
        setTransforms(prev => ({ ...prev, [key]: value }));
    };

    const filterString = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px)`;
    const transformString = `
        scale(${zoom})
        scaleX(${transforms.flipH * (transforms.scaleH / 100)}) 
        scaleY(${transforms.flipV * (transforms.scaleV / 100)}) 
        rotate(${transforms.rotation}deg)
        skew(${transforms.skewH}deg, ${transforms.skewV}deg)
    `;

    return (
        <PhotoEditorContext.Provider value={{
            image, setImage, fileName, isProcessing, processingProgress, currentImageInfo,
            filters, setFilters, updateFilter, transforms, setTransforms, updateTransform, idData, setIdData,
            complianceData, setComplianceData, bgColor, setBgColor,
            aspect, setAspect, crop, setCrop, zoom, setZoom,
            showCropper, setShowCropper, fileInputRef,
            handleFileChange, resetAll, resetComplianceToDefaults,
            onCropComplete, handleRemoveBackground, handleApplyCrop,
            handleDeleteSelection, handleProcess, handleDownload,
            filterString, transformString, validationResults,
            isEraserActive, setIsEraserActive
        }}>
            {children}
        </PhotoEditorContext.Provider>
    );
}

export function usePhotoEditor() {
    const context = useContext(PhotoEditorContext);
    if (context === undefined) {
        throw new Error("usePhotoEditor must be used within a PhotoEditorProvider");
    }
    return context;
}
