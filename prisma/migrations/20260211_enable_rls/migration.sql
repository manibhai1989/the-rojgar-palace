-- Enable Row Level Security (RLS) on all tables
-- This migration fixes the critical security vulnerability where tables 
-- containing sensitive data were exposed without RLS protection

-- ============================================================================
-- AUTHENTICATION & SESSION TABLES
-- ============================================================================

-- User Table: Contains emails, 2FA secrets, and personal information
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own record
CREATE POLICY "Users can view own record" ON "User"
  FOR SELECT
  USING (auth.uid()::text = id);

-- Policy: Users can update their own record
CREATE POLICY "Users can update own record" ON "User"
  FOR UPDATE
  USING (auth.uid()::text = id);

-- Policy: Allow user creation during sign-up (handled by auth system)
CREATE POLICY "Enable insert for authentication" ON "User"
  FOR INSERT
  WITH CHECK (true);

-- Account Table: Contains OAuth tokens (access_token, refresh_token, id_token)
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own OAuth accounts
CREATE POLICY "Users can view own accounts" ON "Account"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can manage own accounts" ON "Account"
  FOR ALL
  USING (auth.uid()::text = "userId");

-- Session Table: Contains session tokens
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own sessions
CREATE POLICY "Users can view own sessions" ON "Session"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can manage own sessions" ON "Session"
  FOR ALL
  USING (auth.uid()::text = "userId");

-- VerificationToken Table: Should only be accessible server-side
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;

-- No public policies - only accessible via service role

-- AuditLog Table: Contains IP addresses and user agents
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own audit logs
CREATE POLICY "Users can view own audit logs" ON "AuditLog"
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- Policy: System can insert audit logs
CREATE POLICY "Enable insert for system" ON "AuditLog"
  FOR INSERT
  WITH CHECK (true);

-- Profile Table: Contains personal information (age, qualification, etc.)
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile" ON "Profile"
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON "Profile"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

-- Policy: Users can create their own profile
CREATE POLICY "Users can create own profile" ON "Profile"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- ============================================================================
-- APPLICATION & USER DATA TABLES
-- ============================================================================

-- Application Table: User's job applications
ALTER TABLE "Application" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own applications
CREATE POLICY "Users can view own applications" ON "Application"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create own applications" ON "Application"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own applications" ON "Application"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own applications" ON "Application"
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- Bookmark Table: User's bookmarked jobs
ALTER TABLE "Bookmark" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON "Bookmark"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create own bookmarks" ON "Bookmark"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own bookmarks" ON "Bookmark"
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ============================================================================
-- PUBLIC CONTENT TABLES (Read-only public access)
-- ============================================================================

-- Job Table: Public job listings
ALTER TABLE "Job" ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read jobs (public content)
CREATE POLICY "Public read access for jobs" ON "Job"
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can create/update jobs (admin functionality)
CREATE POLICY "Authenticated users can insert jobs" ON "Job"
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update jobs" ON "Job"
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete jobs" ON "Job"
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- AdmitCard Table: Public admit card listings
ALTER TABLE "AdmitCard" ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access
CREATE POLICY "Public read access for admit cards" ON "AdmitCard"
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can manage
CREATE POLICY "Authenticated users can manage admit cards" ON "AdmitCard"
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Result Table: Public result listings
ALTER TABLE "Result" ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access
CREATE POLICY "Public read access for results" ON "Result"
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can manage
CREATE POLICY "Authenticated users can manage results" ON "Result"
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- AnswerKey Table: Public answer key listings
ALTER TABLE "AnswerKey" ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access
CREATE POLICY "Public read access for answer keys" ON "AnswerKey"
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can manage
CREATE POLICY "Authenticated users can manage answer keys" ON "AnswerKey"
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Syllabus Table: Public syllabus listings
ALTER TABLE "Syllabus" ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access
CREATE POLICY "Public read access for syllabus" ON "Syllabus"
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can manage
CREATE POLICY "Authenticated users can manage syllabus" ON "Syllabus"
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Admission Table: Public admission listings
ALTER TABLE "Admission" ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access
CREATE POLICY "Public read access for admissions" ON "Admission"
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can manage
CREATE POLICY "Authenticated users can manage admissions" ON "Admission"
  FOR ALL
  USING (auth.uid() IS NOT NULL);
