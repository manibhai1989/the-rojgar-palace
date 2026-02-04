"use server";

import prisma from "@/lib/prisma";

export async function searchResults(query?: string) {
    try {
        const results = await prisma.result.findMany({
            where: query ? {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { organization: { contains: query, mode: 'insensitive' } },
                ]
            } : {},
            orderBy: { createdAt: "desc" },
            take: 50
        });
        return { success: true, results };
    } catch (error: any) {
        console.error("Results search failed:", error);
        return { success: false, error: error.message };
    }
}
