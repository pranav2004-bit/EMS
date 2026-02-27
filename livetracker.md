# LIVETRACKER.md
# Workplace Ethical Risk Reporting Platform (SaaS)

---

## Project Overview

A secure, enterprise-grade SaaS platform enabling confidential anonymous reporting of ethical concerns within corporate environments. The system provides structured case lifecycle management, executive oversight, and secure evidence management with strict data privacy and role-based governance.

**Roles:**
- **Reporter** (anonymous): Submits complaints, uploads evidence, tracks case by Case ID. No identity stored.
- **HR / Investigator**: Authenticated. Manages case lifecycle, reviews evidence, updates status, accesses analytics.
- **Admin**: Authenticated. Creates/manages HR accounts, oversees platform configuration and usage metrics.

---

## Tech Stack Confirmation

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), TypeScript, React Query, Tailwind CSS, Axios |
| Backend | Django, Django REST Framework, JWT Authentication |
| Database | Supabase PostgreSQL (encrypted at rest) |
| Storage | Supabase Private Bucket (signed URL access) |
| Auth | JWT via HTTP-only cookies, bcrypt password hashing |
| Deployment | Frontend → Vercel / Cloud; Backend → Container environment |

---

## Database Schema (TRD-Confirmed)

### `users`
`id`, `name`, `email`, `password_hash`, `role` (admin/hr), `is_active`, `created_at`, `updated_at`

### `complaints`
`id`, `case_id` (UUID, unique), `category`, `title`, `description`, `incident_date`, `location`, `accused_name`, `accused_role`, `impact_flags`, `urgency_level`, `status`, `resolution_note`, `created_at`, `updated_at`

### `complaint_attachments`
`id`, `complaint_id` (FK → complaints.id), `file_name`, `file_path`, `file_type`, `file_size`, `uploaded_at`

> ⚠️ No reporter-related table exists. Reporter identity is never stored.

---

## API Endpoints (TRD-Confirmed)

| Scope | Method | Endpoint |
|---|---|---|
| Public | POST | `/api/access-key/validate` |
| Public | POST | `/api/complaints/` |
| Public | GET | `/api/complaints/track/{case_id}/` |
| HR | POST | `/api/hr/login` |
| HR | GET | `/api/hr/complaints` |
| HR | PATCH | `/api/hr/complaints/{id}` |
| HR | GET | `/api/hr/analytics` |
| Admin | POST | `/api/admin/login` |
| Admin | POST | `/api/admin/hr-users` |
| Admin | PATCH | `/api/admin/hr-users/{id}` |
| Admin | GET | `/api/admin/overview` |

---

## Phase-Based Execution Plan

---

### Phase 1: Project Setup
**Goal:** Initialize both frontend and backend projects with correct folder structure, dependencies, and environment configuration.

**Status:** `Completed`

#### Task 1.1: Backend Initialization (Django)
| Subtask | Description | Status |
|---|---|---|
| 1.1.1 | Create Django project named `ethical_reporting` | Completed |
| 1.1.2 | Create Django apps: `complaints`, `users`, `analytics` | Completed |
| 1.1.3 | Install dependencies: `djangorestframework`, `djangorestframework-simplejwt`, `django-cors-headers`, `psycopg2-binary`, `python-decouple`, `Pillow` | Completed |
| 1.1.4 | Create `requirements.txt` with all pinned dependencies | Completed |
| 1.1.5 | Configure `settings.py`: installed apps, CORS, REST framework defaults, JWT settings | Completed |
| 1.1.6 | Create `.env` file with placeholders: `SUPABASE_DB_URL`, `SUPABASE_STORAGE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `DJANGO_SECRET_KEY`, `ACCESS_KEY_VALUE`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Completed |
| 1.1.7 | Configure `settings.py` to load all values from `.env` via `decouple` | Completed |
| 1.1.8 | Configure Supabase PostgreSQL as the database backend in `settings.py` | Completed |
| 1.1.9 | Define folder structure: `ethical_reporting/`, `apps/complaints/`, `apps/users/`, `apps/analytics/`, `core/` (middleware, permissions, utils) | Completed |

#### Task 1.2: Frontend Initialization (Next.js)
| Subtask | Description | Status |
|---|---|---|
| 1.2.1 | Initialize Next.js App Router project with TypeScript: `npx create-next-app@latest` | Completed |
| 1.2.2 | Install dependencies: `axios`, `@tanstack/react-query`, `tailwindcss`, `clsx` | Completed |
| 1.2.3 | Configure Tailwind CSS with custom design tokens (Deep Navy, Charcoal, Muted Blue) | Completed |
| 1.2.4 | Set up folder structure: `app/`, `components/`, `lib/`, `hooks/`, `types/`, `context/` | Completed |
| 1.2.5 | Create `.env.local` with: `NEXT_PUBLIC_API_BASE_URL` | Completed |
| 1.2.6 | Configure Axios base instance in `lib/axios.ts` with `withCredentials: true` | Completed |
| 1.2.7 | Set up React Query provider in root layout | Completed |

#### Task 1.3: Version Control Setup
| Subtask | Description | Status |
|---|---|---|
| 1.3.1 | Initialize Git repository | Completed |
| 1.3.2 | Create `.gitignore` excluding `.env`, `node_modules`, `__pycache__`, `*.pyc`, `.next` | Completed |

**Phase 1 Output:** Runnable Django dev server + Next.js dev server; no broken imports; `.env` variables loaded correctly.

---

### Phase 2: Authentication Layer
**Goal:** Implement JWT-based authentication for HR and Admin roles. Admin credentials are backend-defined via environment variables.

**Status:** `Completed`

#### Task 2.1: Database Models — Users
| Subtask | Description | Status |
|---|---|---|
| 2.1.1 | Create `CustomUser` model in `apps/users/models.py` with fields: `id`, `name`, `email`, `password_hash`, `role` (choices: admin/hr), `is_active`, `created_at`, `updated_at` | Completed |
| 2.1.2 | Use `AbstractBaseUser` + `BaseUserManager` for custom user model | Completed |
| 2.1.3 | Register `CustomUser` as `AUTH_USER_MODEL` in `settings.py` | Completed |
| 2.1.4 | Create and run migration for `users` table | Completed |

#### Task 2.2: Admin User Bootstrap
| Subtask | Description | Status |
|---|---|---|
| 2.2.1 | Create Django management command `create_admin` that reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env` | Completed |
| 2.2.2 | Command creates admin user only if none exists; idempotent | Completed |
| 2.2.3 | Hash password using bcrypt via Django's `make_password` | Completed |

#### Task 2.3: JWT Authentication Views
| Subtask | Description | Status |
|---|---|---|
| 2.3.1 | Implement `POST /api/hr/login` view: validates email/password, returns JWT via HTTP-only cookie, role=hr enforced | Completed |
| 2.3.2 | Implement `POST /api/admin/login` view: validates email/password, returns JWT via HTTP-only cookie, role=admin enforced | Completed |
| 2.3.3 | Configure `simplejwt` settings: access token TTL, refresh token TTL, cookie names | Completed |
| 2.3.4 | Implement logout endpoint clearing HTTP-only cookie | Completed |

#### Task 2.4: Permission Classes
| Subtask | Description | Status |
|---|---|---|
| 2.4.1 | Create `IsHR` custom DRF permission class in `core/permissions.py`: allows only authenticated users with `role=hr` | Completed |
| 2.4.2 | Create `IsAdmin` custom DRF permission class: allows only authenticated users with `role=admin` | Completed |
| 2.4.3 | Create `IsHROrAdmin` combined permission class | Completed |

#### Task 2.5: Frontend — Auth Flow
| Subtask | Description | Status |
|---|---|---|
| 2.5.1 | Create HR login page: `app/hr/login/page.tsx` | Completed |
| 2.5.2 | Create Admin login page: `app/admin/login/page.tsx` | Completed |
| 2.5.3 | Implement auth context/store tracking role + auth state in `context/AuthContext.tsx` | Completed |
| 2.5.4 | Implement route guard HOC/middleware: redirect unauthenticated HR to `/hr/login`; redirect unauthenticated Admin to `/admin/login` | Completed |
| 2.5.5 | Implement logout function clearing auth state and calling logout endpoint | Completed |

**Phase 2 Output:** HR and Admin can log in and receive JWT cookies. Protected routes block unauthenticated access. Admin bootstrap command works correctly.

---

### Phase 3: Reporter Module (Anonymous)
**Goal:** Implement public-facing anonymous complaint submission, validated by access key. No identity stored.

**Status:** `Completed`

#### Task 3.1: Access Key Validation
| Subtask | Description | Status |
|---|---|---|
| 3.1.1 | Store `ACCESS_KEY_VALUE` in `.env` on backend | Completed |
| 3.1.2 | Implement `POST /api/access-key/validate`: compares submitted key against env var, returns boolean + short-lived session token or flag | Completed |
| 3.1.3 | Apply rate limiting middleware on this endpoint | Completed |
| 3.1.4 | Frontend: Create Access Key page `app/report/page.tsx` with single input field and confidentiality statement | Completed |
| 3.1.5 | On valid access key, redirect to complaint form; on invalid, show error | Completed |

#### Task 3.2: Complaint Submission
| Subtask | Description | Status |
|---|---|---|
| 3.2.1 | Create `Complaint` model in `apps/complaints/models.py` with all TRD-defined fields | Completed |
| 3.2.2 | `case_id` field: UUID4, auto-generated, unique, non-sequential | Completed |
| 3.2.3 | Default `status` = `"Open"` | Completed |
| 3.2.4 | Create and run migration for `complaints` table | Completed |
| 3.2.5 | Implement `POST /api/complaints/` view: validates input, creates complaint record, returns `case_id` only | Completed |
| 3.2.6 | Apply input validation and sanitization on all complaint fields | Completed |
| 3.2.7 | Implement severity classifier (rule-based) based on `urgency_level` and `impact_flags` fields | Completed |
| 3.2.8 | Response must return only `case_id`; no other identifying data echoed back | Completed |

#### Task 3.3: Evidence Upload
| Subtask | Description | Status |
|---|---|---|
| 3.3.1 | Create `ComplaintAttachment` model in `apps/complaints/models.py` with all TRD-defined fields | Completed |
| 3.3.2 | Create and run migration for `complaint_attachments` table | Completed |
| 3.3.3 | Implement file upload logic: validate file type (whitelist), validate file size limit | Completed |
| 3.3.4 | Upload file to Supabase private bucket using `SUPABASE_SERVICE_KEY` | Completed |
| 3.3.5 | Store file metadata in `complaint_attachments` table; store only Supabase storage path (not public URL) | Completed |
| 3.3.6 | Evidence upload is optional; complaint can be submitted without attachments | Completed |

#### Task 3.4: Frontend — Complaint Form
| Subtask | Description | Status |
|---|---|---|
| 3.4.1 | Create complaint form page: `app/report/form/page.tsx` | Completed |
| 3.4.2 | Form sections: category, title, description, incident date, location, accused name, accused role, impact flags (checkboxes), urgency level | Completed |
| 3.4.3 | No identity fields on form (no name, email, employee ID) | Completed |
| 3.4.4 | Evidence upload area with drag-and-drop or file picker | Completed |
| 3.4.5 | On successful submission, display Case ID prominently with instruction to save it | Completed |
| 3.4.6 | Clear form state after submission | Completed |

**Phase 3 Output:** Anonymous user can submit a complaint via access key → form → Case ID display. Files go to private Supabase bucket. No identity stored.

---

### Phase 4: HR Module
**Goal:** Implement HR-authenticated case management including case list, detail view, status transitions, resolution notes, and evidence access.

**Status:** `Completed`

#### Task 4.1: Case List Endpoint
| Subtask | Description | Status |
|---|---|---|
| 4.1.1 | Implement `GET /api/hr/complaints`: returns paginated list of complaints | Completed |
| 4.1.2 | Support query params: `status`, `category`, `urgency_level`, `search` (by case_id) | Completed |
| 4.1.3 | Apply `IsHR` or `IsHROrAdmin` permission on this endpoint | Completed |
| 4.1.4 | Serializer returns: `id`, `case_id`, `category`, `title`, `status`, `urgency_level`, `created_at` (no internal identity fields) | Completed |

#### Task 4.2: Case Detail & Status Update
| Subtask | Description | Status |
|---|---|---|
| 4.2.1 | Implement `PATCH /api/hr/complaints/{id}`: allows updating `status` and `resolution_note` only | Completed |
| 4.2.2 | Enforce valid status transitions: `Open → Under Review → Resolved` | Completed |
| 4.2.3 | Apply `IsHR` or `IsHROrAdmin` permission on this endpoint | Completed |
| 4.2.4 | Return updated complaint record on success | Completed |

#### Task 4.3: Evidence Access (Signed URLs)
| Subtask | Description | Status |
|---|---|---|
| 4.3.1 | Implement signed URL generation endpoint using Supabase service key | Completed |
| 4.3.2 | Signed URLs must be time-limited (e.g., 60 minutes) | Completed |
| 4.3.3 | Only authenticated HR/Admin can request signed URLs | Completed |
| 4.3.4 | No public URL ever exposed for attachment files | Completed |

#### Task 4.4: Frontend — HR Dashboard
| Subtask | Description | Status |
|---|---|---|
| 4.4.1 | Create HR layout: `app/hr/layout.tsx` with left sidebar + top bar with role label | Completed |
| 4.4.2 | Create dashboard page: `app/hr/dashboard/page.tsx` with summary cards (open, under review, resolved counts) | Completed |
| 4.4.3 | Create case list page: `app/hr/cases/page.tsx` with data grid (sortable, filterable, searchable by Case ID) | Completed |
| 4.4.4 | Create case detail page: `app/hr/cases/[id]/page.tsx` with structured content layout | Completed |
| 4.4.5 | Status control dropdown on detail page with valid transition options only | Completed |
| 4.4.6 | Resolution notes textarea on detail page | Completed |
| 4.4.7 | Evidence viewer: list attachments, button to request signed URL and open file | Completed |

**Phase 4 Output:** Authenticated HR user can list, filter, view, update status, add resolution notes, and access evidence via signed URLs.

---

### Phase 5: Admin Module
**Goal:** Implement Admin-authenticated HR account management and platform oversight.

**Status:** `Completed`

#### Task 5.1: HR Account Management Endpoints
| Subtask | Description | Status |
|---|---|---|
| 5.1.1 | Implement `POST /api/admin/hr-users`: creates new HR account with name, email, password; hashes password | Completed |
| 5.1.2 | Enforce role=hr on newly created accounts; Admin cannot assign admin role | Completed |
| 5.1.3 | Implement `PATCH /api/admin/hr-users/{id}`: allows toggling `is_active`, triggering password reset | Completed |
| 5.1.4 | Password reset: generate temporary password, hash and store, return via response (no email service in scope) | Completed |
| 5.1.5 | Apply `IsAdmin` permission on all admin endpoints | Completed |

#### Task 5.2: Admin Overview Endpoint
| Subtask | Description | Status |
|---|---|---|
| 5.2.1 | Implement `GET /api/admin/overview`: returns count of HR users, total complaints, complaints by status | Completed |
| 5.2.2 | Apply `IsAdmin` permission | Completed |

#### Task 5.3: Frontend — Admin Dashboard
| Subtask | Description | Status |
|---|---|---|
| 5.3.1 | Create Admin layout: `app/admin/layout.tsx` with sidebar and role label | Completed |
| 5.3.2 | Create overview page: `app/admin/dashboard/page.tsx` with metric cards from `/api/admin/overview` | Completed |
| 5.3.3 | Create HR management page: `app/admin/users/page.tsx` with clean table layout | Completed |
| 5.3.4 | Table columns: name, email, status (active/inactive), actions | Completed |
| 5.3.5 | Implement "Create HR" modal with name, email, password fields | Completed |
| 5.3.6 | Implement Active/Inactive toggle per HR user row | Completed |
| 5.3.7 | Implement "Reset Password" action per HR user row | Completed |

**Phase 5 Output:** Admin can create HR accounts, toggle active status, reset passwords, and view platform overview metrics.

---

### Phase 6: Evidence Storage
**Goal:** Ensure all file storage operations use Supabase private bucket with validated uploads and signed URL retrieval only.

**Status:** `Completed`

#### Task 6.1: Supabase Storage Integration
| Subtask | Description | Status |
|---|---|---|
| 6.1.1 | Configure Supabase private bucket (bucket must be private, not public) | Completed |
| 6.1.2 | Create `core/storage.py` utility: upload file to bucket, generate signed URL, delete file | Completed |
| 6.1.3 | Use `SUPABASE_SERVICE_KEY` (not anon key) for all storage operations | Completed |

#### Task 6.2: File Validation Middleware
| Subtask | Description | Status |
|---|---|---|
| 6.2.1 | Define allowed file types whitelist: `pdf`, `png`, `jpg`, `jpeg`, `docx` | Completed |
| 6.2.2 | Enforce max file size limit (define in `.env` or config) | Completed |
| 6.2.3 | Validate MIME type, not just extension | Completed |
| 6.2.4 | Reject and return 400 on invalid file type or size | Completed |

#### Task 6.3: Signed URL Generation
| Subtask | Description | Status |
|---|---|---|
| 6.3.1 | Implement backend endpoint to generate signed URL per attachment ID | Completed |
| 6.3.2 | Signed URL TTL: 3600 seconds (1 hour) | Completed |
| 6.3.3 | Endpoint restricted to authenticated HR/Admin only | Completed |
| 6.3.4 | Never store or return signed URLs in database; always generate on demand | Completed |

**Phase 6 Output:** All files stored in private Supabase bucket. No file accessible without a time-limited signed URL. Unauthorized users cannot access any file.

---

### Phase 7: Analytics Module
**Goal:** Implement analytics data endpoints for HR consumption covering volume, status distribution, trends, and resolution rate.

**Status:** `Completed`

#### Task 7.1: Analytics Endpoint
| Subtask | Description | Status |
|---|---|---|
| 7.1.1 | Implement `GET /api/hr/analytics`: accepts optional query params `start_date`, `end_date`, `category` | Completed |
| 7.1.2 | Return: complaint volume by category (grouped count) | Completed |
| 7.1.3 | Return: status distribution (count per status value) | Completed |
| 7.1.4 | Return: trend analysis — complaints grouped by month (created_at) | Completed |
| 7.1.5 | Return: resolution rate — (resolved count / total count) × 100 | Completed |
| 7.1.6 | Apply `IsHR` or `IsHROrAdmin` permission | Completed |
| 7.1.7 | All aggregations performed server-side via Django ORM (no raw SQL) | Completed |

#### Task 7.2: Frontend — Analytics Page
| Subtask | Description | Status |
|---|---|---|
| 7.2.1 | Create analytics page: `app/hr/analytics/page.tsx` | Completed |
| 7.2.2 | Complaint volume by category: display as bar chart or table | Completed |
| 7.2.3 | Status distribution: display as labeled count cards or pie-style summary | Completed |
| 7.2.4 | Monthly trend: display as line chart or table | Completed |
| 7.2.5 | Resolution rate: display as percentage metric card | Completed |
| 7.2.6 | Date range filter controls | Completed |

**Phase 7 Output:** HR can view analytics dashboard with volume, status, trend, and resolution data. All data is server-aggregated and role-protected.

---

### Phase 8: Security Hardening
**Goal:** Apply all security controls defined in PRD/TRD across the entire application.

**Status:** `Completed`

#### Task 8.1: Backend Security
| Subtask | Description | Status |
|---|---|---|
| 8.1.1 | Enable CSRF protection on all non-safe endpoints | Completed |
| 8.1.2 | Confirm JWT stored only in HTTP-only cookies (no `localStorage`) | Completed |
| 8.1.3 | Apply rate limiting on `POST /api/access-key/validate` | Completed |
| 8.1.4 | Apply rate limiting on `POST /api/hr/login` and `POST /api/admin/login` | Completed |
| 8.1.5 | Confirm `GET /api/complaints/track/{case_id}/` does not expose complaint list | Completed |
| 8.1.6 | Confirm `POST /api/complaints/` response returns only `case_id` | Completed |
| 8.1.7 | Confirm no complaint list endpoint is publicly accessible | Completed |
| 8.1.8 | Ensure all Django `DEBUG=False` in production config | Completed |
| 8.1.9 | Set `ALLOWED_HOSTS` and `SECURE_*` settings for production | Completed |

#### Task 8.2: Input Validation & Sanitization
| Subtask | Description | Status |
|---|---|---|
| 8.2.1 | Validate and sanitize all DRF serializer inputs (no free-pass fields) | Completed |
| 8.2.2 | Validate file upload MIME type on server-side | Completed |
| 8.2.3 | Validate Case ID format (UUID) before DB query on track endpoint | Completed |

#### Task 8.3: CORS Configuration
| Subtask | Description | Status |
|---|---|---|
| 8.3.1 | Configure `django-cors-headers` to allow only the frontend origin | Completed |
| 8.3.2 | Set `CORS_ALLOW_CREDENTIALS = True` for cookie-based JWT | Completed |

**Phase 8 Output:** All security controls applied. No public endpoint leaks complaint data. Rate limiting active. JWT in HTTP-only cookies only.

---

### Phase 9: UI Implementation
**Goal:** Implement all frontend pages aligned with Design Guide: minimalistic, corporate, WCAG-compliant, no marketing elements.

**Status:** `Completed`

#### Task 9.1: Design System Setup
| Subtask | Description | Status |
|---|---|---|
| 9.1.1 | Configure Tailwind with custom colors: Deep Navy (`#1a2332`), Charcoal (`#2d3748`), Muted Blue (`#4a6fa5`) | Completed |
| 9.1.2 | Set global font to Inter or IBM Plex Sans via Google Fonts / next/font | Completed |
| 9.1.3 | Define 8px spacing grid in Tailwind config | Completed |
| 9.1.4 | Define status badge color tokens: Muted Gray (Open), Amber (Under Review), Green (Resolved) | Completed |
| 9.1.5 | Create reusable components: `Badge`, `Button`, `Input`, `Modal`, `Card`, `Table`, `Sidebar`, `TopBar` | Completed |

#### Task 9.2: Reporter Pages
| Subtask | Description | Status |
|---|---|---|
| 9.2.1 | Access Key page: minimal layout, confidentiality statement, single input, submit button | Completed |
| 9.2.2 | Complaint Form page: structured sections, clear helper text, no identity fields, evidence upload area | Completed |
| 9.2.3 | Case submission success page: Case ID displayed prominently with "Save this ID" instruction | Completed |
| 9.2.4 | Track Case page: single Case ID input, result card with status badge and resolution summary | Completed |

#### Task 9.3: HR Pages
| Subtask | Description | Status |
|---|---|---|
| 9.3.1 | HR login page: minimal form, no branding excess | Completed |
| 9.3.2 | HR dashboard: summary cards with complaint counts by status | Completed |
| 9.3.3 | Case list: data grid with columns (Case ID, Category, Status, Urgency, Date), filter/sort/search | Completed |
| 9.3.4 | Case detail: structured layout, status dropdown, resolution notes textarea, evidence list | Completed |
| 9.3.5 | Analytics page: metric cards, charts/tables for each metric | Completed |

#### Task 9.4: Admin Pages
| Subtask | Description | Status |
|---|---|---|
| 9.4.1 | Admin login page: minimal form | Completed |
| 9.4.2 | Admin overview dashboard: metric cards from overview endpoint | Completed |
| 9.4.3 | HR users table page: clean table, create button, per-row actions | Completed |
| 9.4.4 | Create HR modal: name, email, password inputs with validation | Completed |
| 9.4.5 | Active/Inactive toggle with visual feedback | Completed |
| 9.4.6 | Password reset action with confirmation | Completed |

#### Task 9.5: Accessibility
| Subtask | Description | Status |
|---|---|---|
| 9.5.1 | All inputs have associated `<label>` elements | Completed |
| 9.5.2 | All interactive elements keyboard-navigable | Completed |
| 9.5.3 | All error and validation messages programmatically associated | Completed |
| 9.5.4 | Color contrast meets WCAG AA (4.5:1 for normal text) | Completed |
| 9.5.5 | `aria-*` attributes applied to dynamic regions (modals, toasts, badges) | Completed |

**Phase 9 Output:** All frontend pages implemented, styled per Design Guide, accessible per WCAG AA. No marketing or gradient elements. Formal UX tone throughout.

---

### Phase 10: Testing & Validation
**Goal:** Validate all functional requirements, security boundaries, and UI behavior before deployment.

**Status:** `Completed`

#### Task 10.1: Backend Unit Tests
| Subtask | Description | Status |
|---|---|---|
| 10.1.1 | Test: `POST /api/access-key/validate` — valid key returns success, invalid returns 401 | Completed |
| 10.1.2 | Test: `POST /api/complaints/` — valid payload creates complaint, returns `case_id` only | Completed |
| 10.1.3 | Test: `GET /api/complaints/track/{case_id}/` — valid UUID returns status; invalid UUID returns 404; no list exposed | Completed |
| 10.1.4 | Test: `POST /api/hr/login` — valid HR credentials succeed; admin credentials fail on HR endpoint | Completed |
| 10.1.5 | Test: `GET /api/hr/complaints` — unauthenticated returns 401; wrong role returns 403 | Completed |
| 10.1.6 | Test: `PATCH /api/hr/complaints/{id}` — valid status transition succeeds; invalid transition rejected | Completed |
| 10.1.7 | Test: `POST /api/admin/hr-users` — creates HR account; accessed by non-admin returns 403 | Completed |
| 10.1.8 | Test: `PATCH /api/admin/hr-users/{id}` — toggle active status; password reset | Completed |
| 10.1.9 | Test: File upload — valid type accepted; invalid type rejected with 400 | Completed |
| 10.1.10 | Test: Signed URL endpoint — only accessible to authenticated HR/Admin | Completed |

#### Task 10.2: Security Validation
| Subtask | Description | Status |
|---|---|---|
| 10.2.1 | Confirm no reporter identity in any DB record | Completed |
| 10.2.2 | Confirm `case_id` is UUID and non-sequential | Completed |
| 10.2.3 | Confirm Supabase bucket is private (direct URL returns 403) | Completed |
| 10.2.4 | Confirm signed URL expires after TTL | Completed |
| 10.2.5 | Confirm HR cannot access admin endpoints | Completed |
| 10.2.6 | Confirm Admin cannot be created via API (only via management command) | Completed |
| 10.2.7 | Confirm rate limiting blocks brute force on access-key endpoint | Completed |

#### Task 10.3: Frontend Validation
| Subtask | Description | Status |
|---|---|---|
| 10.3.1 | Verify all route guards redirect unauthenticated users correctly | Completed |
| 10.3.2 | Verify complaint form has no identity fields | Completed |
| 10.3.3 | Verify Case ID displayed after successful submission | Completed |
| 10.3.4 | Verify track case page fetches only by Case ID, no list shown | Completed |
| 10.3.5 | Verify HR pages inaccessible to Admin and vice versa | Completed |
| 10.3.6 | Verify WCAG AA color contrast on all pages | Completed |
| 10.3.7 | Verify keyboard navigation on all interactive elements | Completed |

**Phase 10 Output:** All test cases passed. Security checks verified. No TODO placeholders in codebase.

---

### Phase 11: Deployment Preparation
**Goal:** Prepare production-ready configuration for frontend and backend deployment.

**Status:** `Completed`

#### Task 11.1: Backend Deployment Config
| Subtask | Description | Status |
|---|---|---|
| 11.1.1 | Create production `settings_prod.py`: `DEBUG=False`, `ALLOWED_HOSTS`, `SECURE_SSL_REDIRECT=True`, `SESSION_COOKIE_SECURE=True`, `CSRF_COOKIE_SECURE=True` | Completed |
| 11.1.2 | Create `Dockerfile` for Django backend | Completed |
| 11.1.3 | Create `docker-compose.yml` for local production simulation | Completed |
| 11.1.4 | Create `gunicorn` or `uvicorn` startup command | Completed |
| 11.1.5 | Create `Procfile` or container entrypoint with `create_admin` management command pre-run | Completed |

#### Task 11.2: Frontend Deployment Config
| Subtask | Description | Status |
|---|---|---|
| 11.2.1 | Verify `NEXT_PUBLIC_API_BASE_URL` set for production domain | Completed |
| 11.2.2 | Ensure no secrets in frontend `.env` (only public env vars) | Completed |
| 11.2.3 | Test production build: `npm run build` passes with no errors | Completed |
| 11.2.4 | Configure `next.config.ts` for production: CSP headers, `X-Frame-Options`, `X-Content-Type-Options` | Completed |

#### Task 11.3: Final Pre-Deployment Checklist
| Subtask | Description | Status |
|---|---|---|
| 11.3.1 | All environment variables documented in `README.md` | Completed |
| 11.3.2 | All migrations committed and runnable headlessly | Completed |
| 11.3.3 | `create_admin` management command tested in clean environment | Completed |
| 11.3.4 | Supabase bucket policy confirmed as private in Supabase dashboard | Completed |
| 11.3.5 | API base URL and CORS origins confirmed for production domains | Completed |

**Phase 11 Output:** Production-ready build. Deployment artifacts ready. All configurations documented.

---

## Overall Progress Summary

| Phase | Name | Status |
|---|---|---|
| Phase 1 | Project Setup | Completed |
| Phase 2 | Authentication Layer | Completed |
| Phase 3 | Reporter Module | Completed |
| Phase 4 | HR Module | Completed |
| Phase 5 | Admin Module | Completed |
| Phase 6 | Evidence Storage | Completed |
| Phase 7 | Analytics | Completed |
| Phase 8 | Security Hardening | Completed |
| Phase 9 | UI Implementation | Completed |
| Phase 10 | Testing & Validation | Completed |
| Phase 11 | Deployment Preparation | Completed |

---

*Last updated: 2026-02-27 | All statuses reflect actual implementation state.*
