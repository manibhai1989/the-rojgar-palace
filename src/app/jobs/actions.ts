"use server";

import prisma from "@/lib/prisma";

export async function searchJobs(query?: string, category?: string) {
    try {
        const jobs = await prisma.job.findMany({
            where: {
                AND: [
                    query ? {
                        OR: [
                            { title: { contains: query, mode: 'insensitive' } },
                            { organization: { contains: query, mode: 'insensitive' } },
                            { department: { contains: query, mode: 'insensitive' } },
                        ]
                    } : {},
                    category && category !== "All" ? { category: category } : {}
                ]
            },
            orderBy: { createdAt: "desc" },
            take: 50
        });
        return { success: true, jobs };
    } catch (error: any) {
        console.error("Search failed:", error);
        return { success: false, error: error.message };
    }
}

export async function getJobsCountByCategory() {
    try {
        const counts = await prisma.job.groupBy({
            by: ['category'],
            _count: {
                _all: true
            }
        });
        return { success: true, counts };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
