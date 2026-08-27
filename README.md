# Personal Knowledge Base

A full-stack notes application for storing personal knowledge, organizing notes with tags, tracking activity, and managing file attachments.

Live demo: https://personal-notes-service-aiwi.onrender.com

## Overview

Personal Knowledge Base is built as a single deployable Node service. The Express API serves the React production build, so the deployed app runs from one public URL and uses same-origin `/api` requests.

## Features

- JWT authentication with registration, login, and current-user lookup
- User-scoped notes CRUD
- Advanced note filtering by title, category, keyword, tag, and sort order
- PostgreSQL full-text search support
- Tag CRUD and note-to-tag assignment
- Soft delete, Trash view, and note restore
- Activity history for note and tag actions
- Dashboard stats for notes, tags, categories, and recent activity
- Supabase-backed document and image attachments
- Image attachment preview flow
- Playwright end-to-end smoke test

## Tech Stack

- Backend: Node.js, Express, PostgreSQL, JWT, bcrypt
- Frontend: React, React Router, Axios, React Hot Toast
- Database: Neon PostgreSQL
- Storage: Supabase Storage
- Deployment: Render Web Service
- Testing: Playwright

## Project Structure

```text
.
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── middleware/
│   └── features/
│       ├── activities/
│       ├── attachments/
│       ├── dashboard/
│       ├── notes/
│       ├── tags/
│       └── users/
├── personal_notes_frontend/
│   └── personal-notes-frontend/
├── scripts/
├── tests/e2e/
├── API_DOCUMENTATION.md
├── render.yaml
└── package.json
```

## Requirements

- Node.js 22 or newer
- npm
- Neon PostgreSQL database with the project schema
- Supabase project with an `attachments` storage bucket

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=8008
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=replace_with_a_long_random_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=replace_with_your_server_key
SUPABASE_BUCKET=attachments
```

Never commit real `.env` values. Use `.env.example` as the template.

## Local Setup

Install backend dependencies:

```bash
npm install
```

Build the React frontend:

```bash
npm run build
```

Start the full application:

```bash
npm start
```

Open:

```text
http://localhost:8008
```

Health check:

```text
http://localhost:8008/api/health
```

## Development

For backend development with restart-on-save:

```bash
npm run dev
```

The React app uses `baseURL: "/api"`, so it works on the same origin in production. If you run the React development server separately, configure a proxy or use the production one-port flow above.

## Database Notes

This project expects an existing Neon schema with these tables:

```text
users
notes
tags
note_tags
note_activities
attachments
```

The migration scripts in `scripts/` are helper scripts for local setup or recovery. If your Neon database is already configured, you do not need to run them before deployment.

## API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for available endpoints and request examples.

## End-to-End Test

The e2e test validates the deployed or local app by checking health, login, dashboard navigation, note opening, and image preview.

Run against local:

```powershell
$env:E2E_BASE_URL = "http://127.0.0.1:8008"
$env:E2E_EMAIL = "test@example.com"
$env:E2E_PASSWORD = "test-password"
npm run test:e2e
```

Run against the live Render deployment:

```powershell
$env:E2E_BASE_URL = "https://personal-notes-service-aiwi.onrender.com"
$env:E2E_EMAIL = "test@example.com"
$env:E2E_PASSWORD = "test-password"
npm run test:e2e
```

Use a dedicated test account with at least one note and one image attachment.

## Deployment

This repo is configured for Render with `render.yaml`.

Render settings:

```text
Build command: npm install && npm run build
Start command: npm start
Health check path: /api/health
```

Render environment variables:

```env
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_strong_secret
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_service_key
SUPABASE_BUCKET=attachments
NODE_VERSION=22
```

After deployment, verify:

```text
https://your-render-service.onrender.com/api/health
https://your-render-service.onrender.com/login
```

## Useful Scripts

```text
npm run build       Build the React frontend
npm start           Start the production Express server
npm run start:full  Build frontend, then start server
npm run dev         Start backend with nodemon
npm run test:e2e    Run Playwright e2e tests
```

## Deployment Status

Current live deployment:

```text
https://personal-notes-service-aiwi.onrender.com
```

Latest verified checks:

- Backend health endpoint returns `200 OK`
- React app is served from Render
- Live Playwright e2e smoke test passed
