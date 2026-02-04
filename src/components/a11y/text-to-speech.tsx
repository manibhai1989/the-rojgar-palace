"use client";

import * as React from "react";
import { Volume2, Loader2, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextToSpeechProps {
    text: string;
    className?: string;
}

export function TextToSpeech({ text, className }: TextToSpeechProps) {
    const [isSpeaking, setIsSpeaking] = React.useState(false);

    React.useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const speak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to pick a natural voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google")) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={speak}
            className={className}
            aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
        >
            {isSpeaking ? (
                <StopCircle className="h-4 w-4 animate-pulse text-primary" />
            ) : (
                <Volume2 className="h-4 w-4 text-muted-foreground" />
            )}
        </Button>
    );
}
