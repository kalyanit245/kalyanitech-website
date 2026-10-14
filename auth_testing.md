# Auth Testing Playbook — Kalyani Technologies

## Step 1: MongoDB verification
```
mongosh
use app
db.users.find({ role: "admin" }).pretty()
db.users.findOne({ role: "admin" }, { password_hash: 1 })
```
Verify: bcrypt hash starts with `$2b$`; indexes on users.email (unique), login_attempts.identifier, inquiries.id (unique), inquiries.created_at.

## Step 2: API testing
```
curl -c cookies.txt -X POST http://localhost:8001/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@kalyanitechnologies.com","password":"Kalyani@Tech2026"}'
cat cookies.txt
curl -b cookies.txt http://localhost:8001/api/auth/me
curl -b cookies.txt http://localhost:8001/api/inquiries
curl -b cookies.txt -X POST http://localhost:8001/api/auth/logout
```
Login returns the admin user object and sets `access_token` (15 min) + `refresh_token` (7 d) httpOnly cookies. `/me` and `/inquiries` require the cookie. Without it: 401.

## Step 3: Negative cases
- `GET /api/inquiries` without cookie → 401.
- Wrong password × 5 (same ip:email) → 429 lockout for 15 minutes.
- `POST /api/auth/refresh` without refresh cookie → 401.

## Credentials
See /app/memory/test_credentials.md (single source of truth).
