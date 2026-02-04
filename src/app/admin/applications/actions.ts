"use server";

import { prisma } from "@/lib/prisma";

export async function getApplications() {
    try {
        const applications = await prisma.application.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                job: {
                    select: {
                        id: true,
                        title: true,
                        organization: true,
                        category: true,
                        endDate: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return { success: true, applications };
    } catch (error) {
        console.error("Error fetching applications:", error);
        return { success: false, applications: [] };
    }
}

export async function updateApplicationStatus(
    applicationId: string,
    status: string
) {
    try {
        await prisma.application.update({
            where: { id: applicationId },
            data: { status },
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating application:", error);
        return { success: false };
    }
}

export async function deleteApplication(applicationId: string) {
    try {
        await prisma.application.delete({
            where: { id: applicationId },
        });

        return { success: true };
    } catch (error) {
        console.error("Error deleting application:", error);
        return { success: false };
    }
}
