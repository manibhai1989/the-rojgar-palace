"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, CheckCircle2 } from "lucide-react";

interface DocumentChecklistProps {
    category: string;
}

export function DocumentChecklist({ category }: DocumentChecklistProps) {
    const documents = [
        { id: "photo", label: "Recent Passport Size Photograph (Color, 20-50KB)", required: true },
        { id: "sign", label: "Scanned Signature (Black Ink, 10-20KB)", required: true },
        { id: "id_proof", label: "Identity Proof (Aadhar/Voter ID/Driving License)", required: true },
        { id: "grad", label: "Graduation Degree/Mark Sheet", required: true },
        { id: "caste", label: "Category/Caste Certificate (if applicable)", required: category !== "UR" },
        { id: "pwd", label: "PWD Certificate (if applicable)", required: false },
    ];

    return (
        <Card className="shadow-md">
            <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-lg flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" /> Personalized Checklist
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4">
                    {documents.map((doc) => (
                        <div key={doc.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <Checkbox id={doc.id} />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor={doc.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {doc.label}
                                </label>
                                {doc.required && (
                                    <span className="text-[10px] text-red-500 font-bold uppercase">Required</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-col space-y-2">
                    <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Download All Templates
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground mt-2">
                        Checklist generated based on your profile for {category} category
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
