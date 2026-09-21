# Student Management System

A full-stack student management application with a React frontend and MongoDB-backed Vercel API routes.

## Architecture

- Frontend: React, React Router, Bootstrap, Axios, Chart.js
- Backend: Vercel serverless API routes with Node.js and Mongoose
- Database: MongoDB Atlas
- Deployment: one Vercel project for both frontend and backend

## Project structure

```
student_management_system/
├── src/                  # React frontend
├── public/               # Frontend assets
├── api/                  # Vercel API routes
│   ├── _lib/db.js
│   ├── students/
│   │   ├── index.js
│   │   └── [id].js
│   ├── stats.js
│   ├── health.js
│   └── index.js
├── package.json
└── vercel.json
```

## API endpoints

- GET `/api/health`
- GET `/api/students`
- POST `/api/students`
- GET `/api/students/:id`
- PUT `/api/students/:id`
- DELETE `/api/students/:id`
- GET `/api/stats`

## Local development

Install dependencies:

```bash
npm install
```

Set the MongoDB connection string in your local environment:

```text
MONGODB_URI=your-mongodb-atlas-connection-string
```

Then run:

```bash
npm start
```

## Vercel deployment

Connect this repository to Vercel with the project root as the Root Directory.

Add this environment variable in Vercel:

```text
MONGODB_URI=your-mongodb-atlas-connection-string
```

Do not commit the MongoDB connection string to GitHub.

The frontend uses the same-domain API path `/api`, so a separate Render backend URL is no longer required.

## MongoDB Atlas

The MongoDB Atlas cluster must allow connections from Vercel. For a simple deployment, configure the Atlas Network Access/IP access list appropriately for your deployment, while keeping database credentials private.

