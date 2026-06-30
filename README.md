# Personal Knowledge Base V2

A full-stack personal notes application with authentication, advanced search, tags, pagination, sorting, soft delete, activity tracking, dashboard stats, API documentation, and Neon PostgreSQL integration.

Document attachments are intentionally not implemented in this version.

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
personal_notes_frontend/personal-notes-frontend/
API_DOCUMENTATION.md
```

## Backend Setup

1. Install dependencies from the root project folder:

```bash
npm install
```

2. Create `.env`:

```env
PORT=8002
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=replace_with_a_long_random_secret
```

3. Make sure `.env` points to the existing Neon database that already contains the project tables.

Current expected Neon tables:

- `users`
- `notes`
- `tags`
- `note_tags`
- `note_activities`
- `attachments`

4. Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:8002`.

## Frontend Setup

```bash
cd personal_notes_frontend/personal-notes-frontend
npm install
npm start
```

The frontend runs at `http://localhost:3000`.

## API Reference

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## Production Notes

- Use a strong `JWT_SECRET` and do not commit real secrets.
- Keep `DATABASE_URL` in environment configuration only.
- This project uses the existing Neon schema configured in `.env`.
- Keep the Neon full-text search indexes enabled for scalable note search.
