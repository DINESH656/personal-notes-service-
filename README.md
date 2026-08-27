# Personal Knowledge Base V2

A full-stack personal notes application with authentication, advanced search, tags, pagination, sorting, soft delete, activity tracking, dashboard stats, document attachments, API documentation, Neon PostgreSQL integration, and Supabase Storage integration.

## Tech Stack

- Backend: Node.js, Express, PostgreSQL, JWT, bcrypt
- Frontend: React, React Router, Axios, React Hot Toast
- Database: PostgreSQL full-text search with `tsvector` and GIN indexing

## Features

- User registration, login, and current-user endpoint
- User-scoped notes CRUD
- Advanced search by title, category, content keyword, and tag
- Efficient keyword search using PostgreSQL full-text search
- Pagination metadata for frontend controls
- Sorting by newest, oldest, title A-Z, and title Z-A
- Tags CRUD and many-to-many note assignment
- Document and image attachments backed by Supabase Storage
- Soft delete and restore from Trash
- Activity history for create, view, update, delete, restore, and tag assignment
- Dashboard stats for notes, tags, categories, and activity

## Project Structure

```text
src/
  app.js
  server.js
  config/db.js
  middleware/auth.middleware.js
  features/
    users/
    notes/
    tags/
    activities/
    dashboard/
    attachments/
personal_notes_frontend/personal-notes-frontend/
API_DOCUMENTATION.md
```

## Run Everything On One Port

The production build runs the React frontend and Express API from one Node process:

```bash
npm install
npm run start:full
```

Open `http://localhost:8008`. The API health check is available at `http://localhost:8008/api/health`.

For development, build the frontend once and start the API:

```bash
npm run build
npm run dev
```

The frontend uses the same-origin `/api` path, so there is no second port or CORS URL to configure.

## End-to-End Test

Start the application with `npm run start:full`, then run the browser smoke test in another terminal:

```bash
E2E_EMAIL=dines@example.com E2E_PASSWORD=your_demo_password npm run test:e2e
```

On PowerShell:

```powershell
$env:E2E_EMAIL = "dines@example.com"
$env:E2E_PASSWORD = "your_demo_password"
npm run test:e2e
```

The test checks the health endpoint, login, dashboard, note navigation, and an actual image preview.

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
PORT=8008
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=replace_with_a_long_random_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=replace_with_your_server_key
SUPABASE_BUCKET=attachments
```

Make sure `DATABASE_URL` points to the existing Neon database that contains the project tables.

Current expected Neon tables:

- `users`
- `notes`
- `tags`
- `note_tags`
- `note_activities`
- `attachments`

## API Reference

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## Production Notes

- Use a strong `JWT_SECRET` and do not commit real secrets.
- Keep `DATABASE_URL` in environment configuration only.
- This project uses the existing Neon schema configured in `.env`.
- Keep the Neon full-text search indexes enabled for scalable note search.

## Deploy From GitHub

Render is the simplest fit for this Express plus React application. Create a new Web Service from the GitHub repository; Render can use the included `render.yaml`, or configure these commands manually:

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Health check path: `/api/health`

Add `DATABASE_URL`, `JWT_SECRET`, and the Supabase variables in the hosting provider's environment settings. Never commit `.env`; commit `.env.example` instead.

Vercel can host the React build, but its serverless model requires restructuring the Express API into separate functions. A single Render or Railway service preserves the current backend and database connection model with one public URL.
