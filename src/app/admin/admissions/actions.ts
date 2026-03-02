"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/security/auth";
import { z } from "zod";

const admissionSchema = z.object({
    title: z.string().min(1).max(200),
    organization: z.string().min(1).max(200),
    link: z.string().url().max(500),
});

const idSchema = z.string().cuid().or(z.string().uuid()).or(z.string().min(5));

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
        const parsedData = admissionSchema.parse(data);
        await prisma.admission.create({ data: parsedData });
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
        const validId = idSchema.parse(id);
        await prisma.admission.delete({ where: { id: validId } });
        revalidatePath("/");
        revalidatePath("/admin/admissions");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
