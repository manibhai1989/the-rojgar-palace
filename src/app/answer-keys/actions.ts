"use server";

import prisma from "@/lib/prisma";

export async function searchAnswerKeys(query?: string) {
    try {
        const answerKeys = await prisma.answerKey.findMany({
            where: query ? {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { organization: { contains: query, mode: 'insensitive' } },
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
