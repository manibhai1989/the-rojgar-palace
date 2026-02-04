/**
 * Secure Error Handling Library
 * Provides generic user-facing errors while logging detailed information server-side
 */

// ============================================================================
// ERROR TYPES
// ============================================================================

export enum ErrorCode {
    // Authentication & Authorization
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    INVALID_TOKEN = 'INVALID_TOKEN',
    SESSION_EXPIRED = 'SESSION_EXPIRED',

    // Validation
    INVALID_INPUT = 'INVALID_INPUT',
    VALIDATION_FAILED = 'VALIDATION_FAILED',
    MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

    // Database
    DATABASE_ERROR = 'DATABASE_ERROR',
    RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
    DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',

    // File Operations
    FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',
    INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
    FILE_TOO_LARGE = 'FILE_TOO_LARGE',

    // Rate Limiting
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

    // Generic
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    OPERATION_FAILED = 'OPERATION_FAILED',
}

// ============================================================================
// ERROR MESSAGES (User-Facing)
// ============================================================================

const USER_ERROR_MESSAGES: Record<ErrorCode, string> = {
    // Authentication & Authorization
    [ErrorCode.UNAUTHORIZED]: 'You must be logged in to perform this action.',
    [ErrorCode.FORBIDDEN]: 'You do not have permission to perform this action.',
    [ErrorCode.INVALID_TOKEN]: 'Your session is invalid. Please log in again.',
    [ErrorCode.SESSION_EXPIRED]: 'Your session has expired. Please log in again.',

    // Validation
    [ErrorCode.INVALID_INPUT]: 'The provided input is invalid. Please check your data and try again.',
    [ErrorCode.VALIDATION_FAILED]: 'Validation failed. Please check your input and try again.',
    [ErrorCode.MISSING_REQUIRED_FIELD]: 'Required fields are missing. Please fill in all required information.',

    // Database
    [ErrorCode.DATABASE_ERROR]: 'A database error occurred. Please try again later.',
    [ErrorCode.RECORD_NOT_FOUND]: 'The requested resource was not found.',
    [ErrorCode.DUPLICATE_ENTRY]: 'This entry already exists.',

    // File Operations
    [ErrorCode.FILE_UPLOAD_FAILED]: 'File upload failed. Please try again.',
    [ErrorCode.INVALID_FILE_TYPE]: 'Invalid file type. Please upload a supported file format.',
    [ErrorCode.FILE_TOO_LARGE]: 'File size exceeds the maximum allowed limit.',

    // Rate Limiting
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please try again later.',

    // Generic
    [ErrorCode.INTERNAL_ERROR]: 'An unexpected error occurred. Please try again later.',
    [ErrorCode.OPERATION_FAILED]: 'The operation failed. Please try again.',
};

// ============================================================================
// SECURE ERROR RESPONSE
// ============================================================================

export interface SecureErrorResponse {
    success: false;
    error: string;
    code: ErrorCode;
}

export interface SecureSuccessResponse<T = any> {
    success: true;
    data: T;
}

export type SecureResponse<T = any> = SecureSuccessResponse<T> | SecureErrorResponse;

/**
 * Create a secure error response
 * Logs detailed error server-side, returns generic message to client
 */
export function createErrorResponse(
    code: ErrorCode,
    internalError?: any,
    context?: Record<string, any>
): SecureErrorResponse {
    // Log detailed error server-side
    console.error('[Security Error]', {
        code,
        timestamp: new Date().toISOString(),
        error: internalError?.message || internalError,
        stack: internalError?.stack,
        context,
    });

    // Return generic error to client
    return {
        success: false,
        error: USER_ERROR_MESSAGES[code],
        code,
    };
}

/**
 * Create a success response
 */
export function createSuccessResponse<T>(data: T): SecureSuccessResponse<T> {
    return {
        success: true,
        data,
    };
}

// ============================================================================
// ERROR HANDLERS
// ============================================================================

/**
 * Handle database errors securely
 */
export function handleDatabaseError(error: any): SecureErrorResponse {
    // Check for specific Prisma errors
    if (error.code === 'P2002') {
        return createErrorResponse(ErrorCode.DUPLICATE_ENTRY, error);
    }

    if (error.code === 'P2025') {
        return createErrorResponse(ErrorCode.RECORD_NOT_FOUND, error);
    }

    // Generic database error
    return createErrorResponse(ErrorCode.DATABASE_ERROR, error);
}

/**
 * Handle validation errors securely
 */
export function handleValidationError(
    validationErrors: Record<string, string>
): SecureErrorResponse {
    return createErrorResponse(
        ErrorCode.VALIDATION_FAILED,
        null,
        { validationErrors }
    );
}

/**
 * Handle authentication errors securely
 */
export function handleAuthError(reason: 'unauthorized' | 'forbidden' | 'expired'): SecureErrorResponse {
    const codeMap = {
        unauthorized: ErrorCode.UNAUTHORIZED,
        forbidden: ErrorCode.FORBIDDEN,
        expired: ErrorCode.SESSION_EXPIRED,
    };

    return createErrorResponse(codeMap[reason]);
}

/**
 * Handle file upload errors securely
 */
export function handleFileError(reason: 'type' | 'size' | 'upload'): SecureErrorResponse {
    const codeMap = {
        type: ErrorCode.INVALID_FILE_TYPE,
        size: ErrorCode.FILE_TOO_LARGE,
        upload: ErrorCode.FILE_UPLOAD_FAILED,
    };

    return createErrorResponse(codeMap[reason]);
}

// ============================================================================
// SAFE ERROR WRAPPER
// ============================================================================

/**
 * Wrap async function with secure error handling
 */
export function withSecureErrorHandling<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    errorCode: ErrorCode = ErrorCode.OPERATION_FAILED
): T {
    return (async (...args: Parameters<T>) => {
        try {
            return await fn(...args);
        } catch (error) {
            return createErrorResponse(errorCode, error);
        }
    }) as T;
}
