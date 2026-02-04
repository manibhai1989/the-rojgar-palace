import React from "react";
import { useResume } from "../context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function SkillsForm() {
    const { resumeData, updateSkills, addProject, updateProject, removeProject } = useResume();

    const handleSkillsChange = (val: string) => {
        // Split by comma and clean up whitespace
        const skillsArray = val.split(',').map(s => s.trim()).filter(s => s !== "");
        updateSkills(skillsArray);
    };

    return (
        <div className="space-y-8">
            {/* Skills Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Skills</h2>
                <div className="space-y-2">
                    <Label>Key Skills (Comma Separated)</Label>
                    <Textarea
                        defaultValue={resumeData.skills.join(", ")}
                        onBlur={(e) => handleSkillsChange(e.target.value)}
                        placeholder="Java, Python, React, Leadership, Public Speaking..."
                        className="bg-white/5 border-white/10 text-white min-h-[80px]"
                    />
                </div>
            </div>

            <div className="w-full h-px bg-white/10" />

            {/* Projects Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Projects</h2>
                    <Button onClick={addProject} size="sm" className="bg-blue-600 hover:bg-blue-500">
                        <Plus className="w-4 h-4 mr-2" /> Add Project
                    </Button>
                </div>

                <div className="space-y-6">
                    {resumeData.projects.map((proj, index) => (
                        <div key={proj.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                            <div className="flex justify-between">
                                <h3 className="font-bold text-slate-300">Project #{index + 1}</h3>
                                <Button variant="ghost" size="icon" onClick={() => removeProject(proj.id)} className="text-red-400 hover:bg-red-400/10 hover:text-red-300">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Project Title</Label>
                                    <Input
                                        value={proj.title}
                                        onChange={(e) => updateProject(proj.id, "title", e.target.value)}
                                        placeholder="e.g. E-Commerce App"
                                        className="bg-black/20 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Link (Optional)</Label>
                                    <Input
                                        value={proj.link}
                                        onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                                        placeholder="e.g. github.com/my-project"
                                        className="bg-black/20 border-white/10 text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={proj.description}
                                    onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                                    placeholder="Brief details about the project stack and outcome..."
                                    className="bg-black/20 border-white/10 text-white"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
