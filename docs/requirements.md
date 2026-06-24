Tech Stack
You are required to use the following:
1. Next.js 16
2. Prisma with SQLite

Any other libraries or packages are allowed. Use whatever you see fit to build a clean and maintainable solution.

Project Overview
You will build a small application called Preorder Manager. It consists of two screens:
1. A preorder list page (see UI-1.png and UI-2.png)
2. A create and update preorder page (see UI-3.png)

Your UI must match the attached screenshots as closely as possible.

Requirements

1. Preorder List Page (refer to UI-1.png)
The page should list all preorders. The following must be handled on the backend (from the database), not on the client only:
- Filters: All, Active, Inactive
- Sort (the sort options are shown in UI-2.png)
- Pagination
If no preorders are found, you may display an empty state in the table in whatever way you see fit.

2. Status Switch and Delete
- The status switch (Active / Inactive) should update the record directly in the database and reflect the change with clear feedback on the frontend.
- The delete button should remove the record from the database and reflect in the list.

3. Selection Checkboxes
- The row checkbox should work.
- The select all checkbox should also work.
- No action buttons need for selection

4. Update Preorder (refer to UI-3.png)
- Clicking the pencil icon on a preorder should open the Update Preorder page.
- All fields must be pre-filled with that preorder's existing values.
- Saving should update the preorder in the database accordingly.

5. Create Preorder
- Clicking Create Preorder on the list page (UI-1.png) should open the create page (UI-3.png).
- This page should be able to create a new preorder record in the database.

6. Navigation and Loading States (on the create and update page, UI-3.png)
- The Cancel button and the Save Changes button should redirect to the list page (UI-1.png) after a successful database update.
- A loader state must be shown while saving.
- The Back button should also redirect to the list page (UI-1.png).

What We Are Looking For
- Correct and working functionality that meets the requirements above
- Clean, readable, and well organized code
- A UI that closely matches the attached screenshots
- Sensible handling of backend logic, especially filtering, sorting, and pagination

Submission Instructions
Please send us the following to assessment@xubitar.com with your CV and Phone number:
1. Your source code, either as a link to a code repository (for example GitHub) or as a zipped project folder.
2. A short README with setup steps so we can run the project locally, including how to set up the database and seed any sample data.