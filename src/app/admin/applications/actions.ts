"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/security/auth";
import { z } from "zod";

const idSchema = z.string().min(5);
const statusSchema = z.string().min(1).max(50);

export async function getApplications() {
    try {
        await requireAdmin();
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
        await requireAdmin();
        const validId = idSchema.parse(applicationId);
        const validStatus = statusSchema.parse(status);

        await prisma.application.update({
            where: { id: validId },
            data: { status: validStatus },
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating application:", error);
        return { success: false };
    }
}

export async function deleteApplication(applicationId: string) {
    try {
        await requireAdmin();
        const validId = idSchema.parse(applicationId);

        await prisma.application.delete({
            where: { id: validId },
        });

        return { success: true };
    } catch (error) {
        console.error("Error deleting application:", error);
        return { success: false };
    }
}
