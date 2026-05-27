# CareerPilot

CareerPilot is a full-stack co-op and internship tracker I built to help students stay organized while applying for jobs.

The main idea is simple: instead of keeping applications in random notes, emails, and spreadsheets, students can track everything in one place. The app lets a user create an account, add job applications, update their status, and see a dashboard summary of their search.

I built this project because I am applying for co-ops myself, so it is based on a real problem I actually deal with.

## Features

- User signup and login
- JWT authentication
- Add job applications
- Track application status
- Dashboard stats
- Simple resume feedback placeholder
- Clean responsive frontend
- PostgreSQL database schema
- Beginner-friendly code comments

## Tech Stack

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS

Backend:
- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT
- bcrypt

## Project Structure

```txt
careerpilot/
  backend/
    src/
      db/
      middleware/
      routes/
      server.ts
  frontend/
    src/
      api/
      components/
      pages/
      App.tsx
      main.tsx
```

## How to Run

### 1. Create the database

Create a PostgreSQL database named:

```txt
careerpilot
```

Then run:

```bash
psql -d careerpilot -f backend/schema.sql
```

### 2. Run backend

```bash
cd backend
npm install
npm run dev
```

### 3. Run frontend

```bash
cd frontend
npm install
npm run dev
```

## Future Features I Would Add

- Resume PDF upload
- AI resume scoring
- Interview question generator
- Kanban board for applications
- Email reminders
- GitHub Actions CI/CD
- Docker deployment

## Resume Bullet

Built CareerPilot, a full-stack internship tracking platform using React, TypeScript, Node.js, Express, PostgreSQL, and JWT authentication. Created protected REST API routes, application status tracking, dashboard analytics, and a responsive frontend to help students manage their co-op search.
