"use client";

import * as React from "react";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";

type Locale = "en" | "hi";
type Translations = typeof en;

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = React.useState<Locale>("en");

    // Persist preference
    React.useEffect(() => {
        const saved = localStorage.getItem("language") as Locale;
        if (saved) setLocale(saved);
    }, []);

    const handleSetLocale = (newLocale: Locale) => {
        setLocale(newLocale);
        localStorage.setItem("language", newLocale);
        document.documentElement.lang = newLocale;
    };

    const t = (path: string): string => {
        const keys = path.split(".");
        let current: any = locale === "en" ? en : hi;

        for (const key of keys) {
            if (current[key] === undefined) return path;
            current = current[key];
        }

        return current as string;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = React.useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
