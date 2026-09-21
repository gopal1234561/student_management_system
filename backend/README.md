# Student Management System API

Express + MongoDB backend for the React Student Management System.

## Render deployment

Set the Render service **Root Directory** to `backend`.

- Build Command: `npm install`
- Start Command: `npm start`
- Environment variable: `MONGODB_URI` = your MongoDB Atlas connection string
- Environment variable: `CORS_ORIGIN` = your deployed frontend URL
- Do not set a fixed PORT; Render supplies `PORT`.

## API

- GET `/health`
- GET `/students`
- GET `/students/:id`
- POST `/students`
- PUT `/students/:id`
- DELETE `/students/:id`
- GET `/stats`
