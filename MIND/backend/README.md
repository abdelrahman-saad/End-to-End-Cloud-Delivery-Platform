# Notes App Backend

A REST API backend built with Go, Gin framework, and PostgreSQL.

## Features

- User authentication (Signup/Login) with JWT tokens
- Password hashing with bcrypt
- CRUD operations for notes
- Starred notes functionality
- Protected routes with JWT middleware
- CORS enabled for frontend
- PostgreSQL database with GORM ORM

## Setup

### Prerequisites

- Go 1.21 or higher
- PostgreSQL database

### Installation

1. Install dependencies:
```bash
go mod download
```

2. Set up PostgreSQL database:
```bash
createdb notes_app
```

3. Configure environment variables (create a `.env` file):
```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=notes_app
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=8080
```

4. Run the server:
```bash
go run cmd/main.go
```

The server will start on port 8080 (or the port specified in `.env`).

## API Endpoints

### Public Endpoints

- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login with email and password
- `GET /health` - Health check

### Protected Endpoints (Require JWT token)

- `GET /api/profile` - Get current user profile
- `GET /api/notes` - Get all notes for the current user
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `PATCH /api/notes/:id/star` - Toggle star on a note

## Dummy Account

The server automatically creates a dummy account on startup:

- **Email:** demo@example.com
- **Password:** demo123456

## Request/Response Examples

### Signup
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Get Notes (with token)
```bash
curl http://localhost:8080/api/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

