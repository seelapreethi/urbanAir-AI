# UrbanAir AI — Software Architecture

> **Version:** 1.0
> **Architecture Style:** Modular Monolith (MVP) with Clean Architecture
> **Designed for:** 20-Day Hackathon → Production Evolution
> **Primary Goal:** From Monitoring Pollution to Preventing It

---

# 1. Architecture Philosophy

UrbanAir AI is **not** a dashboard.

It is an **AI-powered Decision Intelligence Platform** for city administrators.

The architecture is intentionally designed as a **modular monolith** rather than microservices.

Why?

Because:

* Faster development
* Easier deployment
* Lower operational complexity
* Better debugging
* Suitable for a two-person team
* Can later evolve into microservices without major rewrites

---

# High-Level Architecture

```text
                    +----------------------+
                    |      Web Browser     |
                    +----------+-----------+
                               |
                               |
                     HTTPS / REST API
                               |
                               v
+---------------------------------------------------------------+
|                     Next.js Frontend                          |
|---------------------------------------------------------------|
| Dashboard                                                     |
| Maps                                                          |
| Charts                                                        |
| Reports                                                       |
| AI Chat                                                       |
| Scenario Simulator                                            |
+-------------------------+-------------------------------------+
                          |
                          |
                 REST + WebSocket
                          |
                          v
+---------------------------------------------------------------+
|                     FastAPI Backend                           |
|---------------------------------------------------------------|
| API Layer                                                     |
| Authentication                                                |
| Business Logic                                                |
| AI Services                                                   |
| Forecast Engine                                               |
| Report Engine                                                 |
| Data Aggregation                                              |
+-------------------------+-------------------------------------+
                          |
          ----------------------------------------
          |             |            |           |
          |             |            |           |
          v             v            v           v
     PostgreSQL      Redis      ML Models    External APIs
      + PostGIS      Cache      XGBoost      Weather
                                Prophet      AQI
                                RAG          Satellite
```

---

# 2. Project Folder Structure

```text
UrbanAir-AI/

├── frontend/
│
├── backend/
│
├── datasets/
│
├── notebooks/
│
├── docs/
│
├── infrastructure/
│
├── scripts/
│
├── .github/
│
├── docker-compose.yml
├── README.md
└── ARCHITECTURE.md
```

---

# Frontend Structure

```text
frontend/

src/

├── app/
│   ├── dashboard/
│   ├── forecast/
│   ├── map/
│   ├── reports/
│   ├── chat/
│   ├── simulator/
│   ├── admin/
│   └── settings/
│
├── components/
│
│   ├── ui/
│   ├── layout/
│   ├── charts/
│   ├── maps/
│   ├── tables/
│   ├── cards/
│   ├── chat/
│   └── reports/
│
├── hooks/
├── services/
├── lib/
├── store/
├── types/
├── utils/
├── styles/
└── middleware/
```

---

# Backend Structure

```text
backend/

app/

├── api/
│
│   ├── v1/
│   │
│   ├── auth/
│   ├── aqi/
│   ├── forecast/
│   ├── hotspot/
│   ├── simulation/
│   ├── reports/
│   ├── chatbot/
│   ├── cities/
│   ├── health/
│   └── admin/
│
├── core/
│
├── config/
│
├── db/
│
├── models/
│
├── schemas/
│
├── repositories/
│
├── services/
│
├── ai/
│
│   ├── rag/
│   ├── forecasting/
│   ├── explainability/
│   ├── recommendations/
│   ├── embeddings/
│   └── prompts/
│
├── workers/
│
├── middleware/
│
├── utils/
│
├── tests/
│
└── main.py
```

---

# AI Assets

```text
ai/

models/
vector_store/
training/
pipelines/
feature_engineering/
```

---

# Documentation

```text
docs/

API.md
DATABASE.md
DEPLOYMENT.md
ARCHITECTURE.md
AI_PIPELINE.md
```

---

# 3. System Architecture

```text
                    USER

                     |

              Next.js Application

                     |

         ----------------------------

         REST API      WebSocket

               \        /

                FastAPI

                     |

    ---------------------------------------

    |          |         |        |        |

Auth     Forecast     AI      Reports   Simulation

                     |

            Business Services

                     |

        Repository Layer (DAO)

                     |

       PostgreSQL + PostGIS + Redis

                     |

         External Data Providers

Weather

Satellite

Government AQI

Traffic

Population

Land Use
```

---

# Request Lifecycle

```text
Browser

↓

API Gateway

↓

Authentication

↓

Request Validation

↓

Business Service

↓

Repository

↓

Database

↓

AI Layer (optional)

↓

Response Serializer

↓

Frontend
```

---

# 4. Frontend Architecture

Architecture Pattern

```
Presentation Layer

↓

Feature Layer

↓

API Layer

↓

Shared Components

↓

Utilities
```

---

## Feature-Based Organization

Each page owns:

* components
* hooks
* API calls
* loading states
* validation

Example

```text
forecast/

components/

hooks/

api.ts

types.ts

page.tsx
```

Benefits

* modular
* reusable
* scalable

---

## UI Layers

```text
Pages

↓

Feature Components

↓

Reusable Components

↓

ShadCN UI

↓

Tailwind CSS
```

---

## Maps

Leaflet

↓

GeoJSON

↓

Ward Layers

↓

Markers

↓

Heatmaps

---

## Charts

Recharts

↓

AQI Trends

↓

Forecast

↓

City Comparison

↓

Health Impact

---

# 5. Backend Architecture

Architecture Pattern

```
Controller

↓

Service

↓

Repository

↓

Database
```

---

Detailed

```text
Client

↓

FastAPI Router

↓

Pydantic Validation

↓

Service Layer

↓

Repository Layer

↓

SQLAlchemy

↓

PostgreSQL
```

Responsibilities

API Layer

* validation
* routing

Service Layer

* business logic

Repository Layer

* SQL

Models

* ORM

Schemas

* API contracts

AI Layer

* prediction
* recommendation

---

# Dependency Flow

```
API

↓

Service

↓

Repository

↓

Database
```

Never

```
API → Database
```

---

# 6. AI Architecture

AI Modules

```
                AI Engine

                    |

-----------------------------------------------

Forecast

Source Attribution

Recommendations

Explainability

Chat Assistant

Scenario Simulator
```

---

## AI Pipeline

```text
Raw Data

↓

Cleaning

↓

Feature Engineering

↓

Prediction

↓

Explanation

↓

Recommendation

↓

API Response
```

---

## Forecast Pipeline

```
Historical AQI

+

Weather

+

Traffic

+

Population

↓

Feature Engineering

↓

XGBoost

↓

Prophet

↓

Ensemble

↓

24h

48h

72h Forecast
```

---

## Explainable AI

Every prediction returns

```
Prediction

Confidence

Important Features

Reason

Suggested Action
```

---

## RAG Chatbot

```text
Question

↓

Embedding

↓

Vector Search

↓

Relevant Documents

↓

Prompt Builder

↓

LLM

↓

Answer
```

---

## Recommendation Engine

Inputs

```
Forecast

Hotspots

Weather

Traffic

↓

Rules

+

LLM

↓

Recommendations
```

---

# 7. Database Architecture

```
                   PostgreSQL

                        |

------------------------------------------------------------

Users

Cities

Wards

AQI Records

Weather

Forecasts

Traffic

Industries

Construction

Reports

Alerts

Recommendations

Chat History

Embeddings Metadata
```

---

## Database Layers

```
ORM

↓

Repository

↓

PostgreSQL

↓

PostGIS
```

---

## PostGIS Usage

Store

* ward polygons
* pollution hotspots
* station locations
* city boundaries

Enables

* nearest station
* within ward
* hotspot clustering
* geospatial queries

---

# 8. Authentication Flow

Authentication

JWT

Refresh Token

HTTP Only Cookies

---

Flow

```text
Login

↓

JWT Issued

↓

Frontend Stores Session

↓

Authenticated Requests

↓

JWT Validation

↓

API Access
```

---

Role-Based Access Control

```
Citizen

↓

Health Advisory

------------------

City Officer

↓

Dashboard

Forecast

Reports

Simulator

------------------

Admin

↓

Everything
```

---

Middleware

```
JWT Validation

↓

Role Check

↓

API
```

---

# 9. API Architecture

REST API

```
/api/v1
```

Resources

```
/auth

/cities

/aqi

/forecast

/reports

/hotspots

/chat

/simulation

/admin
```

---

API Flow

```text
Frontend

↓

HTTP Request

↓

Router

↓

Validation

↓

Service

↓

Repository

↓

Database

↓

JSON Response
```

---

Response Format

```json
{
  "success": true,
  "data": {},
  "message": "",
  "errors": null,
  "timestamp": ""
}
```

---

# 10. State Management

## Server State

Use **TanStack Query** for:

* AQI data
* forecasts
* reports
* hotspots
* chat history
* caching
* background refetch
* optimistic updates

---

## Client State

Use **Zustand** for:

* authentication
* selected city
* selected ward
* map filters
* theme
* language
* sidebar
* simulation inputs

---

## Component State

React state

```
useState

useReducer
```

---

State Flow

```text
API

↓

TanStack Query

↓

Components

↓

User Action

↓

Zustand

↓

UI Update
```

---

# 11. Caching Strategy

Redis

Stores

* latest AQI
* forecast results
* AI responses
* frequently accessed reports

Benefits

* lower latency
* fewer API calls
* reduced AI cost

---

# 12. Background Jobs

Scheduled Tasks

```
Fetch AQI

↓

Update Weather

↓

Generate Forecast

↓

Refresh Hotspots

↓

Generate Reports

↓

Clear Cache
```

Initially implemented with FastAPI background tasks or a lightweight scheduler (e.g., APScheduler) to keep deployment simple, with the option to migrate to a dedicated task queue later if workload increases.

---

# 13. Deployment Architecture

```text
                 Internet

                     |

             Vercel (Frontend)

                     |

               HTTPS REST API

                     |

            Render (FastAPI Backend)

                     |

        ------------------------------

        |              |             |

 Supabase       Redis Cache     AI Models

 PostgreSQL

 + PostGIS
```

---

# Environment Variables

Frontend

```
NEXT_PUBLIC_API_URL

NEXT_PUBLIC_MAP_TILE_URL
```

Backend

```
DATABASE_URL

REDIS_URL

JWT_SECRET

OPENROUTER_API_KEY

VECTOR_DB_PATH

ENVIRONMENT
```

---

# Scaling Strategy

Current

```
1 Frontend

↓

1 Backend

↓

1 Database
```

Future

```
Load Balancer

↓

Backend x5

↓

Redis

↓

PostgreSQL Read Replicas

↓

Dedicated AI Service

↓

Dedicated Forecast Service

↓

Dedicated Report Service
```

Because the application is organized around clear module boundaries (forecasting, reporting, chatbot, recommendations, etc.), each module can later be extracted into an independent microservice with minimal changes to the API contracts.

---

# Module Mapping

| Module                        | Backend | AI      | Database    | Frontend |
| ----------------------------- | ------- | ------- | ----------- | -------- |
| AI Command Center             | ✓       | ✓       | ✓           | ✓        |
| Geospatial Source Attribution | ✓       | ✓       | ✓ (PostGIS) | ✓        |
| Hyperlocal AQI Forecast       | ✓       | ✓       | ✓           | ✓        |
| Enforcement Intelligence      | ✓       | ✓       | ✓           | ✓        |
| Multi-City Dashboard          | ✓       | —       | ✓           | ✓        |
| Citizen Health Advisory       | ✓       | ✓       | ✓           | ✓        |
| AI Chat Assistant             | ✓       | ✓ (RAG) | ✓           | ✓        |
| Scenario Simulator            | ✓       | ✓       | ✓           | ✓        |
| Explainable AI                | ✓       | ✓       | ✓           | ✓        |
| Report Generator              | ✓       | ✓       | ✓           | ✓        |
