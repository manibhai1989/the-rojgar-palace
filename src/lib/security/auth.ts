/**
 * Authentication & Authorization Library
 * Provides session validation and role-based access control
 */

import { cookies } from 'next/headers';
import { createErrorResponse, ErrorCode } from './errors';

// ============================================================================
// TYPES
// ============================================================================

export interface User {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
}

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    GUEST = 'GUEST',
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Get current user from session
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session-token');

        if (!sessionToken) {
            return null;
        }

        // TODO: Implement actual session validation with your auth provider
        // This is a placeholder - integrate with NextAuth, Clerk, or your auth solution

        // For now, return null (no authentication implemented yet)
        return null;
    } catch (error) {
        console.error('[Auth] Failed to get current user:', error);
        return null;
    }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();
    return user !== null;
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;

    return user.role === role;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
    return await hasRole(UserRole.ADMIN);
}

// ============================================================================
// AUTHORIZATION GUARDS
// ============================================================================

/**
 * Require authentication
 * Throws error if user is not authenticated
 */
export async function requireAuth(): Promise<User> {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('UNAUTHORIZED');
    }

    return user;
}

/**
 * Require admin role
 * Throws error if user is not an admin
 */
export async function requireAdmin(): Promise<User> {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('UNAUTHORIZED');
    }

    if (user.role !== UserRole.ADMIN) {
        throw new Error('FORBIDDEN');
    }

    return user;
}

/**
 * Require specific role
 * Throws error if user doesn't have the required role
 */
export async function requireRole(role: UserRole): Promise<User> {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('UNAUTHORIZED');
    }

    if (user.role !== role) {
        throw new Error('FORBIDDEN');
    }

    return user;
}

// ============================================================================
// PERMISSION CHECKING
// ============================================================================

/**
 * Check if user can perform action on resource
 */
export async function canPerformAction(
    action: 'create' | 'read' | 'update' | 'delete',
    resource: string
): Promise<boolean> {
    const user = await getCurrentUser();

    if (!user) return false;

    // Admins can do everything
    if (user.role === UserRole.ADMIN) return true;

    // Define permission rules
    const permissions: Record<UserRole, Record<string, string[]>> = {
        [UserRole.ADMIN]: {
            '*': ['create', 'read', 'update', 'delete'],
        },
        [UserRole.USER]: {
            'profile': ['read', 'update'],
            'application': ['create', 'read'],
        },
        [UserRole.GUEST]: {
            'jobs': ['read'],
            'results': ['read'],
        },
    };

    const userPermissions = permissions[user.role];
    if (!userPermissions) return false;

    // Check wildcard permission
    if (userPermissions['*']?.includes(action)) return true;

    // Check resource-specific permission
    return userPermissions[resource]?.includes(action) || false;
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

/**
 * Log security event
 */
export function logSecurityEvent(
    event: 'login' | 'logout' | 'unauthorized_access' | 'forbidden_action' | 'data_modification',
    details?: Record<string, any>
): void {
    console.log('[Security Audit]', {
        event,
        timestamp: new Date().toISOString(),
        ...details,
    });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Wrap server action with authentication check
 */
export function withAuth<T extends (...args: any[]) => Promise<any>>(
    action: T
): T {
    return (async (...args: Parameters<T>) => {
        try {
            await requireAuth();
            return await action(...args);
        } catch (error: any) {
            if (error.message === 'UNAUTHORIZED') {
                logSecurityEvent('unauthorized_access');
                return createErrorResponse(ErrorCode.UNAUTHORIZED);
            }
            throw error;
        }
    }) as T;
}

/**
 * Wrap server action with admin check
 */
export function withAdminAuth<T extends (...args: any[]) => Promise<any>>(
    action: T
): T {
    return (async (...args: Parameters<T>) => {
        try {
            await requireAdmin();
            return await action(...args);
        } catch (error: any) {
            if (error.message === 'UNAUTHORIZED') {
                logSecurityEvent('unauthorized_access');
                return createErrorResponse(ErrorCode.UNAUTHORIZED);
            }
            if (error.message === 'FORBIDDEN') {
                logSecurityEvent('forbidden_action');
                return createErrorResponse(ErrorCode.FORBIDDEN);
            }
            throw error;
        }
    }) as T;
}
