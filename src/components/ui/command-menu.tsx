"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DialogProps } from "@radix-ui/react-dialog";
import { Search, Home, Briefcase, FileText, Settings, Moon, Sun, Laptop, IdCard, BookOpen } from "lucide-react";
import { useTheme } from "next-themes";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

export function CommandMenu({ ...props }: DialogProps) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [searchInput, setSearchInput] = React.useState("");
    const { setTheme } = useTheme();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <Button
                variant="outline"
                className="relative h-10 w-10 p-0 xl:h-11 xl:w-64 xl:justify-start xl:px-4 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] xl:text-slate-300"
                onClick={() => setOpen(true)}
                aria-label="Search website"
            >
                <Search className="h-4 w-4 xl:mr-2 text-cyan-400" />
                <span className="hidden xl:inline-flex text-sm">Search job, admit card...</span>
                <kbd className="pointer-events-none absolute right-2 top-2.5 hidden h-6 select-none items-center gap-1 rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 font-mono text-[11px] font-medium text-cyan-400 xl:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type to search..." />
                <CommandList>
                    <CommandEmpty>
                        <div className="flex flex-col items-center justify-center p-4">
                            <p className="text-sm text-muted-foreground mb-2">No command found.</p>
                        </div>
                    </CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => runCommand(() => router.push("/jobs"))}>
                            <Briefcase className="mr-2 h-4 w-4" />
                            <span>Latest Jobs</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/results"))}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>View Results</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/admit-cards"))}>
                            <IdCard className="mr-2 h-4 w-4" />
                            <span>Download Admit Cards</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/syllabus"))}>
                            <BookOpen className="mr-2 h-4 w-4" />
                            <span>Syllabus</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/admin"))}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Search">
                        <CommandItem onSelect={() => {
                            // This is a fallback to allow searching for anything typed in the input
                            // Note: In a real implementation, we might want to capture the input value state
                            // But since CommandInput doesn't expose it easily without state, 
                            // we rely on the user navigating to the main search page for robust searching.
                            const input = document.querySelector('input[cmdk-input]') as HTMLInputElement;
                            if (input?.value) {
                                runCommand(() => router.push(`/search?q=${encodeURIComponent(input.value)}`));
                            } else {
                                runCommand(() => router.push('/search'));
                            }
                        }}>
                            <Search className="mr-2 h-4 w-4" />
                            <span>Search Website</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Theme">
                        <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
                            <Sun className="mr-2 h-4 w-4" />
                            <span>Light</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Dark</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
                            <Laptop className="mr-2 h-4 w-4" />
                            <span>System</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
