"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
    className?: string;
    showMeteors?: boolean;
    meteorCount?: number;
    starCount?: number;
}

export function AnimatedBackground({
    className,
    showMeteors = true,
    meteorCount = 20,
    starCount = 50
}: AnimatedBackgroundProps) {
    const [meteors, setMeteors] = useState<Array<{ left: string, delay: string, duration: string }>>([]);
    const [stars, setStars] = useState<Array<{ top: string, left: string, delay: string, size: string, duration: string }>>([]);

    useEffect(() => {
        // Generate Meteors
        const generatedMeteors = new Array(meteorCount).fill(true).map(() => ({
            left: Math.floor(Math.random() * 100) + "%",
            delay: Math.random() * 1 + 0.2 + "s",
            duration: Math.floor(Math.random() * 8 + 2) + "s",
        }));
        setMeteors(generatedMeteors);

        // Generate Stars
        const generatedStars = new Array(starCount).fill(true).map(() => ({
            top: Math.floor(Math.random() * 100) + "%",
            left: Math.floor(Math.random() * 100) + "%",
            delay: Math.random() * 5 + "s",
            size: Math.random() > 0.5 ? "w-0.5 h-0.5" : "w-1 h-1",
            duration: Math.random() * 3 + 2 + "s"
        }));
        setStars(generatedStars);
    }, [meteorCount, starCount]);

    return (
        <div className={cn("absolute inset-0 z-0 overflow-hidden pointer-events-none", className)}>
            {/* Deep Dark Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-black transition-colors duration-500" />

            {/* Radial Glow Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0)_0%,rgba(17,24,39,0.05)_100%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0)_0%,rgba(17,24,39,0.5)_100%)]" />

            {/* Stars */}
            {stars.map((star, idx) => (
                <div
                    key={"star" + idx}
                    className={cn(
                        "absolute rounded-full bg-slate-300 dark:bg-white animate-twinkle opacity-70",
                        star.size
                    )}
                    style={{
                        top: star.top,
                        left: star.left,
                        animationDelay: star.delay,
                        animationDuration: star.duration
                    }}
                />
            ))}

            {/* Meteors */}
            {showMeteors && meteors.map((meteor, idx) => (
                <span
                    key={"meteor" + idx}
                    className={cn(
                        "absolute top-0 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-400 dark:bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
                        "animate-meteor"
                    )}
                    style={{
                        top: 0,
                        left: meteor.left,
                        animationDelay: meteor.delay,
                        animationDuration: meteor.duration,
                    }}
                >
                    {/* Meteor Tail */}
                    <div className="pointer-events-none absolute top-1/2 -z-10 h-[1px] w-[50px] -translate-y-1/2 bg-gradient-to-r from-slate-400 to-transparent dark:from-slate-500" />
                </span>
            ))}

            {/* Grid Overlay for Tech Feel */}
            <div
                className="absolute inset-0 opacity-[0.2]"
                style={{
                    backgroundImage: `linear-gradient(to right, #4f4f4f2e 1px, transparent 1px),
                                      linear-gradient(to bottom, #4f4f4f2e 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
                }}
            />
        </div>
    );
}
