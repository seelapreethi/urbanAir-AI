# UrbanAir AI — Smart City Air Quality Intelligence Platform

> From Monitoring Pollution to Preventing It.

UrbanAir AI is an enterprise-grade AI decision-support platform for municipal authorities. It aggregates raw environmental feeds—including public CPCB sensors, weather forecasts, Sentinel-5P satellite indices, traffic grids, and local zoning layers—into a unified GIS Command Center. Rather than just displaying indexes, it analyzes causes, projects future trends, and ranks ranked policy interventions.

---

## 🏗 Monorepo Architecture

The workspace is structured as an NPM workspaces monorepo:

```text
UrbanAir-AI/
├── apps/
│   ├── web/            # Next.js 15 (React 19, TypeScript, TailwindCSS, Lucide Icons)
│   └── api/            # FastAPI (Python 3.11, SQLAlchemy, PostGIS, Uvicorn, SQLite/PostgreSQL)
├── packages/
│   ├── shared/         # Shared TypeScript interfaces & types declarations
│   └── ui/             # Reusable UI component configurations
├── datasets/           # Local Grounded RAG Database (WHO, CPCB limits, policy indexes)
├── docker-compose.yml  # Orchestrates PostgreSQL, Redis, API, and Next.js containers
└── README.md           # Deployment & Setup guidelines
```

---

## 🛠 Features Implemented

1. **GIS Interactive Maps Workspace**
   - Centered around OpenStreetMap tiles containing toggleable layers for Schools, Hospitals, Inspections, and Attributed Emission points.
   - Animated wind vector overlay indicating pollution dispersion fields.
2. **AI Telemetry Engine**
   - Computes causal analysis (load contributions from Traffic, Industry, Burning), forecasts 72-hour timeline vectors, and evaluates demographic risk exposure guidelines.
3. **Admin Settings & Metrics Diagnostics**
   - Configures theme preferences, alert thresholds, default cities, and displays live backend container CPU/memory usage and cache hit ratios.

---

## 🐳 Docker Production Orchestration

To compile and launch the entire stack (Next.js, FastAPI, PostGIS, and Redis) locally or on cloud targets:

```bash
# Build and run all container services in background
docker compose up --build -d

# Verify all containers are running and healthy
docker compose ps
```

Services are exposed at:
- **Command Center Dashboard**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Documentation & Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Verification Route**: [http://localhost:8000/api/v1/monitor/health](http://localhost:8000/api/v1/monitor/health)

---

## 💻 Local Development Setup

### Step 1: Install Workspace Dependencies
From the repository root directory:
```bash
npm install
npm run build:shared
```

### Step 2: Launch Databases & Cache Pools
```bash
docker compose up db redis -d
```

### Step 3: Run FastAPI Backend
1. Go to `apps/api/`.
2. Activate your virtual env and install python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the uvicorn development server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

### Step 4: Run Next.js Frontend
From the root workspace folder:
```bash
npm run dev:web
```

---

## 🔒 Seed Accounts

The startup initialization automatically seeds standard development accounts:
- **Administrator**: `admin@urbanair.ai` / `Admin@123`
- **City Officer**: `officer@urbanair.ai` / `Officer@123`
- **Citizen**: `citizen@urbanair.ai` / `Citizen@123`
