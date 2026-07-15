# UrbanAir AI MLOps Infrastructure

This package implements automated model retraining, version registry tracking, and safe deployment rollback controls.

## MLOps Lifecycle Flow

```text
       [Data Ingestion]
              │
              ▼ (Crosses threshold or detects Drift)
     [Retraining Trigger]
              │
              ▼
   [Multi-Model Comparison] (Linear, RF, XGBoost)
              │
              ▼
    [Promotion Gatekeeper]
    ├── Promoted (If RMSE & MAE improve) ──► [Production State]
    └── Rejected (Else) ────────────────────► [Staging / Archived]
                                                    │
                                                    ▼
                                            [Rollback Switch]
```

## Module Directory Structure
```text
mlops/
├── registry.py      # Manages model status indices (model_registry.json)
├── promotion.py     # Gatekeeper comparing metrics before promotion
├── rollback.py      # safe previous model rollback restore
├── monitoring.py    # Tracks latency and computes prediction drift index
└── test_mlops.py    # Unit tests for registry, promotion, and rollbacks
```

## Operational Configurations
- `ENABLE_AUTO_RETRAIN`: `true`
- `MIN_NEW_RECORDS`: `500`
- `RETRAIN_INTERVAL_DAYS`: `7`
- `ENABLE_MODEL_PROMOTION`: `true`
- `ENABLE_DRIFT_DETECTION`: `true`
- `ENABLE_ROLLBACK`: `true`

## Rollback Policy
If prediction errors are detected, administrative APIs allow one-click rollback:
1. REST queries to `POST /api/v1/internal/models/rollback` shift the active version back to the previous stable model.
2. The server reloads its memory singleton mapping pointers instantly, guaranteeing zero request interruption.
