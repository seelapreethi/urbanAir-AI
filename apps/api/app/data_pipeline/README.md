# Real-Time Data Ingestion Pipeline

This module implements the background scheduling data sync loops fetching live air quality and weather coordinates from free public APIs.

## Architecture Pipeline Flow

```text
  [OpenAQ]      [Open-Meteo]      [OSM Overpass]
     │               │                  │
     ▼               ▼                  ▼
[Connectors]   [Connectors]       [Connectors]
     │               │                  │
     └───────┬───────┘                  │
             ▼                          ▼
       [Normalizers]              [Overlays Maps]
             │
             ▼
       [Validators]
             │
             ├──► [Cache Layer] (Memory Buffer)
             │
             ▼
        [Database]
```

## Module Directory Structure
```text
data_pipeline/
├── connectors/         # OpenAQ, Open-Meteo, CPCB, and OSM API connection classes
├── validators/         # Coordinate ranges and AQI limit checkers
├── normalizers/        # Standardizes parameters to a unified schema dictionary
├── cache/              # Memory buffers preventing queries when servers are down
├── scheduler/          # Lifespan task loops that refresh inputs
└── test_pipeline.py    # Unit tests covering validators, normalizers, and cache
```

## Scheduler Timers & Operations
- **AQI Sync**: Refreshes hourly (`DATA_FETCH_INTERVAL=3600`).
- **Weather Sync**: Refreshes every 30 minutes.
- **Fail-Safe Fallback**: If an API times out or returns non-200 states, it retrieves the expired cache buffer, logging warnings without failing frontend requests.

## Ingestion Environment Variables
- `ENABLE_REAL_DATA`: `true` (enables HTTP connections to public endpoints).
- `ENABLE_CACHE`: `true`.
- `CACHE_TTL`: `1800` (cache lifetime in seconds).
- `DATA_FETCH_INTERVAL`: `3600`.
