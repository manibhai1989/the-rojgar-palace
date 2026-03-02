"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const searchSchema = z.string().max(100).optional();

export async function searchAnswerKeys(query?: string) {
    try {
        const safeQuery = searchSchema.parse(query);
        const answerKeys = await prisma.answerKey.findMany({
            where: safeQuery ? {
                OR: [
                    { title: { contains: safeQuery, mode: 'insensitive' } },
                    { organization: { contains: safeQuery, mode: 'insensitive' } },
                ]
            } : {},
            orderBy: { createdAt: "desc" },
            take: 50
        });
        return { success: true, answerKeys };
    } catch (error: any) {
        console.error("Answer keys search failed:", error);
        return { success: false, error: error.message };
    }
}
