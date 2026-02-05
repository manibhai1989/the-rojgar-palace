import React from "react";
import { useResume } from "../context/ResumeContext";

export function ResumePreview() {
    const { resumeData, templateId } = useResume();
    const data = resumeData;

    const isModern = templateId === "modern";

    return (
        <div id="resume-preview" className={`p-[20mm] h-full ${isModern ? 'font-sans text-slate-900' : 'font-serif text-black'}`}>

            {/* Header */}
            <div className={`${isModern ? 'text-left border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-end' : 'text-center border-b border-black pb-4 mb-4'}`}>
                <div>
                    <h1 className={`${isModern ? 'text-4xl font-black tracking-tighter' : 'text-3xl font-bold uppercase tracking-wide mb-2'}`}>
                        {data.personal.fullName || "YOUR NAME"}
                    </h1>
                    {isModern && <div className="text-lg font-medium text-slate-600 mt-1">{data.personal.summary ? data.personal.summary.substring(0, 60) + (data.personal.summary.length > 60 ? '...' : '') : 'Professional Role'}</div>}
                </div>

                <div className={`${isModern ? 'text-right space-y-1 text-sm' : 'flex flex-wrap justify-center gap-3 text-sm text-gray-800'}`}>
                    <div className={isModern ? '' : 'inline'}>{data.personal.email} {isModern ? '' : '•'}</div>
                    <div className={isModern ? '' : 'inline'}> {data.personal.phone} {isModern ? '' : '•'}</div>
                    <div className={isModern ? '' : 'inline'}> {data.personal.linkedin} {isModern ? '' : '•'}</div>
                    <div className={isModern ? '' : 'inline'}> {data.personal.website}</div>
                </div>
            </div>

            {/* Summary (Classic only handles it here, Modern handles it in header or separate) */}
            {!isModern && data.personal.summary && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Professional Summary</h2>
                    <p className="text-justify">{data.personal.summary}</p>
                </div>
            )}

            {isModern && data.personal.summary && (
                <div className="mb-6">
                    <p className="text-slate-700 leading-relaxed">{data.personal.summary}</p>
                </div>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <div className="mb-6">
                    <h2 className={`text-sm font-bold uppercase ${isModern ? 'tracking-widest text-slate-500 mb-4' : 'border-b border-black mb-2'}`}>Experience</h2>
                    <div className="space-y-4">
                        {data.experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className={`font-bold ${isModern ? 'text-lg text-slate-900' : ''}`}>{exp.company}</span>
                                    <span className={`${isModern ? 'text-slate-500 text-sm font-medium' : 'font-bold'}`}>{exp.duration}</span>
                                </div>
                                <div className={`italic mb-2 ${isModern ? 'text-blue-600 not-italic font-semibold' : ''}`}>{exp.role}</div>
                                <ul className="list-disc list-inside text-sm pl-2 space-y-1">
                                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                        <li key={i} className="text-slate-700">{line}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <div className="mb-6">
                    <h2 className={`text-sm font-bold uppercase ${isModern ? 'tracking-widest text-slate-500 mb-4' : 'border-b border-black mb-2'}`}>Education</h2>
                    <div className="space-y-3">
                        {data.education.map((edu) => (
                            <div key={edu.id} className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-base">{edu.school}</div>
                                    <div className={`${isModern ? 'text-slate-600' : 'italic'}`}>{edu.degree}</div>
                                </div>
                                <div className="text-right">
                                    <div className={`${isModern ? 'text-slate-500 font-medium' : 'font-bold'}`}>{edu.year}</div>
                                    {edu.score && <div className="text-xs text-slate-500">GPA/Grade: {edu.score}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <div className="mb-6">
                    <h2 className={`text-sm font-bold uppercase ${isModern ? 'tracking-widest text-slate-500 mb-4' : 'border-b border-black mb-2'}`}>Skills</h2>
                    <div className="flex flex-wrap gap-x-2 gap-y-2">
                        {data.skills.map((skill, i) => (
                            <span key={i} className={`${isModern ? 'bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-700' : 'bg-gray-100 px-2 rounded-sm border border-gray-200'}`}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
                <div className="mb-6">
                    <h2 className={`text-sm font-bold uppercase ${isModern ? 'tracking-widest text-slate-500 mb-4' : 'border-b border-black mb-2'}`}>Projects</h2>
                    <div className="space-y-4">
                        {data.projects.map((proj) => (
                            <div key={proj.id} className={isModern ? "bg-slate-50 p-4 rounded-lg" : ""}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold">{proj.title}</span>
                                    {proj.link && <a href={proj.link} className="text-blue-800 underline text-xs">{proj.link}</a>}
                                </div>
                                <p className="text-sm text-slate-700">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Watermark */}
            <div className="absolute bottom-2 right-4 text-[10px] text-slate-400 font-sans opacity-50 select-none print:opacity-100">
                Created with The Job Palace
            </div>

        </div>
    );
}
