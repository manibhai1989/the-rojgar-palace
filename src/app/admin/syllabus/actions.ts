"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/security/auth";
import { z } from "zod";

const idSchema = z.string().min(5);

export async function getAdminSyllabus() {
    try {
        await requireAdmin();
        const data = await prisma.syllabus.findMany({
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data };
    } catch (error: any) {
        console.error("Error fetching admin syllabus:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteSyllabus(id: string) {
    try {
        await requireAdmin();
        const validId = idSchema.parse(id);
        await prisma.syllabus.delete({
            where: { id: validId },
        });
        revalidatePath("/admin/syllabus");
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting syllabus:", error);
        return { success: false, error: error.message };
    }
}
