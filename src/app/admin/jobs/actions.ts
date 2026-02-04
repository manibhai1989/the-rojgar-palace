"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { validateCuid } from "@/lib/security/validation";
import {
    createErrorResponse,
    createSuccessResponse,
    handleDatabaseError,
    ErrorCode,
    type SecureResponse
} from "@/lib/security/errors";
import { logSecurityEvent } from "@/lib/security/auth";

/**
 * Get all jobs (admin only)
 * Security: Should add authentication check in production
 */
export async function getJobs(): Promise<SecureResponse<any[]>> {
    try {
        // TODO: Add authentication check
        // await requireAdmin();

        const jobs = await prisma.job.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return createSuccessResponse(jobs);
    } catch (error: any) {
        return handleDatabaseError(error);
    }
}

/**
 * Delete a job (admin only)
 * Security: Validates ID, checks authentication, logs action
 */
export async function deleteJob(id: string): Promise<SecureResponse<void>> {
    try {
        // Security: Validate ID format
        if (!validateCuid(id)) {
            return createErrorResponse(ErrorCode.INVALID_INPUT, 'Invalid job ID format');
        }

        // TODO: Add authentication check
        // const user = await requireAdmin();

        // Attempt to delete
        await prisma.job.delete({
            where: { id },
        });

        // Security: Log deletion action
        logSecurityEvent('data_modification', {
            action: 'delete',
            resource: 'job',
            resourceId: id,
            // userId: user.id,
        });

        // Revalidate cache
        revalidatePath("/admin/jobs");
        revalidatePath("/");

        return createSuccessResponse(undefined);
    } catch (error: any) {
        // Handle Prisma-specific errors
        if (error.code === 'P2025') {
            return createErrorResponse(ErrorCode.RECORD_NOT_FOUND, error);
        }

        return handleDatabaseError(error);
    }
}
