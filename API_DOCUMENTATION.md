# Personal Notes Service API

Base URL: `http://localhost:8008/api`

In production, replace the host with the deployed service URL. The frontend uses this same-origin `/api` path automatically.

All protected routes require:

`Authorization: Bearer <token>`

## Auth

### Register

`POST /auth/register`

```json
{
  "full_name": "Demo User",
  "email": "demo@example.com",
  "password": "password123"
}
```

### Login

`POST /auth/login`

```json
{
  "email": "demo@example.com",
  "password": "password123"
}
```

### Current User

`GET /auth/me`

## Notes

### Create Note

`POST /notes`

```json
{
  "title": "JWT Auth Notes",
  "category": "Backend",
  "content": "JWT protects all note routes."
}
```

### List Notes

`GET /notes?page=1&limit=10&sortBy=newest&title=jwt&category=Backend&keyword=token&tag=tag_abcd`

Query params:

| Name | Description |
| --- | --- |
| `page` | Positive integer page number. |
| `limit` | Page size from 1 to 100. |
| `sortBy` | `newest`, `oldest`, `title_asc`, `title_desc`. |
| `title` | Optional title substring search. |
| `category` | Optional category substring search. |
| `keyword` | Optional full-text search over title, category, and content. |
| `tag` | Optional tag id or tag name filter. |

Response includes `notes`, `pagination`, and active `filters`.

### Get One Note

`GET /notes/:id`

Returns only notes owned by the authenticated user and excludes soft-deleted notes.

### Update Note

`PUT /notes/:id`

```json
{
  "title": "Updated title",
  "category": "Backend",
  "content": "Updated note content."
}
```

### Soft Delete Note

`DELETE /notes/:id`

Marks the note as deleted. It remains available for recovery/audit and no longer appears in normal listings.

### Trash

`GET /notes/trash?page=1&limit=10&sortBy=newest&keyword=jwt`

Uses the same pagination, sorting, search, category, and tag filters as `/notes`, but returns deleted notes.

### Restore Note

`PATCH /notes/:id/restore`

## Tags

### Create Tag

`POST /tags`

```json
{
  "tagName": "backend"
}
```

### List Tags

`GET /tags`

### Update Tag

`PUT /tags/:id`

```json
{
  "tagName": "interview-prep"
}
```

### Delete Tag

`DELETE /tags/:id`

### Assign Tags To Note

`PUT /tags/note/:noteId`

```json
{
  "tagIds": ["tag_abcd", "tag_efgh"]
}
```

Send an empty array to remove all tags from the note.

### Get Tags For Note

`GET /tags/note/:noteId`

## Activities

### List Activities

`GET /activities?page=1&limit=10&sortBy=newest&noteId=note_abcd&actionType=EDIT`

Query params:

| Name | Description |
| --- | --- |
| `page` | Positive integer page number. |
| `limit` | Page size from 1 to 100. |
| `sortBy` | `newest` or `oldest`. |
| `noteId` | Optional note-specific history filter. |
| `actionType` | Optional action filter such as `CREATE`, `EDIT`, `DELETE`, `RESTORE`, `TAG_ADD`, or `VIEW`. |

## Dashboard

### Dashboard Stats

`GET /dashboard`

Returns note, tag, category, and activity counters plus the latest note/activity for the authenticated user.

## Attachments

Attachment routes are protected and require `Authorization: Bearer <token>`.

### Upload Attachment

`POST /attachments/notes/:noteId/attachments`

Send as `multipart/form-data`:

| Field | Description |
| --- | --- |
| `attachment` | File to upload. Supports JPG, JPEG, PNG, PDF, DOCX, and TXT files. |

### List Note Attachments

`GET /attachments/notes/:noteId/attachments`

Returns all attachments for the authenticated user's note.

### Get Attachment Download URL

`GET /attachments/:attachmentId/download`

Returns attachment metadata and a short-lived Supabase signed URL.

### Delete Attachment

`DELETE /attachments/:attachmentId`

Deletes the attachment record and removes the file from Supabase Storage.
