# Student Management System

A full-stack student management application with a React frontend, Express/Node.js backend, and MongoDB Atlas database.

## Architecture

- Frontend: React, React Router, Bootstrap, Axios, Chart.js
- Backend: Express + Node.js + Mongoose
- Database: MongoDB Atlas
- Frontend deployment: Vercel
- Backend deployment: Render

## Project structure

```
student_management_system/
├── src/                  # React frontend
├── public/               # Frontend assets
├── backend/              # Express + Node.js backend
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── package.json
└── README.md
```

## Backend API endpoints

- GET `/`
- GET `/health`
- GET `/students`
- POST `/students`
- GET `/students/:id`
- PUT `/students/:id`
- DELETE `/students/:id`
- GET `/stats`

## Local development

### Frontend

```bash
npm install
npm start
```

### Backend

```bash
cd backend
npm install
npm start
```

Create a `backend/.env` file:

```text
MONGODB_URI=your-mongodb-atlas-connection-string
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

## Deployment

### Backend — Render

Set the Render service Root Directory to:

```text
backend
```

Build Command:

```npm install```

Start Command:

```npm start```

Add this Render environment variable:

```text
MONGODB_URI=your-mongodb-atlas-connection-string
```

Optionally set:

```text
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Frontend — Vercel

Deploy the repository root as the Vercel project.

Set:

```text
REACT_APP_API_URL=https://student-management-system-backend-e521.onrender.com
```

The frontend communicates with the separate Express backend on Render.

## MongoDB Atlas

Keep the MongoDB connection string private. The Render backend uses `MONGODB_URI` to connect to MongoDB Atlas.
