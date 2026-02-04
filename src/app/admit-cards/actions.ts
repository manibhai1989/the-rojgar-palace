"use server";

import prisma from "@/lib/prisma";

export async function searchAdmitCards(query?: string) {
    try {
        const admitCards = await prisma.admitCard.findMany({
            where: query ? {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { organization: { contains: query, mode: 'insensitive' } },
                ]
            } : {},
            orderBy: { createdAt: "desc" },
            take: 50
        });
        return { success: true, admitCards };
    } catch (error: any) {
        console.error("Admit cards search failed:", error);
        return { success: false, error: error.message };
    }
}
