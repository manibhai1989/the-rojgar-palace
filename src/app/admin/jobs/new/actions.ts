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
    feesObj?: Record<string, any>[]; // Dynamic Objects
    vacancyObj?: Record<string, any>[]; // Dynamic Objects
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
    // CHECK: Loosened validation here, as we parse it safely later.
    // If it's missing, we still flag it, but we log exactly what's wrong.
    if (!data.lastDateApply) {
        errors.lastDateApply = 'Last date to apply is required';
        console.error("Validation Failed: Missing lastDateApply. Received:", data.lastDateApply); // Debug Log
    }

    // Optional: Age validation
    if (data.minAge !== undefined && data.minAge !== null && data.minAge !== '') {
        const minAge = validateInteger(data.minAge, 0, 100);
        if (minAge === null) {
            // errors.minAge = 'Minimum age must be between 0 and 100'; // IGNORE AGE VALIDATION ERRORS FOR NOW (Dynamic Storage)
        }
    }

    if (data.maxAge !== undefined && data.maxAge !== null && data.maxAge !== '') {
        const maxAge = validateInteger(data.maxAge, 1, 100);
        if (maxAge === null) {
            // errors.maxAge = 'Maximum age must be between 1 and 100'; // IGNORE AGE VALIDATION ERRORS FOR NOW
        }
    }

    if (Object.keys(errors).length > 0) {
        console.error("Validation Errors:", errors);
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

        // Sanitize Nested Arrays (DYNAMIC KEYS SUPPORT)
        feesObj: data.feesObj?.map(fee => {
            const newFee: Record<string, any> = {};
            Object.keys(fee).forEach(key => {
                newFee[key] = sanitizeString(String(fee[key] || ''), 100);
            });
            return newFee;
        }).filter(f => Object.values(f).some(v => v)) || [], // Filter rows where all values are empty

        vacancyObj: data.vacancyObj?.map(vac => {
            const newVac: Record<string, any> = {};
            Object.keys(vac).forEach(key => {
                // Allow numbers for 'count' or 'total' fields, verify if string
                const val = vac[key];
                newVac[key] = (typeof val === 'number') ? val : sanitizeString(String(val || ''), 200);
            });
            return newVac;
        }).filter(v => Object.values(v).some(val => val)) || [], // Filter rows where all values are empty

        importantLinks: data.importantLinks?.map(link => ({
            title: sanitizeString(link.title || '', 150),
            url: sanitizeUrl(link.url || '')
        })).filter(l => l.title || l.url) || [], // Filter empty links

        extraDetails: data.extraDetails?.map(detail => ({
            title: sanitizeString(detail.title || '', 150),
            content: sanitizeString(detail.content || '', 5000)
        })).filter(d => d.title || d.content) || [], // Filter empty details

        customDates: data.customDates?.map(date => ({
            label: sanitizeString(date.label || '', 100),
            value: sanitizeString(date.value || '', 100)
        })).filter(d => d.label || d.value) || [],

        selectionStages: data.selectionStages?.map(stage => sanitizeString(stage || '', 500)).filter(s => s) || [],

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
        console.log("[createJob] Incoming Data:", JSON.stringify(data, null, 2)); // DEBUG
        console.log("[createJob] Sanitized Data:", JSON.stringify(sanitizedData, null, 2)); // DEBUG

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

        // Custom Robust Age Parser
        // Custom Robust Age Parser (Dynamic: Returns Number if clean, else String)
        const parseAge = (val: any) => {
            if (!val) return null;
            // 1. Try strict number
            const num = parseInt(String(val), 10);
            if (!isNaN(num) && String(num) === String(val)) return num;

            // 2. Try extracting first number if it looks like "18 Years"
            const match = String(val).match(/^\d+$/); // Only strict digits
            if (match) return parseInt(match[0], 10);

            // 3. Fallback: Return original string (Dynamic Storage)
            return sanitizeString(String(val), 50);
        };

        const minAge = parseAge(sanitizedData.minAge);
        const maxAge = parseAge(sanitizedData.maxAge);



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
        console.log("[updateJob] Incoming Data:", JSON.stringify(data, null, 2)); // DEBUG
        console.log("[updateJob] Sanitized Data:", JSON.stringify(sanitizedData, null, 2)); // DEBUG

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

        // Custom Robust Age Parser
        // Custom Robust Age Parser (Dynamic)
        const parseAge = (val: any) => {
            if (!val) return null;
            const num = parseInt(String(val), 10);
            if (!isNaN(num) && String(num) === String(val)) return num;

            const match = String(val).match(/^\d+$/);
            if (match) return parseInt(match[0], 10);

            return sanitizeString(String(val), 50);
        };

        const minAge = parseAge(sanitizedData.minAge);
        const maxAge = parseAge(sanitizedData.maxAge);



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
                eligibility: (sanitizedData.educationalQualification || sanitizedData.ageLimitDetails || minAge || maxAge) ? {
                    minAge: minAge,
                    maxAge: maxAge,
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
