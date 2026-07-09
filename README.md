# UrbanAir AI — Smart City Air Quality Intelligence Platform

From Monitoring Pollution to Preventing It.

UrbanAir AI is an AI-powered decision support platform for city administrators that combines AQI sensors, weather forecasting, satellite imagery, traffic congestion profiles, and GIS datasets into an actionable control center.

---

## Workspace Structure

The project is structured as an npm workspaces monorepo:

```text
UrbanAir-AI/
├── apps/
│   ├── web/            # Next.js 15 (React 19 + TypeScript + Tailwind)
│   └── api/            # FastAPI Backend (Python 3.11 + SQLAlchemy + PostGIS)
├── packages/
│   ├── shared/         # Shared typescript configurations and type interfaces
│   └── ui/             # Optional shared component library
├── docker/             # Docker deployment configurations
├── docs/               # System architecture and specifications
└── docker-compose.yml  # Local services (PostgreSQL + PostGIS and Redis)
```

---

## Local Development Setup

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Python**: `3.11`
- **Docker & Docker Compose** (for database containerization)

---

### Step 1: Environment Configuration

Copy the example environment variables file at the root:

```bash
cp .env.example .env
```

Review the values inside `.env`. The database connects to localhost by default.

---

### Step 2: Spin Up Local Services

Launch the database (PostgreSQL with PostGIS extension) and Redis using Docker Compose:

```bash
docker compose up -d
```

Verify that the databases are healthy and running:

```bash
docker compose ps
```

---

### Step 3: Install Workspaces Dependencies

Run this from the monorepo root to link packages and install node modules:

```bash
npm install
```

Build the shared typescript type package:

```bash
npm run build:shared
```

---

### Step 4: Start the FastAPI Backend

1. Navigate to the backend directory:
   ```bash
   cd apps/api
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

The Swagger API documentation will be available at: [http://localhost:8000/docs](http://localhost:8000/docs).
Upon start, the database schemas are automatically created, and standard development credentials are seeded.

---

### Step 5: Start the Next.js Frontend

Run this from the monorepo root:

```bash
npm run dev:web
```

The web console will be available at: [http://localhost:3000](http://localhost:3000).

---

## Development Seed Credentials

The optional seeding script populates these standard accounts when `ENVIRONMENT=development`:

- **Administrator**: `admin@urbanair.ai` / `Admin@123`
- **City Officer**: `officer@urbanair.ai` / `Officer@123`
- **Citizen**: `citizen@urbanair.ai` / `Citizen@123`
