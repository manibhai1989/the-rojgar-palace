"use client";

import { usePhotoEditor } from "../context/PhotoEditorContext";
import { EditorShell } from "../components/EditorShell";
import { SelectionPanel } from "../components/SelectionPanel";

export default function CropPage() {
    const {
        image, aspect, setAspect, showCropper, setShowCropper,
        handleApplyCrop, handleDeleteSelection
    } = usePhotoEditor() as any;

    return (
        <EditorShell>
            <div className="space-y-6">

                <SelectionPanel
                    aspect={aspect}
                    setAspect={setAspect}
                    showCropper={showCropper}
                    setShowCropper={setShowCropper}
                    handleApplyCrop={handleApplyCrop}
                    handleDeleteSelection={handleDeleteSelection}
                    hasImage={!!image}
                />
            </div>
        </EditorShell>
    );
}
