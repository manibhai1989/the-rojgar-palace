# Deployment & Scaling Guide

## 1. CI/CD Pipeline (GitHub Actions)
The project uses GitHub Actions for continuous integration.
- **Trigger**: Pushes and PRs to `main` branch.
- **Jobs**: Linting, Type Checking, and Build Verification.
- **Workflow File**: `.github/workflows/deploy.yml`

## 2. Infrastructure (Vercel)
- **Framework**: Next.js App Router (v14+)
- **Configuration**: `vercel.json` provides strict security headers and rewrite rules.
- **Environment Variables**:
    - `DATABASE_URL`: Connection string for PostgreSQL (Supabase/Neon).
    - `NEXT_PUBLIC_SENTRY_DSN`: Error tracking endpoint.
    - `NEXTAUTH_SECRET`: Session encryption key.
    - `MAINTENANCE_MODE`: Set to `"true"` to enable the downtime page.

## 3. Monitoring (Sentry)
- **Client-Side**: Tracks React errors and session replays.
- **Server-Side**: Monitors API routes and database queries.
- **Edge**: Tracks edge middleware performance.

## 4. Maintenance & Scaling
- **Maintenance Mode**: 
    1. Go to Vercel Environment Variables.
    2. Set `MAINTENANCE_MODE` to `true`.
    3. Redeploy to activate the global "Under Maintenance" screen.
- **Auto-Scaling**: Handled automatically by Vercel Serverless Functions.
- **Database Scaling**: Upgrade database plan (Supabase/Neon) if connection limits are reached.

## 5. Scaling Strategy
- **Horizontal**: Auto-scaling rules based on CPU > 70%.
- **Peak Handling**: Pre-warm serverless functions before Exam Result declarations.
- **CDN**: Use Edge Caching for static assets to reduce origin load.

## 6. Disaster Recovery
- **Backup Strategy**: Daily automated backups via Supabase (Point-in-Time Recovery).
- **Multi-Region**: Failover replicas in secondary AWS region (e.g., ap-south-1 -> eu-central-1).
- **RTO/RPO Targets**: Recovery Time < 1 hour; Recovery Point < 5 minutes.

## 7. Cost Optimization
- **Asset Caching**: Aggressive cache policies for images/fonts to lower bandwidth costs.
- **Serverless Limits**: Set max execution duration to 10s to prevent runaway function costs.
- **Database Pruning**: Archive audit logs > 90 days to cold storage (S3/R2).

## 8. Maintenance Schedule
| Frequency | Activity | Window (IST) |
|-----------|----------|--------------|
| Weekly    | Dependency Updates | Sun 3:00 AM |
| Monthly   | Security Patches | 1st Sat 2:00 AM |
| Quarterly | Database Vacuum | Last Sun 1:00 AM |
