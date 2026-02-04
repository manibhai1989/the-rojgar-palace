"use server";

import prisma from "@/lib/prisma";

export async function searchSyllabus(query?: string) {
    try {
        const syllabus = await prisma.syllabus.findMany({
            where: query ? {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { organization: { contains: query, mode: 'insensitive' } },
                ]
            } : {},
            orderBy: { createdAt: "desc" },
            take: 50
        });
        return { success: true, syllabus };
    } catch (error: any) {
        console.error("Syllabus search failed:", error);
        return { success: false, error: error.message };
    }
}
