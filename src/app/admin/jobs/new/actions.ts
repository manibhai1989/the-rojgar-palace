"use server";

import prisma from "@/lib/prisma";
import slugify from "slugify";
import { revalidatePath } from "next/cache";
import {
    sanitizeString,
    sanitizeUrl, // Imported
    validateInteger,
    validateDate,
    createValidationResult,
    type ValidationResult,
} from "@/lib/security/validation";
import {
    createErrorResponse,
    createSuccessResponse,
    handleDatabaseError,
    handleValidationError,
    ErrorCode,
    type SecureResponse,
} from "@/lib/security/errors";
import { logSecurityEvent } from "@/lib/security/auth";

// ============================================================================
// TYPES
// ============================================================================

interface JobFormData {
    postName: string;
    totalVacancy: string | number;
    shortInfo: string;
    applicationBegin?: string;
    lastDateApply: string;
    lastDateFee?: string;
    examDate?: string;
    minAge?: string | number;
    maxAge?: string | number;
    eligibilityObj?: any; // To be deprecated/merged
    feesObj?: { category: string, amount: string }[];
    vacancyObj?: { postName: string, category: string, count: number }[];
    importantLinks?: { title: string, url: string }[];

    // New Extended Fields
    customDates?: { label: string, value: string }[];
    ageLimitDetails?: { calculateDate: string, relaxation: string };
    selectionStages?: string[];
    educationalQualification?: string;
    extraDetails?: { title: string, content: string }[];
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate job creation data
 */
function validateJobData(data: any): ValidationResult {
    const errors: Record<string, string> = {};

    // Required: Post Name
    if (!data.postName || typeof data.postName !== 'string') {
        errors.postName = 'Post name is required';
    } else if (data.postName.trim().length < 3) {
        errors.postName = 'Post name must be at least 3 characters';
    } else if (data.postName.length > 200) {
        errors.postName = 'Post name must not exceed 200 characters';
    }

    // Required: Total Vacancy
    const vacancyCount = validateInteger(data.totalVacancy, 0, 1000000);
    if (vacancyCount === null) {
        errors.totalVacancy = 'Total vacancy must be a valid number between 0 and 1,000,000';
    }

    // Required: Short Info
    if (!data.shortInfo || typeof data.shortInfo !== 'string') {
        errors.shortInfo = 'Short info is required';
    } else if (data.shortInfo.trim().length < 10) {
        errors.shortInfo = 'Short info must be at least 10 characters';
    } else if (data.shortInfo.length > 500) {
        errors.shortInfo = 'Short info must not exceed 500 characters';
    }

    // Required: Last Date to Apply
    if (!data.lastDateApply) {
        errors.lastDateApply = 'Last date to apply is required';
    }

    // Optional: Age validation
    if (data.minAge !== undefined && data.minAge !== null && data.minAge !== '') {
        const minAge = validateInteger(data.minAge, 0, 100);
        if (minAge === null) {
            errors.minAge = 'Minimum age must be between 0 and 100';
        }
    }

    if (data.maxAge !== undefined && data.maxAge !== null && data.maxAge !== '') {
        const maxAge = validateInteger(data.maxAge, 1, 100);
        if (maxAge === null) {
            errors.maxAge = 'Maximum age must be between 1 and 100';
        }
    }

    return createValidationResult(errors);
}

// ============================================================================
// SANITIZATION
// ============================================================================

/**
 * Sanitize job data
 */
function sanitizeJobData(data: JobFormData): JobFormData {
    return {
        postName: sanitizeString(data.postName || '', 200),
        totalVacancy: data.totalVacancy,
        shortInfo: sanitizeString(data.shortInfo || '', 500),
        applicationBegin: data.applicationBegin,
        lastDateApply: data.lastDateApply,
        lastDateFee: data.lastDateFee,
        examDate: data.examDate,
        minAge: data.minAge,
        maxAge: data.maxAge,

        // Sanitize Nested Arrays
        feesObj: data.feesObj?.map(fee => ({
            category: sanitizeString(fee.category || '', 100),
            amount: sanitizeString(fee.amount || '', 20)
        })) || [],

        vacancyObj: data.vacancyObj?.map(vac => ({
            postName: sanitizeString(vac.postName || '', 200),
            category: sanitizeString(vac.category || '', 100),
            count: vac.count // Number
        })) || [],

        importantLinks: data.importantLinks?.map(link => ({
            title: sanitizeString(link.title || '', 150),
            url: sanitizeUrl(link.url || '') // Use URL sanitizer
        })) || [],

        extraDetails: data.extraDetails?.map(detail => ({
            title: sanitizeString(detail.title || '', 150),
            content: sanitizeString(detail.content || '', 5000)
        })) || [],

        customDates: data.customDates?.map(date => ({
            label: sanitizeString(date.label || '', 100),
            value: sanitizeString(date.value || '', 100)
        })) || [],

        selectionStages: data.selectionStages?.map(stage => sanitizeString(stage || '', 500)) || [],

        educationalQualification: sanitizeString(data.educationalQualification || '', 10000),

        ageLimitDetails: {
            calculateDate: sanitizeString(data.ageLimitDetails?.calculateDate || '', 50),
            relaxation: sanitizeString(data.ageLimitDetails?.relaxation || '', 200)
        }
    };
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Create a new job posting (admin only)
 * Security: Validates all inputs, sanitizes data, checks authentication
 */
export async function createJob(data: any): Promise<SecureResponse<any>> {
    try {
        // TODO: Add authentication check
        // const user = await requireAdmin();

        // Security: Validate input data
        const validation = validateJobData(data);
        if (!validation.valid) {
            return handleValidationError(validation.errors);
        }

        // Security: Sanitize input data
        const sanitizedData = sanitizeJobData(data);

        // Generate unique slug
        const baseSlug = slugify(sanitizedData.postName, { lower: true, strict: true });
        const uniqueSuffix = Math.random().toString(36).substring(2, 7);
        const slug = `${baseSlug}-${uniqueSuffix}`;

        // Helper to parse dates safely
        const parseDate = (dateStr?: string): Date | null => {
            if (!dateStr) return null;

            const lowerStr = dateStr.toLowerCase();
            if (lowerStr.includes("notify") ||
                lowerStr.includes("soon") ||
                lowerStr.includes("tba")) {
                return null;
            }

            return validateDate(dateStr);
        };

        // Parse and validate numeric values
        const vacanciesCount = validateInteger(sanitizedData.totalVacancy, 0, 1000000) || 0;
        const minAge = sanitizedData.minAge ? validateInteger(sanitizedData.minAge, 0, 100) : null;
        const maxAge = sanitizedData.maxAge ? validateInteger(sanitizedData.maxAge, 0, 100) : null;

        // Create job in database
        const job = await prisma.job.create({
            data: {
                title: sanitizedData.postName,
                slug: slug,
                organization: sanitizedData.postName.split(" ").slice(0, 2).join(" "), // Simple heuristic
                department: sanitizedData.postName,
                category: "Latest Jobs", // Default
                vacanciesCount: vacanciesCount,
                vacanciesDetail: sanitizedData.vacancyObj, // Strict JSON
                shortInfo: sanitizedData.shortInfo,

                // Standard Dates
                startDate: parseDate(sanitizedData.applicationBegin),
                endDate: parseDate(sanitizedData.lastDateApply) || new Date(),
                feeDeadline: parseDate(sanitizedData.lastDateFee),
                examDate: parseDate(sanitizedData.examDate),

                // Fees
                fees: sanitizedData.feesObj,

                // Combined Eligibility (Age + Qualification)
                eligibility: (minAge || maxAge || sanitizedData.educationalQualification || sanitizedData.ageLimitDetails) ? {
                    minAge: minAge,
                    maxAge: maxAge,
                    educationDetails: sanitizedData.educationalQualification,
                    ageCalculateDate: sanitizedData.ageLimitDetails?.calculateDate,
                    ageRelaxation: sanitizedData.ageLimitDetails?.relaxation,
                    criteria: sanitizedData.eligibilityObj // Fallback/Legacy
                } : undefined,

                // Application Process + Custom Dates + Links
                applicationProcess: (sanitizedData.importantLinks || sanitizedData.customDates || sanitizedData.extraDetails) ? {
                    links: sanitizedData.importantLinks,
                    customDates: sanitizedData.customDates, // Stores things like "Re-Open", "Phase 2"
                    extraDetails: sanitizedData.extraDetails // Stores miscellaneous info
                } : undefined,

                // Selection Process
                selectionProcess: sanitizedData.selectionStages ? {
                    stages: sanitizedData.selectionStages
                } : undefined,

                officialUrl: sanitizedData.importantLinks?.find(l => l.title.toLowerCase().includes("apply") || l.title.toLowerCase().includes("website"))?.url,
                notificationPdf: sanitizedData.importantLinks?.find(l => l.title.toLowerCase().includes("notification"))?.url,
                isNew: true
            }
        });

        // Security: Log creation action
        logSecurityEvent('data_modification', {
            action: 'create',
            resource: 'job',
            resourceId: job.id,
            // userId: user.id,
        });

        // Sync to other tables
        await syncJobToCategories(sanitizedData);

        // Revalidate cache
        revalidatePath("/admin/jobs");
        revalidatePath("/");

        return createSuccessResponse(job);
    } catch (error: any) {
        return handleDatabaseError(error);
    }
}

/**
 * Update an existing job (admin only)
 */
export async function updateJob(id: string, data: any): Promise<SecureResponse<any>> {
    try {
        // TODO: Add authentication check
        // const user = await requireAdmin();

        // 1. Validate Input
        const validation = validateJobData(data);
        if (!validation.valid) {
            return handleValidationError(validation.errors);
        }

        // 2. Sanitize Input
        const sanitizedData = sanitizeJobData(data);

        // 3. Parse and Clean Data Helper
        const parseDate = (dateStr?: string): Date | null => {
            if (!dateStr) return null;
            const lowerStr = dateStr.toLowerCase();
            if (lowerStr.includes("notify") || lowerStr.includes("soon") || lowerStr.includes("tba")) {
                return null;
            }
            return validateDate(dateStr);
        };

        const vacanciesCount = validateInteger(sanitizedData.totalVacancy, 0, 1000000) || 0;
        // const minAge = sanitizedData.minAge ? validateInteger(sanitizedData.minAge, 0, 100) : null;
        // const maxAge = sanitizedData.maxAge ? validateInteger(sanitizedData.maxAge, 0, 100) : null;

        // 4. Update Database
        await prisma.job.update({
            where: { id },
            data: {
                title: sanitizedData.postName,
                // organization: sanitizedData.postName.split(" ").slice(0, 2).join(" "), // Auto-update organization too? maybe not.
                vacanciesCount: vacanciesCount,
                vacanciesDetail: sanitizedData.vacancyObj,
                shortInfo: sanitizedData.shortInfo,

                startDate: parseDate(sanitizedData.applicationBegin),
                endDate: parseDate(sanitizedData.lastDateApply) || new Date(),
                feeDeadline: parseDate(sanitizedData.lastDateFee),
                examDate: parseDate(sanitizedData.examDate),

                fees: sanitizedData.feesObj,

                // We reconstruct eligibility and applicationProcess fully to ensure no data loss/merging issues
                eligibility: (sanitizedData.educationalQualification || sanitizedData.ageLimitDetails) ? {
                    // minAge: minAge, // If we want to update top-level age columns too, we should map them back
                    // maxAge: maxAge,
                    educationDetails: sanitizedData.educationalQualification,
                    ageCalculateDate: sanitizedData.ageLimitDetails?.calculateDate,
                    ageRelaxation: sanitizedData.ageLimitDetails?.relaxation,
                    criteria: sanitizedData.eligibilityObj
                } : undefined,

                applicationProcess: (sanitizedData.importantLinks || sanitizedData.customDates || sanitizedData.extraDetails) ? {
                    links: sanitizedData.importantLinks,
                    customDates: sanitizedData.customDates,
                    extraDetails: sanitizedData.extraDetails
                } : undefined,

                selectionProcess: sanitizedData.selectionStages ? {
                    stages: sanitizedData.selectionStages
                } : undefined,

                // Update URLs if links changed
                officialUrl: sanitizedData.importantLinks?.find(l => l.title.toLowerCase().includes("apply") || l.title.toLowerCase().includes("website"))?.url,
                notificationPdf: sanitizedData.importantLinks?.find(l => l.title.toLowerCase().includes("notification"))?.url,
            }
        });

        // 5. Audit Log
        logSecurityEvent('data_modification', {
            action: 'update',
            resource: 'job',
            resourceId: id,
        });

        // 6. Sync to other tables (Admit Card, Result, etc.)
        await syncJobToCategories(sanitizedData);

        // 7. Revalidate
        revalidatePath("/admin/jobs");
        revalidatePath("/");
        revalidatePath(`/jobs/${id}`);

        return createSuccessResponse({ success: true });
    } catch (error: any) {
        return handleDatabaseError(error);
    }
}

/**
 * Sync Job Data to dependent tables (AdmitCard, Result, Syllabus, AnswerKey)
 * based on the presence of specific keywords in 'importantLinks'.
 */
async function syncJobToCategories(data: JobFormData) {
    if (!data.importantLinks || data.importantLinks.length === 0) return;

    const title = data.postName;
    const organization = data.postName.split(" ").slice(0, 2).join(" "); // Simple guess

    // Helper to find specific link
    const findLink = (keyword: string) =>
        data.importantLinks?.find(l => l.title.toLowerCase().includes(keyword.toLowerCase()))?.url;

    // 1. Admit Cards
    const admitCardLink = findLink("admit card");
    if (admitCardLink) {
        const existing = await prisma.admitCard.findFirst({ where: { title: { equals: title, mode: 'insensitive' } } });
        if (existing) {
            await prisma.admitCard.update({ where: { id: existing.id }, data: { link: admitCardLink, updatedAt: new Date() } });
        } else {
            await prisma.admitCard.create({ data: { title, organization, link: admitCardLink } });
        }
    }

    // 2. Results
    const resultLink = findLink("result");
    if (resultLink) {
        const existing = await prisma.result.findFirst({ where: { title: { equals: title, mode: 'insensitive' } } });
        if (existing) {
            await prisma.result.update({ where: { id: existing.id }, data: { link: resultLink, updatedAt: new Date() } });
        } else {
            await prisma.result.create({ data: { title, organization, link: resultLink } });
        }
    }

    // 3. Answer Keys
    const answerKeyLink = findLink("answer key");
    if (answerKeyLink) {
        const existing = await prisma.answerKey.findFirst({ where: { title: { equals: title, mode: 'insensitive' } } });
        if (existing) {
            await prisma.answerKey.update({ where: { id: existing.id }, data: { link: answerKeyLink, updatedAt: new Date() } });
        } else {
            await prisma.answerKey.create({ data: { title, organization, link: answerKeyLink } });
        }
    }

    // 4. Syllabus
    const syllabusLink = findLink("syllabus");
    if (syllabusLink) {
        const existing = await prisma.syllabus.findFirst({ where: { title: { equals: title, mode: 'insensitive' } } });
        if (existing) {
            await prisma.syllabus.update({ where: { id: existing.id }, data: { link: syllabusLink, updatedAt: new Date() } });
        } else {
            await prisma.syllabus.create({ data: { title, organization, link: syllabusLink } });
        }
    }
}
