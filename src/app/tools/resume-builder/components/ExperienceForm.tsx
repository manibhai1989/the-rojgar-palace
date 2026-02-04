import React from "react";
import { useResume } from "../context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function ExperienceForm() {
    const { resumeData, addExperience, removeExperience, updateExperience } = useResume();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Work Experience</h2>
                <Button onClick={addExperience} size="sm" className="bg-blue-600 hover:bg-blue-500">
                    <Plus className="w-4 h-4 mr-2" /> Add Job
                </Button>
            </div>

            <div className="space-y-6">
                {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                        <div className="flex justify-between">
                            <h3 className="font-bold text-slate-300">Role #{index + 1}</h3>
                            <Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)} className="text-red-400 hover:bg-red-400/10 hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Company Name</Label>
                                <Input
                                    value={exp.company}
                                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                    placeholder="e.g. Google"
                                    className="bg-black/20 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Role / Title</Label>
                                <Input
                                    value={exp.role}
                                    onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                                    placeholder="e.g. Software Engineer"
                                    className="bg-black/20 border-white/10 text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input
                                value={exp.duration}
                                onChange={(e) => updateExperience(exp.id, "duration", e.target.value)}
                                placeholder="e.g. Jan 2022 - Present"
                                className="bg-black/20 border-white/10 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Description / Bullets</Label>
                            <Textarea
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                                placeholder="• Led a team of 5 developers...&#10;• Improved performance by 30%..."
                                className="bg-black/20 border-white/10 text-white min-h-[120px]"
                            />
                            <p className="text-[10px] text-slate-500">Use hyphens or bullets for lists. Each line will be a bullet point.</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
