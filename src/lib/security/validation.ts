/**
 * Security Validation Library
 * Centralized input validation and sanitization utilities
 */

// ============================================================================
// STRING VALIDATION & SANITIZATION
// ============================================================================

/**
 * Sanitize string to prevent XSS attacks
 * Removes HTML tags and dangerous characters
 */
export function sanitizeString(input: string, maxLength: number = 500): string {
    if (typeof input !== 'string') return '';

    // Trim and limit length
    let sanitized = input.trim().slice(0, maxLength);

    // Remove HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');

    // Escape special characters:
    // we do NOT encode & ' " symbols because React handles output encoding automatically.
    // Double-encoding (saving &amp; to DB) causes display issues (user sees &amp;).
    // We implicitly trust React's auto-escaping for the view layer.

    return sanitized;
}

/**
 * Sanitize URL specifically (Preserves structure, blocks javascript:)
 */
export function sanitizeUrl(url: string | undefined | null): string {
    if (!url || typeof url !== 'string') return '';
    let sanitized = url.trim();

    // Block dangerous protocols
    if (sanitized.toLowerCase().startsWith('javascript:') || sanitized.toLowerCase().startsWith('data:')) {
        return '';
    }

    // Auto-prepend https:// if it looks like a domain but has no protocol
    if (!sanitized.match(/^https?:\/\//) && !sanitized.startsWith('/') && sanitized.includes('.')) {
        sanitized = `https://${sanitized}`;
    }

    return sanitized;
}

/**
 * Validate and sanitize a slug (URL-safe string)
 */
export function validateSlug(slug: string): boolean {
    if (!slug || typeof slug !== 'string') return false;

    // Slug should only contain lowercase letters, numbers, and hyphens
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugPattern.test(slug) && slug.length <= 200;
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(input: string): string | null {
    if (typeof input !== 'string') return null;

    const trimmed = input.trim();

    // Length validation
    if (trimmed.length === 0 || trimmed.length > 100) return null;

    // Remove dangerous characters
    const sanitized = trimmed.replace(/[^\w\s\-']/g, '');

    if (sanitized.length === 0) return null;

    // Block SQL keywords
    const dangerousPatterns = /(\bDROP\b|\bDELETE\b|\bUPDATE\b|\bINSERT\b|\bEXEC\b|\bSCRIPT\b)/gi;
    if (dangerousPatterns.test(sanitized)) return null;

    return sanitized;
}

// ============================================================================
// NUMBER VALIDATION
// ============================================================================

/**
 * Validate and parse integer with range check
 */
export function validateInteger(
    value: any,
    min: number = Number.MIN_SAFE_INTEGER,
    max: number = Number.MAX_SAFE_INTEGER
): number | null {
    const num = parseInt(value, 10);

    if (isNaN(num)) return null;
    if (num < min || num > max) return null;

    return num;
}

/**
 * Validate and parse float with range check
 */
export function validateFloat(
    value: any,
    min: number = -Infinity,
    max: number = Infinity
): number | null {
    const num = parseFloat(value);

    if (isNaN(num)) return null;
    if (num < min || num > max) return null;

    return num;
}

// ============================================================================
// DATE VALIDATION
// ============================================================================

/**
 * Validate and parse date string
 */
export function validateDate(dateStr: any): Date | null {
    if (!dateStr) return null;

    // Handle string dates
    if (typeof dateStr === 'string') {
        // Skip placeholder values
        if (dateStr.toLowerCase().includes('notify') ||
            dateStr.toLowerCase().includes('soon') ||
            dateStr.toLowerCase().includes('tba')) {
            return null;
        }
    }

    // Handle DD/MM/YYYY format
    if (typeof dateStr === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        // Check if valid date
        if (!isNaN(date.getTime()) && date.getFullYear() === year) {
            return date;
        }
        return null;
    }

    const date = new Date(dateStr);

    // Check if valid date
    if (isNaN(date.getTime())) return null;

    // Check if date is reasonable (between 1900 and 2100)
    const year = date.getFullYear();
    if (year < 1900 || year > 2100) return null;

    return date;
}

/**
 * Validate date range
 */
export function validateDateRange(startDate: Date, endDate: Date): boolean {
    if (!startDate || !endDate) return false;
    return startDate <= endDate;
}

// ============================================================================
// EMAIL & URL VALIDATION
// ============================================================================

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;

    // RFC 5322 compliant email regex (simplified)
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return emailPattern.test(email) && email.length <= 254;
}

/**
 * Validate URL
 */
export function validateUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;

    try {
        const urlObj = new URL(url);
        // Only allow http and https protocols
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}

// ============================================================================
// FILE VALIDATION
// ============================================================================

/**
 * Validate file type
 */
export function validateFileType(filename: string, allowedTypes: string[]): boolean {
    if (!filename || typeof filename !== 'string') return false;

    const extension = filename.toLowerCase().split('.').pop();
    if (!extension) return false;

    return allowedTypes.includes(extension);
}

/**
 * Validate file size
 */
export function validateFileSize(sizeInBytes: number, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return sizeInBytes > 0 && sizeInBytes <= maxSizeInBytes;
}

/**
 * Validate image file
 */
export const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
export const MAX_IMAGE_SIZE_MB = 10;

export function validateImageFile(filename: string, sizeInBytes: number): {
    valid: boolean;
    error?: string;
} {
    if (!validateFileType(filename, ALLOWED_IMAGE_TYPES)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`
        };
    }

    if (!validateFileSize(sizeInBytes, MAX_IMAGE_SIZE_MB)) {
        return {
            valid: false,
            error: `File size exceeds maximum allowed size of ${MAX_IMAGE_SIZE_MB}MB`
        };
    }

    return { valid: true };
}

// ============================================================================
// ID VALIDATION
// ============================================================================

/**
 * Validate CUID (Prisma default ID format)
 */
export function validateCuid(id: string): boolean {
    if (!id || typeof id !== 'string') return false;

    // CUID format: starts with 'c', followed by alphanumeric characters
    const cuidPattern = /^c[a-z0-9]{24}$/;
    return cuidPattern.test(id);
}

/**
 * Validate UUID
 */
export function validateUuid(id: string): boolean {
    if (!id || typeof id !== 'string') return false;

    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(id);
}

// ============================================================================
// OBJECT VALIDATION
// ============================================================================

/**
 * Validate JSON object
 */
export function validateJson(jsonString: string): { valid: boolean; data?: any; error?: string } {
    try {
        const data = JSON.parse(jsonString);
        return { valid: true, data };
    } catch (error) {
        return { valid: false, error: 'Invalid JSON format' };
    }
}

/**
 * Sanitize object by removing null/undefined values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): Partial<T> {
    const sanitized: Partial<T> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined) {
            sanitized[key as keyof T] = value;
        }
    }

    return sanitized;
}

// ============================================================================
// BATCH VALIDATION
// ============================================================================

/**
 * Validation result type
 */
export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
}

/**
 * Create validation result
 */
export function createValidationResult(errors: Record<string, string> = {}): ValidationResult {
    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}
