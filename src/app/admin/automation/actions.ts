
"use server";

import { CrawlerEngine } from "@/lib/automation/crawler";
import { createSuccessResponse, createErrorResponse, ErrorCode } from "@/lib/security/errors";

export async function scanAllSources() {
    try {
        console.log("Triggering manual scan...");
        const jobs = await CrawlerEngine.scanAll();
        return createSuccessResponse(jobs);
    } catch (error: any) {
        return createErrorResponse(ErrorCode.INTERNAL_ERROR, error.message);
    }
}
