
# Appointments App — Next.js + Django REST

Full-stack appointments application with a **Next.js frontend**, **Django REST backend**, and **Postgres** persistence.  
Production-ready setup with Docker Compose, environment variables, caching, logging, and JWT authentication.

## Stack

- Frontend: Next.js 14, React 18, TailwindCSS, shadcn/ui
- Backend: Python 3.11, Django 5, Django REST Framework
- Database: PostgreSQL 15 (Docker)
- Docker / docker-compose

## Environment setup

1) **Clone the repository**
```bash
git clone https://github.com/andregamoraes/appointments-app.git
cd appointments-app
```

2) **Backend (Django)**
Copy `.env.example` to `.env`:

```bash
cp backend/.env.example backend/.env
```

3) **Frontend (Next.js)**
Copy `.env.example` to `.env.local`:

```bash
cp frontend/.env.example frontend/.env.local`
```

4) Run with Docker
`docker-compose up --build`

- Frontend available at: http://localhost:3000
- Backend API available at: http://localhost:4000

5) (Optional) Create Django superuser
`docker-compose exec backend python manage.py createsuperuser`

## Demo logins

Use the following credentials for testing:

- Patient
  Email: `patient@example.com`
  Password: `test1234`

