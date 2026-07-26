# res.me

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white&style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white&style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge)
![Redis](https://img.shields.io/badge/Redis-FF4438?logo=redis&logoColor=white&style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=for-the-badge)

## About

**res.me** is an all-in-one resume workspace where you can write, score, tailor, and export your resume in a single application. Built with **Next.js 15** on the frontend and **FastAPI** on the backend, it integrates an AI scoring engine powered by Google Gemini and a **LaTeX PDF pipeline** for polished exports.

## Features

- Resume writing and editing workspace in a unified UI
- AI-powered resume scoring via Google Gemini
- Resume tailoring to specific job descriptions
- LaTeX-based PDF export for professionally formatted output
- Score radar chart and category breakdown dashboard
- Background evaluation jobs via Celery workers
- JWT authentication with full session management
- Side-by-side evaluation comparison with score deltas

## Technology Stack

- **Frontend**: Next.js 15, TypeScript, React, Tailwind CSS, Radix UI, Recharts, Zustand
- **Backend**: Python, FastAPI, Celery, Alembic
- **Database**: PostgreSQL, Redis
- **AI**: Google Gemini API
- **Export**: LaTeX PDF pipeline
- **Infrastructure**: Docker Compose, Turborepo
