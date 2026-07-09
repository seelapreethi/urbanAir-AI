# API.md

# UrbanAir AI REST API Specification

> **API Style:** RESTful API
> **Protocol:** HTTPS
> **Version:** v1
> **Response Format:** JSON
> **Authentication:** JWT Bearer Token
> **Architecture:** Resource-Oriented REST

---

# 1. API Design Principles

UrbanAir AI follows REST architectural principles.

Every API should be:

* Stateless
* Versioned
* Secure
* Predictable
* Consistent
* Cache-friendly
* Frontend agnostic

---

## Base URL

```text
https://api.urbanair.ai/api/v1
```

Development

```text
http://localhost:8000/api/v1
```

---

# 2. Versioning

Every endpoint begins with:

```text
/api/v1/
```

Future versions

```text
/api/v2/
/api/v3/
```

Never break existing clients.

---

# 3. Resource Naming

Use nouns.

Correct

```text
/cities

/wards

/forecasts

/reports

/users
```

Wrong

```text
/getCities

/createForecast

/deleteUser
```

HTTP methods define the action.

---

# 4. HTTP Methods

| Method | Purpose        |
| ------ | -------------- |
| GET    | Read           |
| POST   | Create         |
| PUT    | Replace        |
| PATCH  | Partial Update |
| DELETE | Delete         |

---

# 5. Authentication

JWT Bearer Token

Header

```http
Authorization: Bearer <JWT_TOKEN>
```

---

Public APIs

No authentication

Examples

```text
GET /health

GET /cities

GET /aqi/public

GET /health-advisories/public
```

---

Protected APIs

Require JWT

Examples

```text
POST /reports

POST /forecasts/run

POST /simulations

GET /admin/dashboard
```

---

# 6. Role-Based Access

| Role              | Access                           |
| ----------------- | -------------------------------- |
| Citizen           | Public data, advisories, AI chat |
| City Officer      | Dashboard, reports, simulations  |
| Pollution Board   | Forecasts, enforcement           |
| Health Department | Advisories                       |
| Administrator     | Full access                      |

---

# 7. Standard Response Format

Success

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {},
  "timestamp": "2026-07-01T10:15:30Z"
}
```

---

Failure

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "city_id",
      "message": "City not found."
    }
  ],
  "timestamp": "2026-07-01T10:15:30Z"
}
```

---

# 8. HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 202  | Accepted              |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 429  | Too Many Requests     |
| 500  | Internal Server Error |
| 503  | Service Unavailable   |

---

# 9. Pagination

Large collections are paginated.

Example

```text
GET /aqi-records?page=2&page_size=25
```

Response

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 2,
    "page_size": 25,
    "total_records": 1250,
    "total_pages": 50
  }
}
```

---

# 10. Filtering

Example

```text
GET /forecasts

?city_id=...

&ward_id=...

&date=2026-07-01

&severity=HIGH
```

---

# 11. Searching

```text
GET /cities

?search=Hyderabad
```

```text
GET /users

?search=John
```

---

# 12. Sorting

```text
GET /reports

?sort=generated_at

&order=desc
```

Supported

```text
asc

desc
```

---

# 13. Field Selection (Optional)

```text
GET /forecasts

?fields=predicted_aqi,confidence_score
```

Reduces payload size for dashboard widgets.

---

# 14. Date Filtering

```text
GET /aqi-records

?from=2026-07-01

&to=2026-07-07
```

---

# 15. API Rate Limiting

| API                | Limit   |
| ------------------ | ------- |
| Public APIs        | 100/min |
| Authenticated APIs | 300/min |
| AI Chat            | 30/min  |
| Login              | 10/min  |

---

# 16. Idempotency

`POST` endpoints that trigger expensive or asynchronous operations (e.g., report generation) should support an optional `Idempotency-Key` header so clients can safely retry requests without creating duplicate work.

---

# 17. Request Validation

All requests are validated before reaching business logic.

Validation includes:

* Required fields
* UUID format
* Date format (ISO 8601)
* Enum values
* Numeric ranges
* Authorization

Invalid requests return **422 Unprocessable Entity**.

---

# 18. API Categories

```text
Authentication

Users

Cities

Wards

Monitoring Stations

AQI

Weather

Forecasts

Hotspots

Source Attribution

Recommendations

Explainability

Scenario Simulator

Health Advisories

Alerts

Notifications

AI Chat

Reports

Administration
```

---

# 19. Endpoint Naming Convention

| Resource    | Endpoint           |
| ----------- | ------------------ |
| Users       | `/users`           |
| Single User | `/users/{user_id}` |
| Reports     | `/reports`         |
| Forecasts   | `/forecasts`       |
| Hotspots    | `/hotspots`        |

Nested resources are only used when ownership is explicit (e.g., `/reports/{report_id}/exports`). Otherwise, related resources are filtered using query parameters.

---

# 20. Authentication APIs

## Base Endpoint

```text
/api/v1/auth
```

---

### Login

| Method | Endpoint      |
| ------ | ------------- |
| POST   | `/auth/login` |

Authentication

Public

Request

```json
{
  "email": "officer@city.gov",
  "password": "********"
}
```

Response

```json
{
  "success": true,
  "data": {
    "access_token": "...",
    "refresh_token": "...",
    "expires_in": 3600
  }
}
```

Status Codes

```
200
401
422
```

---

### Refresh Token

| Method | Endpoint        |
| ------ | --------------- |
| POST   | `/auth/refresh` |

Authentication

Refresh Token

Response

New JWT

---

### Logout

| Method | Endpoint       |
| ------ | -------------- |
| POST   | `/auth/logout` |

Authentication

JWT Required

---

### Current User

| Method | Endpoint   |
| ------ | ---------- |
| GET    | `/auth/me` |

Returns

* user
* role
* assigned city
* permissions

---

### Change Password

| Method | Endpoint                |
| ------ | ----------------------- |
| PUT    | `/auth/change-password` |

---

### Forgot Password

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/auth/forgot-password` |

---

### Reset Password

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | `/auth/reset-password` |

---

# 21. Users API

Base

```text
/api/v1/users
```

---

### List Users

| Method | Endpoint |
| ------ | -------- |
| GET    | `/users` |

Supports

```
Pagination

Search

Sorting

Filtering
```

Filters

```
role

city

active
```

---

### Get User

```
GET /users/{user_id}
```

---

### Create User

```
POST /users
```

---

### Update User

```
PUT /users/{user_id}
```

---

### Partial Update User

```
PATCH /users/{user_id}
```

---

### Delete User

```
DELETE /users/{user_id}
```

Soft delete.

---

### User Permissions

```
GET /users/{user_id}/permissions
```

---

# 22. Roles API

```
GET /roles

GET /roles/{role_id}

POST /roles

PUT /roles/{role_id}

DELETE /roles/{role_id}
```

Administrator only for write operations.

# API.md

# 24. Geographic APIs

The Geographic APIs provide access to the administrative hierarchy and monitoring infrastructure used throughout UrbanAir AI.

These APIs support:

* AI Command Center
* Multi-City Dashboard
* AQI Monitoring
* Hyperlocal Forecasting
* Citizen Advisory
* Enforcement Intelligence
* Report Generator

---

# Geographic Hierarchy

```text
Country
    │
    ▼
Cities
    │
    ▼
Wards
    │
    ▼
Monitoring Stations
```

---

# 24.1 Cities API

Base Endpoint

```text
/api/v1/cities
```

---

## List Cities

| Method | Endpoint  |
| ------ | --------- |
| GET    | `/cities` |

### Authentication

Public

---

### Query Parameters

| Parameter | Type    | Description         |
| --------- | ------- | ------------------- |
| page      | Integer | Page number         |
| page_size | Integer | Records per page    |
| search    | String  | Search by city name |
| state     | String  | Filter by state     |
| country   | String  | Filter by country   |
| sort      | String  | Sort field          |
| order     | String  | asc / desc          |

---

### Example

```http
GET /api/v1/cities?page=1&page_size=20&search=Hyderabad
```

---

### Response

```json
{
  "success": true,
  "data": [
    {
      "city_id": "uuid",
      "city_name": "Hyderabad",
      "state_name": "Telangana",
      "country_name": "India",
      "population": 10000000
    }
  ],
  "meta": {}
}
```

---

### Status Codes

| Code | Meaning       |
| ---- | ------------- |
| 200  | Success       |
| 400  | Invalid query |
| 500  | Server error  |

---

## Get City

| Method | Endpoint            |
| ------ | ------------------- |
| GET    | `/cities/{city_id}` |

Returns complete city details.

---

## Create City

| Method | Endpoint  |
| ------ | --------- |
| POST   | `/cities` |

Authentication

Administrator

---

Request

```json
{
  "city_name": "",
  "state_name": "",
  "country_name": "",
  "population": 0,
  "area_sq_km": 0
}
```

---

Status Codes

```text
201 Created

400 Bad Request

409 Conflict

422 Validation Error
```

---

## Update City

| Method | Endpoint            |
| ------ | ------------------- |
| PUT    | `/cities/{city_id}` |

Administrator only.

---

## Delete City

| Method | Endpoint            |
| ------ | ------------------- |
| DELETE | `/cities/{city_id}` |

Soft delete.

---

# 24.2 Wards API

Base

```text
/api/v1/wards
```

---

## List Wards

| Method | Endpoint |
| ------ | -------- |
| GET    | `/wards` |

---

### Filters

```text
city_id

search

page

page_size

sort

order
```

---

Example

```http
GET /wards?city_id=uuid&page=1
```

---

Response

```json
{
  "success": true,
  "data": [
    {
      "ward_id": "",
      "ward_name": "",
      "population": 50000
    }
  ]
}
```

---

## Get Ward

```text
GET /wards/{ward_id}
```

---

## Create Ward

```text
POST /wards
```

Admin

---

## Update Ward

```text
PUT /wards/{ward_id}
```

---

## Delete Ward

```text
DELETE /wards/{ward_id}
```

Soft delete.

---

## Get Wards by City

```text
GET /cities/{city_id}/wards
```

Returns every ward belonging to a city.

---

# 24.3 Monitoring Stations API

Base

```text
/api/v1/stations
```

---

## List Stations

| Method | Endpoint    |
| ------ | ----------- |
| GET    | `/stations` |

---

Filters

```text
city_id

ward_id

provider

status

search

page

page_size
```

---

Example

```http
GET /stations?city_id=uuid&status=ACTIVE
```

---

Response

```json
{
  "success": true,
  "data": [
    {
      "station_id": "",
      "station_name": "",
      "provider": "",
      "status": "ACTIVE"
    }
  ]
}
```

---

## Get Station

```text
GET /stations/{station_id}
```

---

## Create Station

```text
POST /stations
```

---

## Update Station

```text
PUT /stations/{station_id}
```

---

## Delete Station

```text
DELETE /stations/{station_id}
```

---

## Stations Near Location

```text
GET /stations/nearby
```

Query Parameters

```text
latitude

longitude

radius
```

Example

```http
GET /stations/nearby?latitude=17.3850&longitude=78.4867&radius=5000
```

Returns monitoring stations within the specified radius (meters).

---

## Station Latest AQI

```text
GET /stations/{station_id}/latest-aqi
```

Returns the most recent AQI observation.

---

## Station History

```text
GET /stations/{station_id}/history
```

Filters

```text
from

to

page

page_size
```

---

# 24.4 Geographic Lookup APIs

These endpoints reduce frontend API calls by returning reference data.

---

## City Summary

```text
GET /cities/{city_id}/summary
```

Returns

* AQI overview
* Weather summary
* Forecast summary
* Number of wards
* Active stations

Used by the AI Command Center.

---

## Ward Summary

```text
GET /wards/{ward_id}/summary
```

Returns

* Latest AQI
* Forecast
* Health advisory
* Hotspots
* Recommendations

---

## City Statistics

```text
GET /cities/{city_id}/statistics
```

Returns

* Population
* Area
* Number of wards
* Monitoring stations
* Average AQI
* Current hotspot count

---

## Ward Boundaries

```text
GET /wards/{ward_id}/boundary
```

Returns GeoJSON for map rendering.

---

## City Boundary

```text
GET /cities/{city_id}/boundary
```

Returns GeoJSON.

---

## Station Locations

```text
GET /stations/locations
```

Returns only coordinates for efficient map rendering.

Example response:

```json
{
  "success": true,
  "data": [
    {
      "station_id": "uuid",
      "latitude": 17.3850,
      "longitude": 78.4867
    }
  ]
}
```

---

# 25. Geographic API Permissions

| Endpoint       | Citizen | Officer | Admin |
| -------------- | :-----: | :-----: | :---: |
| GET Cities     |    ✅    |    ✅    |   ✅   |
| GET Wards      |    ✅    |    ✅    |   ✅   |
| GET Stations   |    ✅    |    ✅    |   ✅   |
| Create City    |    ❌    |    ❌    |   ✅   |
| Update City    |    ❌    |    ❌    |   ✅   |
| Delete City    |    ❌    |    ❌    |   ✅   |
| Create Ward    |    ❌    |    ❌    |   ✅   |
| Update Ward    |    ❌    |    ❌    |   ✅   |
| Delete Ward    |    ❌    |    ❌    |   ✅   |
| Create Station |    ❌    |    ✅    |   ✅   |
| Update Station |    ❌    |    ✅    |   ✅   |
| Delete Station |    ❌    |    ❌    |   ✅   |

---

# 26. Geographic Endpoint Summary

```text
GET    /cities
GET    /cities/{city_id}
POST   /cities
PUT    /cities/{city_id}
DELETE /cities/{city_id}

GET    /cities/{city_id}/summary
GET    /cities/{city_id}/statistics
GET    /cities/{city_id}/boundary
GET    /cities/{city_id}/wards

GET    /wards
GET    /wards/{ward_id}
POST   /wards
PUT    /wards/{ward_id}
DELETE /wards/{ward_id}
GET    /wards/{ward_id}/summary
GET    /wards/{ward_id}/boundary

GET    /stations
GET    /stations/{station_id}
POST   /stations
PUT    /stations/{station_id}
DELETE /stations/{station_id}
GET    /stations/nearby
GET    /stations/locations
GET    /stations/{station_id}/latest-aqi
GET    /stations/{station_id}/history
```

# API.md

# 28. Environmental APIs

The Environmental APIs expose environmental observations, pollutant measurements, weather data, and AI-generated forecasts.

These APIs power:

* AI Command Center
* Hyperlocal AQI Forecast
* Multi-City Dashboard
* Explainable AI
* Report Generator
* Scenario Simulator

---

# Environmental Data Flow

```text
Monitoring Stations
        │
        ▼
AQI Records
        │
        ▼
Pollutant Measurements
        │
        ▼
Weather Data
        │
        ▼
Forecast Engine
        │
        ▼
Forecast Results
```

---

# 28.1 Pollutants API

Base Endpoint

```text
/api/v1/pollutants
```

---

## List Pollutants

| Method | Endpoint      |
| ------ | ------------- |
| GET    | `/pollutants` |

### Authentication

Public

---

### Query Parameters

None

---

### Response

```json
{
  "success": true,
  "data": [
    {
      "pollutant_id": "uuid",
      "code": "PM25",
      "name": "PM2.5",
      "unit": "µg/m³"
    }
  ]
}
```

---

## Get Pollutant

```text
GET /pollutants/{pollutant_id}
```

---

Administrator APIs

```text
POST   /pollutants
PUT    /pollutants/{pollutant_id}
DELETE /pollutants/{pollutant_id}
```

---

# 28.2 AQI Records API

Base

```text
/api/v1/aqi-records
```

---

## List AQI Records

| Method | Endpoint       |
| ------ | -------------- |
| GET    | `/aqi-records` |

### Authentication

Public

---

### Filters

```text
city_id

ward_id

station_id

from

to

category

page

page_size

sort

order
```

---

Example

```http
GET /aqi-records?city_id=uuid&from=2026-07-01&to=2026-07-07&page=1
```

---

### Response

```json
{
  "success": true,
  "data": [
    {
      "aqi_record_id": "uuid",
      "city_id": "uuid",
      "ward_id": "uuid",
      "station_id": "uuid",
      "observed_at": "2026-07-01T10:00:00Z",
      "aqi_value": 184,
      "category": "Poor",
      "dominant_pollutant": "PM2.5"
    }
  ],
  "meta": {}
}
```

---

Status Codes

| Code | Meaning          |
| ---- | ---------------- |
| 200  | Success          |
| 400  | Invalid filters  |
| 422  | Validation error |

---

## Get AQI Record

```text
GET /aqi-records/{aqi_record_id}
```

Returns a single AQI observation.

---

## Create AQI Record

```text
POST /aqi-records
```

Authentication

Administrator / Data Ingestion Service

---

Request

```json
{
  "station_id": "uuid",
  "observed_at": "2026-07-01T10:00:00Z",
  "aqi_value": 142,
  "dominant_pollutant_id": "uuid"
}
```

---

## Update AQI Record

```text
PUT /aqi-records/{aqi_record_id}
```

---

## Delete AQI Record

```text
DELETE /aqi-records/{aqi_record_id}
```

Soft delete if supported by ingestion policy.

---

# 28.3 AQI Measurements API

Base

```text
/api/v1/aqi-measurements
```

---

## List Measurements

```text
GET /aqi-measurements
```

---

Filters

```text
aqi_record_id

pollutant_id

city_id

station_id

from

to
```

---

## Get Measurement

```text
GET /aqi-measurements/{measurement_id}
```

---

Administrator

```text
POST   /aqi-measurements

PUT    /aqi-measurements/{measurement_id}

DELETE /aqi-measurements/{measurement_id}
```

---

# 28.4 Weather API

Base

```text
/api/v1/weather
```

---

## List Weather Observations

```text
GET /weather
```

---

Filters

```text
city_id

ward_id

station_id

from

to

page

page_size
```

---

Response

```json
{
  "success": true,
  "data": [
    {
      "weather_id": "uuid",
      "temperature_c": 33.2,
      "humidity_percent": 48,
      "wind_speed_mps": 5.2,
      "rainfall_mm": 0.0,
      "observed_at": "2026-07-01T10:00:00Z"
    }
  ]
}
```

---

## Latest Weather

```text
GET /weather/latest
```

Optional Filters

```text
city_id

ward_id

station_id
```

---

## Get Weather Observation

```text
GET /weather/{weather_id}
```

---

Administrator

```text
POST

PUT

DELETE
```

Supported on `/weather` and `/weather/{weather_id}`.

---

# 28.5 Forecast API

Base

```text
/api/v1/forecasts
```

---

## List Forecast Results

```text
GET /forecasts
```

---

Filters

```text
city_id

ward_id

forecast_date

forecast_horizon

page

page_size

sort

order
```

---

Example

```http
GET /forecasts?city_id=uuid&forecast_horizon=72
```

---

Response

```json
{
  "success": true,
  "data": [
    {
      "forecast_result_id": "uuid",
      "forecast_time": "2026-07-02T10:00:00Z",
      "predicted_aqi": 214,
      "confidence_score": 92.3,
      "dominant_pollutant": "PM2.5"
    }
  ]
}
```

---

## Get Forecast

```text
GET /forecasts/{forecast_result_id}
```

---

## Latest Forecast

```text
GET /forecasts/latest
```

Filters

```text
city_id

ward_id
```

---

## Forecast History

```text
GET /forecasts/history
```

Filters

```text
city_id

ward_id

from

to
```

---

## Trigger Forecast Run

```text
POST /forecasts/run
```

Authentication

Administrator

Pollution Board

---

Request

```json
{
  "city_id": "uuid",
  "forecast_horizon_hours": 72
}
```

---

Response

```json
{
  "success": true,
  "message": "Forecast job accepted.",
  "data": {
    "forecast_run_id": "uuid",
    "status": "QUEUED"
  }
}
```

---

Status Codes

| Code | Meaning          |
| ---- | ---------------- |
| 202  | Accepted         |
| 401  | Unauthorized     |
| 403  | Forbidden        |
| 422  | Validation error |

---

## Forecast Run Status

```text
GET /forecasts/runs/{forecast_run_id}
```

Returns:

* Status
* Progress
* Started at
* Finished at
* Model version

---

## Forecast Accuracy

```text
GET /forecasts/accuracy
```

Filters

```text
city_id

from

to
```

Returns model evaluation metrics (e.g., MAE, RMSE, MAPE) for the requested period.

---

# 28.6 Dashboard Environmental APIs

These optimized endpoints return aggregated data for dashboard widgets.

---

## Current AQI Summary

```text
GET /dashboard/current-aqi
```

Returns

* Current AQI
* Category
* Dominant pollutant
* Trend

---

## AQI Trend

```text
GET /dashboard/aqi-trend
```

Filters

```text
city_id

ward_id

days
```

---

## Weather Summary

```text
GET /dashboard/weather-summary
```

Returns latest weather metrics for the selected scope.

---

## Forecast Summary

```text
GET /dashboard/forecast-summary
```

Returns

* 24-hour forecast
* 48-hour forecast
* 72-hour forecast
* Confidence score

---

# 29. Environmental API Permissions

| Endpoint             | Citizen | Officer | Admin |
| -------------------- | :-----: | :-----: | :---: |
| GET Pollutants       |    ✅    |    ✅    |   ✅   |
| GET AQI              |    ✅    |    ✅    |   ✅   |
| GET Weather          |    ✅    |    ✅    |   ✅   |
| GET Forecasts        |    ✅    |    ✅    |   ✅   |
| Create AQI Record    |    ❌    |    ❌*   |   ✅   |
| Update AQI Record    |    ❌    |    ❌*   |   ✅   |
| Delete AQI Record    |    ❌    |    ❌    |   ✅   |
| Trigger Forecast Run |    ❌    |    ✅    |   ✅   |

*Data ingestion services may be granted machine-to-machine credentials instead of user roles.

---

# 30. Environmental Endpoint Summary

```text
GET    /pollutants
GET    /pollutants/{pollutant_id}
POST   /pollutants
PUT    /pollutants/{pollutant_id}
DELETE /pollutants/{pollutant_id}

GET    /aqi-records
GET    /aqi-records/{aqi_record_id}
POST   /aqi-records
PUT    /aqi-records/{aqi_record_id}
DELETE /aqi-records/{aqi_record_id}

GET    /aqi-measurements
GET    /aqi-measurements/{measurement_id}
POST   /aqi-measurements
PUT    /aqi-measurements/{measurement_id}
DELETE /aqi-measurements/{measurement_id}

GET    /weather
GET    /weather/latest
GET    /weather/{weather_id}
POST   /weather
PUT    /weather/{weather_id}
DELETE /weather/{weather_id}

GET    /forecasts
GET    /forecasts/latest
GET    /forecasts/history
GET    /forecasts/{forecast_result_id}
POST   /forecasts/run
GET    /forecasts/runs/{forecast_run_id}
GET    /forecasts/accuracy

GET    /dashboard/current-aqi
GET    /dashboard/aqi-trend
GET    /dashboard/weather-summary
GET    /dashboard/forecast-summary
```
# API.md

# 32. AI Intelligence APIs

The AI Intelligence APIs expose the core decision-support capabilities of UrbanAir AI.

These endpoints transform environmental data into actionable insights for city administrators.

They power:

* Geospatial Source Attribution
* Enforcement Intelligence
* Explainable AI
* AI Recommendations
* Scenario Simulator
* AI Command Center

---

# AI Decision Flow

```text
AQI + Weather + Traffic + Satellite
                │
                ▼
        AI Forecast Engine
                │
                ▼
       Source Attribution
                │
                ▼
      Explainable AI (XAI)
                │
                ▼
      Recommendations Engine
                │
                ▼
      Scenario Simulator
```

---

# 32.1 Pollution Hotspots API

Base Endpoint

```text
/api/v1/hotspots
```

---

## List Hotspots

| Method | Endpoint    |
| ------ | ----------- |
| GET    | `/hotspots` |

### Authentication

Authenticated Users

---

### Filters

| Parameter | Description                    |
| --------- | ------------------------------ |
| city_id   | Filter by city                 |
| ward_id   | Filter by ward                 |
| severity  | Low / Medium / High / Critical |
| from      | Detection start date           |
| to        | Detection end date             |
| active    | Active hotspots only           |
| page      | Pagination                     |
| page_size | Pagination                     |
| sort      | detected_at / severity         |
| order     | asc / desc                     |

---

Example

```http
GET /hotspots?city_id=uuid&severity=HIGH&page=1
```

---

Response

```json
{
  "success": true,
  "data": [
    {
      "hotspot_id": "uuid",
      "severity": "HIGH",
      "average_aqi": 286,
      "confidence_score": 91.4,
      "detected_at": "2026-07-01T10:00:00Z"
    }
  ]
}
```

---

## Get Hotspot

```text
GET /hotspots/{hotspot_id}
```

Returns:

* Geometry
* AQI
* Sources
* Recommendations
* Forecast

---

## Current Hotspots

```text
GET /hotspots/current
```

Returns all currently active hotspots.

---

## Hotspot Geometry

```text
GET /hotspots/{hotspot_id}/geometry
```

Returns GeoJSON polygon for map rendering.

---

# 32.2 Source Attribution API

Base

```text
/api/v1/source-attributions
```

---

## List Source Attributions

```text
GET /source-attributions
```

---

Filters

```text
hotspot_id

forecast_result_id

pollution_source_id

city_id
```

---

Example

```http
GET /source-attributions?hotspot_id=uuid
```

---

Response

```json
{
  "success": true,
  "data": [
    {
      "source": "Traffic",
      "contribution_percent": 48.3,
      "confidence_score": 92.1
    },
    {
      "source": "Construction",
      "contribution_percent": 26.4,
      "confidence_score": 87.2
    }
  ]
}
```

---

## Get Attribution

```text
GET /source-attributions/{attribution_id}
```

---

## Attribution for Forecast

```text
GET /forecasts/{forecast_result_id}/source-attributions
```

---

## Attribution for Hotspot

```text
GET /hotspots/{hotspot_id}/source-attributions
```

---

# 32.3 AI Recommendations API

Base

```text
/api/v1/recommendations
```

---

## List Recommendations

```text
GET /recommendations
```

---

Filters

```text
city_id

ward_id

priority

status

forecast_result_id

hotspot_id

page

page_size
```

---

Response

```json
{
  "success": true,
  "data": [
    {
      "recommendation_id": "uuid",
      "title": "Reduce traffic flow by 20%",
      "priority": "HIGH",
      "expected_aqi_improvement": 34,
      "confidence_score": 91.8,
      "status": "PENDING"
    }
  ]
}
```

---

## Get Recommendation

```text
GET /recommendations/{recommendation_id}
```

---

## Update Recommendation Status

```text
PATCH /recommendations/{recommendation_id}
```

Request

```json
{
  "status": "IMPLEMENTED"
}
```

---

Allowed Status

```text
PENDING

ACCEPTED

REJECTED

IMPLEMENTED
```

---

## Recommendations by Forecast

```text
GET /forecasts/{forecast_result_id}/recommendations
```

---

## Recommendations by Hotspot

```text
GET /hotspots/{hotspot_id}/recommendations
```

---

# 32.4 Explainable AI API

Base

```text
/api/v1/explainability
```

---

## Feature Contributions

```text
GET /explainability/{forecast_result_id}
```

Returns feature importance for a forecast.

---

Example Response

```json
{
  "success": true,
  "data": [
    {
      "feature": "Wind Speed",
      "importance": 0.42
    },
    {
      "feature": "Humidity",
      "importance": 0.29
    }
  ]
}
```

---

## Forecast Explanation

```text
GET /forecasts/{forecast_result_id}/explanation
```

Returns

* Prediction
* Confidence
* Major factors
* Source attribution
* Natural-language explanation

---

## Model Metadata

```text
GET /models/current
```

Returns

* Model version
* Training date
* Supported horizon
* Feature count

Administrator only.

---

# 32.5 Scenario Simulator API

Base

```text
/api/v1/simulations
```

---

## List Simulations

```text
GET /simulations
```

---

Filters

```text
user_id

city_id

created_from

created_to

page

page_size
```

---

## Get Simulation

```text
GET /simulations/{simulation_id}
```

---

## Create Simulation

```text
POST /simulations
```

Authentication

Officer

Administrator

---

Request

```json
{
  "city_id": "uuid",
  "ward_id": "uuid",
  "simulation_name": "Reduce Traffic",
  "parameters": [
    {
      "name": "traffic_density",
      "value": 80
    }
  ]
}
```

---

Response

```json
{
  "success": true,
  "data": {
    "simulation_id": "uuid",
    "status": "RUNNING"
  }
}
```

---

Status Codes

| Code | Meaning          |
| ---- | ---------------- |
| 202  | Accepted         |
| 401  | Unauthorized     |
| 403  | Forbidden        |
| 422  | Validation Error |

---

## Simulation Status

```text
GET /simulations/{simulation_id}/status
```

---

## Simulation Results

```text
GET /simulations/{simulation_id}/results
```

Returns

* Predicted AQI
* Expected improvement
* Confidence
* Comparison with baseline

---

Example

```json
{
  "predicted_aqi": 198,
  "expected_change": -42,
  "confidence_score": 90.2
}
```

---

## Delete Simulation

```text
DELETE /simulations/{simulation_id}
```

Deletes only user-owned simulations unless performed by an administrator.

---

# 32.6 AI Dashboard APIs

Optimized endpoints for the AI Command Center.

---

## AI Insights

```text
GET /dashboard/ai-insights
```

Returns

* Top risks
* Key observations
* Forecast summary
* Recommended actions

---

## Top Pollution Sources

```text
GET /dashboard/top-sources
```

Filters

```text
city_id

ward_id
```

---

## Enforcement Priorities

```text
GET /dashboard/enforcement
```

Returns ranked inspection targets.

---

## Explainability Summary

```text
GET /dashboard/explainability
```

Returns aggregated feature importance across recent forecasts.

---

# 33. AI API Permissions

| Endpoint                     | Citizen | Officer | Admin |
| ---------------------------- | :-----: | :-----: | :---: |
| View Hotspots                |    ✅    |    ✅    |   ✅   |
| View Source Attribution      |    ✅    |    ✅    |   ✅   |
| View Recommendations         |    ✅    |    ✅    |   ✅   |
| Update Recommendation Status |    ❌    |    ✅    |   ✅   |
| View Explainability          |    ✅    |    ✅    |   ✅   |
| Run Simulation               |    ❌    |    ✅    |   ✅   |
| Delete Simulation            |  Owner  |  Owner  |   ✅   |
| View Model Metadata          |    ❌    |    ❌    |   ✅   |

---

# 34. AI Endpoint Summary

```text
GET    /hotspots
GET    /hotspots/current
GET    /hotspots/{hotspot_id}
GET    /hotspots/{hotspot_id}/geometry
GET    /hotspots/{hotspot_id}/source-attributions
GET    /hotspots/{hotspot_id}/recommendations

GET    /source-attributions
GET    /source-attributions/{attribution_id}
GET    /forecasts/{forecast_result_id}/source-attributions

GET    /recommendations
GET    /recommendations/{recommendation_id}
PATCH  /recommendations/{recommendation_id}
GET    /forecasts/{forecast_result_id}/recommendations

GET    /explainability/{forecast_result_id}
GET    /forecasts/{forecast_result_id}/explanation
GET    /models/current

GET    /simulations
GET    /simulations/{simulation_id}
POST   /simulations
GET    /simulations/{simulation_id}/status
GET    /simulations/{simulation_id}/results
DELETE /simulations/{simulation_id}

GET    /dashboard/ai-insights
GET    /dashboard/top-sources
GET    /dashboard/enforcement
GET    /dashboard/explainability
```
# API.md

# 36. Citizen Services, AI Chat, Reporting & Administration APIs

These APIs complete the UrbanAir AI platform by supporting citizen-facing services, AI conversations, report generation, and administrative operations.

They power:

* Citizen Health Advisory
* AI Chat Assistant (RAG)
* Report Generator
* Notifications
* Administration
* System Monitoring

---

# Service Overview

```text
Forecast Engine
       │
       ▼
Health Advisories
       │
       ▼
Alerts
       │
       ▼
Notifications

Knowledge Base
       │
       ▼
RAG Pipeline
       │
       ▼
AI Chat

Forecasts
Recommendations
Hotspots
       │
       ▼
Report Generator
```

---

# 36.1 Health Advisories API

Base Endpoint

```text
/api/v1/health-advisories
```

---

## List Health Advisories

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | `/health-advisories` |

Authentication

Public

---

### Filters

| Parameter      | Description                    |
| -------------- | ------------------------------ |
| city_id        | Filter by city                 |
| ward_id        | Filter by ward                 |
| advisory_level | Low / Moderate / High / Severe |
| active         | Active advisories              |
| page           | Pagination                     |
| page_size      | Pagination                     |

---

Example

```http
GET /health-advisories?city_id=uuid&active=true
```

---

Response

```json
{
  "success": true,
  "data": [
    {
      "advisory_id": "uuid",
      "title": "Avoid Outdoor Exercise",
      "level": "HIGH",
      "valid_until": "2026-07-01T20:00:00Z"
    }
  ]
}
```

---

## Get Advisory

```text
GET /health-advisories/{advisory_id}
```

---

Administrator

```text
POST   /health-advisories
PUT    /health-advisories/{advisory_id}
DELETE /health-advisories/{advisory_id}
```

---

# 36.2 Alerts API

Base

```text
/api/v1/alerts
```

---

## List Alerts

```text
GET /alerts
```

Authentication

Officer

Administrator

---

Filters

```text
severity

city_id

status

page

page_size
```

---

## Get Alert

```text
GET /alerts/{alert_id}
```

---

## Acknowledge Alert

```text
PATCH /alerts/{alert_id}/acknowledge
```

Response

```json
{
  "success": true,
  "message": "Alert acknowledged."
}
```

---

## Create Alert

```text
POST /alerts
```

Used internally by the system or administrators.

---

# 36.3 Notifications API

Base

```text
/api/v1/notifications
```

---

## List Notifications

```text
GET /notifications
```

Returns notifications for the authenticated user.

---

Filters

```text
is_read

notification_type

page

page_size
```

---

## Mark as Read

```text
PATCH /notifications/{notification_id}/read
```

---

## Mark All as Read

```text
PATCH /notifications/read-all
```

---

## Delete Notification

```text
DELETE /notifications/{notification_id}
```

Deletes only the current user's notification.

---

# 36.4 AI Chat API

Base

```text
/api/v1/chat
```

---

## Create Chat Session

```text
POST /chat/sessions
```

Request

```json
{
  "title": "Traffic Pollution Analysis"
}
```

---

Response

```json
{
  "success": true,
  "data": {
    "session_id": "uuid"
  }
}
```

---

## List Chat Sessions

```text
GET /chat/sessions
```

---

Filters

```text
page

page_size

search
```

---

## Get Chat Session

```text
GET /chat/sessions/{session_id}
```

---

## Delete Chat Session

```text
DELETE /chat/sessions/{session_id}
```

---

## Send Message

```text
POST /chat/sessions/{session_id}/messages
```

---

Request

```json
{
  "message": "Why is AQI expected to increase tomorrow?"
}
```

---

Response

```json
{
  "success": true,
  "data": {
    "message_id": "uuid",
    "response": "Tomorrow's AQI is expected to increase due to lower wind speeds, increased traffic, and expected construction activity.",
    "sources": [
      {
        "document_id": "uuid",
        "title": "CPCB Air Quality Guidelines"
      }
    ]
  }
}
```

---

## List Messages

```text
GET /chat/sessions/{session_id}/messages
```

---

## Regenerate Response

```text
POST /chat/messages/{message_id}/regenerate
```

---

# 36.5 Knowledge Base API

Base

```text
/api/v1/knowledge
```

---

## List Documents

```text
GET /knowledge/documents
```

Administrator

---

## Upload Document

```text
POST /knowledge/documents
```

Supports

* PDF
* DOCX
* HTML
* TXT

---

## Get Document

```text
GET /knowledge/documents/{document_id}
```

---

## Delete Document

```text
DELETE /knowledge/documents/{document_id}
```

---

## Reindex Knowledge Base

```text
POST /knowledge/reindex
```

Triggers document chunking and embedding generation.

---

# 36.6 Reports API

Base

```text
/api/v1/reports
```

---

## List Reports

```text
GET /reports
```

---

Filters

```text
report_type

city_id

generated_by

status

page

page_size
```

---

## Get Report

```text
GET /reports/{report_id}
```

---

## Generate Report

```text
POST /reports
```

Request

```json
{
  "city_id": "uuid",
  "report_type": "MONTHLY",
  "report_period_start": "2026-06-01",
  "report_period_end": "2026-06-30"
}
```

---

Response

```json
{
  "success": true,
  "data": {
    "report_id": "uuid",
    "status": "QUEUED"
  }
}
```

---

## Report Status

```text
GET /reports/{report_id}/status
```

---

## Download Report

```text
GET /reports/{report_id}/download
```

Query

```text
format=pdf
```

Supported formats

```text
pdf

csv
```

---

## Delete Report

```text
DELETE /reports/{report_id}
```

---

# 36.7 Audit Logs API

Base

```text
/api/v1/audit-logs
```

Administrator Only

---

## List Logs

```text
GET /audit-logs
```

---

Filters

```text
user_id

action

entity

from

to

page

page_size
```

---

## Get Audit Record

```text
GET /audit-logs/{audit_log_id}
```

---

# 36.8 System Settings API

Base

```text
/api/v1/system-settings
```

Administrator Only

---

## List Settings

```text
GET /system-settings
```

---

## Get Setting

```text
GET /system-settings/{setting_key}
```

---

## Update Setting

```text
PUT /system-settings/{setting_key}
```

Request

```json
{
  "value": "300"
}
```

---

# 36.9 Health Check API

Base

```text
/api/v1
```

Public

---

## Health

```text
GET /health
```

Response

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "database": "connected",
  "redis": "connected",
  "ai_service": "available"
}
```

---

## Readiness Probe

```text
GET /ready
```

Used by Kubernetes/Render for deployment health checks.

---

## Liveness Probe

```text
GET /live
```

Confirms application process is alive.

---

# 37. API Permission Matrix

| API Group         | Citizen | Officer | Admin |
| ----------------- | :-----: | :-----: | :---: |
| Authentication    |    ✅    |    ✅    |   ✅   |
| Geographic        |    ✅    |    ✅    |   ✅   |
| Environmental     |    ✅    |    ✅    |   ✅   |
| AI Insights       |    ✅    |    ✅    |   ✅   |
| AI Chat           |    ✅    |    ✅    |   ✅   |
| Reports           |    ❌    |    ✅    |   ✅   |
| Health Advisories |    ✅    |    ✅    |   ✅   |
| Alerts            |    ❌    |    ✅    |   ✅   |
| Notifications     | ✅ (Own) |    ✅    |   ✅   |
| Knowledge Base    |    ❌    |   Read  |  Full |
| Audit Logs        |    ❌    |    ❌    |   ✅   |
| System Settings   |    ❌    |    ❌    |   ✅   |

---

# 38. Complete Endpoint Summary

```text
AUTHENTICATION
--------------
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
POST   /auth/forgot-password
POST   /auth/reset-password
PUT    /auth/change-password
GET    /auth/me

USERS & ROLES
-------------
GET    /users
GET    /users/{id}
POST   /users
PUT    /users/{id}
PATCH  /users/{id}
DELETE /users/{id}
GET    /roles
GET    /roles/{id}
POST   /roles
PUT    /roles/{id}
DELETE /roles/{id}

GEOGRAPHIC
----------
GET    /cities
GET    /cities/{id}
POST   /cities
PUT    /cities/{id}
DELETE /cities/{id}
GET    /wards
GET    /stations
...

ENVIRONMENT
-----------
GET    /aqi-records
GET    /weather
GET    /forecasts
POST   /forecasts/run
GET    /dashboard/current-aqi
...

AI
--
GET    /hotspots
GET    /source-attributions
GET    /recommendations
PATCH  /recommendations/{id}
GET    /explainability/{forecast_id}
POST   /simulations
GET    /dashboard/ai-insights
...

CITIZEN
-------
GET    /health-advisories
GET    /alerts
PATCH  /alerts/{id}/acknowledge
GET    /notifications
PATCH  /notifications/{id}/read

AI CHAT
-------
POST   /chat/sessions
GET    /chat/sessions
POST   /chat/sessions/{id}/messages
GET    /chat/sessions/{id}/messages
DELETE /chat/sessions/{id}

KNOWLEDGE
---------
GET    /knowledge/documents
POST   /knowledge/documents
DELETE /knowledge/documents/{id}
POST   /knowledge/reindex

REPORTS
-------
GET    /reports
POST   /reports
GET    /reports/{id}
GET    /reports/{id}/status
GET    /reports/{id}/download
DELETE /reports/{id}

ADMIN
-----
GET    /audit-logs
GET    /system-settings
PUT    /system-settings/{key}

SYSTEM
------
GET    /health
GET    /ready
GET    /live
```
