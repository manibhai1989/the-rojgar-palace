-- Add explicit policy for VerificationToken table
-- This resolves the Supabase warning: "RLS enabled but no policies exist"

-- VerificationToken should ONLY be accessible by server-side code (NextAuth)
-- using service role credentials that bypass RLS.
-- This policy explicitly documents that public access is denied.

CREATE POLICY "No public access to verification tokens" ON "VerificationToken"
  FOR ALL
  USING (false);

-- Note: NextAuth server-side code uses service role credentials
-- which bypass RLS entirely, so this policy doesn't affect functionality.
