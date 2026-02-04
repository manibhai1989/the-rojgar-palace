"use server";

import prisma from "@/lib/prisma";

export async function searchAdmissions(query?: string) {
    try {
        const admissions = await prisma.admission.findMany({
            where: query ? {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { organization: { contains: query, mode: 'insensitive' } },
                ]
            } : {},
            orderBy: { createdAt: "desc" },
            take: 50
        });
        return { success: true, admissions };
    } catch (error: any) {
        console.error("Admissions search failed:", error);
        return { success: false, error: error.message };
    }
}
