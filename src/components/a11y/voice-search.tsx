"use client";

import * as React from "react";
import { Mic, MicOff, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

interface VoiceSearchProps {
    onSearch: (query: string) => void;
}

export function VoiceSearch({ onSearch }: VoiceSearchProps) {
    const { t } = useLanguage();
    const [isListening, setIsListening] = React.useState(false);
    const [transcript, setTranscript] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);

    // Check browser support
    const recognitionRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
            // @ts-ignore
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onend = () => setIsListening(false);

            recognitionRef.current.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0])
                    .map((result) => result.transcript)
                    .join("");

                setTranscript(transcript);

                if (event.results[0].isFinal) {
                    setTimeout(() => {
                        onSearch(transcript);
                        setIsOpen(false);
                    }, 1000);
                }
            };
        }
    }, [onSearch]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setTranscript("");
            recognitionRef.current?.start();
        }
    };

    if (typeof window !== "undefined" && !("webkitSpeechRecognition" in window)) {
        return null; // Hide if not supported
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="relative"
            >
                <Mic className="h-5 w-5" />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl font-black uppercase italic tracking-tighter">
                            {t("a11y.voiceSearch")}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center py-10 space-y-8">
                        <div
                            className={cn(
                                "h-24 w-24 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer",
                                isListening ? "bg-red-100 text-red-600 scale-110 shadow-xl shadow-red-200" : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                            onClick={toggleListening}
                        >
                            {isListening ? (
                                <Mic className="h-10 w-10 animate-pulse" />
                            ) : (
                                <MicOff className="h-10 w-10" />
                            )}
                        </div>

                        <div className="text-center space-y-2 min-h-[3rem]">
                            {isListening ? (
                                <>
                                    <p className="font-bold text-lg animate-pulse">{t("a11y.voiceSearchListening")}</p>
                                    <p className="text-muted-foreground text-sm font-medium">{transcript || "Speak now..."}</p>
                                </>
                            ) : (
                                <p className="text-muted-foreground text-sm font-medium">Click microphone to start speaking</p>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
