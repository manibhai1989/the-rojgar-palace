"use client";

import { usePhotoEditor } from "../context/PhotoEditorContext";
import { EditorShell } from "../components/EditorShell";
import { CompliancePanel } from "../components/CompliancePanel";

export default function CompliancePage() {
    const {
        complianceData, setComplianceData, currentImageInfo,
        handleProcess, isProcessing, resetComplianceToDefaults
    } = usePhotoEditor() as any;

    return (
        <EditorShell>
            <div className="space-y-6">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Exam Compliance</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                        Validation for UPSC, SSC, and GDS standards.
                    </p>
                </div>
                <CompliancePanel
                    complianceData={complianceData}
                    setComplianceData={setComplianceData}
                    currentImageInfo={currentImageInfo}
                    handleProcess={handleProcess}
                    isProcessing={isProcessing}
                    resetToDefaults={resetComplianceToDefaults}
                />
            </div>
        </EditorShell>
    );
}
