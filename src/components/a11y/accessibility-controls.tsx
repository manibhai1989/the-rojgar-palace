"use client";

import * as React from "react";
import { Settings, Eye, ZoomIn, ZoomOut, RotateCcw, Monitor, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/language-context";

export function AccessibilityControls() {
    const { t } = useLanguage();
    const [fontSize, setFontSize] = React.useState(100);
    const [highContrast, setHighContrast] = React.useState(false);

    const [isMounted, setIsMounted] = React.useState(false);

    // Apply accessibility settings
    React.useEffect(() => {
        setIsMounted(true);
        const root = document.documentElement;
        root.style.fontSize = `${fontSize}%`;

        if (highContrast) {
            root.classList.add("high-contrast");
        } else {
            root.classList.remove("high-contrast");
        }
    }, [fontSize, highContrast]);

    const resetSettings = () => {
        setFontSize(100);
        setHighContrast(false);
    };

    if (!isMounted) return null;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size="icon"
                    className="fixed bottom-6 left-6 z-50 rounded-full h-12 w-12 shadow-2xl bg-black text-white hover:scale-110 transition-transform"
                    aria-label={t("a11y.controls")}
                >
                    <Eye className="h-6 w-6" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 ml-6 mb-2 rounded-2xl shadow-xl border-2" side="right" align="end">
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h4 className="font-black uppercase tracking-widest text-xs flex items-center">
                            <Settings className="mr-2 h-4 w-4" /> {t("a11y.controls")}
                        </h4>
                        <Button variant="ghost" size="sm" onClick={resetSettings} className="h-6 text-[10px] uppercase font-bold text-muted-foreground hover:text-red-500">
                            <RotateCcw className="mr-1 h-3 w-3" /> {t("a11y.reset")}
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-bold flex items-center">
                                <Type className="mr-2 h-4 w-4 text-muted-foreground" /> {t("a11y.textSize")}
                            </Label>
                            <span className="text-xs font-black bg-muted px-2 py-1 rounded">{fontSize}%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ZoomOut className="h-4 w-4 text-muted-foreground" />
                            <Slider
                                value={[fontSize]}
                                min={80}
                                max={150}
                                step={5}
                                onValueChange={(val) => setFontSize(val[0])}
                                className="flex-1"
                            />
                            <ZoomIn className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold flex items-center">
                            <Monitor className="mr-2 h-4 w-4 text-muted-foreground" /> {t("a11y.contrast")}
                        </Label>
                        <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                    </div>

                    <div className="bg-yellow-100 p-3 rounded-xl border border-yellow-200">
                        <p className="text-[10px] font-medium text-yellow-800 leading-tight">
                            <strong>Note:</strong> High Contrast mode forces a yellow-on-black theme for maximum readability.
                        </p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
