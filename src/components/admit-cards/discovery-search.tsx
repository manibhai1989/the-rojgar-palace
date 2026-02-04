"use client";

import * as React from "react";
import { Search, Hash, Calendar, Fingerprint, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { motion } from "framer-motion";

export function DiscoverySearch() {
    return (
        <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-border">
                    {/* Access Method */}
                    <div className="p-6 space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground flex items-center">
                            <Fingerprint className="mr-1.5 h-3 w-3" /> Search Method
                        </Label>
                        <Select defaultValue="roll">
                            <SelectTrigger className="border-none bg-transparent h-10 px-0 focus:ring-0 font-bold text-sm">
                                <SelectValue placeholder="Select Method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="roll">Roll Number</SelectItem>
                                <SelectItem value="reg">Registration ID</SelectItem>
                                <SelectItem value="app">Application No.</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* ID Input */}
                    <div className="p-6 space-y-2 col-span-1 md:col-span-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground flex items-center">
                            <Hash className="mr-1.5 h-3 w-3" /> Credentials
                        </Label>
                        <div className="flex items-center">
                            <Input
                                placeholder="Enter your number here..."
                                className="border-none bg-transparent h-10 px-0 focus-visible:ring-0 font-bold text-lg placeholder:text-muted-foreground/50"
                            />
                        </div>
                    </div>

                    {/* Date Of Birth */}
                    <div className="p-6 space-y-2 flex flex-col justify-center">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground flex items-center">
                            <Calendar className="mr-1.5 h-3 w-3" /> Date of Birth
                        </Label>
                        <Input
                            type="date"
                            className="border-none bg-transparent h-10 px-0 focus-visible:ring-0 font-bold text-sm"
                        />
                    </div>
                </div>

                {/* Search Button Footer */}
                <div className="p-4 bg-muted/30 border-t flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground font-medium px-2 italic">
                        By searching, you agree to verify your identity for secure access.
                    </p>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="bg-primary hover:bg-primary/90 rounded-xl px-8 shadow-lg shadow-primary/20">
                            Search Admit Card <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </motion.div>
                </div>
            </CardContent>
        </Card>
    );
}
