
"use server";

import prisma from "@/lib/prisma";
import { createSuccessResponse, createErrorResponse, ErrorCode, SecureErrorResponse } from "@/lib/security/errors";
import { revalidatePath } from "next/cache";
import { validateUrl } from "@/lib/security/validation";

export async function addSource(data: { name: string; url: string; selector: string }) {
    console.log("[addSource] Request received:", data);
    try {
        if (!validateUrl(data.url)) {
            console.error("[addSource] Validation failed: Invalid URL", data.url);
            return createErrorResponse(ErrorCode.INVALID_INPUT, "Invalid URL provided");
        }

        console.log("[addSource] Attempting Prisma create...");
        const source = await (prisma as any).source.create({
            data: {
                name: data.name,
                url: data.url,
                selector: data.selector,
                keywords: ["Recruitment", "Notification", "Vacancy"], // Default keywords
                isActive: true
            }
        });

        console.log("[addSource] Created successfully:", source.id);
        revalidatePath("/admin/automation");
        return createSuccessResponse(source);
    } catch (error: any) {
        console.error("[addSource] Prisma Error Details:", JSON.stringify(error, null, 2));
        console.error("[addSource] Full Error Object:", error);
        if (error.code === 'P2002') return createErrorResponse(ErrorCode.CONFLICT, "This URL is already registered.");

        // DEBUG: Return actual error to UI
        return {
            success: false,
            error: "DEBUG ERROR: " + (error.message || JSON.stringify(error)),
            code: ErrorCode.INTERNAL_ERROR
        } as SecureErrorResponse;
        // return createErrorResponse(ErrorCode.INTERNAL_ERROR, error.message || "Unknown DB Error");
    }
}

export async function getSources() {
    try {
        const sources = await (prisma as any).source.findMany({
            orderBy: { createdAt: "desc" }
        });
        return createSuccessResponse(sources);
    } catch (error: any) {
        return createErrorResponse(ErrorCode.INTERNAL_ERROR, error.message);
    }
}

export async function deleteSource(id: string) {
    try {
        await (prisma as any).source.delete({ where: { id } });
        revalidatePath("/admin/automation");
        return createSuccessResponse(id);
    } catch (error: any) {
        return createErrorResponse(ErrorCode.INTERNAL_ERROR, error.message);
    }
}
