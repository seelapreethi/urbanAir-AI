Excellent. Since this is the core of the project, we'll build it like an actual AI system design document.

---

# AI.md

# UrbanAir AI — AI System Architecture

**Version:** 1.0

**Purpose**

This document defines the complete AI architecture for UrbanAir AI.

It covers every AI subsystem used throughout the platform while remaining modular, scalable, production-ready, and achievable within a 20-day hackathon.

No implementation details are included.

---

# 1. AI Philosophy

UrbanAir AI is **not** a chatbot.

It is an **AI Decision Support Platform**.

Instead of merely predicting AQI, it answers:

* Why pollution increased
* Where pollution originated
* What will happen next
* Which citizens are affected
* What actions should be taken
* What impact each action may have

The AI system consists of several independent pipelines that communicate through well-defined interfaces.

---

# 2. AI Architecture Overview

```text
                    DATA SOURCES
──────────────────────────────────────────────────────

AQI Sensors
Weather APIs
Traffic Data
Satellite Data
Population Data
Land Use Data
Government Datasets

                    │
                    ▼

            DATA INGESTION PIPELINE

                    │
                    ▼

            DATA VALIDATION PIPELINE

                    │
                    ▼

         FEATURE ENGINEERING PIPELINE

                    │
      ┌─────────────┼──────────────┐
      ▼             ▼              ▼

 Forecasting    Source AI      RAG Index

      │             │              │
      ▼             ▼              ▼

 Recommendation  Explainable AI  Chat Assistant

      │
      ▼

 Scenario Simulator

      │
      ▼

 FastAPI REST APIs

      │
      ▼

 Next.js Frontend
```

---

# 3. AI Folder Structure

```text
backend/

ai/

├── config/

├── data_pipeline/

│   ├── ingestion/

│   ├── validation/

│   ├── cleaning/

│   ├── transformation/

│   └── feature_engineering/

├── forecasting/

│   ├── models/

│   ├── training/

│   ├── inference/

│   ├── evaluation/

│   └── scheduling/

├── source_attribution/

├── recommendation/

├── explainability/

├── scenario/

├── rag/

│   ├── ingestion/

│   ├── chunking/

│   ├── embeddings/

│   ├── retrieval/

│   ├── prompts/

│   └── generation/

├── shared/

│   ├── preprocessing/

│   ├── metrics/

│   ├── utilities/

│   └── constants/

└── tests/
```

---

# 4. AI Modules

UrbanAir AI consists of seven major AI subsystems.

| Module                | Purpose                     |
| --------------------- | --------------------------- |
| Data Pipeline         | Collects and prepares data  |
| Forecasting Pipeline  | Predicts AQI                |
| Source Attribution    | Identifies pollution causes |
| Recommendation Engine | Suggests interventions      |
| Explainable AI        | Explains predictions        |
| Scenario Simulator    | Runs "What-if" simulations  |
| RAG Pipeline          | AI Chat Assistant           |

Each subsystem is independent and replaceable.

---

# 5. High-Level Data Flow

```text
Raw Data

↓

Cleaning

↓

Validation

↓

Feature Engineering

↓

Forecast Model

↓

Prediction

↓

Explanation

↓

Recommendation

↓

Scenario Simulation

↓

API

↓

Frontend
```

---

# 6. AI Design Principles

Every AI module follows the same architecture.

```
Input

↓

Validation

↓

Processing

↓

Model

↓

Post-processing

↓

Confidence Estimation

↓

API Response
```

This ensures consistency across the platform.

---

# 7. Shared AI Components

All modules reuse common infrastructure.

### Feature Store

Stores engineered features used by multiple models.

Examples:

* Rolling AQI averages
* Wind trends
* Population density
* Traffic intensity
* Industrial proximity

Benefits:

* No duplicated feature engineering
* Consistent training and inference
* Faster model execution

---

### Model Registry

Tracks every trained model.

Stores:

* Version
* Algorithm
* Training date
* Evaluation metrics
* Supported forecast horizon
* Feature schema
* Deployment status

Only approved models are used in production inference.

---

### AI Configuration

Central configuration includes:

* Forecast horizons (24h, 48h, 72h)
* Confidence thresholds
* Feature lists
* Model versions
* Scheduler intervals
* Retrieval limits for RAG

Keeping configuration centralized avoids hard-coded values.

---

# 8. AI Communication Pattern

```text
Forecast Engine
        │
        ▼
Explainable AI
        │
        ▼
Recommendation Engine
        │
        ▼
Scenario Simulator
        │
        ▼
REST API
```

The RAG pipeline operates independently and queries stored data and documents rather than calling forecasting models directly.

---

# 9. AI Execution Types

UrbanAir AI uses two execution modes.

### Batch Jobs

Scheduled tasks that generate or refresh data.

Examples:

* AQI forecast generation
* Model retraining
* Feature computation
* Knowledge base indexing

These are executed on a schedule and persist results to the database.

---

### Real-Time Requests

Triggered by API calls.

Examples:

* AI chat
* Scenario simulation
* Forecast explanation
* Recommendation retrieval

These provide immediate responses using precomputed data where possible.

---

# 10. AI Lifecycle

```text
Collect Data

↓

Validate

↓

Engineer Features

↓

Train Model

↓

Evaluate

↓

Register Model

↓

Deploy

↓

Run Inference

↓

Monitor Performance

↓

Retrain
```

This lifecycle applies consistently across forecasting and other predictive components.

---

# 11. AI Technology Stack

| Purpose              | Technology               |
| -------------------- | ------------------------ |
| ML Framework         | Scikit-learn             |
| Gradient Boosting    | XGBoost                  |
| Time Series          | Prophet                  |
| Embeddings           | Sentence Transformers    |
| RAG Orchestration    | LangChain                |
| LLM Access           | OpenRouter (free models) |
| Numerical Processing | NumPy                    |
| Data Processing      | Pandas                   |
| Model Persistence    | Joblib                   |
| Scheduling           | APScheduler / Cron       |
| Caching              | Redis                    |

All selected technologies are free and suitable for a hackathon MVP.

---

# 12. AI Module Dependencies

```text
                Data Pipeline
                      │
      ┌───────────────┼───────────────┐
      ▼               ▼               ▼
Forecasting   Source Attribution   RAG
      │               │
      ▼               ▼
Explainability
      │
      ▼
Recommendation Engine
      │
      ▼
Scenario Simulator
```

Modules communicate through defined interfaces rather than directly sharing internal logic.

---

# 13. Design Goals

* Modular and independently testable components
* Shared preprocessing and feature engineering
* Separation of training and inference workflows
* Explainable predictions with confidence scores
* Asynchronous processing for long-running tasks
* Easy replacement of models without API changes
* Scalable architecture suitable for future expansion

# AI.md

# 15. Data Pipeline

The Data Pipeline is the foundation of the entire UrbanAir AI platform.

Every AI model depends on clean, validated, and standardized data.

Its responsibilities are to:

* Collect data from multiple sources
* Validate incoming data
* Clean and normalize records
* Engineer reusable features
* Store processed datasets
* Feed downstream AI pipelines

No AI model reads raw data directly.

---

# 16. Data Sources

UrbanAir AI combines multiple heterogeneous datasets into a unified feature store.

| Source                  | Data Type              | Update Frequency | Usage                        |
| ----------------------- | ---------------------- | ---------------- | ---------------------------- |
| AQI Monitoring Stations | Air Quality            | Hourly           | Forecasting, Hotspots        |
| Weather API             | Meteorological         | Hourly           | Forecasting                  |
| Satellite Data          | Aerosols / Fire / Dust | Daily            | Source Attribution           |
| Traffic Data            | Congestion             | Hourly           | Forecasting, Recommendations |
| Land Use Data           | Static GIS             | Monthly          | Source Attribution           |
| Population Data         | Census                 | Static           | Health Advisories            |
| Government Datasets     | Environmental          | Weekly/Monthly   | AI Chat, Reports             |

---

# 17. Data Pipeline Architecture

```text
                 External Sources
──────────────────────────────────────────

AQI
Weather
Traffic
Satellite
Land Use
Population
Government Data

            │
            ▼

      Data Ingestion Layer

            │
            ▼

      Data Validation Layer

            │
            ▼

      Data Cleaning Layer

            │
            ▼

   Feature Engineering Layer

            │
            ▼

        Feature Store

            │
      ┌─────┼────────────┐
      ▼     ▼            ▼

 Forecast   RAG      Recommendation
```

---

# 18. Pipeline Stages

The pipeline consists of five sequential stages.

```text
Raw Data

↓

Ingestion

↓

Validation

↓

Cleaning

↓

Transformation

↓

Feature Engineering

↓

Feature Store
```

Each stage has a single responsibility.

---

# 19. Data Ingestion Layer

Purpose:

Collect data from all configured sources.

Responsibilities:

* Pull external APIs
* Read uploaded datasets
* Import government files
* Accept monitoring station uploads
* Timestamp every record
* Record ingestion metadata

Output:

Raw standardized records.

---

# 20. Data Validation Layer

Purpose:

Ensure only valid data enters the AI system.

Validation checks include:

## Schema Validation

* Required fields
* Correct data types
* UUID format
* Date format
* Coordinate format

---

## Range Validation

Examples

AQI

```text
0–500
```

Humidity

```text
0–100%
```

Temperature

```text
-50°C to 60°C
```

Latitude

```text
-90 to 90
```

Longitude

```text
-180 to 180
```

---

## Consistency Validation

Examples:

* Station belongs to ward
* Ward belongs to city
* Pollutant exists
* Duplicate timestamps
* Missing locations

Invalid records are quarantined for review instead of entering the feature store.

---

# 21. Data Cleaning Layer

Purpose:

Produce reliable datasets for machine learning.

Operations include:

* Remove duplicates
* Handle missing values
* Normalize units
* Standardize timestamps
* Correct formatting
* Trim invalid text
* Resolve inconsistent categories

Example:

```text
PM2.5
PM 2.5
PM25
```

↓

```text
PM2.5
```

---

# 22. Data Transformation Layer

Converts cleaned data into consistent machine-readable structures.

Examples:

* Convert local time to UTC
* Normalize categorical values
* Aggregate hourly observations
* Join weather with AQI
* Merge ward metadata
* Align timestamps across datasets

Output:

Unified observation records.

---

# 23. Feature Engineering Pipeline

Purpose:

Generate reusable ML features.

Instead of repeatedly calculating values during training and inference, features are computed once and stored.

---

## Categories of Features

### Environmental Features

Examples:

* Current AQI
* Previous AQI
* Rolling AQI averages
* Dominant pollutant
* AQI trend

---

### Weather Features

Examples:

* Temperature
* Humidity
* Wind speed
* Wind direction
* Rainfall
* Pressure

---

### Geographic Features

Examples:

* Elevation
* Population density
* Distance to industry
* Distance to highway
* Green cover percentage

---

### Temporal Features

Examples:

* Hour of day
* Day of week
* Weekend
* Month
* Season

---

### Traffic Features

Examples:

* Traffic index
* Peak-hour indicator
* Average vehicle density

---

### Satellite Features

Examples:

* Aerosol index
* Fire hotspots
* Dust concentration

---

# 24. Feature Store

Purpose:

Central repository for engineered features.

Benefits:

* Same features for training and inference
* Reduced computation
* Versioned feature definitions
* Easier experimentation

Feature Store Consumers:

```text
Forecast Model

Recommendation Engine

Scenario Simulator

Explainable AI
```

---

# 25. Data Quality Monitoring

Every ingestion cycle generates quality metrics.

Tracked metrics include:

| Metric            | Description         |
| ----------------- | ------------------- |
| Records Received  | Total incoming rows |
| Valid Records     | Passed validation   |
| Invalid Records   | Failed validation   |
| Missing Values    | Per column          |
| Duplicate Records | Count               |
| Processing Time   | Pipeline duration   |

These metrics support operational monitoring and troubleshooting.

---

# 26. Scheduling Strategy

Not all datasets update at the same frequency.

| Dataset         | Schedule   |
| --------------- | ---------- |
| AQI             | Every hour |
| Weather         | Every hour |
| Traffic         | Every hour |
| Satellite       | Daily      |
| Government Data | Weekly     |
| Land Use        | Monthly    |
| Population      | On update  |

Schedulers trigger ingestion automatically based on source frequency.

---

# 27. Failure Handling

The pipeline is designed to tolerate partial failures.

Examples:

* Weather API unavailable → continue processing AQI.
* Satellite update delayed → retain previous day's data.
* Invalid station data → quarantine affected records only.

Principles:

* No single data source should halt the entire pipeline.
* Failed jobs are retried with exponential backoff.
* Every failure is logged and auditable.

---

# 28. Data Lineage

Each processed record maintains traceability.

Stored metadata includes:

* Source system
* Ingestion timestamp
* Transformation version
* Feature generation version
* Processing job ID

This enables reproducibility and debugging.

---

# 29. End-to-End Data Flow

```text
External Sources
        │
        ▼
Ingestion
        │
        ▼
Validation
        │
        ▼
Cleaning
        │
        ▼
Transformation
        │
        ▼
Feature Engineering
        │
        ▼
Feature Store
        │
        ├────────► Forecasting Pipeline
        ├────────► Recommendation Engine
        ├────────► Scenario Simulator
        ├────────► Explainable AI
        └────────► RAG Metadata
```

---

# 30. Design Decisions

| Decision                           | Reason                                         |
| ---------------------------------- | ---------------------------------------------- |
| Separate ingestion from validation | Easier maintenance and testing                 |
| Central feature store              | Eliminates duplicated feature logic            |
| Version feature definitions        | Ensures reproducible training and inference    |
| Scheduled ingestion                | Matches update frequency of each source        |
| Quarantine invalid data            | Prevents corrupt records from affecting models |
| Shared preprocessing               | Keeps all AI modules consistent                |

# AI.md

# 32. Forecasting Pipeline

The Forecasting Pipeline is the core predictive engine of UrbanAir AI.

Its purpose is to estimate future air quality at the city and ward levels while providing confidence scores and explainable outputs.

The pipeline generates:

* 24-hour AQI forecasts
* 48-hour AQI forecasts
* 72-hour AQI forecasts
* Ward-level predictions
* Confidence scores
* Dominant pollutant predictions
* Inputs for recommendations and simulations

---

# 33. Forecasting Architecture

```text id="8vfw1x"
             Feature Store
                   │
                   ▼
          Feature Selection
                   │
                   ▼
        Time-Series Preparation
                   │
                   ▼
          Forecast Model
        (Prophet + XGBoost)
                   │
                   ▼
        Prediction Post-Processing
                   │
                   ▼
 Confidence Estimation & Validation
                   │
                   ▼
          Forecast Results
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
 Explainability  Recommendations  Scenario Simulator
```

---

# 34. Forecasting Objectives

The model predicts:

| Output             | Description                 |
| ------------------ | --------------------------- |
| AQI Value          | Predicted Air Quality Index |
| AQI Category       | Good, Moderate, Poor, etc.  |
| Dominant Pollutant | PM2.5, PM10, NO₂, etc.      |
| Confidence Score   | Reliability of prediction   |
| Forecast Horizon   | 24h / 48h / 72h             |

---

# 35. Input Features

The forecasting engine consumes engineered features from the Feature Store.

### Environmental

* Current AQI
* Previous AQI
* Rolling averages
* Pollutant concentrations

### Weather

* Temperature
* Humidity
* Wind speed
* Wind direction
* Rainfall
* Atmospheric pressure

### Geographic

* Population density
* Green cover
* Industrial proximity
* Road density

### Traffic

* Congestion index
* Vehicle density
* Peak-hour indicator

### Temporal

* Hour
* Day
* Month
* Season
* Weekend flag

---

# 36. Forecast Horizons

UrbanAir AI supports multiple horizons.

```text id="j9x3pt"
Input Features
      │
      ▼
Forecast Engine
      │
      ├────────► 24 Hours
      ├────────► 48 Hours
      └────────► 72 Hours
```

Each horizon is stored independently to support comparison and evaluation.

---

# 37. Model Selection Strategy

A hybrid approach balances accuracy, explainability, and simplicity.

| Model   | Purpose                                 | Reason                                            |
| ------- | --------------------------------------- | ------------------------------------------------- |
| Prophet | Captures trends and seasonality         | Fast, interpretable, ideal for time series        |
| XGBoost | Captures nonlinear feature interactions | Strong tabular performance and feature importance |

### Why Hybrid?

* Prophet models temporal patterns.
* XGBoost incorporates external factors such as weather and traffic.
* Ensemble predictions improve robustness while remaining lightweight enough for a hackathon.

---

# 38. Training Pipeline

```text id="3zq9ve"
Historical Data
        │
        ▼
Train / Validation Split
        │
        ▼
Feature Preparation
        │
        ▼
Model Training
        │
        ▼
Evaluation
        │
        ▼
Model Registry
```

---

## Dataset Split

Recommended split:

| Dataset    | Percentage |
| ---------- | ---------: |
| Training   |        70% |
| Validation |        15% |
| Test       |        15% |

Time-based splits should be used to avoid data leakage.

---

# 39. Model Evaluation

Each trained model is evaluated before deployment.

Metrics include:

| Metric | Purpose                  |
| ------ | ------------------------ |
| MAE    | Average prediction error |
| RMSE   | Penalizes large errors   |
| MAPE   | Percentage error         |
| R²     | Goodness of fit          |

Only models meeting predefined quality thresholds are promoted to production.

---

# 40. Model Registry

Every trained model is registered with metadata.

Stored information:

* Model ID
* Version
* Algorithm
* Training timestamp
* Training dataset version
* Feature schema version
* Evaluation metrics
* Deployment status

Example lifecycle:

```text id="6tw4wk"
Train
  │
  ▼
Evaluate
  │
  ▼
Register
  │
  ▼
Approve
  │
  ▼
Deploy
```

---

# 41. Inference Pipeline

Inference is separated from training.

```text id="r5h1af"
Latest Features
        │
        ▼
Load Production Model
        │
        ▼
Predict AQI
        │
        ▼
Post-Processing
        │
        ▼
Confidence Estimation
        │
        ▼
Store Forecast
```

Predictions are persisted so the frontend reads cached results rather than invoking models on every request.

---

# 42. Forecast Scheduling

Forecast generation runs automatically.

| Task             | Schedule                       |
| ---------------- | ------------------------------ |
| 24-hour forecast | Every hour                     |
| 48-hour forecast | Every hour                     |
| 72-hour forecast | Every hour                     |
| Model retraining | Weekly (or manually triggered) |

This keeps forecasts fresh while avoiding unnecessary computation.

---

# 43. Confidence Estimation

Every prediction includes a confidence score.

Confidence is derived from factors such as:

* Recent model validation performance
* Input data completeness
* Similarity to historical patterns
* Forecast horizon (longer horizons generally have lower confidence)

Example response:

```text id="2lf0dz"
Predicted AQI: 186

Confidence: 91%

Dominant Pollutant: PM2.5
```

---

# 44. Forecast Storage

Forecast outputs are stored for reuse.

Each record contains:

* Forecast timestamp
* Horizon
* City
* Ward
* Predicted AQI
* AQI category
* Dominant pollutant
* Confidence score
* Model version

Stored forecasts are consumed by:

* Dashboard
* Reports
* Recommendations
* Explainability
* Scenario Simulator

---

# 45. Failure Recovery

If forecasting fails:

* Keep the latest valid forecast available.
* Mark the failed run in monitoring.
* Retry the job according to scheduler policy.
* Notify administrators if repeated failures occur.

This prevents blank dashboards and maintains service continuity.

---

# 46. Forecast Pipeline Flow

```text id="c6f9lp"
Feature Store
      │
      ▼
Feature Selection
      │
      ▼
Prophet
      │
      ├────────┐
      ▼        │
   Trend       │
               ▼
           XGBoost
               │
               ▼
      Ensemble Prediction
               │
               ▼
Confidence Score
               │
               ▼
Forecast Database
               │
      ┌────────┼─────────┐
      ▼        ▼         ▼
Dashboard  Reports  Recommendation Engine
```

---

# 47. Design Decisions

| Decision                        | Reason                                    |
| ------------------------------- | ----------------------------------------- |
| Separate training and inference | Independent deployment and testing        |
| Hybrid Prophet + XGBoost        | Combines temporal and contextual modeling |
| Persist forecast results        | Faster dashboard performance              |
| Hourly scheduled inference      | Balances freshness and compute cost       |
| Versioned models                | Traceability and rollback support         |
| Time-based validation           | Prevents leakage in forecasting tasks     |

# AI.md

# 49. RAG (Retrieval-Augmented Generation) Pipeline

The RAG Pipeline powers the **AI Chat Assistant** in UrbanAir AI.

Unlike a general-purpose chatbot, it answers questions using trusted project knowledge and live platform data, reducing hallucinations and providing traceable responses.

It can answer questions such as:

* Why did AQI increase today?
* Which wards are most affected?
* What is the 72-hour forecast?
* Why did the model predict AQI 210?
* Which interventions should the city prioritize?
* What are the CPCB recommendations for PM2.5?

---

# 50. RAG Architecture

```text id="r4x7qa"
            Knowledge Sources
────────────────────────────────────────

Government Documents
Environmental Reports
Policies & Guidelines
UrbanAir Reports
Forecast Results
Recommendations
Health Advisories

            │
            ▼

     Document Ingestion

            │
            ▼

        Text Extraction

            │
            ▼

         Chunking Engine

            │
            ▼

     Embedding Generator

            │
            ▼

        Vector Store

            │
            ▼

 User Question
            │
            ▼
 Semantic Search
            │
            ▼
 Context Retrieval
            │
            ▼
 Prompt Builder
            │
            ▼
 OpenRouter LLM
            │
            ▼
 Final Response
```

---

# 51. Knowledge Sources

The assistant retrieves information from curated, trusted sources.

| Source                              | Purpose                      |
| ----------------------------------- | ---------------------------- |
| Government environmental guidelines | Regulatory guidance          |
| Pollution control documents         | Domain knowledge             |
| UrbanAir generated reports          | Historical insights          |
| Forecast database                   | Current predictions          |
| Recommendations                     | Suggested interventions      |
| Health advisories                   | Citizen guidance             |
| FAQ documents                       | Common operational questions |

The RAG pipeline never treats user conversations as authoritative knowledge.

---

# 52. Document Ingestion Pipeline

Documents are processed before becoming searchable.

```text id="4j4h8j"
Upload
   │
   ▼
Text Extraction
   │
   ▼
Metadata Extraction
   │
   ▼
Chunking
   │
   ▼
Embedding
   │
   ▼
Vector Index
```

Supported document types:

* PDF
* DOCX
* TXT
* HTML
* Markdown

---

# 53. Document Metadata

Each document stores metadata for filtering and traceability.

Example metadata:

* Document ID
* Title
* Source
* Category
* Author (if available)
* Publication date
* Language
* Version
* Tags

This enables retrieval filtering without embedding metadata into the text itself.

---

# 54. Chunking Strategy

Documents are split into smaller semantic chunks before embedding.

Goals:

* Preserve context
* Improve retrieval precision
* Reduce prompt size
* Avoid truncation

Guidelines:

* Prefer paragraph or section boundaries.
* Use overlapping chunks to preserve continuity.
* Keep chunk sizes consistent across the corpus.

Each chunk stores:

* Chunk ID
* Parent document ID
* Sequence number
* Text
* Metadata reference

---

# 55. Embedding Pipeline

Each chunk is converted into a vector representation.

Pipeline:

```text id="x2r7dn"
Chunk
   │
   ▼
Sentence Transformer
   │
   ▼
Embedding Vector
   │
   ▼
Vector Store
```

Recommended free embedding model:

* **Sentence Transformers** (`all-MiniLM-L6-v2`)

Reasons:

* Free
* Lightweight
* Fast inference
* Strong semantic search performance
* Suitable for hackathon deployment

---

# 56. Vector Store

The vector store indexes embeddings for similarity search.

Stores:

* Chunk embedding
* Chunk metadata
* Document reference
* Chunk position

Responsibilities:

* Similarity search
* Metadata filtering
* Top-k retrieval

For the MVP, embeddings can be stored in PostgreSQL with vector support or another free vector-capable solution compatible with the existing stack.

---

# 57. Retrieval Pipeline

```text id="xg8vkt"
User Question
      │
      ▼
Embedding Generation
      │
      ▼
Vector Search
      │
      ▼
Top-k Chunks
      │
      ▼
Metadata Filtering
      │
      ▼
Context Assembly
```

Retrieval should prioritize:

1. Semantic similarity
2. Document quality
3. Recency (where applicable)
4. Source reliability

---

# 58. Prompt Construction

The prompt builder combines:

* System instructions
* Retrieved context
* User question
* Conversation history (limited)
* Response formatting instructions

Prompt structure:

```text id="szn7qm"
System Prompt

↓

Retrieved Context

↓

Conversation History

↓

User Question

↓

LLM
```

The prompt should explicitly instruct the model to answer only from the provided context when applicable.

---

# 59. LLM Selection

UrbanAir AI uses **OpenRouter** with free-access models.

Selection criteria:

* Strong instruction following
* Good reasoning ability
* Low latency
* Free tier availability

The LLM is responsible for:

* Natural-language generation
* Summarization
* Explanation
* Question answering

The LLM is **not** responsible for storing knowledge.

---

# 60. Conversation Memory

Conversation memory is scoped to a chat session.

Stored items:

* User messages
* Assistant responses
* Timestamps
* Session title

Memory is used only to maintain conversational continuity and is **not** added to the knowledge base.

Older messages may be summarized to stay within model context limits.

---

# 61. Citation Strategy

Every answer should reference its supporting sources.

Returned citations may include:

* Document title
* Section
* Report ID
* Forecast ID
* Recommendation ID

Example:

```text id="3h6xpy"
Answer

↓

Sources

• CPCB Guideline
• Monthly Report (June 2026)
• Forecast #F-1024
```

This improves transparency and user trust.

---

# 62. Safety & Guardrails

The assistant should:

* Decline unsupported claims.
* Avoid fabricating statistics.
* Distinguish forecasts from observations.
* Prefer retrieved evidence over model memory.
* Clearly indicate uncertainty when context is insufficient.

If no relevant context is found, the assistant should state that it does not have enough information rather than invent an answer.

---

# 63. RAG End-to-End Flow

```text id="l7m3bw"
Knowledge Documents
         │
         ▼
Document Ingestion
         │
         ▼
Chunking
         │
         ▼
Embeddings
         │
         ▼
Vector Store
         │
         ▼
User Question
         │
         ▼
Question Embedding
         │
         ▼
Similarity Search
         │
         ▼
Top-k Chunks
         │
         ▼
Prompt Builder
         │
         ▼
OpenRouter LLM
         │
         ▼
Answer + Citations
```

---

# 64. Design Decisions

| Decision                    | Reason                                        |
| --------------------------- | --------------------------------------------- |
| Retrieval before generation | Reduces hallucinations                        |
| Separate document ingestion | Allows incremental updates                    |
| Chunk-based indexing        | Improves retrieval precision                  |
| Metadata-aware retrieval    | Enables filtering by source and date          |
| Session-scoped memory       | Maintains context without polluting knowledge |
| Citation-first responses    | Increases transparency and trust              |
| Lightweight embedding model | Fits hackathon resource constraints           |

# AI.md

# 66. Recommendation Engine

The Recommendation Engine transforms AI predictions into **actionable decisions** for city administrators.

Instead of only predicting that pollution will increase, it recommends:

* What should be done
* Where action is required
* When intervention is most effective
* Expected AQI improvement
* Confidence in the recommendation

This is the primary decision-support component of UrbanAir AI.

---

# 67. Recommendation Architecture

```text
                  Forecast Engine
                        │
                        ▼
              Explainable AI (XAI)
                        │
                        ▼
             Source Attribution Engine
                        │
                        ▼
           Recommendation Rule Engine
                        │
                        ▼
           Recommendation Scoring Engine
                        │
                        ▼
            Priority Ranking Engine
                        │
                        ▼
          Recommendation Repository
                        │
                        ▼
                 REST API / Dashboard
```

The Recommendation Engine **does not generate forecasts**. It consumes outputs from the Forecasting and Explainability pipelines.

---

# 68. Recommendation Inputs

The engine combines information from multiple sources.

| Source              | Purpose                             |
| ------------------- | ----------------------------------- |
| Forecast Results    | Future AQI predictions              |
| Source Attribution  | Pollution contributors              |
| Weather             | Wind, rainfall, humidity            |
| Traffic             | Congestion levels                   |
| Population          | Impact estimation                   |
| Ward Metadata       | Geographic context                  |
| Historical Outcomes | Previous intervention effectiveness |

---

# 69. Recommendation Pipeline

```text
Forecast
     │
     ▼
Determine Risk
     │
     ▼
Identify Pollution Sources
     │
     ▼
Generate Candidate Actions
     │
     ▼
Estimate Impact
     │
     ▼
Rank Actions
     │
     ▼
Return Top Recommendations
```

---

# 70. Recommendation Categories

Recommendations are grouped by domain.

| Category      | Examples                                            |
| ------------- | --------------------------------------------------- |
| Traffic       | Restrict heavy vehicles, stagger traffic            |
| Construction  | Pause dust-generating work, increase water spraying |
| Industrial    | Increase inspections, temporary emission controls   |
| Waste Burning | Immediate enforcement action                        |
| Public Health | Issue health advisory, distribute masks             |
| Municipal     | Increase street sweeping, water sprinkling          |

Each recommendation belongs to exactly one primary category.

---

# 71. Rule-Based Decision Layer

The first stage applies deterministic business rules.

Example logic:

```text
High AQI
+
Traffic identified as dominant source
+
Morning rush hour

↓

Recommend traffic restrictions
```

Rules provide:

* Predictability
* Transparency
* Fast execution
* Easy policy updates

They are stored separately from application code so they can evolve without modifying the inference pipeline.

---

# 72. AI Scoring Layer

After candidate actions are generated, each is scored.

Evaluation factors include:

* Forecast severity
* Source attribution confidence
* Population affected
* Historical effectiveness
* Geographic coverage
* Time sensitivity

The score is used for ranking rather than replacing rule-based recommendations.

---

# 73. Priority Ranking

Each recommendation receives a priority level.

| Priority | Meaning                    |
| -------- | -------------------------- |
| Critical | Immediate action required  |
| High     | Action within hours        |
| Medium   | Monitor and prepare        |
| Low      | Informational / preventive |

Priority is derived from both forecast severity and estimated impact.

---

# 74. Impact Estimation

Each recommendation estimates its expected effect.

Outputs include:

* Estimated AQI reduction
* Expected percentage improvement
* Population benefiting
* Estimated implementation window

Example:

```text
Recommendation:
Reduce heavy vehicle traffic by 20%

Estimated AQI Improvement:
−28 AQI

Confidence:
89%
```

These values are estimates, not guarantees.

---

# 75. Recommendation Confidence

Every recommendation includes a confidence score.

Confidence is influenced by:

* Forecast confidence
* Source attribution confidence
* Historical intervention success
* Data completeness

Example:

```text
Recommendation Confidence

92%
```

Lower confidence recommendations are still returned but clearly identified.

---

# 76. Recommendation Lifecycle

```text
Generated
     │
     ▼
Pending Review
     │
     ├────────► Rejected
     │
     ▼
Accepted
     │
     ▼
Implemented
     │
     ▼
Archived
```

Tracking lifecycle states enables auditing and future effectiveness analysis.

---

# 77. Enforcement Intelligence Integration

The Recommendation Engine supplies the Enforcement Intelligence module.

Example outputs:

* Top inspection locations
* Priority construction sites
* High-risk industrial areas
* Waste-burning hotspots

The enforcement dashboard consumes ranked recommendations rather than generating its own logic.

---

# 78. Dashboard Output

The AI Command Center displays a summarized view.

Example:

```text
Top Recommendation

Reduce heavy vehicle traffic
Priority: HIGH
Expected AQI Improvement: 24
Confidence: 91%

Secondary Recommendation

Increase road dust suppression
Priority: MEDIUM
Expected AQI Improvement: 12
```

---

# 79. Recommendation Storage

Generated recommendations are stored for:

* Dashboard display
* Reporting
* Auditing
* Historical comparison
* Scenario simulation

Stored attributes include:

* Recommendation ID
* Linked forecast
* Linked hotspot
* Category
* Priority
* Confidence
* Expected impact
* Current status
* Creation timestamp

---

# 80. End-to-End Recommendation Flow

```text
Forecast Results
        │
        ▼
Source Attribution
        │
        ▼
Rule Engine
        │
        ▼
Candidate Actions
        │
        ▼
Impact Estimation
        │
        ▼
Priority Scoring
        │
        ▼
Recommendation Repository
        │
        ├────────► Dashboard
        ├────────► Reports
        ├────────► Scenario Simulator
        └────────► REST API
```

---

# 81. Design Decisions

| Decision                    | Reason                                                     |
| --------------------------- | ---------------------------------------------------------- |
| Rule-first architecture     | Transparent and easy to validate                           |
| AI-assisted ranking         | Improves prioritization without sacrificing explainability |
| Confidence scores           | Helps decision-makers judge reliability                    |
| Persist recommendations     | Enables auditing and trend analysis                        |
| Separate impact estimation  | Reusable by the Scenario Simulator                         |
| Category-based organization | Simplifies UI and reporting                                |

# AI.md

# 83. Scenario Simulator

The Scenario Simulator enables decision-makers to evaluate the **potential impact of proposed interventions before implementing them**.

Instead of asking:

> "What will tomorrow's AQI be?"

It answers:

> "What happens if we reduce traffic by 25%?"
>
> "What if construction activity is paused?"
>
> "What if rainfall occurs tomorrow?"

The simulator **does not create new forecasting models**. It reuses the existing Forecasting Pipeline with modified input features.

---

# 84. Simulator Architecture

```text id="7h2mfa"
              Current Feature Store
                     │
                     ▼
           Baseline Forecast
                     │
                     ▼
        User Scenario Parameters
                     │
                     ▼
      Feature Modification Engine
                     │
                     ▼
         Forecast Inference Engine
                     │
                     ▼
         Compare With Baseline
                     │
                     ▼
          Impact Calculation
                     │
                     ▼
        Simulation Result Store
                     │
                     ▼
             Dashboard / API
```

---

# 85. Simulation Objectives

The simulator estimates the effect of one or more interventions.

Supported outputs:

| Output                 | Description                |
| ---------------------- | -------------------------- |
| Predicted AQI          | AQI after intervention     |
| AQI Change             | Difference from baseline   |
| Percentage Improvement | Relative improvement       |
| Confidence Score       | Reliability of estimate    |
| Dominant Pollutant     | Expected primary pollutant |
| Summary                | Human-readable explanation |

---

# 86. Supported Scenario Types

### Traffic

Examples:

* Reduce traffic volume
* Restrict heavy vehicles
* Change peak-hour flow

---

### Construction

Examples:

* Pause construction
* Reduce dust emissions
* Increase water spraying

---

### Industrial

Examples:

* Reduce industrial emissions
* Temporary plant shutdown
* Increase compliance checks

---

### Weather

Examples:

* Rainfall
* Increased wind speed
* Higher humidity

These scenarios are hypothetical environmental inputs for planning purposes.

---

### Municipal Actions

Examples:

* Road cleaning
* Street watering
* Green corridor expansion

---

# 87. Simulation Workflow

```text id="3lwp8s"
Existing Forecast
       │
       ▼
Apply Scenario
       │
       ▼
Modify Features
       │
       ▼
Run Forecast Model
       │
       ▼
Compare Results
       │
       ▼
Generate Summary
```

The baseline forecast remains unchanged and serves as the reference point.

---

# 88. Feature Modification Engine

The simulator modifies only the selected input variables.

Example:

Baseline:

```text id="z0s0ja"
Traffic Density

100%
```

Scenario:

```text id="v8zw4m"
Traffic Density

75%
```

All other features remain unchanged unless explicitly modified.

This ensures controlled experiments and reproducible results.

---

# 89. Single vs. Multi-Action Simulations

The simulator supports:

### Single Action

Example:

```text id="5drzjj"
Reduce traffic by 20%
```

---

### Multi-Action

Example:

```text id="b5m7ng"
Reduce traffic by 20%

+

Pause construction

+

Increase road watering
```

Actions are evaluated together using the same forecasting pipeline.

---

# 90. Baseline Comparison

Every simulation compares against the latest approved forecast.

```text id="vc8i2g"
Baseline AQI

↓

Scenario AQI

↓

Difference

↓

Estimated Improvement
```

This allows users to quantify the benefit of proposed interventions.

---

# 91. Simulation Results

Each simulation returns:

* Baseline AQI
* Scenario AQI
* AQI difference
* Percentage improvement
* Confidence score
* Assumptions
* Timestamp

Example:

```text id="0n1x6t"
Baseline AQI

218

↓

Scenario AQI

186

↓

Improvement

32 AQI

↓

Confidence

90%
```

---

# 92. Confidence Propagation

Simulation confidence is derived from:

* Forecast confidence
* Quality of modified inputs
* Number of assumptions introduced
* Historical similarity to known conditions

More assumptions generally reduce confidence.

---

# 93. Scenario History

Saved simulations enable comparison and reuse.

Stored metadata includes:

* Simulation ID
* User
* City
* Ward
* Scenario name
* Modified parameters
* Baseline forecast reference
* Result summary
* Creation timestamp

This supports collaboration, reporting, and auditability.

---

# 94. Dashboard Integration

The AI Command Center displays simulation results in a comparison-friendly format.

Example:

```text id="9kcz7m"
Current Forecast

AQI: 214

↓

Scenario Forecast

AQI: 187

↓

Expected Improvement

12.6%
```

Users can compare multiple saved simulations side by side.

---

# 95. End-to-End Simulation Flow

```text id="v6rjxy"
Forecast Results
        │
        ▼
User Scenario
        │
        ▼
Feature Modification
        │
        ▼
Forecast Inference
        │
        ▼
Baseline Comparison
        │
        ▼
Impact Estimation
        │
        ▼
Simulation Repository
        │
        ├────────► Dashboard
        ├────────► Reports
        └────────► REST API
```

---

# 96. Design Decisions

| Decision                       | Reason                                  |
| ------------------------------ | --------------------------------------- |
| Reuse forecasting model        | Avoid duplicate prediction logic        |
| Modify only selected features  | Controlled and reproducible simulations |
| Preserve baseline forecast     | Enables meaningful comparisons          |
| Support multi-action scenarios | Reflects real-world interventions       |
| Persist simulation history     | Reporting, auditing, and reuse          |
| Confidence propagation         | Communicates uncertainty clearly        |

# AI.md

# 98. Explainable AI (XAI)

Explainable AI is a first-class component of UrbanAir AI.

Every prediction, recommendation, and simulation must answer:

* **Why was this prediction made?**
* **Which factors influenced it the most?**
* **How confident is the system?**
* **What evidence supports the recommendation?**

The objective is to build trust with city administrators by making AI decisions transparent and auditable.

---

# 99. Explainability Architecture

```text id="7c9l2p"
              Feature Store
                    │
                    ▼
            Forecast Prediction
                    │
                    ▼
        Explainability Engine
        ┌──────────┼──────────┐
        ▼          ▼          ▼
 Feature Importance  Confidence  Source Attribution
        │          │          │
        └──────────┼──────────┘
                   ▼
     Natural Language Explanation
                   │
                   ▼
          Dashboard / Reports / API
```

The Explainability Engine consumes prediction outputs but never modifies them.

---

# 100. Explainability Objectives

For every forecast or simulation, the system should provide:

| Output                   | Purpose                            |
| ------------------------ | ---------------------------------- |
| Feature Importance       | Identify influential variables     |
| Confidence Score         | Express prediction reliability     |
| Source Attribution       | Explain probable pollution sources |
| Natural Language Summary | Human-readable explanation         |
| Supporting Evidence      | Data used for reasoning            |

---

# 101. Feature Importance

Feature importance quantifies how much each input contributed to a prediction.

Typical contributors include:

* Previous AQI
* Wind speed
* Wind direction
* Humidity
* Traffic density
* PM2.5 concentration
* Industrial proximity
* Rainfall

Example:

```text id="3d7nq8"
Prediction: AQI 196

Most Influential Features

1. Wind Speed
2. Traffic Density
3. PM2.5
4. Humidity
5. Rainfall
```

Feature importance helps users understand *what drove* the prediction.

---

# 102. Local vs. Global Explanations

UrbanAir AI supports two levels of explainability.

### Local Explanation

Explains a **single prediction**.

Example:

> AQI for Ward 12 tomorrow is expected to rise primarily because of reduced wind speed and increased morning traffic.

---

### Global Explanation

Summarizes model behavior across many predictions.

Example:

> Over the past month, wind speed and PM2.5 were the most influential variables across all forecasts.

This distinction supports both operational decisions and long-term analysis.

---

# 103. Confidence Estimation

Every AI output includes a confidence score.

Confidence is influenced by:

* Model validation performance
* Input data quality
* Forecast horizon
* Historical similarity
* Data completeness

Example:

```text id="2rjv3m"
Forecast AQI

214

Confidence

91%
```

Confidence is **not** a probability of correctness; it is an estimate of prediction reliability.

---

# 104. Source Attribution Integration

Explainability incorporates results from the Source Attribution module.

Example:

```text id="5n6t4w"
Likely Contributors

Traffic ............ 47%

Construction ....... 28%

Industry ........... 15%

Other .............. 10%
```

This allows administrators to distinguish *why* AQI is increasing from *where* pollution is likely originating.

---

# 105. Natural Language Explanation

The system converts technical outputs into readable summaries.

Example:

```text id="1gqf9k"
Tomorrow's AQI is expected to increase because lower wind speeds will reduce pollutant dispersion while morning traffic is projected to increase. PM2.5 is expected to remain the dominant pollutant. Confidence in this forecast is high due to strong agreement with historical weather and traffic patterns.
```

The explanation is generated from structured AI outputs rather than relying solely on an LLM, ensuring consistency.

---

# 106. Explainability Pipeline

```text id="8b1y4r"
Forecast Prediction
        │
        ▼
Feature Importance
        │
        ▼
Confidence Estimation
        │
        ▼
Source Attribution
        │
        ▼
Natural Language Generator
        │
        ▼
Final Explanation
```

Each stage contributes one part of the final explanation.

---

# 107. Explainability API Output

Every explanation should expose structured data.

Example response:

```text id="4w2m8p"
Prediction
-----------
AQI: 214

Confidence
-----------
91%

Top Features
------------
Wind Speed
Traffic Density
Humidity

Primary Source
--------------
Traffic

Summary
-------
Lower wind speed combined with increased traffic is expected to elevate PM2.5 concentrations.
```

This structure supports dashboards, reports, and AI chat responses.

---

# 108. Explainability in Other Modules

The Explainability Engine is reused throughout the platform.

| Module             | Explainability Contribution             |
| ------------------ | --------------------------------------- |
| Forecasting        | Why AQI changed                         |
| Recommendations    | Why an action is suggested              |
| Scenario Simulator | Why a scenario improved or worsened AQI |
| Reports            | Human-readable analysis                 |
| AI Chat            | Evidence-backed responses               |

Centralizing explainability avoids inconsistent reasoning across modules.

---

# 109. Monitoring Explainability Quality

The platform should monitor explanation quality over time.

Tracked metrics include:

* Explanation generation success rate
* Average confidence score
* Missing explanation rate
* Average response generation time
* Most influential features by period

These metrics help identify issues with model behavior or data quality.

---

# 110. End-to-End XAI Flow

```text id="9h4v7e"
Feature Store
      │
      ▼
Forecast Model
      │
      ▼
Prediction
      │
      ├────────► Feature Importance
      ├────────► Confidence Estimation
      ├────────► Source Attribution
      │
      ▼
Natural Language Explanation
      │
      ├────────► Dashboard
      ├────────► Reports
      ├────────► AI Chat
      └────────► REST API
```

---

# 111. Design Decisions

| Decision                         | Reason                                                    |
| -------------------------------- | --------------------------------------------------------- |
| Separate Explainability Engine   | Keeps prediction logic independent from explanation logic |
| Structured explanations first    | Ensures consistency and auditability                      |
| Natural-language summaries       | Makes outputs understandable to non-technical users       |
| Confidence with every prediction | Communicates uncertainty explicitly                       |
| Reuse across modules             | Avoids duplicated explanation logic                       |
| Source attribution integration   | Connects predictions to likely pollution causes           |

---

# 112. Model Selection Strategy

UrbanAir AI favors **free, open-source, and explainable** technologies suitable for a hackathon MVP while allowing future upgrades.

| AI Component            | Selected Model/Tool                        | Reason                                       |
| ----------------------- | ------------------------------------------ | -------------------------------------------- |
| Time-Series Forecasting | Prophet                                    | Fast, interpretable seasonal forecasting     |
| Tabular Prediction      | XGBoost                                    | High accuracy and feature importance support |
| Embeddings              | Sentence Transformers (`all-MiniLM-L6-v2`) | Lightweight and free                         |
| RAG Orchestration       | LangChain                                  | Modular retrieval pipeline                   |
| LLM                     | OpenRouter free models                     | Cost-effective natural language generation   |
| Data Processing         | Pandas + NumPy                             | Mature data ecosystem                        |
| Model Persistence       | Joblib                                     | Simple deployment and versioning             |

Selection criteria:

* Open source or free tier
* Fast inference
* Easy deployment
* Good documentation
* Strong community support
* Explainability support where applicable

---

# 113. AI Operations (MLOps-lite for MVP)

Although this is a hackathon project, the architecture follows lightweight operational practices.

### Training

* Manual trigger or scheduled retraining
* Version every trained model
* Record evaluation metrics

### Inference

* Load only approved production models
* Cache predictions where appropriate
* Log inference metadata

### Monitoring

Track:

* Prediction latency
* Forecast generation success
* Data freshness
* Model version in production
* Confidence score distribution

---

# 114. Complete AI Pipeline

```text id="5m8k1q"
External Data Sources
          │
          ▼
    Data Ingestion
          │
          ▼
 Data Validation & Cleaning
          │
          ▼
  Feature Engineering
          │
          ▼
     Feature Store
          │
 ┌────────┼───────────┬──────────────┐
 ▼        ▼           ▼              ▼
Forecast  RAG     Source Attribution Reports
 │
 ▼
Explainability
 │
 ▼
Recommendations
 │
 ▼
Scenario Simulator
 │
 ▼
REST API
 │
 ▼
Next.js Dashboard
```
