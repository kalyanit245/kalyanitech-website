# Kalyani Technologies — Marketing Website PRD

## Original problem statement
"need a complete website for my software company Kalyani Technologies with given logo" — logo: 4-pointed teal star sparkle + "KALYANI" teal serif wordmark + coral "TECHNOLOGIES", on dark navy-black.

## Architecture
- **Frontend**: Vite + React 19 + TS, Tailwind v4, shadcn/ui (base-ui), motion (framer-motion) scroll reveals + masked hero line reveal + parallax star, lenis smooth scrolling. Pages: `/` (Home), `/admin` (enquiries dashboard). Fonts: Lora Variable (headings), Plus Jakarta Sans (body), JetBrains Mono (metrics).
- **Backend**: FastAPI + motor (MongoDB). Routes: `GET /api/`, `POST /api/inquiries`, `GET /api/inquiries` (sorted desc). Indexes: inquiries.id (unique), inquiries.created_at (desc).
- **Design**: dark obsidian (#070B12), teal (#14B8A6), coral (#FF5A36); grain overlay; editorial marquee; bento services grid; staggered portfolio with filter tabs; stats counters; testimonials; split contact section. Favicon = SVG star mark. Original logo at `frontend/public/logo.png` (recreated as crisp SVG/text lockup in nav/footer).

## User personas
- Prospective client (CTO/founder) evaluating the studio → browses services/work, submits enquiry.
- Company team → views incoming enquiries at /admin.

## Core requirements (static)
Marketing site with hero, services, work, about, testimonials, contact form persisted to DB, admin enquiry list.

## Implemented
- 2026-10-04: Full site v1 — all sections above, working enquiry form (POST /api/inquiries) with validation + Sonner toasts, /admin enquiries table, mobile nav, favicon, typecheck clean, e2e verified via public URL (curl + browser pass).

## Backlog
- P0: Protect /admin with auth (login) before going live.
- P1: Email notification on new enquiry (Resend).
- P1: Real portfolio content/images from the client.
- P2: Blog/insights, careers page, case-study detail pages, SEO audit, i18n.

## Next tasks
1. Confirm real service list, contact email/phone, and portfolio items with the client.
2. Add admin auth, then email notifications.
