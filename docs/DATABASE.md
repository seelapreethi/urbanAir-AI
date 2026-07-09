# DATABASE.md

# UrbanAir AI Database Design

> **Database:** PostgreSQL 16 + PostGIS
> **Architecture:** Normalized Relational Database (3NF)
> **Primary Key Strategy:** UUID v4
> **Spatial Engine:** PostGIS
> **Cache Layer:** Redis (Non-Persistent)
> **Version:** 1.0

---

# 1. Database Philosophy

UrbanAir AI is an **AI-powered decision intelligence platform**, not merely an AQI storage system. The database is therefore designed to support:

* Real-time environmental monitoring
* Historical trend analysis
* Geospatial intelligence
* AI forecasting
* Explainable AI
* Scenario simulation
* Enforcement workflows
* Citizen advisories
* Multi-city deployments
* Future horizontal scaling

The database acts as the **single source of truth** for all persistent application data.

---

# 2. Database Design Goals

The schema is designed around the following principles:

* Fully normalized (Third Normal Form)
* Clear separation of master data and transactional data
* Geospatial support through PostGIS
* Immutable historical environmental records
* Optimized for analytical queries
* Extensible for future AI models
* Compatible with Supabase PostgreSQL
* Suitable for a modular monolith with future microservice extraction

---

# 3. Technology Stack

| Component         | Technology          |
| ----------------- | ------------------- |
| Database Engine   | PostgreSQL 16       |
| Spatial Extension | PostGIS             |
| ORM               | SQLAlchemy          |
| Migration Tool    | Alembic             |
| Cache             | Redis               |
| Connection Pool   | SQLAlchemy Engine   |
| Deployment        | Supabase PostgreSQL |

---

# 4. Design Principles

## 4.1 UUID Primary Keys

Every table uses UUIDs instead of auto-increment integers.

Example:

```
city_id
ward_id
station_id
forecast_id
user_id
```

### Why?

* Globally unique identifiers
* Easier data synchronization
* Safe distributed inserts
* Better support for future microservices
* Prevents ID enumeration attacks

---

## 4.2 UTC Everywhere

All timestamps are stored in UTC.

Example columns:

```
created_at
updated_at
observed_at
forecast_time
generated_at
```

The frontend is responsible for timezone conversion.

---

## 4.3 Audit Columns

Every persistent table should include the following fields unless there is a strong reason not to:

| Column     | Purpose                                                           |
| ---------- | ----------------------------------------------------------------- |
| created_at | Record creation time                                              |
| updated_at | Last modification time                                            |
| created_by | User that created the record (nullable for system-generated data) |
| updated_by | User that last modified the record (nullable)                     |

### Benefits

* Auditability
* Change tracking
* Administrative transparency

---

## 4.4 Soft Deletes

Business entities are never permanently removed.

Each applicable table includes:

```
is_deleted BOOLEAN
deleted_at TIMESTAMP
```

### Why?

* Prevent accidental data loss
* Preserve historical references
* Maintain audit trails
* Simplify recovery

Environmental time-series data (e.g., AQI readings) should remain immutable and generally should not support soft deletion.

---

## 4.5 Naming Conventions

### Tables

Plural snake_case

Examples:

```
users
cities
wards
aqi_records
forecast_results
reports
```

---

### Columns

snake_case

Examples:

```
city_name
aqi_value
station_code
forecast_time
```

---

### Foreign Keys

Always reference the parent table's primary key.

Examples:

```
city_id
ward_id
station_id
user_id
report_id
```

---

### Boolean Fields

Prefix with descriptive verbs where appropriate.

Examples:

```
is_active
is_verified
is_deleted
is_public
```

---

### Timestamp Fields

Consistent naming:

```
created_at
updated_at
observed_at
generated_at
forecast_time
deleted_at
```

---

# 5. Normalization Strategy

UrbanAir AI follows **Third Normal Form (3NF)**.

## First Normal Form (1NF)

* Atomic values only
* No repeating groups
* One value per column

Example:

Correct:

```
pollutant = PM2.5
```

Incorrect:

```
pollutants = PM2.5, PM10, NO₂
```

---

## Second Normal Form (2NF)

* Every non-key attribute depends on the entire primary key.
* No partial dependencies.

---

## Third Normal Form (3NF)

* No transitive dependencies.
* Lookup data is separated into dedicated master tables.

Example:

Instead of storing city names repeatedly in AQI records, store a `city_id` foreign key referencing the `cities` table.

---

# 6. Data Classification

The schema is divided into logical domains.

```
Master Data
│
├── Cities
├── Wards
├── Monitoring Stations
├── Users
└── Roles

Environmental Data
│
├── AQI Records
├── Pollutants
├── Weather
└── Forecasts

AI Intelligence
│
├── Source Attribution
├── Recommendations
├── Explainability
└── Simulations

Citizen Services
│
├── Health Advisories
├── Notifications
└── Alerts

AI Assistant
│
├── Chat Sessions
├── Chat Messages
└── Knowledge Base

Reporting
│
├── Reports
├── Report Jobs
└── Audit Logs
```

This separation improves maintainability and aligns with backend module boundaries.

---

# 7. Spatial Database Design (PostGIS)

PostGIS is used for all geographic information.

## Spatial Objects

| Entity              | Geometry Type |
| ------------------- | ------------- |
| City Boundary       | MULTIPOLYGON  |
| Ward Boundary       | MULTIPOLYGON  |
| Monitoring Station  | POINT         |
| Pollution Hotspot   | POINT         |
| Construction Site   | POINT         |
| Industrial Area     | POLYGON       |
| Waste Burning Event | POINT         |

---

## Why PostGIS?

It enables efficient spatial queries such as:

* Which ward contains a pollution hotspot?
* Which monitoring station is closest to a location?
* Which construction sites lie within 2 km of a station?
* Which wards intersect a city's boundary?

Without PostGIS, these operations would require complex application-side calculations.

---

# 8. High-Level Entity Groups

```
                 USERS
                   │
                   │
              USER ROLES
                   │
                   │
                   ▼

        +-------------------+
        |      CITIES       |
        +-------------------+
                   │
          One-to-Many
                   │
                   ▼
        +-------------------+
        |      WARDS        |
        +-------------------+
                   │
          One-to-Many
                   │
                   ▼
      +-------------------------+
      | MONITORING STATIONS     |
      +-------------------------+
                   │
        One-to-Many Relationships
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
AQI RECORDS   WEATHER DATA   FORECASTS
                   │
                   ▼
        SOURCE ATTRIBUTION
                   │
                   ▼
          RECOMMENDATIONS
                   │
                   ▼
            HEALTH ALERTS
                   │
                   ▼
               REPORTS
```

---

# 9. Indexing Strategy

Indexes are created based on query patterns rather than every column.

## Primary Indexes

Every table has:

* Primary Key Index
* Unique Index (where applicable)

---

## Foreign Key Indexes

Every foreign key is indexed.

Examples:

```
city_id
ward_id
station_id
user_id
report_id
```

This improves join performance.

---

## Time-Series Indexes

Environmental tables are heavily filtered by time.

Examples:

```
observed_at
forecast_time
generated_at
```

These columns should have B-tree indexes.

---

## Composite Indexes

Used for common filtering patterns.

Examples:

```
(city_id, observed_at)

(station_id, observed_at)

(ward_id, forecast_time)

(city_id, generated_at)
```

Composite indexes improve performance for dashboards and trend analysis.

---

## Spatial Indexes

All geometry columns use GiST indexes.

Examples:

```
city_boundary

ward_boundary

station_location

hotspot_location
```

These indexes enable fast geospatial queries.

---

# 10. Data Retention Strategy

| Data Type     | Retention                        |
| ------------- | -------------------------------- |
| AQI Records   | Permanent                        |
| Weather Data  | Permanent                        |
| Forecasts     | Permanent (for model evaluation) |
| Reports       | Permanent                        |
| Chat History  | Configurable                     |
| Audit Logs    | Permanent                        |
| Notifications | Configurable                     |

Historical data is intentionally preserved to improve AI model training and support long-term trend analysis.

---

# 11. Database Domains vs Application Modules

| Application Module       | Primary Database Domain         |
| ------------------------ | ------------------------------- |
| AI Command Center        | AQI, Weather, Forecasts         |
| Source Attribution       | Pollution Sources, Hotspots     |
| AQI Forecast             | Forecasts, Weather, AQI History |
| Enforcement Intelligence | Hotspots, Recommendations       |
| Multi-City Dashboard     | Cities, Wards, AQI Records      |
| Citizen Health Advisory  | Advisories, Alerts              |
| AI Chat Assistant        | Chat, Knowledge Base            |
| Scenario Simulator       | Simulations, Forecasts          |
| Explainable AI           | Prediction Metadata             |
| Report Generator         | Reports, AQI, Forecasts         |

# DATABASE.md

# 13. Core Master Tables

The **Core Master Tables** represent the foundational entities of UrbanAir AI.

These tables change infrequently and are referenced by nearly every transactional table in the system.

```text
Core Master Data

Roles
   │
Users

Cities
   │
Wards
   │
Monitoring Stations
```

---

# 13.1 Roles

## Purpose

Defines the permissions available in the platform.

Rather than storing permission logic in application code, the database maintains a centralized list of roles.

This enables:

* Role-Based Access Control (RBAC)
* Future expansion
* Easier administration

---

## Table

```text
roles
```

---

## Columns

| Column      | Type        | Nullable | Description                 |
| ----------- | ----------- | -------- | --------------------------- |
| role_id     | UUID        | No       | Primary Key                 |
| role_name   | VARCHAR(50) | No       | Unique role name            |
| description | TEXT        | Yes      | Role description            |
| is_active   | BOOLEAN     | No       | Whether the role is enabled |
| created_at  | TIMESTAMP   | No       | Creation timestamp          |
| updated_at  | TIMESTAMP   | No       | Last update timestamp       |

---

## Constraints

Primary Key

```text
role_id
```

Unique

```text
role_name
```

---

## Relationships

```text
roles (1)

↓

users (Many)
```

One role can be assigned to many users.

---

## Indexes

Primary Index

```text
role_id
```

Unique Index

```text
role_name
```

---

# Why separate Roles?

Because permissions evolve independently of users.

Examples:

* Citizen
* City Officer
* Pollution Board Officer
* Health Department
* Administrator

Adding new roles should not require schema changes.

---

# 13.2 Users

## Purpose

Stores authenticated users of UrbanAir AI.

Supports:

* Authentication
* Authorization
* Report ownership
* Chat ownership
* Audit logs

---

## Table

```text
users
```

---

## Columns

| Column             | Type         | Nullable | Description        |
| ------------------ | ------------ | -------- | ------------------ |
| user_id            | UUID         | No       | Primary Key        |
| role_id            | UUID         | No       | FK → roles         |
| city_id            | UUID         | Yes      | Assigned city      |
| first_name         | VARCHAR(100) | No       | First name         |
| last_name          | VARCHAR(100) | Yes      | Last name          |
| email              | VARCHAR(255) | No       | Login email        |
| password_hash      | TEXT         | No       | Hashed password    |
| phone_number       | VARCHAR(20)  | Yes      | Contact number     |
| preferred_language | VARCHAR(20)  | No       | UI language        |
| is_verified        | BOOLEAN      | No       | Email verification |
| is_active          | BOOLEAN      | No       | Account status     |
| last_login_at      | TIMESTAMP    | Yes      | Last login         |
| created_at         | TIMESTAMP    | No       | Created timestamp  |
| updated_at         | TIMESTAMP    | No       | Updated timestamp  |

---

## Foreign Keys

```text
role_id

↓

roles
```

```text
city_id

↓

cities
```

---

## Relationships

```text
Roles

↓

Users

↓

Reports

↓

Chat Sessions

↓

Audit Logs
```

---

## Constraints

Primary Key

```text
user_id
```

Unique

```text
email
```

---

## Indexes

Primary Index

```text
user_id
```

Unique Index

```text
email
```

Foreign Key Index

```text
role_id
```

Foreign Key Index

```text
city_id
```

---

# Why assign users to cities?

City administrators generally operate within a single jurisdiction.

This enables:

* Automatic filtering
* Security isolation
* Simpler dashboards

Super administrators can have `city_id = NULL`.

---

# 13.3 Cities

## Purpose

Represents every supported city.

Every major module references this table.

---

## Table

```text
cities
```

---

## Columns

| Column       | Type                   | Nullable | Description            |
| ------------ | ---------------------- | -------- | ---------------------- |
| city_id      | UUID                   | No       | Primary Key            |
| city_name    | VARCHAR(100)           | No       | Official city name     |
| state_name   | VARCHAR(100)           | No       | State                  |
| country_name | VARCHAR(100)           | No       | Country                |
| population   | BIGINT                 | Yes      | Latest population      |
| area_sq_km   | NUMERIC                | Yes      | Area                   |
| climate_zone | VARCHAR(50)            | Yes      | Climate classification |
| timezone     | VARCHAR(50)            | No       | Timezone identifier    |
| boundary     | GEOMETRY(MULTIPOLYGON) | No       | City boundary          |
| centroid     | GEOMETRY(POINT)        | No       | City center            |
| is_active    | BOOLEAN                | No       | Supported city         |
| created_at   | TIMESTAMP              | No       | Created timestamp      |
| updated_at   | TIMESTAMP              | No       | Updated timestamp      |

---

## Relationships

```text
Cities

↓

Wards

↓

Stations

↓

AQI

↓

Forecasts

↓

Reports
```

---

## Constraints

Primary Key

```text
city_id
```

Unique

```text
(city_name, state_name, country_name)
```

---

## Indexes

Primary Index

```text
city_id
```

Spatial Index

```text
boundary
```

Spatial Index

```text
centroid
```

---

## Why store geometry?

Needed for:

* Map rendering
* Spatial analytics
* Boundary validation
* City comparison
* Administrative queries

---

# 13.4 Wards

## Purpose

A city is divided into administrative wards.

Hyperlocal forecasting, advisories, and enforcement operate at this level.

---

## Table

```text
wards
```

---

## Columns

| Column     | Type                   | Nullable | Description       |
| ---------- | ---------------------- | -------- | ----------------- |
| ward_id    | UUID                   | No       | Primary Key       |
| city_id    | UUID                   | No       | FK → cities       |
| ward_code  | VARCHAR(30)            | No       | Government code   |
| ward_name  | VARCHAR(100)           | No       | Display name      |
| population | BIGINT                 | Yes      | Population        |
| area_sq_km | NUMERIC                | Yes      | Area              |
| boundary   | GEOMETRY(MULTIPOLYGON) | No       | Ward polygon      |
| centroid   | GEOMETRY(POINT)        | No       | Center point      |
| created_at | TIMESTAMP              | No       | Created timestamp |
| updated_at | TIMESTAMP              | No       | Updated timestamp |

---

## Foreign Keys

```text
city_id

↓

cities
```

---

## Relationships

```text
City

↓

Wards

↓

Stations

↓

Forecasts

↓

Health Advisories

↓

Hotspots
```

---

## Constraints

Primary Key

```text
ward_id
```

Unique

```text
(city_id, ward_code)
```

---

## Indexes

Primary Index

```text
ward_id
```

Foreign Key

```text
city_id
```

Spatial Index

```text
boundary
```

Spatial Index

```text
centroid
```

Composite Index

```text
(city_id, ward_name)
```

---

## Why Wards instead of neighborhoods?

Wards are official administrative units.

Government interventions are planned and executed at the ward level.

---

# 13.5 Monitoring Stations

## Purpose

Represents AQI monitoring stations.

Can support:

* Government stations
* IoT sensors
* Temporary monitoring units
* Mobile monitoring stations

---

## Table

```text
monitoring_stations
```

---

## Columns

| Column            | Type            | Nullable | Description                         |
| ----------------- | --------------- | -------- | ----------------------------------- |
| station_id        | UUID            | No       | Primary Key                         |
| ward_id           | UUID            | No       | FK → wards                          |
| city_id           | UUID            | No       | FK → cities                         |
| station_code      | VARCHAR(50)     | No       | Official station identifier         |
| station_name      | VARCHAR(150)    | No       | Human-readable name                 |
| provider          | VARCHAR(100)    | No       | Data source (e.g., CPCB, State PCB) |
| latitude          | DECIMAL(9,6)    | No       | Latitude                            |
| longitude         | DECIMAL(9,6)    | No       | Longitude                           |
| location          | GEOMETRY(POINT) | No       | Spatial point                       |
| elevation_m       | NUMERIC         | Yes      | Elevation above sea level           |
| installation_date | DATE            | Yes      | Installation date                   |
| status            | VARCHAR(20)     | No       | Active, Maintenance, Inactive       |
| created_at        | TIMESTAMP       | No       | Created timestamp                   |
| updated_at        | TIMESTAMP       | No       | Updated timestamp                   |

---

## Foreign Keys

```text
city_id

↓

cities
```

```text
ward_id

↓

wards
```

---

## Constraints

Primary Key

```text
station_id
```

Unique

```text
station_code
```

Check Constraint

```text
status

IN

(
ACTIVE,
MAINTENANCE,
INACTIVE
)
```

---

## Relationships

```text
Monitoring Station

↓

AQI Records

↓

Weather

↓

Pollutant Measurements

↓

Forecast Validation
```

---

## Indexes

Primary Index

```text
station_id
```

Unique Index

```text
station_code
```

Foreign Key Index

```text
city_id
```

Foreign Key Index

```text
ward_id
```

Spatial Index

```text
location
```

Composite Index

```text
(city_id, status)
```

---

## Why both latitude/longitude and PostGIS geometry?

* `location` (GEOMETRY) enables fast spatial queries, distance calculations, and geofencing.
* `latitude` and `longitude` simplify API responses, exports, integrations, and debugging without requiring clients to parse PostGIS geometry.

This avoids unnecessary conversion on the application side while retaining full spatial capabilities.

---

# 14. Core Master Entity Relationship Diagram

```text
                    +------------------+
                    |      roles       |
                    +------------------+
                             │
                             │ 1
                             │
                             ▼
                    +------------------+
                    |      users       |
                    +------------------+
                             │
                             │ N
                             │
                             ▼
                    +------------------+
                    |      cities      |
                    +------------------+
                             │
                             │ 1
                             │
                             ▼
                    +------------------+
                    |      wards       |
                    +------------------+
                             │
                             │ 1
                             │
                             ▼
                 +---------------------------+
                 | monitoring_stations       |
                 +---------------------------+
```

> **Note:** In the full schema, `users` references both `roles` and (optionally) `cities`. The diagram above focuses on the foundational master-data hierarchy. Additional relationships to environmental, AI, reporting, and citizen-service tables will be introduced in subsequent sections.

# DATABASE.md

# 16. Environmental Data Layer

The Environmental Data Layer stores **time-series observations** collected from monitoring stations and external providers. It is the foundation for:

* AI Command Center
* Hyperlocal AQI Forecasting
* Explainable AI
* Multi-City Dashboard
* Scenario Simulator
* Citizen Health Advisories
* Report Generation

Unlike master data, these tables grow continuously and are optimized for high-volume inserts and analytical queries.

---

# Environmental Data Flow

```text
External Sources
│
├── CPCB / State PCB AQI
├── Weather APIs
├── Satellite Data
├── Traffic Data
└── Government Datasets
        │
        ▼
Ingestion Pipeline
        │
        ▼
AQI Records
Weather Observations
Traffic Snapshots
        │
        ▼
Feature Engineering
        │
        ▼
Forecast Runs
        │
        ▼
Forecast Results
        │
        ▼
AI Recommendations
```

---

# 16.1 Pollutants

## Purpose

Stores the master list of pollutants measured by the platform.

This avoids hardcoding pollutant names throughout the application and allows future expansion.

---

## Table

```text
pollutants
```

---

## Columns

| Column         | Type         | Nullable | Description                  |
| -------------- | ------------ | -------- | ---------------------------- |
| pollutant_id   | UUID         | No       | Primary Key                  |
| pollutant_code | VARCHAR(20)  | No       | Short code (PM25, PM10, NO2) |
| pollutant_name | VARCHAR(100) | No       | Display name                 |
| unit           | VARCHAR(30)  | No       | Measurement unit             |
| description    | TEXT         | Yes      | Description                  |
| created_at     | TIMESTAMP    | No       | Created timestamp            |

---

## Example Records

| Code | Name             | Unit  |
| ---- | ---------------- | ----- |
| PM25 | PM2.5            | µg/m³ |
| PM10 | PM10             | µg/m³ |
| NO2  | Nitrogen Dioxide | µg/m³ |
| SO2  | Sulfur Dioxide   | µg/m³ |
| CO   | Carbon Monoxide  | mg/m³ |
| O3   | Ozone            | µg/m³ |

---

## Relationships

```text
Pollutants

↓

AQI Measurements
```

---

## Indexes

Primary

```
pollutant_id
```

Unique

```
pollutant_code
```

---

# Why separate pollutants?

Different countries measure different pollutants.

Adding a new pollutant should require **no schema changes**.

---

# 16.2 AQI Records

## Purpose

Represents a single AQI observation for a monitoring station at a specific timestamp.

This is the primary environmental fact table.

---

## Table

```text
aqi_records
```

---

## Columns

| Column                | Type         | Nullable | Description                   |
| --------------------- | ------------ | -------- | ----------------------------- |
| aqi_record_id         | UUID         | No       | Primary Key                   |
| station_id            | UUID         | No       | FK → monitoring_stations      |
| ward_id               | UUID         | No       | FK → wards                    |
| city_id               | UUID         | No       | FK → cities                   |
| observed_at           | TIMESTAMP    | No       | Observation time              |
| aqi_value             | INTEGER      | No       | Calculated AQI                |
| category              | VARCHAR(30)  | No       | Good, Moderate, Poor, etc.    |
| dominant_pollutant_id | UUID         | Yes      | FK → pollutants               |
| source                | VARCHAR(100) | No       | Data provider                 |
| quality_flag          | VARCHAR(20)  | No       | Validated, Estimated, Missing |
| created_at            | TIMESTAMP    | No       | Insert timestamp              |

---

## Foreign Keys

```text
station_id → monitoring_stations

ward_id → wards

city_id → cities

dominant_pollutant_id → pollutants
```

---

## Relationships

```text
Monitoring Station

↓

AQI Records

↓

AQI Measurements

↓

Forecasting
```

---

## Constraints

Primary Key

```
aqi_record_id
```

Check Constraints

```text
aqi_value >= 0

aqi_value <= 500
```

---

## Indexes

Primary

```
aqi_record_id
```

Composite

```
(station_id, observed_at)
```

Composite

```
(city_id, observed_at)
```

Composite

```
(ward_id, observed_at)
```

Time Index

```
observed_at
```

---

# Why duplicate city_id and ward_id?

Although derivable through `station_id`, storing them directly:

* simplifies queries
* avoids unnecessary joins
* improves dashboard performance
* supports partition pruning in future

This is a deliberate, controlled denormalization for read efficiency.

---

# 16.3 AQI Measurements

## Purpose

Stores individual pollutant concentrations associated with an AQI record.

One AQI record can contain measurements for multiple pollutants.

---

## Table

```text
aqi_measurements
```

---

## Columns

| Column         | Type          | Nullable | Description      |
| -------------- | ------------- | -------- | ---------------- |
| measurement_id | UUID          | No       | Primary Key      |
| aqi_record_id  | UUID          | No       | FK → aqi_records |
| pollutant_id   | UUID          | No       | FK → pollutants  |
| concentration  | NUMERIC(10,2) | No       | Measured value   |
| unit           | VARCHAR(30)   | No       | Measurement unit |

---

## Relationships

```text
AQI Record

↓

AQI Measurements

↓

Pollutant
```

---

## Example

AQI Record

```
AQI = 245
```

Measurements

```text
PM2.5 = 154

PM10 = 221

NO2 = 68

SO2 = 14

CO = 1.1
```

---

## Constraints

Unique

```text
(aqi_record_id, pollutant_id)
```

This prevents duplicate measurements for the same pollutant in a single observation.

---

## Indexes

Composite

```
aqi_record_id

pollutant_id
```

---

# Why not store PM2.5 as a column?

Because:

* not every station measures every pollutant
* new pollutants may be introduced
* schema remains extensible

This follows a normalized fact-dimension pattern.

---

# 16.4 Weather Observations

## Purpose

Stores weather data synchronized with AQI observations.

Weather is a key input to forecasting and source attribution.

---

## Table

```text
weather_observations
```

---

## Columns

| Column              | Type         | Nullable | Description              |
| ------------------- | ------------ | -------- | ------------------------ |
| weather_id          | UUID         | No       | Primary Key              |
| station_id          | UUID         | Yes      | FK → monitoring_stations |
| ward_id             | UUID         | No       | FK → wards               |
| city_id             | UUID         | No       | FK → cities              |
| observed_at         | TIMESTAMP    | No       | Observation time         |
| temperature_c       | NUMERIC(5,2) | Yes      | Temperature              |
| humidity_percent    | NUMERIC(5,2) | Yes      | Humidity                 |
| wind_speed_mps      | NUMERIC(5,2) | Yes      | Wind speed               |
| wind_direction_deg  | INTEGER      | Yes      | Wind direction           |
| rainfall_mm         | NUMERIC(8,2) | Yes      | Rainfall                 |
| pressure_hpa        | NUMERIC(6,2) | Yes      | Atmospheric pressure     |
| cloud_cover_percent | NUMERIC(5,2) | Yes      | Cloud cover              |
| source              | VARCHAR(100) | No       | Data provider            |
| created_at          | TIMESTAMP    | No       | Insert timestamp         |

---

## Relationships

```text
Weather

↓

Forecast Runs

↓

Scenario Simulator
```

---

## Indexes

Composite

```
(city_id, observed_at)
```

Composite

```
(ward_id, observed_at)
```

Composite

```
(station_id, observed_at)
```

---

# 16.5 Forecast Runs

## Purpose

Represents a single execution of the forecasting pipeline.

Separating runs from predictions provides reproducibility and model governance.

---

## Table

```text
forecast_runs
```

---

## Columns

| Column                 | Type         | Nullable | Description        |
| ---------------------- | ------------ | -------- | ------------------ |
| forecast_run_id        | UUID         | No       | Primary Key        |
| model_name             | VARCHAR(100) | No       | Model identifier   |
| model_version          | VARCHAR(30)  | No       | Model version      |
| training_window_days   | INTEGER      | No       | Training period    |
| generated_at           | TIMESTAMP    | No       | Execution time     |
| forecast_horizon_hours | INTEGER      | No       | Prediction horizon |
| execution_time_ms      | INTEGER      | Yes      | Runtime            |
| status                 | VARCHAR(30)  | No       | Success / Failed   |
| created_by             | UUID         | Yes      | FK → users         |

---

## Why separate forecast runs?

This allows:

* reproducibility
* model comparison
* debugging
* auditability
* A/B testing

---

# 16.6 Forecast Results

## Purpose

Stores every predicted AQI value produced by a forecast run.

One run generates many predictions across cities, wards, and forecast horizons.

---

## Table

```text
forecast_results
```

---

## Columns

| Column                | Type         | Nullable | Description         |
| --------------------- | ------------ | -------- | ------------------- |
| forecast_result_id    | UUID         | No       | Primary Key         |
| forecast_run_id       | UUID         | No       | FK → forecast_runs  |
| city_id               | UUID         | No       | FK → cities         |
| ward_id               | UUID         | No       | FK → wards          |
| forecast_time         | TIMESTAMP    | No       | Predicted timestamp |
| predicted_aqi         | INTEGER      | No       | Predicted AQI       |
| confidence_score      | NUMERIC(5,2) | No       | Confidence (%)      |
| dominant_pollutant_id | UUID         | Yes      | FK → pollutants     |
| generated_at          | TIMESTAMP    | No       | Generation time     |

---

## Relationships

```text
Forecast Run

↓

Forecast Results

↓

Explainability

↓

Recommendations

↓

Reports
```

---

## Constraints

Check

```text
predicted_aqi >= 0

predicted_aqi <= 500
```

---

## Indexes

Composite

```
(city_id, forecast_time)
```

Composite

```
(ward_id, forecast_time)
```

Composite

```
(forecast_run_id, forecast_time)
```

---

# Why separate runs and results?

Instead of overwriting predictions, every execution is preserved.

Benefits:

* compare model versions
* evaluate prediction accuracy
* rollback if necessary
* maintain AI governance

---

# 17. Environmental Layer ER Diagram

```text
cities
   │
   ├──────────────┐
   │              │
wards        monitoring_stations
   │              │
   └──────┬───────┘
          │
          ▼
     aqi_records
          │
          ▼
   aqi_measurements
          │
          ▼
     pollutants

weather_observations
          │
          ▼
     forecast_runs
          │
          ▼
    forecast_results
```

# DATABASE.md

# 19. AI & Intelligence Layer

The AI & Intelligence Layer transforms environmental observations into actionable insights.

Rather than only predicting AQI, UrbanAir AI answers:

* **Why** pollution occurred
* **Where** intervention is needed
* **What** actions should be taken
* **How much** improvement each action may achieve
* **How confident** the AI is in its recommendations

These tables power:

* Geospatial Source Attribution
* Enforcement Intelligence
* Explainable AI
* AI Recommendations
* Scenario Simulator
* AI Command Center

---

# AI Data Flow

```text id="ai-flow-db"
AQI Records
Weather
Traffic
Satellite
Land Use
Population
        │
        ▼
Feature Engineering
        │
        ▼
Forecast Results
        │
        ▼
Source Attribution
        │
        ▼
Hotspot Detection
        │
        ▼
Explainability
        │
        ▼
Recommendations
        │
        ▼
Scenario Simulation
```

---

# 19.1 Pollution Sources

## Purpose

Stores the catalog of pollution source categories recognized by the platform.

This is a master table used throughout source attribution and recommendations.

---

## Table

```text id="pollution-sources-table"
pollution_sources
```

---

## Columns

| Column              | Type         | Nullable | Description        |
| ------------------- | ------------ | -------- | ------------------ |
| pollution_source_id | UUID         | No       | Primary Key        |
| source_code         | VARCHAR(30)  | No       | Short identifier   |
| source_name         | VARCHAR(100) | No       | Display name       |
| description         | TEXT         | Yes      | Description        |
| is_active           | BOOLEAN      | No       | Active status      |
| created_at          | TIMESTAMP    | No       | Creation timestamp |

---

## Example Records

| Source Code   | Source Name          |
| ------------- | -------------------- |
| TRAFFIC       | Vehicular Traffic    |
| INDUSTRY      | Industrial Emissions |
| CONSTRUCTION  | Construction Dust    |
| WASTE_BURNING | Open Waste Burning   |
| ROAD_DUST     | Road Dust            |
| BIOMASS       | Biomass Burning      |

---

## Relationships

```text id="pollution-source-rel"
pollution_sources

↓

source_attributions

↓

recommendations
```

---

## Indexes

Primary Key

```text id="pollution-source-pk"
pollution_source_id
```

Unique

```text id="pollution-source-uk"
source_code
```

---

# Why a master table?

New pollution categories can be added without changing any application logic or database schema.

---

# 19.2 Pollution Hotspots

## Purpose

Represents locations identified by AI as areas requiring attention.

Hotspots are generated periodically from environmental observations and spatial analysis.

---

## Table

```text id="hotspots-table"
pollution_hotspots
```

---

## Columns

| Column            | Type              | Nullable | Description                    |
| ----------------- | ----------------- | -------- | ------------------------------ |
| hotspot_id        | UUID              | No       | Primary Key                    |
| city_id           | UUID              | No       | FK → cities                    |
| ward_id           | UUID              | No       | FK → wards                     |
| detected_at       | TIMESTAMP         | No       | Detection time                 |
| hotspot_type      | VARCHAR(50)       | No       | Persistent / Temporary         |
| severity          | VARCHAR(30)       | No       | Low / Medium / High / Critical |
| average_aqi       | INTEGER           | No       | Average AQI                    |
| affected_radius_m | INTEGER           | Yes      | Estimated radius               |
| confidence_score  | NUMERIC(5,2)      | No       | AI confidence (%)              |
| geometry          | GEOMETRY(POLYGON) | No       | Hotspot boundary               |
| centroid          | GEOMETRY(POINT)   | No       | Center point                   |
| expires_at        | TIMESTAMP         | Yes      | Optional expiration            |
| created_at        | TIMESTAMP         | No       | Created timestamp              |

---

## Relationships

```text id="hotspot-rel"
City

↓

Ward

↓

Pollution Hotspots

↓

Recommendations

↓

Enforcement
```

---

## Indexes

Primary

```text id="hotspot-pk"
hotspot_id
```

Composite

```text id="hotspot-city-time"
(city_id, detected_at)
```

Composite

```text id="hotspot-ward-time"
(ward_id, detected_at)
```

Spatial

```text id="hotspot-gist"
geometry
```

Spatial

```text id="hotspot-centroid"
centroid
```

---

# Why polygons instead of points?

Pollution affects an **area**, not just a single coordinate.

Polygons allow:

* Ward overlap calculations
* Population impact estimation
* Heatmap rendering
* Enforcement planning

---

# 19.3 Source Attributions

## Purpose

Explains the most likely causes of a hotspot or forecast.

This is one of the most important AI tables.

Instead of saying:

> AQI = 285

UrbanAir AI can say:

* Traffic → 48%
* Construction → 27%
* Industry → 18%
* Waste Burning → 7%

---

## Table

```text id="source-attribution-table"
source_attributions
```

---

## Columns

| Column               | Type         | Nullable | Description                |
| -------------------- | ------------ | -------- | -------------------------- |
| attribution_id       | UUID         | No       | Primary Key                |
| hotspot_id           | UUID         | Yes      | FK → pollution_hotspots    |
| forecast_result_id   | UUID         | Yes      | FK → forecast_results      |
| pollution_source_id  | UUID         | No       | FK → pollution_sources     |
| contribution_percent | NUMERIC(5,2) | No       | Estimated contribution     |
| confidence_score     | NUMERIC(5,2) | No       | AI confidence              |
| explanation          | TEXT         | Yes      | Human-readable explanation |
| created_at           | TIMESTAMP    | No       | Created timestamp          |

---

## Constraints

Exactly one of:

* hotspot_id
* forecast_result_id

must be populated.

This allows attribution for both current hotspots and future forecasts.

---

## Relationships

```text id="source-attribution-rel"
Forecast

↓

Source Attribution

↓

Pollution Source
```

---

## Indexes

Composite

```text id="source-hotspot"
(hotspot_id, pollution_source_id)
```

Composite

```text id="source-forecast"
(forecast_result_id, pollution_source_id)
```

---

# Why percentages?

Decision-makers need relative impact.

Example:

```text id="source-example"
Traffic      52%

Construction 24%

Industry     18%

Others        6%
```

---

# 19.4 AI Recommendations

## Purpose

Stores recommendations generated by the AI engine.

Recommendations are versioned and persist for reporting and auditing.

---

## Table

```text id="recommendation-table"
recommendations
```

---

## Columns

| Column                   | Type         | Nullable | Description                                 |
| ------------------------ | ------------ | -------- | ------------------------------------------- |
| recommendation_id        | UUID         | No       | Primary Key                                 |
| forecast_result_id       | UUID         | Yes      | FK → forecast_results                       |
| hotspot_id               | UUID         | Yes      | FK → pollution_hotspots                     |
| city_id                  | UUID         | No       | FK → cities                                 |
| ward_id                  | UUID         | Yes      | FK → wards                                  |
| title                    | VARCHAR(200) | No       | Recommendation title                        |
| recommendation_text      | TEXT         | No       | Detailed recommendation                     |
| expected_aqi_improvement | INTEGER      | Yes      | Estimated AQI reduction                     |
| priority                 | VARCHAR(20)  | No       | Low / Medium / High / Critical              |
| confidence_score         | NUMERIC(5,2) | No       | AI confidence                               |
| status                   | VARCHAR(20)  | No       | Pending / Accepted / Rejected / Implemented |
| generated_at             | TIMESTAMP    | No       | Generated timestamp                         |

---

## Relationships

```text id="recommendation-rel"
Forecast

↓

Recommendation

↓

Reports
```

---

## Indexes

Composite

```text id="recommendation-city"
(city_id, priority)
```

Composite

```text id="recommendation-status"
(status, generated_at)
```

---

# Why persist recommendations?

Because authorities need to know:

* what was suggested
* when
* whether it was implemented
* whether it worked

---

# 19.5 Feature Contributions (Explainable AI)

## Purpose

Stores feature importance for every forecast.

Supports transparent AI.

---

## Table

```text id="feature-table"
feature_contributions
```

---

## Columns

| Column                  | Type         | Nullable | Description            |
| ----------------------- | ------------ | -------- | ---------------------- |
| feature_contribution_id | UUID         | No       | Primary Key            |
| forecast_result_id      | UUID         | No       | FK → forecast_results  |
| feature_name            | VARCHAR(100) | No       | Feature name           |
| contribution_score      | NUMERIC(8,4) | No       | Relative importance    |
| feature_value           | VARCHAR(100) | Yes      | Observed feature value |
| created_at              | TIMESTAMP    | No       | Created timestamp      |

---

## Example

```text id="feature-example"
Wind Speed

+0.42

Humidity

+0.31

Traffic Density

+0.18

Rainfall

-0.24
```

---

## Indexes

Composite

```text id="feature-index"
(forecast_result_id, feature_name)
```

---

# Why separate rows?

Different AI models produce different numbers of features.

A normalized table remains flexible regardless of model complexity.

---

# 19.6 Scenario Simulations

## Purpose

Represents one "what-if" simulation requested by a user.

Example:

> Reduce traffic by 20%

---

## Table

```text id="simulation-table"
scenario_simulations
```

---

## Columns

| Column          | Type         | Nullable | Description     |
| --------------- | ------------ | -------- | --------------- |
| simulation_id   | UUID         | No       | Primary Key     |
| user_id         | UUID         | No       | FK → users      |
| city_id         | UUID         | No       | FK → cities     |
| ward_id         | UUID         | Yes      | FK → wards      |
| simulation_name | VARCHAR(150) | No       | Display name    |
| description     | TEXT         | Yes      | Notes           |
| created_at      | TIMESTAMP    | No       | Simulation time |

---

## Relationships

```text id="simulation-rel"
Users

↓

Scenario Simulations

↓

Scenario Results
```

---

# 19.7 Scenario Results

## Purpose

Stores outputs produced by a scenario simulation.

A single simulation can generate multiple predicted outcomes.

---

## Table

```text id="scenario-results-table"
scenario_results
```

---

## Columns

| Column             | Type          | Nullable | Description                   |
| ------------------ | ------------- | -------- | ----------------------------- |
| scenario_result_id | UUID          | No       | Primary Key                   |
| simulation_id      | UUID          | No       | FK → scenario_simulations     |
| parameter_name     | VARCHAR(100)  | No       | Modified parameter            |
| original_value     | NUMERIC(10,2) | Yes      | Baseline                      |
| simulated_value    | NUMERIC(10,2) | Yes      | User value                    |
| predicted_aqi      | INTEGER       | No       | Predicted AQI                 |
| expected_change    | INTEGER       | No       | AQI improvement/deterioration |
| confidence_score   | NUMERIC(5,2)  | No       | AI confidence                 |

---

## Example

```text id="scenario-example"
Traffic

100%

↓

80%

↓

AQI

245

↓

201

↓

Improvement

44
```

---

## Indexes

Composite

```text id="scenario-index"
(simulation_id, parameter_name)
```

---

# 20. AI Layer ER Diagram

```text id="ai-er-diagram"
pollution_sources
        │
        │
        ▼
source_attributions
        ▲
        │
forecast_results
        │
        ▼
feature_contributions
        │
        ▼
recommendations
        ▲
        │
pollution_hotspots
        │
        ▼
scenario_simulations
        │
        ▼
scenario_results
```
# DATABASE.md

# 22. Citizen Services, AI Chat, Reporting & Administration Layer

This section contains the remaining business tables required to support all UrbanAir AI modules.

These tables power:

* Citizen Health Advisory
* AI Chat Assistant (RAG)
* Report Generator
* Notifications & Alerts
* System Administration
* Audit Trail
* AI Knowledge Base

---

# Module Mapping

```text
Citizen Health Advisory
│
├── health_advisories
├── alerts
└── notifications

AI Chat Assistant
│
├── chat_sessions
├── chat_messages
├── knowledge_documents
└── document_chunks

Report Generator
│
├── reports
└── report_exports

Administration
│
├── audit_logs
└── system_settings
```

---

# 22.1 Health Advisories

## Purpose

Stores AI-generated health recommendations for citizens.

Unlike notifications, advisories are informational and targeted to a location.

Examples:

* Avoid outdoor exercise.
* Wear an N95 mask.
* Keep windows closed.
* Sensitive groups should remain indoors.

---

## Table

```text
health_advisories
```

---

## Columns

| Column             | Type         | Nullable | Description                    |
| ------------------ | ------------ | -------- | ------------------------------ |
| advisory_id        | UUID         | No       | Primary Key                    |
| city_id            | UUID         | No       | FK → cities                    |
| ward_id            | UUID         | Yes      | FK → wards                     |
| forecast_result_id | UUID         | Yes      | FK → forecast_results          |
| advisory_level     | VARCHAR(20)  | No       | Low / Moderate / High / Severe |
| title              | VARCHAR(200) | No       | Advisory title                 |
| message            | TEXT         | No       | Advisory content               |
| valid_from         | TIMESTAMP    | No       | Start time                     |
| valid_until        | TIMESTAMP    | No       | End time                       |
| created_at         | TIMESTAMP    | No       | Created timestamp              |

---

## Relationships

```text
Forecast

↓

Health Advisory

↓

Citizens
```

---

## Indexes

Composite

```text
(city_id, valid_from)
```

Composite

```text
(ward_id, valid_from)
```

---

# Why separate advisories from alerts?

Advisories provide guidance.

Alerts demand attention.

These concepts have different lifecycles.

---

# 22.2 Alerts

## Purpose

Represents critical system-generated events.

Examples:

* AQI exceeds 300
* Forecast predicts hazardous air quality
* Sensor offline
* AI confidence below threshold

---

## Table

```text
alerts
```

---

## Columns

| Column          | Type         | Nullable | Description                    |
| --------------- | ------------ | -------- | ------------------------------ |
| alert_id        | UUID         | No       | Primary Key                    |
| city_id         | UUID         | No       | FK → cities                    |
| ward_id         | UUID         | Yes      | FK → wards                     |
| alert_type      | VARCHAR(50)  | No       | AQI / Forecast / Sensor        |
| severity        | VARCHAR(20)  | No       | Low / Medium / High / Critical |
| title           | VARCHAR(200) | No       | Alert title                    |
| message         | TEXT         | No       | Alert details                  |
| acknowledged    | BOOLEAN      | No       | User acknowledgement           |
| acknowledged_by | UUID         | Yes      | FK → users                     |
| acknowledged_at | TIMESTAMP    | Yes      | Acknowledgement time           |
| created_at      | TIMESTAMP    | No       | Alert creation                 |

---

## Relationships

```text
Alerts

↓

Notifications

↓

Users
```

---

## Indexes

Composite

```text
(city_id, severity)
```

Composite

```text
(created_at, severity)
```

---

# 22.3 Notifications

## Purpose

Tracks notifications delivered to users.

Supports:

* In-app notifications
* Email
* Push notifications
* SMS (future)

---

## Table

```text
notifications
```

---

## Columns

| Column            | Type         | Nullable | Description           |
| ----------------- | ------------ | -------- | --------------------- |
| notification_id   | UUID         | No       | Primary Key           |
| user_id           | UUID         | No       | FK → users            |
| alert_id          | UUID         | Yes      | FK → alerts           |
| title             | VARCHAR(200) | No       | Notification title    |
| message           | TEXT         | No       | Notification content  |
| notification_type | VARCHAR(30)  | No       | Email / Push / In-App |
| is_read           | BOOLEAN      | No       | Read status           |
| delivered_at      | TIMESTAMP    | Yes      | Delivery time         |
| created_at        | TIMESTAMP    | No       | Created timestamp     |

---

## Relationships

```text
Users

↓

Notifications
```

---

# 22.4 Chat Sessions

## Purpose

Represents one conversation with the AI assistant.

---

## Table

```text
chat_sessions
```

---

## Columns

| Column     | Type         | Nullable | Description        |
| ---------- | ------------ | -------- | ------------------ |
| session_id | UUID         | No       | Primary Key        |
| user_id    | UUID         | No       | FK → users         |
| city_id    | UUID         | Yes      | FK → cities        |
| title      | VARCHAR(200) | Yes      | Conversation title |
| created_at | TIMESTAMP    | No       | Session start      |
| updated_at | TIMESTAMP    | No       | Last activity      |

---

## Relationships

```text
User

↓

Chat Session

↓

Messages
```

---

## Indexes

Composite

```text
(user_id, updated_at)
```

---

# 22.5 Chat Messages

## Purpose

Stores every message exchanged with the AI assistant.

---

## Table

```text
chat_messages
```

---

## Columns

| Column            | Type        | Nullable | Description               |
| ----------------- | ----------- | -------- | ------------------------- |
| message_id        | UUID        | No       | Primary Key               |
| session_id        | UUID        | No       | FK → chat_sessions        |
| sender            | VARCHAR(20) | No       | User / Assistant / System |
| message           | TEXT        | No       | Message content           |
| prompt_tokens     | INTEGER     | Yes      | LLM prompt tokens         |
| completion_tokens | INTEGER     | Yes      | LLM completion tokens     |
| latency_ms        | INTEGER     | Yes      | Response latency          |
| created_at        | TIMESTAMP   | No       | Message time              |

---

## Indexes

Composite

```text
(session_id, created_at)
```

---

# Why separate sessions and messages?

Allows:

* unlimited conversation length
* conversation history
* conversation deletion
* analytics

---

# 22.6 Knowledge Documents

## Purpose

Stores documents used by the RAG pipeline.

Examples:

* CPCB guidelines
* WHO air quality standards
* Municipal SOPs
* Environmental regulations

---

## Table

```text
knowledge_documents
```

---

## Columns

| Column        | Type         | Nullable | Description         |
| ------------- | ------------ | -------- | ------------------- |
| document_id   | UUID         | No       | Primary Key         |
| title         | VARCHAR(255) | No       | Document title      |
| source        | VARCHAR(255) | Yes      | Source organization |
| document_type | VARCHAR(50)  | No       | PDF / HTML / Text   |
| language      | VARCHAR(20)  | No       | Language            |
| version       | VARCHAR(20)  | Yes      | Document version    |
| storage_path  | TEXT         | No       | File location       |
| checksum      | VARCHAR(128) | Yes      | Integrity hash      |
| created_at    | TIMESTAMP    | No       | Upload timestamp    |

---

# 22.7 Document Chunks

## Purpose

Stores logical text chunks created during document ingestion.

The vector embeddings themselves should live in the vector store (e.g., PostgreSQL with pgvector or another vector database in a future architecture), while this table stores metadata and source text.

---

## Table

```text
document_chunks
```

---

## Columns

| Column       | Type         | Nullable | Description                |
| ------------ | ------------ | -------- | -------------------------- |
| chunk_id     | UUID         | No       | Primary Key                |
| document_id  | UUID         | No       | FK → knowledge_documents   |
| chunk_index  | INTEGER      | No       | Chunk order                |
| content      | TEXT         | No       | Chunk text                 |
| embedding_id | VARCHAR(255) | Yes      | External vector identifier |
| token_count  | INTEGER      | Yes      | Number of tokens           |
| created_at   | TIMESTAMP    | No       | Created timestamp          |

---

## Relationships

```text
Knowledge Document

↓

Document Chunks

↓

Vector Store
```

---

# Why separate chunks?

Large documents are split before embedding.

This improves:

* semantic search
* retrieval accuracy
* LLM context quality

---

# 22.8 Reports

## Purpose

Stores generated reports.

Supports:

* Daily reports
* Weekly reports
* Monthly reports
* City summaries

---

## Table

```text
reports
```

---

## Columns

| Column              | Type        | Nullable | Description                  |
| ------------------- | ----------- | -------- | ---------------------------- |
| report_id           | UUID        | No       | Primary Key                  |
| city_id             | UUID        | No       | FK → cities                  |
| generated_by        | UUID        | Yes      | FK → users                   |
| report_type         | VARCHAR(30) | No       | Daily / Weekly / Monthly     |
| report_period_start | DATE        | No       | Start date                   |
| report_period_end   | DATE        | No       | End date                     |
| report_status       | VARCHAR(20) | No       | Pending / Completed / Failed |
| summary             | TEXT        | Yes      | Executive summary            |
| generated_at        | TIMESTAMP   | No       | Generation time              |

---

## Relationships

```text
Reports

↓

Report Exports
```

---

# 22.9 Report Exports

## Purpose

Tracks generated export files.

---

## Table

```text
report_exports
```

---

## Columns

| Column          | Type        | Nullable | Description      |
| --------------- | ----------- | -------- | ---------------- |
| export_id       | UUID        | No       | Primary Key      |
| report_id       | UUID        | No       | FK → reports     |
| export_format   | VARCHAR(20) | No       | PDF / CSV        |
| file_path       | TEXT        | No       | Storage location |
| file_size_bytes | BIGINT      | Yes      | File size        |
| generated_at    | TIMESTAMP   | No       | Export time      |

---

# Why separate exports?

One report can have multiple export formats.

Example:

```text
Monthly Report

↓

PDF

↓

CSV

↓

Future Excel
```

---

# 22.10 Audit Logs

## Purpose

Maintains a permanent record of important system actions.

Supports:

* security
* compliance
* debugging
* accountability

---

## Table

```text
audit_logs
```

---

## Columns

| Column       | Type         | Nullable | Description         |
| ------------ | ------------ | -------- | ------------------- |
| audit_log_id | UUID         | No       | Primary Key         |
| user_id      | UUID         | Yes      | FK → users          |
| action       | VARCHAR(100) | No       | Operation performed |
| entity_name  | VARCHAR(100) | No       | Table or module     |
| entity_id    | UUID         | Yes      | Affected record     |
| ip_address   | INET         | Yes      | Client IP           |
| user_agent   | TEXT         | Yes      | Browser/client      |
| created_at   | TIMESTAMP    | No       | Event time          |

---

## Why audit logs?

Critical administrative actions should never disappear.

Examples:

* Login
* Report generation
* Recommendation approval
* Alert acknowledgement
* User management

---

# 22.11 System Settings

## Purpose

Stores configurable application-wide settings.

Avoids hardcoding operational values.

---

## Table

```text
system_settings
```

---

## Columns

| Column        | Type         | Nullable | Description                |
| ------------- | ------------ | -------- | -------------------------- |
| setting_id    | UUID         | No       | Primary Key                |
| setting_key   | VARCHAR(100) | No       | Unique configuration key   |
| setting_value | TEXT         | No       | Configuration value        |
| description   | TEXT         | Yes      | Human-readable description |
| updated_by    | UUID         | Yes      | FK → users                 |
| updated_at    | TIMESTAMP    | No       | Last update                |

---

## Example Settings

```text
forecast.default_horizon = 72

aqi.alert_threshold = 300

chat.max_history = 20

report.retention_days = 365
```

---

# 23. Complete High-Level ER Diagram

```text
roles
   │
users
   │
   ├──────────────┐
   │              │
cities        audit_logs
   │
wards
   │
monitoring_stations
   │
aqi_records
   │
aqi_measurements
   │
pollutants

weather_observations
        │
forecast_runs
        │
forecast_results
        │
 ┌──────┼─────────────┐
 │      │             │
 │      │             │
 ▼      ▼             ▼
feature_contributions
source_attributions
recommendations
        │
pollution_hotspots
        │
health_advisories
        │
alerts
        │
notifications

users
   │
chat_sessions
   │
chat_messages

knowledge_documents
   │
document_chunks

reports
   │
report_exports

scenario_simulations
   │
scenario_results
```

---

# 24. Final Database Summary

## Total Tables

| Domain                 | Tables |
| ---------------------- | ------ |
| Identity & Access      | 2      |
| Geographic Master Data | 3      |
| Environmental Data     | 6      |
| AI & Intelligence      | 7      |
| Citizen Services       | 3      |
| AI Chat & Knowledge    | 4      |
| Reporting              | 2      |
| Administration         | 2      |

**Total: 29 production-ready tables**
