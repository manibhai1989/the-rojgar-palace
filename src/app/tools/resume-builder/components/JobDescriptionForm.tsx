import React from "react";
import { useResume } from "../context/ResumeContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function JobDescriptionForm() {
    const { jobDescription, setJobDescription } = useResume();

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-2">Target Job Description</h2>
            <p className="text-sm text-slate-400 mb-4">Paste the job description here. Our AI will analyze your resume against keywords to improve your match score.</p>

            <div className="space-y-2">
                <Label>Job Description / Key Requirements</Label>
                <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the JD here (e.g. 'Looking for a React Developer with 3 years of experience...')"
                    className="bg-white/5 border-white/10 text-white min-h-[300px] font-mono text-sm leading-relaxed"
                />
            </div>
        </div>
    );
}
