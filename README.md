# SaaS Notes App (Next.js + Prisma)

This is a complete example project for the assignment: multi-tenant SaaS Notes Application with JWT auth, role-based access, subscription gating, and a minimal frontend. Ready to deploy to Vercel or run locally.

## Quick start (development)
1. Copy `.env.example` to `.env` and set `JWT_SECRET`.
2. `npm install`
3. `npx prisma generate`
4. `npx prisma migrate dev --name init`
5. `npm run seed`
6. `npm run dev`

## Test accounts (password for all: password)
- admin@acme.test (Admin, tenant: Acme)
- user@acme.test (Member, tenant: Acme)
- admin@globex.test (Admin, tenant: Globex)
- user@globex.test (Member, tenant: Globex)

## Multi-tenant approach
Shared schema with a `tenantId` column on tenant-owned records (Tenant, User, Note). Documented in `prisma/schema.prisma`.
