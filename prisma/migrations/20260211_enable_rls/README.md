# Apply RLS Migration to Supabase

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://mcryxbvedntuhazozrif.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `prisma/migrations/20260211_enable_rls/migration.sql`
5. Click **Run** to execute the migration
6. Verify success (should see "Success. No rows returned")

## Option 2: Using psql Command Line

Run this command from your terminal:

```bash
psql "postgresql://postgres.mcryxbvedntuhazozrif:DbQ18pUELaZ4SWjr@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres" -f "prisma/migrations/20260211_enable_rls/migration.sql"
```

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
