# Row Level Security Migration

This migration enables Row Level Security (RLS) on all database tables.

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `prisma/migrations/20260211_enable_rls/migration.sql`
5. Click **Run** to execute the migration
6. Verify success (should see "Success. No rows returned")

## Manual Application (Optional)

If you prefer to apply manually using `psql`:

```bash
psql "postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:5432/postgres" -f "prisma/migrations/20260211_enable_rls/migration.sql"
```

Replace with your actual database connection string from `.env.local`

## Option 3: Using Supabase CLI

If you have Supabase CLI installed:

```bash
supabase db execute -f prisma/migrations/20260211_enable_rls/migration.sql
```

## Verification

After applying the migration, verify RLS is enabled by running this query in SQL Editor:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

All tables should show `rowsecurity = true`.

## Check Policies

Verify policies were created:

```sql
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

You should see multiple policies for each table.
