

# Backend.md

# UrbanAir AI — Backend Folder Structure

**Version:** 1.0

**Framework:** FastAPI

**Architecture Style:** Clean Architecture + Layered Architecture

---

# 1. Backend Design Philosophy

The backend is designed around **Clean Architecture**, ensuring:

- Separation of concerns
- High cohesion
- Low coupling
- Testability
- Reusability
- Scalability
- Maintainability

Each layer has a single responsibility and communicates only with adjacent layers.

---

# 2. High-Level Architecture

```text
                    HTTP Request
                          │
                          ▼
                    API Router Layer
                          │
                          ▼
                  Authentication Layer
                          │
                          ▼
                  Validation (Schemas)
                          │
                          ▼
                   Service Layer
                          │
                          ▼
                 Repository Layer
                          │
                          ▼
              PostgreSQL / PostGIS
```

AI services integrate alongside the Service Layer and consume repositories and shared utilities.

---

# 3. Backend Folder Structure

```text
backend/
│
├── app/
│   │
│   ├── main.py
│   ├── config/
│   ├── core/
│   ├── api/
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   ├── services/
│   ├── ai/
│   ├── middleware/
│   ├── dependencies/
│   ├── security/
│   ├── database/
│   ├── cache/
│   ├── tasks/
│   ├── utils/
│   ├── constants/
│   ├── exceptions/
│   ├── logging/
│   ├── storage/
│   ├── monitoring/
│   └── tests/
│
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── pyproject.toml
├── README.md
└── .env.example
```

---

# 4. API Layer

```text
api/

├── router.py
├── dependencies.py

├── auth.py

├── users.py

├── roles.py

├── cities.py

├── wards.py

├── stations.py

├── pollutants.py

├── aqi.py

├── weather.py

├── forecasts.py

├── hotspots.py

├── recommendations.py

├── explainability.py

├── simulations.py

├── reports.py

├── advisories.py

├── alerts.py

├── notifications.py

├── chat.py

├── knowledge.py

├── dashboard.py

├── audit_logs.py

└── system.py
```

### Responsibilities

- HTTP endpoints
- Request validation
- Authentication dependency injection
- Response serialization
- Status codes
- OpenAPI documentation

Routers **never contain business logic**.

---

# 5. Service Layer

```text
services/

├── auth_service.py

├── user_service.py

├── role_service.py

├── city_service.py

├── ward_service.py

├── station_service.py

├── pollutant_service.py

├── aqi_service.py

├── weather_service.py

├── forecast_service.py

├── hotspot_service.py

├── recommendation_service.py

├── explainability_service.py

├── simulation_service.py

├── report_service.py

├── advisory_service.py

├── alert_service.py

├── notification_service.py

├── chat_service.py

├── knowledge_service.py

├── dashboard_service.py

├── audit_service.py

└── system_service.py
```

### Responsibilities

- Business rules
- Workflow orchestration
- AI module coordination
- Transactions
- Validation beyond schema
- Error handling

Services communicate with repositories, never directly with the database.

---

# 6. Repository Layer

```text
repositories/

├── base_repository.py

├── user_repository.py

├── role_repository.py

├── city_repository.py

├── ward_repository.py

├── station_repository.py

├── pollutant_repository.py

├── aqi_repository.py

├── weather_repository.py

├── forecast_repository.py

├── hotspot_repository.py

├── recommendation_repository.py

├── simulation_repository.py

├── report_repository.py

├── advisory_repository.py

├── notification_repository.py

├── chat_repository.py

├── knowledge_repository.py

├── audit_repository.py

└── settings_repository.py
```

### Responsibilities

- CRUD operations
- Database queries
- Pagination
- Filtering
- Joins
- Transactions
- PostGIS queries

Repositories never contain business logic.

---

# 7. Models

```text
models/

├── base.py

├── user.py

├── role.py

├── city.py

├── ward.py

├── monitoring_station.py

├── pollutant.py

├── aqi_record.py

├── weather_record.py

├── forecast_result.py

├── pollution_source.py

├── hotspot.py

├── recommendation.py

├── simulation.py

├── health_advisory.py

├── alert.py

├── notification.py

├── report.py

├── document.py

├── chat_session.py

├── chat_message.py

├── audit_log.py

└── system_setting.py
```

Each file contains one SQLAlchemy model.

---

# 8. Schemas

```text
schemas/

├── auth.py

├── user.py

├── role.py

├── city.py

├── ward.py

├── station.py

├── pollutant.py

├── aqi.py

├── weather.py

├── forecast.py

├── hotspot.py

├── recommendation.py

├── simulation.py

├── report.py

├── advisory.py

├── alert.py

├── notification.py

├── chat.py

├── knowledge.py

├── dashboard.py

└── common.py
```

Each schema contains:

- Create DTO
- Update DTO
- Response DTO
- Filter DTO
- Pagination DTO

---

# 9. AI Module Structure

```text
ai/

├── config/

├── shared/

│   ├── preprocessing/

│   ├── feature_store/

│   ├── metrics/

│   ├── registry/

│   └── utilities/

├── data_pipeline/

│   ├── ingestion/

│   ├── validation/

│   ├── cleaning/

│   ├── transformation/

│   └── feature_engineering/

├── forecasting/

│   ├── training/

│   ├── inference/

│   ├── evaluation/

│   ├── scheduling/

│   └── models/

├── explainability/

├── source_attribution/

├── recommendation/

├── scenario/

├── rag/

│   ├── ingestion/

│   ├── chunking/

│   ├── embeddings/

│   ├── retrieval/

│   ├── prompts/

│   └── generation/

└── monitoring/
```

Each AI subsystem is isolated and independently testable.

---

# 10. Database Layer

```text
database/

├── session.py

├── base.py

├── migrations/

├── seed/

└── init_db.py
```

Responsibilities:

- Engine creation
- Session management
- Alembic migrations
- Seed data
- Connection pooling

---

# 11. Security

```text
security/

├── jwt.py

├── password.py

├── permissions.py

├── roles.py

├── oauth.py

└── auth_helpers.py
```

Responsibilities:

- JWT creation
- JWT verification
- Password hashing
- RBAC authorization
- Authentication helpers

---

# 12. Middleware

```text
middleware/

├── authentication.py

├── authorization.py

├── logging.py

├── request_id.py

├── exception_handler.py

├── cors.py

├── rate_limit.py

├── timing.py

└── security_headers.py
```

Responsibilities:

- Request logging
- Exception handling
- Rate limiting
- Request tracing
- Security headers
- Authentication checks

---

# 13. Dependencies

```text
dependencies/

├── auth.py

├── pagination.py

├── database.py

├── permissions.py

└── filters.py
```

FastAPI dependency injection helpers.

---

# 14. Tasks (Background Jobs)

```text
tasks/

├── forecast_tasks.py

├── report_tasks.py

├── notification_tasks.py

├── ingestion_tasks.py

├── retraining_tasks.py

├── embedding_tasks.py

└── cleanup_tasks.py
```

Responsibilities:

- Scheduled forecasts
- Report generation
- Notifications
- AI retraining
- RAG indexing
- Cleanup jobs

---

# 15. Cache

```text
cache/

├── redis.py

├── dashboard_cache.py

├── forecast_cache.py

├── chat_cache.py

└── recommendation_cache.py
```

Frequently accessed data is cached to reduce latency and database load.

---

# 16. Utilities

```text
utils/

├── datetime.py

├── geometry.py

├── pagination.py

├── validators.py

├── formatters.py

├── csv.py

├── pdf.py

├── geojson.py

├── file_upload.py

└── helpers.py
```

Pure utility functions shared across the application.

---

# 17. Constants

```text
constants/

├── roles.py

├── permissions.py

├── pollutants.py

├── forecast.py

├── api.py

├── status.py

└── messages.py
```

Centralized application constants prevent magic strings.

---

# 18. Exceptions

```text
exceptions/

├── auth.py

├── validation.py

├── database.py

├── ai.py

├── business.py

└── handlers.py
```

Defines custom exception types and global exception handling.

---

# 19. Logging

```text
logging/

├── config.py

├── audit.py

├── api.py

├── ai.py

└── database.py
```

Structured logging for:

- API requests
- AI pipelines
- Authentication
- Database operations
- Audit events

---

# 20. Storage

```text
storage/

├── uploads/

├── reports/

├── documents/

└── temporary/
```

Stores generated reports and uploaded knowledge-base documents.

---

# 21. Monitoring

```text
monitoring/

├── health.py

├── metrics.py

├── tracing.py

└── performance.py
```

Tracks:

- API latency
- AI execution time
- Database performance
- Background job health
- System availability

---

# 22. Testing Structure

```text
tests/

├── unit/

├── integration/

├── api/

├── repositories/

├── services/

├── ai/

└── fixtures/
```

Testing mirrors the production folder layout to simplify maintenance.

---

# 23. Layer Interaction Rules

```text
HTTP Request
      │
      ▼
Router
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
Database
```

**Rules:**

- Routers must not access repositories directly.
- Services must not access HTTP request objects.
- Repositories must not contain business logic.
- AI modules interact through services, not routers.
- Models are only used for persistence.
- Schemas are only used for request/response validation.

---

# 24. Backend Design Principles

| Principle | Benefit |
|-----------|---------|
| Clean Architecture | Loose coupling and maintainability |
| One model per file | Easier navigation and reviews |
| One router per resource | RESTful organization |
| Repository pattern | Database abstraction |
| Service layer | Centralized business logic |
| Shared AI utilities | Avoid duplicated ML code |
| Background tasks | Non-blocking long-running operations |
| Centralized middleware | Consistent cross-cutting concerns |
| Typed schemas | Reliable API contracts |
| Modular structure | Easy feature expansion |
