# Workplace Ethical Risk Reporting Platform

## Setup Instructions

### Backend (Django)
1. Navigate to `/backend`.
2. Create and activate a virtual environment.
3. Install dependencies: `pip install -r requirements.txt`.
4. Configure `.env` using `.env.example` as a template.
5. Apply migrations: `python manage.py migrate`.
6. Bootstrap Admin: `python manage.py create_admin`.
7. Start server: `python manage.py runserver`.

### Frontend (Next.js)
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Configure `.env.local`: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api`.
4. Start dev server: `npm run dev`.

## Key Features
- **Anonymous Reporting**: Access Key-gated, no reporter identity stored, UUID Case IDs.
- **Enterprise UI**: Minimalist, corporate-tone, WCAG-compliant.
- **Role-Based Access**: 
    - **Reporter**: Submit and track via Case ID.
    - **HR**: Manage lifecycle, evidence (signed URLs), analytics.
    - **Admin**: System governance, HR account management.
- **Security**: JWT in HTTP-only cookies, Supabase private storage, rate limiting.

## Project Structure
- `/backend/apps/users`: Auth and account management.
- `/backend/apps/complaints`: Core business logic for incidents.
- `/backend/apps/analytics`: Server-side data aggregation.
- `/backend/core`: Shared permissions, storage, and utility logic.
- `/frontend/app`: Next.js App Router (Public, HR, Admin routes).
- `/frontend/context`: Global Auth state management.
