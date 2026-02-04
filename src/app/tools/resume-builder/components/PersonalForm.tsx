import React from "react";
import { useResume } from "../context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PersonalForm() {
    const { resumeData, updatePersonal } = useResume();

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Personal Details</h2>

            <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                    value={resumeData.personal.fullName}
                    onChange={(e) => updatePersonal("fullName", e.target.value)}
                    placeholder="e.g. John Doe"
                    className="bg-white/5 border-white/10 text-white"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                        value={resumeData.personal.email}
                        onChange={(e) => updatePersonal("email", e.target.value)}
                        placeholder="john@example.com"
                        className="bg-white/5 border-white/10 text-white"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                        value={resumeData.personal.phone}
                        onChange={(e) => updatePersonal("phone", e.target.value)}
                        placeholder="+1 234 567 890"
                        className="bg-white/5 border-white/10 text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>LinkedIn (Optional)</Label>
                    <Input
                        value={resumeData.personal.linkedin}
                        onChange={(e) => updatePersonal("linkedin", e.target.value)}
                        placeholder="linkedin.com/in/john"
                        className="bg-white/5 border-white/10 text-white"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Website (Optional)</Label>
                    <Input
                        value={resumeData.personal.website}
                        onChange={(e) => updatePersonal("website", e.target.value)}
                        placeholder="portfolio.com"
                        className="bg-white/5 border-white/10 text-white"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Professional Summary</Label>
                <Textarea
                    value={resumeData.personal.summary}
                    onChange={(e) => updatePersonal("summary", e.target.value)}
                    placeholder="Briefly describe your professional background and goals..."
                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
            </div>
        </div>
    );
}
