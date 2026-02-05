"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Lock, Sidebar, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ApplicationIframeProps {
    officialUrl: string;
}

export function ApplicationIframe({ officialUrl }: ApplicationIframeProps) {
    const [iframeBlock, setIframeBlock] = React.useState(false);

    return (
        <Card className="border-t-4 border-t-govt-saffron shadow-lg overflow-hidden">
            <CardHeader className="bg-muted/10">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl flex items-center">
                            <Lock className="mr-2 h-5 w-5 text-green-600" /> Secure Application Portal
                        </CardTitle>
                        <CardDescription>
                            Applying for Union Public Service Commission (UPSC)
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <a href={officialUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" /> Open in New Tab
                        </a>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col md:flex-row h-auto md:h-[400px]">
                {/* Helper Sidebar */}
                <div className="w-full md:w-64 bg-muted/20 border-r p-4 space-y-6 overflow-y-auto hidden md:block">
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center">
                            <Info className="mr-1 h-3 w-3" /> Quick Help
                        </h4>
                        <ul className="text-xs space-y-3">
                            <li className="p-2 bg-white rounded border shadow-sm">
                                <strong>Step 1:</strong> One Time Registration (OTR) is mandatory.
                            </li>
                            <li className="p-2 bg-white rounded border shadow-sm">
                                <strong>Step 2:</strong> Upload documents carefully in specified dimensions.
                            </li>
                            <li className="p-2 bg-white rounded border shadow-sm">
                                <strong>Step 3:</strong> Pay fee only through official gateway.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Secure Redirect Viewport */}
                <div className="flex-1 relative bg-white flex flex-col items-center justify-center p-8 text-center space-y-6">
                    <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                        <Lock className="h-10 w-10 text-blue-600" />
                    </div>

                    <div className="max-w-md space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">Proceed to Official Portal</h3>
                        <p className="text-slate-500">
                            You are about to utilize the external secure application portal. Please ensure you have your documents ready.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-sm">
                        <Button className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" asChild>
                            <a href={officialUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-5 w-5" />
                                Launch Application Portal
                            </a>
                        </Button>
                        <p className="text-[10px] text-muted-foreground text-center">
                            Opens in a new secure window
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
