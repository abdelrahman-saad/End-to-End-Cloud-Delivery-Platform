# Quick Start Guide

Welcome to the Notes App! Get up and running in minutes.

## Dummy Account Details

**Email:** demo@example.com  
**Password:** demo123456

This account is automatically created when you start the backend server.

## Running the Application

### Step 1: Start the Backend

1. Make sure PostgreSQL is running and create the database:
```bash
createdb notes_app
```

2. Navigate to backend directory:
```bash
cd backend
```

3. Run the Go server:
```bash
go run cmd/main.go
```

The backend will start on **http://localhost:8080**

### Step 2: Start the Frontend

1. Open a new terminal
2. Navigate to frontend directory:
```bash
cd frontend
```

3. Install dependencies (first time only):
```bash
npm install
```

4. Run the frontend:
```bash
npm run dev
```

The frontend will start on **http://localhost:3000**

### Step 3: Login and Test

1. Open your browser and go to **http://localhost:3000**
2. Use the dummy account:
   - Click "Login" tab
   - Email: `demo@example.com`
   - Password: `demo123456`
3. You should see the Notes page!

## App Features Overview

Once logged in, you can:

### ✨ **Create Notes**
- Click the **Plus (+)** button in the sidebar to create new notes
- Choose from 5 different colors (Yellow, Red, Green, Blue, Purple)
- Set status: Note, In Progress, Done, or No Status
- Add title and content

### ⭐ **Starred Notes**
- Click the **Star** icon in the sidebar to view only starred notes
- Click the star icon on any note card to star/unstar it
- Perfect for keeping important notes at your fingertips

### 🔍 **Search**
- Use the search bar to filter notes by title
- Works on both main notes and starred notes pages

### 🏠 **Navigation**
- **Home** icon - View all your notes
- **Plus** icon - Create a new note
- **Star** icon - View starred notes only
- **Settings** icon (bottom) - Logout from your account

### 🎨 **Beautiful UI**
- Modern dark theme with glassmorphism effects
- Smooth animations and hover effects
- Fully responsive design
- Colorful note cards with custom themes

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Check PostgreSQL is running:
```bash
pg_isready
```

2. Create database manually:
```bash
psql -c "CREATE DATABASE notes_app;"
```

3. Update backend/.env if using different credentials

### Frontend Won't Connect to Backend

1. Make sure backend is running on port 8080
2. Check console for CORS errors
3. Verify API URL in `frontend/src/services/api.js` is correct

### Already Have the Dummy Account?

If you've run the backend before, the dummy account is already created. Just use it!

## Quick Workflow Example

1. **Login** with the dummy account
2. **Click the Plus (+) button** to create your first note
3. **Add a title** like "My First Note"
4. **Choose a color** (try Green or Blue!)
5. **Set status** to "In Progress"
6. **Click "Create Note"**
7. **Star the note** by clicking the star icon
8. **View starred notes** by clicking the Star sidebar icon

That's it! You're now using the app! 🎉

