
"use server";

import prisma from "@/lib/prisma";
import { createSuccessResponse, createErrorResponse, ErrorCode } from "@/lib/security/errors";
import { revalidatePath } from "next/cache";
import { validateUrl } from "@/lib/security/validation";

export async function addSource(data: { name: string; url: string; selector: string }) {
    try {
        if (!validateUrl(data.url)) {
            return createErrorResponse(ErrorCode.INVALID_INPUT, "Invalid URL provided");
        }

        const source = await prisma.source.create({
            data: {
                name: data.name,
                url: data.url,
                selector: data.selector,
                keywords: ["Recruitment", "Notification", "Vacancy"], // Default keywords
                isActive: true
            }
        });

        revalidatePath("/admin/automation");
        return createSuccessResponse(source);
    } catch (error: any) {
        if (error.code === 'P2002') return createErrorResponse(ErrorCode.CONFLICT, "This URL is already registered.");
        return createErrorResponse(ErrorCode.INTERNAL_ERROR, error.message);
    }
}

export async function getSources() {
    try {
        const sources = await prisma.source.findMany({
            orderBy: { createdAt: "desc" }
        });
        return createSuccessResponse(sources);
    } catch (error: any) {
        return createErrorResponse(ErrorCode.INTERNAL_ERROR, error.message);
    }
}

export async function deleteSource(id: string) {
    try {
        await prisma.source.delete({ where: { id } });
        revalidatePath("/admin/automation");
        return createSuccessResponse(id);
    } catch (error: any) {
        return createErrorResponse(ErrorCode.INTERNAL_ERROR, error.message);
    }
}
