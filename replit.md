# ETA Platform

## Overview

The ETA (Executive Transition for Autism/ADHD) platform is a secure, web-based interactive system designed for Children's Hospital of Philadelphia (CHOP) research. It serves parents as primary users, with teens and professionals as secondary audiences.

**Core Purpose:**
- Deliver four intervention modules across two phases (Pre-Permit, Learning-to-Drive)
- Provide assessments with individualized guidance and progress tracking
- Support bilingual (English/Spanish) functionality throughout
- Enable AI-assisted coaching with CHOP-approved content using RAG and guardrails
- Maintain HIPAA/FERPA compliance with full audit trails

**Administrative Features:**
- User management for research staff
- Content management and updates
- Analytics dashboard and data exports
- Research randomization capabilities

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Stack
- **Framework:** Next.js with App Router and TypeScript
- **UI:** React with Tailwind CSS and shadcn/ui component library
- **Internationalization:** next-intl for bilingual English/Spanish support with locale routing
- **Data Fetching:** TanStack Query for client-side caching
- **Forms:** React Hook Form with Zod validation

### Backend Stack
- **API Layer:** Next.js Route Handlers (simpler approach) or Fastify service for enterprise separation
- **Database:** PostgreSQL with Drizzle ORM
- **Caching/Jobs:** Redis (optional) for queues, rate-limiting, and background jobs

### Authentication & Authorization
- **Auth Provider:** Auth.js (NextAuth) configured for future OIDC/SAML integration with CHOP SSO
- **Access Control:** Role-based access control (RBAC) with optional attribute-based checks (ABAC)
- **Sessions:** Database-backed sessions for auditability and compliance

### Security & Compliance
- HIPAA/FERPA-aligned design patterns
- Complete audit trails for all user actions
- Export-ready research dataset outputs

### Observability
- **Logging:** Pino for structured server-side logging
- **Tracing:** OpenTelemetry integration
- **Error Tracking:** Sentry or equivalent
- **Testing:** Vitest for unit tests

## External Dependencies

| Category | Service/Tool | Purpose |
|----------|-------------|---------|
| Database | PostgreSQL | Primary data storage |
| Cache | Redis | Queues, rate-limiting, background jobs (optional) |
| Auth | Auth.js/NextAuth | Authentication with future CHOP SSO support |
| AI | RAG system | AI-assisted coaching with guardrails |
| Monitoring | Sentry | Error reporting and tracking |
| Tracing | OpenTelemetry | Distributed tracing |

**Note:** The platform MVP is fully implemented with all 12 core features complete:
1. Next.js with TypeScript, Tailwind CSS, shadcn/ui
2. PostgreSQL with Drizzle ORM
3. Bilingual framework (English/Spanish) with next-intl
4. Auth.js with RBAC for 7 roles
5. Audit logging for security events
6. Module engine with phases, modules, steps
7. Module progression UI with bilingual content
8. Assessment framework with scoring
9. Progress tracking with milestones
10. Admin console with navigation
11. User management and content editing
12. Analytics dashboard and CSV exports