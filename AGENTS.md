<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Context: Preorder Manager
This is a Next.js 16 application for managing preorders.

## Architecture Decisions & Implementation Details
1. **Database Strategy (Prisma 7 & SQLite):**
   - We use Prisma 7 with SQLite. Because Prisma 7 removed the default internal engine, we explicitly use the `@prisma/adapter-better-sqlite3` driver adapter to instantiate `PrismaClient` (see `app/lib/db.ts`).
   - The `url` property is omitted from `datasource db` in `schema.prisma` as per Prisma 7 rules.
   - Seed data is managed via `npx tsx prisma/seed.ts` using the same adapter setup.

2. **Backend Logic (Server Actions):**
   - All database operations (fetch, create, update, delete, toggle) are handled via Next.js Server Actions in `app/lib/actions.ts`.

3. **State Management (Search Params):**
   - The main Preorder List page (`app/page.tsx`) relies completely on URL SearchParams (`filter`, `sortBy`, `sortOrder`, `page`) for state. 
   - This ensures filtering, sorting, and pagination are backend-driven (from the database) and URL-shareable, matching Next.js App Router best practices.

4. **UI Components:**
   - The application uses Tailwind CSS v4.
   - Client components (`PreordersTable.tsx`, `PreorderForm.tsx`) handle interactive UI elements (dropdowns, toggle switches, loading states) and invoke Server Actions, followed by `router.refresh()` or `revalidatePath("/")` to update the server-rendered UI.
