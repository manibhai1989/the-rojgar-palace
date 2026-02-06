"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAdminSyllabus() {
    try {
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
        await prisma.syllabus.delete({
            where: { id },
        });
        revalidatePath("/admin/syllabus");
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting syllabus:", error);
        return { success: false, error: error.message };
    }
}
