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
            <CardContent className="p-0 flex flex-col md:flex-row h-[700px]">
                {/* Helper Sidebar */}
                <div className="w-full md:w-64 bg-muted/20 border-r p-4 space-y-6 overflow-y-auto">
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
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-[10px] text-blue-800">
                        <p className="font-bold">Pro Tip:</p>
                        Keep your Graduation Marksheets and Category certificate ready before starting.
                    </div>
                </div>

                {/* Iframe Viewport */}
                <div className="flex-1 relative bg-white">
                    {iframeBlock ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-muted/5">
                            <Sidebar className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-bold">Portal blocked by provider</h3>
                            <p className="text-muted-foreground text-sm max-w-sm mt-2">
                                For security reasons, the official portal does not allow being viewed inside another website. Please use the button below to apply in a professional window.
                            </p>
                            <Button className="mt-6 bg-govt-saffron hover:bg-orange-600" asChild>
                                <a href={officialUrl} target="_blank" rel="noopener noreferrer">
                                    Apply on Official Website
                                </a>
                            </Button>
                        </div>
                    ) : (
                        <iframe
                            src={officialUrl}
                            className="w-full h-full border-none"
                            title="Official Portal"
                            onError={() => setIframeBlock(true)}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
