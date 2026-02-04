"use client";

import { usePhotoEditor } from "../context/PhotoEditorContext";
import { EditorShell } from "../components/EditorShell";
import { IDMakerPanel } from "../components/IDMakerPanel";

export default function IDMakerPage() {
    const { idData, setIdData } = usePhotoEditor() as any;

    return (
        <EditorShell>
            <div className="space-y-6">

                <IDMakerPanel idData={idData} setIdData={setIdData} />
            </div>
        </EditorShell>
    );
}
