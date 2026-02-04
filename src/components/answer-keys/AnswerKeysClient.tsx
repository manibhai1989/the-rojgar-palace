"use client";

import { useState, useEffect, useTransition } from "react";
import { Search, Key, ExternalLink, Loader2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { searchAnswerKeys } from "@/app/answer-keys/actions";

interface AnswerKeysClientProps {
    initialAnswerKeys: any[];
}

export default function AnswerKeysClient({ initialAnswerKeys }: AnswerKeysClientProps) {
    const [answerKeys, setAnswerKeys] = useState(initialAnswerKeys);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSearch = async (query: string) => {
        startTransition(async () => {
            const res = await searchAnswerKeys(query);
            if (res.success) {
                setAnswerKeys(res.answerKeys || []);
            }
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <div className="space-y-12">
            <div className="sticky top-20 z-30 p-2 bg-white/80 dark:bg-slate-950/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <Input
                        placeholder="Search for answer keys by exam name or organization..."
                        className="w-full bg-slate-50 dark:bg-white/5 border-none h-14 pl-12 focus-visible:ring-0 text-lg text-slate-900 dark:text-white placeholder:text-slate-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isPending && answerKeys.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-50">
                        <Loader2 className="w-12 h-12 animate-spin text-amber-500 mb-4" />
                        <p className="text-slate-600 dark:text-slate-400">Searching for answer keys...</p>
                    </div>
                ) : answerKeys.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        {answerKeys.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                layout
                            >
                                <Card className="group bg-white dark:bg-slate-900/40 border-slate-200 dark:border-white/5 hover:border-amber-500/30 hover:shadow-lg dark:hover:shadow-none backdrop-blur-md transition-all h-full flex flex-col overflow-hidden">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                                <Key className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ANSWER KEY</span>
                                        </div>
                                        <h3 className="text-xl font-bold leading-tight text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{item.organization}</p>
                                    </CardHeader>

                                    <CardContent className="flex-1">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>Posted: {format(new Date(item.createdAt), "dd MMM yyyy")}</span>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="bg-slate-50 dark:bg-amber-500/5 border-t border-slate-100 dark:border-white/5 p-4">
                                        <Button
                                            asChild
                                            className="w-full bg-amber-100/50 dark:bg-amber-600/20 hover:bg-amber-600 text-amber-700 dark:text-amber-400 hover:text-white border border-amber-500/30 font-bold transition-all"
                                        >
                                            <a href={item.link} target="_blank">
                                                View Answer Key
                                                <ExternalLink className="w-4 h-4 ml-2" />
                                            </a>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="col-span-full py-40 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 mb-6">
                            <Search className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">No answer keys found</h3>
                        <p className="text-slate-500">Try searching for a different keyword.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
