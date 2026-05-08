# MIND - Notes Application

A full-stack notes application with React frontend and Go backend.

## Project Structure

```
mind/
├── frontend/          # React application with Vite
├── backend/          # Go REST API with Gin framework
└── README.md         # This file
```

## Prerequisites

### Backend
- Go 1.21 or higher
- PostgreSQL database

### Frontend
- Node.js 18+ and npm

## Setup Instructions

### 1. Database Setup

Create PostgreSQL database:
```bash
createdb notes_app
```

Or using SQL:
```sql
CREATE DATABASE notes_app;
```

### 2. Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
go mod download
```

3. Configure environment (already set in .env):
```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=notes_app
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=8080
```

4. Run the backend server:
```bash
go run cmd/main.go
```

The backend will start on port 8080 and automatically create a dummy account.

### 3. Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the frontend development server:
```bash
npm run dev
```

The frontend will start on port 3000.

## Dummy Account

A dummy account is automatically created when the backend starts:

- **Email:** demo@example.com
- **Password:** demo123456

## Features

### Backend (Go + Gin + PostgreSQL)
- User authentication with JWT tokens
- Password hashing with bcrypt
- RESTful API endpoints
- CORS enabled for frontend
- Auto-migration database schema
- Protected routes with JWT middleware

### Frontend (React + Vite)
- Modern dark-themed UI with Tailwind CSS
- Glassmorphism design with smooth animations
- Login and Signup pages with validation
- Notes management with full CRUD operations
- **Create Note** page with color and status selection
- **Starred Notes** view with filtering
- Real-time search functionality
- Interactive sidebar navigation
- Logout functionality
- JWT-based authentication
- Responsive design for all devices

## API Endpoints

### Public
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /health` - Health check

### Protected (Require JWT token)
- `GET /api/profile` - Get user profile
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note
- `GET /api/notes/:id` - Get note by ID
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `PATCH /api/notes/:id/star` - Toggle star

## Development

### Backend
```bash
cd backend
go run cmd/main.go
```

### Frontend
```bash
cd frontend
npm run dev
```

Access the application at http://localhost:3000

## Technologies Used

### Backend
- Go 1.21
- Gin Web Framework
- GORM ORM
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React 18 with Hooks
- Vite build tool
- React Router v6 for navigation
- Tailwind CSS for styling
- Font Awesome 5 for icons
- Axios/Fetch for API calls

## License

MIT
