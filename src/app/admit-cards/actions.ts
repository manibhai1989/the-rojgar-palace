"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const searchSchema = z.string().max(100).optional();

export async function searchAdmitCards(query?: string) {
    try {
        const safeQuery = searchSchema.parse(query);
        const admitCards = await prisma.admitCard.findMany({
            where: safeQuery ? {
                OR: [
                    { title: { contains: safeQuery, mode: 'insensitive' } },
                    { organization: { contains: safeQuery, mode: 'insensitive' } },
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
