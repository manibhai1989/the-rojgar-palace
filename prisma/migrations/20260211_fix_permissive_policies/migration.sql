-- Fix overly permissive RLS policies
-- Removes unrestricted INSERT policies on User and AuditLog tables

-- ============================================================================
-- FIX: User Table - Remove unrestricted INSERT
-- ============================================================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Enable insert for authentication" ON "User";

-- Note: User creation is handled by NextAuth server-side with service role
-- No public INSERT policy is needed. NextAuth uses the service role to bypass RLS
-- when creating users during authentication.

-- ============================================================================
-- FIX: AuditLog Table - Remove unrestricted INSERT
-- ============================================================================

-- Drop the overly permissive policy  
DROP POLICY IF EXISTS "Enable insert for system" ON "AuditLog";

-- Note: Audit logs should only be created server-side by the application
-- Server code uses environment variables with sufficient privileges to bypass RLS
-- No public INSERT policy is needed or desired for security reasons.
