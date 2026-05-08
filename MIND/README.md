# MIND - Source Code Repository

[![Go](https://img.shields.io/badge/Go-1.23-00ADD8.svg)](https://golang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](https://www.postgresql.org/)

> Full-stack note management application with React frontend, Go backend, and PostgreSQL database.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Docker Support](#docker-support)
- [Environment Variables](#environment-variables)
- [Testing](#testing)

---

## 🎯 Overview

This repository contains the complete application source code for the MIND notes application:

- **Frontend**: Modern React 18 SPA with Vite build system
- **Backend**: RESTful API built with Go and Gin framework
- **Database**: PostgreSQL 15 for data persistence

### Technology Stack

**Frontend:**
- React 18.2 with Hooks
- React Router v6 for navigation
- Tailwind CSS for styling
- Vite for fast development builds
- Font Awesome icons

**Backend:**
- Go 1.23
- Gin web framework
- GORM ORM for database operations
- JWT authentication
- bcrypt password hashing

**Database:**
- PostgreSQL 15
- Automatic schema migrations
- Connection pooling

---

## ✨ Features

### Authentication
- ✅ User signup with email validation
- ✅ JWT-based authentication
- ✅ Secure password hashing (bcrypt)
- ✅ Token-based session management
- ✅ Protected routes and API endpoints

### Notes Management
- ✅ Create notes with rich metadata
- ✅ Edit existing notes
- ✅ Delete notes
- ✅ Star/unstar important notes
- ✅ Real-time search filtering
- ✅ 5 color themes (Yellow, Red, Green, Blue, Purple)
- ✅ 4 status types (Note, In Progress, Done, No Status)

### User Interface
- ✅ Modern dark theme with glassmorphism
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Interactive sidebar navigation
- ✅ Empty states and loading indicators
- ✅ Form validation with error handling

---

## 🏗️ Architecture

### Application Flow

```
┌─────────────┐      HTTP      ┌─────────────┐      SQL        ┌──────────────┐
│   Browser   │ ────────────▶  │  Go Backend │ ─────────────▶  │  PostgreSQL  │
│  React SPA  │ ◀────────────  │  Gin + GORM │ ◀─────────────  │   Database   │
└─────────────┘    JSON/JWT    └─────────────┘   ORM Queries   └──────────────┘
```

### Backend Architecture

```
backend/
├── cmd/
│   └── main.go                 # Application entry point
├── internal/
│   ├── handlers/               # HTTP request handlers
│   │   ├── auth_handler.go     # Login, signup, profile
│   │   ├── auth_middleware.go  # JWT validation
│   │   └── notes_handler.go    # CRUD operations
│   ├── models/                 # Data models
│   │   ├── user.go             # User & Note structs
│   │   └── auth.go             # JWT & bcrypt functions
│   ├── db/                     # Database layer
│   │   └── database.go         # Connection & migrations
│   └── utils/                  # Utilities
│       └── response.go         # JSON response helpers
└── Dockerfile                  # Production image
```

### Frontend Architecture

```
frontend/
├── src/
│   ├── pages/                  # Route components
│   │   ├── LoginPage.jsx       # Authentication
│   │   ├── NotesPage.jsx       # Main dashboard
│   │   ├── CreateNotePage.jsx  # Create new note
│   │   ├── EditNotePage.jsx    # Edit existing note
│   │   └── StarredNotesPage.jsx # View favorites
│   ├── components/             # Reusable UI components
│   │   ├── SideMiniMenu.jsx    # Sidebar navigation
│   │   ├── NoteCard.jsx        # Note display card
│   │   ├── NotesGrid.jsx       # Grid layout
│   │   ├── NotesHeader.jsx     # Search header
│   │   ├── StatusBadge.jsx     # Status indicator
│   │   └── Star.jsx            # Star icon
│   ├── services/               # API integration
│   │   └── api.js              # HTTP client
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # React entry point
└── Dockerfile                  # Production image
```

---

## 🚀 Getting Started

### Prerequisites

- **Backend**: Go 1.21+, PostgreSQL 15+
- **Frontend**: Node.js 18+, npm
- **Optional**: Docker & Docker Compose

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/who-sam/MIND.git
cd MIND
```

#### 2. Setup Database
```bash
# Create PostgreSQL database
createdb notes_app

# Or using psql
psql -c "CREATE DATABASE notes_app;"
```

#### 3. Start Backend
```bash
cd backend

# Install dependencies
go mod download

# Create .env file (if needed)
cp .env.example .env

# Run server
go run cmd/main.go
```

Backend will start on **http://localhost:8080**

#### 4. Start Frontend
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will start on **http://localhost:3000**

#### 5. Access Application
- **URL**: http://localhost:3000
- **Login**: `demo@example.com` / `demo123456`

---

## 📡 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### POST `/auth/signup`
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** (201 Created)
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

#### POST `/auth/login`
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Protected Endpoints (Require JWT Token)

All protected endpoints require `Authorization: Bearer <token>` header.

#### GET `/notes`
Get all notes for authenticated user.

**Response:** (200 OK)
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "My First Note",
      "content": "Note content here",
      "color": "customyellow",
      "status": "note",
      "starred": false,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST `/notes`
Create a new note.

**Request:**
```json
{
  "title": "New Note",
  "content": "Note content",
  "color": "customblue",
  "status": "todo:inprogress"
}
```

**Response:** (201 Created)
```json
{
  "data": {
    "id": 2,
    "user_id": 1,
    "title": "New Note",
    "color": "customblue",
    "status": "todo:inprogress",
    "starred": false
  }
}
```

#### GET `/notes/:id`
Get a specific note by ID.

#### PUT `/notes/:id`
Update an existing note.

**Request:**
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "color": "customgreen",
  "status": "todo:done",
  "starred": true
}
```

#### DELETE `/notes/:id`
Delete a note.

**Response:** (200 OK)
```json
{
  "message": "Note deleted successfully"
}
```

#### PATCH `/notes/:id/star`
Toggle star status on a note.

**Response:** (200 OK)
```json
{
  "data": {
    "id": 1,
    "starred": true
  }
}
```

### Error Responses

All errors return appropriate HTTP status codes with JSON:

```json
{
  "error": "Error message description"
}
```

Common status codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

---

## 🔧 Development

### Backend Development

#### Run with Hot Reload
```bash
# Install Air (Go hot reload)
go install github.com/cosmtrek/air@latest

# Run with hot reload
cd backend
air
```

#### Run Tests
```bash
cd backend
go test ./... -v
```

#### Code Formatting
```bash
gofmt -s -w .
```

### Frontend Development

#### Development Server
```bash
cd frontend
npm run dev
```

#### Build for Production
```bash
npm run build
```

#### Preview Production Build
```bash
npm run preview
```

#### Linting
```bash
npm run lint
```

---

## 🐳 Docker Support

### Using Docker Compose (Recommended)

#### Development Mode
```bash
# Start all services
docker-compose -f docker-compose.dev.yml up

# Stop services
docker-compose -f docker-compose.dev.yml down
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- PostgreSQL: localhost:5432

#### Production Mode
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Building Individual Images

#### Backend
```bash
cd backend
docker build -t notes-app-backend:latest .
docker run -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  notes-app-backend:latest
```

#### Frontend
```bash
cd frontend
docker build -t notes-app-frontend:latest .
docker run -p 80:80 notes-app-frontend:latest
```

---

## 🔐 Environment Variables

### Backend (.env)

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=notes_app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
PORT=8080
```

### Frontend (vite.config.js)

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
go test ./...

# Run with coverage
go test ./... -cover

# Verbose output
go test ./... -v

# Test specific package
go test ./internal/handlers -v
```

### Frontend Tests

```bash
cd frontend

# Run tests (when implemented)
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Manual Testing

#### Test Backend API
```bash
# Health check
curl http://localhost:8080/api/health

# Signup
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'

# Get notes (with token)
curl http://localhost:8080/api/notes \
  -H "Authorization: Bearer <your-token>"
```

---

## 📦 Build & Deploy

### Production Builds

#### Backend
```bash
cd backend
CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd
```

#### Frontend
```bash
cd frontend
npm run build
# Output in ./dist directory
```

### Docker Images

Images are automatically built and pushed by CI pipeline:
- **Frontend**: `whosam1/notes-app-frontend:latest`
- **Backend**: `whosam1/notes-app-backend:latest`

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style

- **Go**: Follow [Effective Go](https://golang.org/doc/effective_go.html)
- **JavaScript/React**: ESLint configuration provided
- **Commits**: Use conventional commits format

---

## 📝 License

This project is licensed under the MIT License.

---

## 🔗 Related Repositories

- **Infrastructure**: [mind-infra-pipeline](https://github.com/who-sam/mind-infra-pipeline)
- **CI Pipeline**: [mind-ci-pipeline](https://github.com/who-sam/mind-ci-pipeline)
- **ArgoCD**: [mind-argocd-pipeline](https://github.com/who-sam/mind-argocd-pipeline)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/who-sam/MIND/issues)
- **Main Project**: [MIND Documentation](https://github.com/who-sam/MIND)
