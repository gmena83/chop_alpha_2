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

**Note:** The platform MVP is fully implemented with all core features complete:

### Core Features (12)
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

### LMS Learner Interface
- **Learner Dashboard** (`/[locale]/dashboard`): Shows enrolled modules, progress stats, earned milestones
- **Module Viewer** (`/[locale]/modules/[moduleId]`): Step-by-step lesson viewer with sidebar navigation
- **Reusable Components** (`src/components/lms/`):
  - ProgressCard: Module cards with progress bars and status
  - MilestoneCard: Achievement badges with points
  - StepNavigation: Step sidebar with completion tracking
  - VideoPlayer: YouTube/Vimeo/direct video embed support
  - StepContent: Unified content renderer for all step types

### Staff Portal
- **Staff Dashboard** (`/[locale]/staff`): Overview stats, quick actions, system status
- **Module Management** (`/[locale]/staff/modules`): 
  - Create, edit, and organize learning modules
  - Manage steps with video uploads, video URLs, markdown content, and checklists
  - Direct video file uploads (MP4, WebM, OGG, MOV up to 500MB) via Replit Object Storage
  - YouTube/Vimeo embed URL support as alternative to uploads
  - Toggle module/step active status
  - Bilingual content support (English/Spanish)
  - **Quiz Management**: Add quiz questions to video steps with configurable passing thresholds (70%, 80%, 90%, 100%)
  - **Helper Text & Extra Help**: Add supplementary content and link additional video/text resources for learner support
- **User Management** (`/[locale]/staff/users`):
  - View all users with pagination and filtering
  - Create new user accounts with role assignment
  - Edit user details and role permissions
  - Role-based access (admin, super_admin, research_staff)
- **Settings** (`/[locale]/staff/settings`): Account info, database status, localization
- **Access Control**: Only accessible to admin, super_admin, and research_staff roles

### Learning Paths Schema
- `learning_paths`: Programs grouping multiple modules
- `learning_path_modules`: Module ordering with prerequisites
- `user_learning_paths`: User enrollment and progress tracking

### Public-Facing Pages (No Login Required)
- **Homepage** (`/[locale]`): "What is Independent Mobility?" with hero, mobility icons, testimonials, research cards
- **Mobility Options** (`/[locale]/mobility/`):
  - **Pedestrian** (`/pedestrian`): Walking skills, crosswalk safety, route planning
  - **Biking** (`/biking`): Cycling skills, traffic rules, route planning
  - **Driving** (`/driving`): Path to licensing with autism-informed support
  - **Public Transit** (`/public-transit`): Bus/train navigation, reading schedules
  - **Rideshare** (`/rideshare`): App usage, safety verification, budgeting
- **Reusable Public Components** (`src/components/public/`):
  - PublicHeader: Navigation with dropdown menus
  - PublicFooter: CHOP Research Institute footer
  - MobilityHero: Hero section with diagonal image overlay