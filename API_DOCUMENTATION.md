# Personal Notes Service API

Base URL: `http://localhost:8002`

## Auth

Use the JWT returned from login as a bearer token:

`Authorization: Bearer <token>`

## Users

### Register

`POST /api/auth/register`

```json
{
  "full_name": "Demo User",
  "email": "demo@example.com",
  "password": "password123"
}
```

### Login

`POST /api/auth/login`

```json
{
  "email": "demo@example.com",
  "password": "password123"
}
```

## Notes

All notes routes require authentication.

### Create Note

`POST /api/notes`

```json
{
  "title": "My first note",
  "category": "Backend",
  "content": "Only the signed-in user can view this note."
}
```

### Get My Notes

`GET /api/notes`

### Get One Of My Notes

`GET /api/notes/:noteId`

The API always filters notes by the authenticated user's `user_id`, so users cannot read another user's notes.

### Search Notes

`GET /api/notes?keyword=auth&category=Backend`

## Tags

All tag routes require authentication.

### Create Tag

`POST /api/tags`

```json
{
  "tagName": "important"
}
```

### Assign Tags To Note

`PUT /api/tags/note/:noteId`

```json
{
  "tagIds": ["tag_abcd"]
}
```
