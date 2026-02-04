"use client";

import { usePhotoEditor } from "../context/PhotoEditorContext";
import { EditorShell } from "../components/EditorShell";
import { AIPanel } from "../components/AIPanel";

export default function AIBGPage() {
    const {
        image, isProcessing, processingProgress,
        handleRemoveBackground, bgColor, setBgColor
    } = usePhotoEditor() as any;

    return (
        <EditorShell>
            <div className="space-y-6">

                <AIPanel
                    isProcessing={isProcessing}
                    processingProgress={processingProgress}
                    handleRemoveBackground={handleRemoveBackground}
                    bgColor={bgColor}
                    setBgColor={setBgColor}
                    hasImage={!!image}
                />
            </div>
        </EditorShell>
    );
}
