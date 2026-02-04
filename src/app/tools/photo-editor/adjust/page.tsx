"use client";

import { usePhotoEditor } from "../context/PhotoEditorContext";
import { EditorShell } from "../components/EditorShell";
import { AdjustPanel } from "../components/AdjustPanel";

export default function AdjustPage() {
    const { filters, setFilters, transforms, setTransforms, resetAll } = usePhotoEditor() as any;

    return (
        <EditorShell>
            <div className="space-y-6">

                <AdjustPanel
                    filters={filters}
                    setFilters={setFilters}
                    transforms={transforms}
                    setTransforms={setTransforms}
                    resetFilters={resetAll}
                />
            </div>
        </EditorShell>
    );
}
