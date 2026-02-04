"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Education {
    id: string;
    school: string;
    degree: string;
    year: string;
    score: string;
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    duration: string;
    description: string;
}

export interface Project {
    id: string;
    title: string;
    link: string;
    description: string;
}

export interface ResumeData {
    personal: {
        fullName: string;
        email: string;
        phone: string;
        linkedin: string;
        website: string;
        summary: string;
    };
    education: Education[];
    experience: Experience[];
    skills: string[];
    projects: Project[];
}

interface ResumeContextType {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
    addEducation: () => void;
    removeEducation: (id: string) => void;
    updateEducation: (id: string, field: keyof Education, value: string) => void;
    addExperience: () => void;
    removeExperience: (id: string) => void;
    updateExperience: (id: string, field: keyof Experience, value: string) => void;
    addProject: () => void;
    removeProject: (id: string) => void;
    updateProject: (id: string, field: keyof Project, value: string) => void;
    updatePersonal: (field: keyof ResumeData['personal'], value: string) => void;
    updateSkills: (skills: string[]) => void;
    jobDescription: string;
    setJobDescription: (jd: string) => void;
    atsScore: number;
    suggestions: string[];
    templateId: string;
    setTemplateId: (id: string) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

import { ATSScanner } from "../lib/ats-scanner";

export function ResumeProvider({ children }: { children: React.ReactNode }) {
    const scanner = new ATSScanner();

    const [resumeData, setResumeData] = useState<ResumeData>({
        personal: {
            fullName: "",
            email: "",
            phone: "",
            linkedin: "",
            website: "",
            summary: "",
        },
        education: [
            { id: "1", school: "", degree: "", year: "", score: "" }
        ],
        experience: [],
        skills: [],
        projects: [],
    });

    const [jobDescription, setJobDescription] = useState("");
    const [atsScore, setAtsScore] = useState(0);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [templateId, setTemplateId] = useState("classic");

    // Auto-calculate ATS Score when data changes (Debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            const result = scanner.calculateScore(resumeData, jobDescription);
            setAtsScore(result.score);
            setSuggestions(result.suggestions);
        }, 1000); // Wait 1s after typing stops

        return () => clearTimeout(timer);
    }, [resumeData, jobDescription]);

    const updatePersonal = (field: keyof ResumeData['personal'], value: string) => {
        setResumeData(prev => ({
            ...prev,
            personal: { ...prev.personal, [field]: value }
        }));
    };

    const addEducation = () => {
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, { id: Date.now().toString(), school: "", degree: "", year: "", score: "" }]
        }));
    };

    const removeEducation = (id: string) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.filter(e => e.id !== id)
        }));
    };

    const updateEducation = (id: string, field: keyof Education, value: string) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e)
        }));
    };

    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [...prev.experience, { id: Date.now().toString(), company: "", role: "", duration: "", description: "" }]
        }));
    };

    const removeExperience = (id: string) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.filter(e => e.id !== id)
        }));
    };

    const updateExperience = (id: string, field: keyof Experience, value: string) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
        }));
    };

    const addProject = () => {
        setResumeData(prev => ({
            ...prev,
            projects: [...prev.projects, { id: Date.now().toString(), title: "", link: "", description: "" }]
        }));
    };

    const removeProject = (id: string) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.filter(p => p.id !== id)
        }));
    };

    const updateProject = (id: string, field: keyof Project, value: string) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
        }));
    };

    const updateSkills = (skills: string[]) => {
        setResumeData(prev => ({ ...prev, skills }));
    };

    return (
        <ResumeContext.Provider value={{
            resumeData, setResumeData,
            addEducation, removeEducation, updateEducation,
            addExperience, removeExperience, updateExperience,
            addProject, removeProject, updateProject,
            updatePersonal, updateSkills,
            jobDescription, setJobDescription,
            atsScore, suggestions,
            templateId, setTemplateId
        }}>
            {children}
        </ResumeContext.Provider>
    );
}

export function useResume() {
    const context = useContext(ResumeContext);
    if (!context) {
        throw new Error("useResume must be used within a ResumeProvider");
    }
    return context;
}
