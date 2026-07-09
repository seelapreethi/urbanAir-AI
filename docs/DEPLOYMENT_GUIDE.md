# UrbanAir AI – Deployment Guide

Version: 1.0

---

# Deployment Architecture

Frontend

↓

Vercel

↓

Backend

↓

Render

↓

Database

↓

Supabase PostgreSQL

↓

AI

↓

OpenRouter + Local Models

---

# Environment Variables

Frontend

NEXT_PUBLIC_API_URL

NEXT_PUBLIC_MAP_TILE_URL

NEXT_PUBLIC_APP_NAME

Backend

DATABASE_URL

JWT_SECRET

OPENROUTER_API_KEY

REDIS_URL

FRONTEND_URL

Environment files must never be committed to Git.

---

# Docker

Containers

Frontend

Backend

Database

Redis

Run

docker compose up

---

# Frontend Deployment

Platform

Vercel

Steps

1. Connect GitHub repository.
2. Import project.
3. Configure environment variables.
4. Deploy.

---

# Backend Deployment

Platform

Render

Steps

1. Create Web Service.
2. Connect GitHub.
3. Configure environment variables.
4. Build and deploy.

---

# Database

Platform

Supabase PostgreSQL

Requirements

Enable PostGIS.

Create schema.

Seed initial data.

---

# AI Services

OpenRouter

Purpose

Chat Assistant

Recommendations

Use free models whenever available.

---

# Storage

Reports

PDFs

Architecture diagrams

Store using cloud object storage or local filesystem for MVP.

---

# CI/CD

On every push

- Install dependencies.
- Run lint.
- Run tests.
- Build frontend.
- Build backend.

---

# Production Checklist

- Environment variables configured.
- HTTPS enabled.
- Authentication working.
- Database connected.
- AI endpoints responding.
- Maps loading.
- Charts rendering.
- Reports generating.
- Responsive UI verified.

---

# Monitoring

Frontend

Vercel Analytics (optional)

Backend

Render Logs

Database

Supabase Dashboard

---

# Backup Strategy

Database

Daily backup (manual for MVP).

Source Code

GitHub repository.

Documentation

Version-controlled in docs/.

---

# Final Deliverables

- Live web application
- Source code repository
- Architecture diagram
- Presentation deck
- Demo video
- README
- Documentation
