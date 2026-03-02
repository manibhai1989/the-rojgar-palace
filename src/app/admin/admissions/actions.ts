"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/security/auth";

export async function getAdmissions() {
    try {
        await requireAdmin();
        const items = await prisma.admission.findMany({
            orderBy: { createdAt: "desc" },
            take: 20
        });
        return { success: true, items };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createAdmission(data: { title: string; organization: string; link: string }) {
    try {
        await requireAdmin();
        await prisma.admission.create({ data });
        revalidatePath("/");
        revalidatePath("/admin/admissions");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteAdmission(id: string) {
    try {
        await requireAdmin();
        await prisma.admission.delete({ where: { id } });
        revalidatePath("/");
        revalidatePath("/admin/admissions");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
