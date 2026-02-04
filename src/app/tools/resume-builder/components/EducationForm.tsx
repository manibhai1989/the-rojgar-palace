import React from "react";
import { useResume } from "../context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function EducationForm() {
    const { resumeData, addEducation, removeEducation, updateEducation } = useResume();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Education</h2>
                <Button onClick={addEducation} size="sm" className="bg-blue-600 hover:bg-blue-500">
                    <Plus className="w-4 h-4 mr-2" /> Add School
                </Button>
            </div>

            <div className="space-y-6">
                {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                        <div className="flex justify-between">
                            <h3 className="font-bold text-slate-300">School #{index + 1}</h3>
                            <Button variant="ghost" size="icon" onClick={() => removeEducation(edu.id)} className="text-red-400 hover:bg-red-400/10 hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label>Institution Name</Label>
                            <Input
                                value={edu.school}
                                onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                                placeholder="e.g. Harvard University"
                                className="bg-black/20 border-white/10 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Degree</Label>
                                <Input
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                    placeholder="e.g. B.Sc. Computer Science"
                                    className="bg-black/20 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Year/Duration</Label>
                                <Input
                                    value={edu.year}
                                    onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                                    placeholder="e.g. 2020 - 2024"
                                    className="bg-black/20 border-white/10 text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Score / GPA (Optional)</Label>
                            <Input
                                value={edu.score}
                                onChange={(e) => updateEducation(edu.id, "score", e.target.value)}
                                placeholder="e.g. 3.8/4.0 or 85%"
                                className="bg-black/20 border-white/10 text-white"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
