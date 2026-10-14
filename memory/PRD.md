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
- 2026-10-14: Admin auth (email+password, httpOnly cookie sessions: 15-min access + 7-day refresh, /api/auth/login|logout|me|refresh, 5-strike 15-min brute-force lockout, idempotent admin seed from env). /admin now requires login; Login page at /login with silent refresh retry.
- 2026-10-14: Email alerts — every new enquiry emails the owner via Emergent-managed Resend (background task, never blocks the form; recipient = OWNER_EMAIL in backend/.env, currently test sink pending the owner's real address).
- 2026-10-14: Case study pages at /work/:slug (4 projects, shared data in frontend/src/data/projects.ts), linked from the Work grid, with overview/challenge/solution, stack, results and next-project navigation.
- 2026-10-14: Rethemed the entire site to a white/light palette (user request) — soft-white background #F7F9FC, white panels, darker teal for text accents; the hero deploy console and service code editor stay deliberately dark as contrast moments.

## Backlog
- P0: Replace OWNER_EMAIL with the owner's real inbox (ask user); real portfolio content from the client.
- P1: Forgot/reset password flow; enquiry status management in /admin.
- P2: Blog/insights, careers page, SEO audit, i18n.
