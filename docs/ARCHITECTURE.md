# System Architecture

## Overview
SarkariResultHub is a highly scalable, Next.js-based web application designed to handle high bursts of traffic typical for exam result portals. It uses a serverless architecture for ease of scaling and maintenance.

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), React, Tailwind CSS, Shadcn UI
- **Backend**: Next.js Server Actions, Route Handlers
- **Database**: PostgreSQL (via Prisma ORM) with Supabase/Neon
- **Caching**: Redis (Upstash) for session storage and API rate limiting
- **Authentication**: NextAuth.js (JWT Strategy)
- **Monitoring**: Sentry (Error Tracking), Vercel Analytics

## Core Components

### 1. Navigation & Routing
- **Layouts**: Root layout handles global providers (Theme, Auth, Language).
- **Navigation**:
    - `Header`: Sticky top bar with mega-menus.
    - `MobileNav`: Fixed bottom bar for mobile devices.
    - `Breadcrumbs`: Auto-generated hierarchical paths.
    - `CommandMenu`: Global search and action palette (Ctrl+K).

### 2. Job Engine
- **Models**: `Job`, `Application`, `Bookmark`.
- **Features**:
    - Dynamic slug-based routing (`/jobs/[slug]`).
    - Smart Eligibility Calculator.
    - Automated "Apply Link" generation with tracking.

### 3. Notification System
- **Real-time**: WebSocket/Polling for immediate alerts.
- **Components**: `NotificationCenter` (Sheet) and `EmergencyOverlay`.
- **Channels**: In-app, Email (planned), Push (Service Worker).

### 4. Accessibility & i18n
- **Context**: `LanguageContext` for switching `en`/`hi`.
- **Controls**: `AccessibilityControls` for font size/contrast.
- **Voice**: Web Speech API integration for voice search and TTS.

### 5. Deployment
- **Platform**: Vercel (Edge Network).
- **CI/CD**: GitHub Actions for automated testing and builds.
- **Security**: strict CSP, Rate Limiting, and MFA.

## Data Flow
1. **User Request** -> Edge Middleware (Rate Limit/Auth Check) -> Next.js Server
2. **Data Fetch** -> Prisma Client -> PostgreSQL (Supabase)
3. **Caching** -> Redis (if applicable) -> Response

## Scaling Strategy
- **Frontend**: Static assets cached on Edge CDN.
- **Backend**: Serverless functions scale to zero or infinity based on demand.
- **Database**: Connection pooling via Prisma Accelerate or Supabase Pooler.

## Performance Checklist
- [ ] **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1.
- [ ] **Image Optimization**: Use `next/image` with AVIF/WebP formats.
- [ ] **Code Splitting**: Dynamic imports for heavy components (e.g., Charts, Editors).
- [ ] **Caching**: Redis for API responses and Edge Caching for static assets.
- [ ] **Bundle Size**: Analyze with `@next/bundle-analyzer` and keep initial JS < 100KB.
- [ ] **Fonts**: Use `next/font` to eliminate layout shift (CLS).
