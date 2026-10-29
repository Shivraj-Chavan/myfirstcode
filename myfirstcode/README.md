# myFirstCode — Frontend

A React + Tailwind frontend for the myFirstCode coding platform (Std 6–10), with three role-based
panels: **Student**, **Teacher**, and **Admin**. Built directly against your uploaded controllers
and routes.

## Setup

```bash
cd myfirstcode
npm install
cp .env.example .env   # then set VITE_API_URL to your backend, e.g. http://localhost:5000/api
npm run dev
```

Open http://localhost:5173

## How admin accounts work

Per your spec, admin is "managed by DB directly." There's no sign-up path for `role = 'admin'` in
`authController.js` (register only creates `student`/`teacher`). To create an admin, insert a row
directly into the `users` table with `role='admin'`, `verified=true`, `status='APPROVED'`, then log
in with that email from `/login` — the existing login endpoint works as-is for this.

## Project structure

```
src/
  api/
    axios.js         — shared axios instance, attaches JWT from localStorage, handles 401s
    endpoints.js      — every API path the app calls, mapped 1:1 to your route files
  context/AuthContext.jsx
  components/
    layout/           — Sidebar, Topbar, DashboardLayout (shared by all 3 panels)
    ui/               — Modal, DataTable, StatCard, Badge, Loader, EmptyState, ComingSoon
    shared/           — PageHeader, CodeRunner (the in-browser code editor + /runcode/run)
  pages/
    auth/             — Login, Register, VerifyOtp
    student/ teacher/ admin/   — one folder per role
  config/nav.js        — sidebar nav items per role
```

## ⚠️ Backend items to fix for full functionality

These were found while mapping the frontend to your actual route files. The UI is already built
and ready for all of them — each just needs the backend side finished.

1. **Server likely won't boot as-is.** `routes/calenderRoutes.js` imports `getEventById` and
   `getDashboard` from `"../controllers/calendarController.js"` — that file doesn't exist (yours is
   `calenderController.js`, spelled differently) and doesn't export either function. It also
   references an undefined `adminMiddleware`. Until this file is fixed/trimmed, importing it will
   throw at startup. The frontend only relies on `GET /calendar/`, `POST /calendar/create`,
   `PUT /calendar/update/:id`, `DELETE /calendar/delete/:id` — those four handlers exist and work,
   so trimming the broken imports/routes out of `calenderRoutes.js` is enough to unblock everything.

2. **Calendar visibility is scoped to "my own events" only.** `getEvents` filters by
   `teacher_id = req.user.id`, so only the teacher who created an event sees it. There's no working
   route yet for "events for a student's standard" (`getEventsByStandard` exists in the controller
   but isn't wired to a working route) or "all events for admin" (`getAllEventsAdmin` has the same
   problem). Student and Admin calendar pages currently show a friendly empty state explaining this.

3. **`GET /assignments/:id/attempts` hangs.** In `assignmentsRoutes.js` it's registered as
   `router.get("/:id/attempts", authorizeRoles, getAssignmentAttempts)` — `authorizeRoles` is a
   factory (`authorizeRoles(...roles)`) that needs to be *called*, not passed directly, and there's
   no `verifyToken` before it either. As written, the middleware returns a function without ever
   calling `next()`, so the request never resolves. Fix:
   ```js
   router.get("/:id/attempts", verifyToken, authorizeRoles("teacher", "admin"), getAssignmentAttempts);
   ```

4. **Two parallel "teacher" systems.** `authController.js` manages teachers inside the `users`
   table (this is what actually logs in via JWT — register/login/approve/delete). Separately,
   `teacherController.js` manages a different `teachers` table with its own approve/CRUD. The
   Admin → Teachers page here uses the `/auth/*` endpoints since those are tied to real login
   accounts; `/teacher/*` routes are mapped in `endpoints.js` too in case you consolidate later.

5. **Two parallel "student" systems**, similarly. `users` (role='student') is what a student
   actually registers and logs in with. `students` is a separate registration/CRM-style table with
   its own `teacher_id`/`batch_name` fields, managed by `studentController.js`. Admin → Students
   here manages the `students` table (since that's what the assign-to-teacher flow uses) — there's
   a banner on that page noting the two aren't linked yet.

6. **`studentRoutes.js` never wires up `getTeacherStudents`.** The Teacher → My Students page
   works around this by calling `GET /students/` (all students) and filtering client-side for
   `teacher_id === <logged-in teacher's id>`. Wiring a real `GET /students/mine` (or similar) using
   the existing controller function would be more efficient at scale.

7. **No backend yet for:** assignment submission-for-grading (students can run code in the
   Assignments page, but there's no `POST` endpoint to save a graded submission), leaderboard,
   enquiries (student ↔ teacher messaging), certificates, or course payments/levels. Each of these
   has a designed, ready-to-wire screen in the app with an in-context note explaining what's
   missing — search for `ComingSoon` usages in `src/pages/*/`.

## Design notes

- Palette: deep indigo `#12132B` (ink), electric violet `#5B5FEF` (brand), mint `#12D992` (success/
  run code), amber `#FFB627` (streaks/pending), coral `#FF5C7A` (errors/delete).
- Type: Space Grotesk (headings), Inter (UI text), JetBrains Mono (code + the `$ eyebrow` labels).
- Signature element: the terminal-prompt branding (`myFirstCode_` with a blinking cursor, `$`
  eyebrows on section labels) — a nod to the fact this is a coding platform, not a generic LMS.
