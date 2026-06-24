# Preorder Manager

This is a Next.js 16 application called **Preorder Manager**. It consists of a preorder listing dashboard with backend-driven filtering, sorting, and pagination, along with pages to create and update preorders.

## Tech Stack
- **Next.js 16** (App Router)
- **Prisma 7**
- **SQLite**
- **Tailwind CSS v4**

## File Structure

```text
xubitar-assignment/
├─ app/
│  ├─ [id]/edit/page.tsx
│  ├─ components/
│  │  ├─ Checkbox.tsx
│  │  ├─ PreorderForm.tsx
│  │  └─ PreordersTable.tsx
│  ├─ create/page.tsx
│  ├─ generated/prisma/
│  ├─ lib/
│  │  ├─ actions.ts
│  │  └─ db.ts
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ docs/
│  └─ requirements.md
├─ prisma/
│  ├─ migrations/
│  ├─ schema.prisma
│  └─ seed.ts
├─ public/
├─ .env.example
├─ next.config.ts
├─ package.json
├─ prisma.config.ts
└─ README.md
```

---

## Getting Started & Local Setup

Follow these steps to set up the project and the database on your local machine:

### 1. Install Dependencies
Install all required node packages:
```bash
npm install
```

### 2. Set Up the Database
Run the Prisma migrations to create the local SQLite database file (`prisma/dev.db`):
```bash
npx prisma migrate dev --name init
```

### 3. Seed Sample Data
Populate the database with the initial 8 sample preorders shown in the UI screenshots:
```bash
npx tsx prisma/seed.ts
```

### 4. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## Features Implemented

1. **Preorder List Page**
   - Filter tabs: **All**, **Active**, and **Inactive** preorders (evaluated on the database side).
   - Sort dropdown: Sort by **Name**, **Created At**, **Starts At**, and **Ends At** in **Ascending** or **Descending** order (evaluated on the database side).
   - Pagination: Backend-paginated navigation (e.g., Showing 1 to 8 from 8) with dynamic page counts.
   - Status switch: Instantly updates the preorder status in the SQLite database and shows interactive visual feedback.
   - Delete button: Deletes the preorder record directly from the database and updates the table.
   - Row and header checkboxes: Active select-all and custom styled checkboxes.
   
2. **Create & Update Form**
   - Clean, side-by-side design layout matching `UI-3.png`.
   - Name input (required with asterisk).
   - Products count selector.
   - Preorder when selector (regardless-of-stock / out-of-stock).
   - Starts At and Ends At date-time pickers.
   - Status Active switch.
   - Back, Cancel, and Save changes buttons with visual loading indicators.

**Live Demo**

Visit the live deployed site to view the application in action:
- **Website:** https://xubitar-assignment.onrender.com

