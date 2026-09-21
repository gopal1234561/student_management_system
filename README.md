# Student Management System

A full-stack student management application with a React frontend and Express/MongoDB REST API.

## Architecture

- Frontend: React, React Router, Bootstrap, Axios, Chart.js
- Backend: Node.js, Express, Mongoose
- Database: MongoDB Atlas
- Deployment: frontend as a static React site and backend on Render

## Frontend

Run npm install and then npm start.

For production, set REACT_APP_API_URL to the backend URL before npm run build. The frontend currently falls back to the Render backend URL if the variable is not supplied.

## Backend

The backend is in the backend/ directory.

Run cd backend, npm install, then npm start.

Create backend/.env from backend/.env.example and set MONGODB_URI.

## Render backend settings

For the existing Render Web Service connected to this repository:

- Root Directory: backend
- Build Command: npm install
- Start Command: npm start
- Environment variable: MONGODB_URI = your MongoDB Atlas connection string
- Environment variable: CORS_ORIGIN = your deployed frontend URL
- Do not set a fixed PORT; Render supplies PORT.

The API exposes /health, /students, /students/:id, and /stats.
