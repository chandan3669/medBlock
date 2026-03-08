# MedBlock — System Deployment & Operations Guide

> **Version:** 1.0.0 | **Last Updated:** March 2026 | **Environment:** Development

---

## Table of Contents

1. [Team Architecture](#team-architecture)
2. [Prerequisites](#prerequisites)
3. [Option A — Local Network Setup](#option-a--local-network-setup)
4. [Option B — Docker Deployment](#option-b--docker-deployment)
5. [Environment Configuration](#environment-configuration)
6. [System Verification](#system-verification)
7. [Troubleshooting Reference](#troubleshooting-reference)

---

## Team Architecture

MedBlock is a distributed system composed of four independent microservices, each maintained by a separate team member.

| Engineer | Responsibility | Technology | Port |
| :--- | :--- | :--- | :---: |
| **Chandan** | Frontend UI + API Gateway | React.js + Node.js/Express | `3000` + `4000` |
| **ML Engineer** | AI Diagnostic Engine | FastAPI (Python) | `8000` |
| **Blockchain Engineer** | Prescription Ledger | Go | `5000` |
| **Database Engineer** | Persistent Data Layer | PostgreSQL | `5432` |

> All services communicate over a shared local network (LAN/WiFi) or a Docker bridge network.

---

## Prerequisites

Ensure the following tools are installed on the respective machines **before** attempting to run the system.

| Tool | Min Version | Required By |
| :--- | :---: | :--- |
| Node.js | 18.x | Chandan |
| npm | 9.x | Chandan |
| Python | 3.11+ | ML Engineer |
| Go | 1.21+ | Blockchain Engineer |
| PostgreSQL | 15 | Database Engineer |
| Docker + Docker Compose | 24.x | All (for Option B) |

---

## Option A — Local Network Setup

> **Requirement:** All machines must be connected to the **same WiFi or LAN network.**

### Step 1 — Database Engineer

Start PostgreSQL and run the following schema to initialize the database:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create prescriptions / history table
CREATE TABLE IF NOT EXISTS prescriptions (
    id                SERIAL PRIMARY KEY,
    user_id           INTEGER REFERENCES users(id) ON DELETE CASCADE,
    symptoms          TEXT[],
    disease           VARCHAR(255),
    confidence        FLOAT,
    medicines         TEXT[],
    prescription_hash VARCHAR(512),
    created_at        TIMESTAMP DEFAULT NOW()
);
```

After the database is running, **share your machine's local IP address** with Chandan.

```bash
# Get your IP address (Windows)
ipconfig

# Get your IP address (macOS/Linux)
ifconfig | grep "inet "
```

---

### Step 2 — ML Engineer

Install dependencies and start the FastAPI service:

```bash
cd medblock-ml/
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Required API Contract** — Expose exactly this endpoint:

```
POST /predict
Content-Type: application/json

Request Body:
{
  "symptoms": ["headache", "fever", "cough"]
}

Response:
{
  "disease": "Viral Flu",
  "confidence": 0.91,
  "medicines": ["Paracetamol 500mg", "Rest"]
}
```

After the service is running, **share your machine's local IP address** with Chandan.

---

### Step 3 — Blockchain Engineer

Install dependencies and start the Go service:

```bash
cd medblock-blockchain/
go mod download
go run main.go
```

**Expected output:**
```
Blockchain service running on port 5000
```

**Required API Contract** — Expose exactly these two endpoints:

```
# Store a new prescription on the chain
POST /store
{
  "userId": 1,
  "disease": "Viral Flu",
  "confidence": 0.91,
  "symptoms": ["headache", "fever"],
  "medicines": ["Paracetamol 500mg"]
}
→ Response: { "prescriptionHash": "0xabc123..." }

# Verify an existing prescription by hash
GET /verify/:hash
→ Response: {
    "verified": true,
    "disease": "Viral Flu",
    "confidence": 0.91,
    "symptoms": ["headache", "fever"],
    "medicines": ["Paracetamol 500mg"],
    "timestamp": "2026-03-03T12:00:00Z"
  }
```

> **Important:** Enable CORS on your Go service to allow requests from `http://localhost:4000`.

After the service is running, **share your machine's local IP address** with Chandan.

---

### Step 4 — Chandan: Configure Environment Variables

Once all teammates have shared their IP addresses, open `backend/.env` and update:

```env
PORT=4000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here

# Database Engineer's machine IP
DB_URL=postgres://medblock_user:medblock_pass@192.168.1.XXX:5432/medblock

# ML Engineer's machine IP
FASTAPI_ML_URL=http://192.168.1.XXX:8000

# Blockchain Engineer's machine IP
GO_BLOCKCHAIN_URL=http://192.168.1.XXX:5000
```

---

### Step 5 — Chandan: Start Backend (Terminal 1)

```bash
cd "C:\Users\Gostr\OneDrive\Desktop\medBLock\backend"
npm install
npm run dev
```

**Expected output:**
```
🚀 API Gateway running in development mode on port 4000
```

---

### Step 6 — Chandan: Start Frontend (Terminal 2)

Open a **new terminal window** and run:

```bash
cd "C:\Users\Gostr\OneDrive\Desktop\medBLock\frontend"
npm install
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

Navigate to **http://localhost:3000** in your browser.

---

## Option B — Docker Deployment

> **Recommended:** Most reliable method. Eliminates version conflicts across machines.

### Step 1 — ML Engineer builds and pushes their image

```bash
cd medblock-ml/
docker build -t <dockerhub-username>/medblock-ml:latest .
docker push <dockerhub-username>/medblock-ml:latest
```

Share the full image name with Chandan (e.g., `mlguy/medblock-ml:latest`).

### Step 2 — Blockchain Engineer builds and pushes their image

```bash
cd medblock-blockchain/
docker build -t <dockerhub-username>/medblock-blockchain:latest .
docker push <dockerhub-username>/medblock-blockchain:latest
```

Share the full image name with Chandan.

### Step 3 — Chandan updates `docker-compose.yml`

Uncomment and fill in the image names in `docker-compose.yml`:

```yaml
ml_service:
  image: mlguy/medblock-ml:latest       # ← Replace with actual image

blockchain_service:
  image: bcguy/medblock-blockchain:latest  # ← Replace with actual image
```

### Step 4 — Chandan starts the entire system

```bash
cd "C:\Users\Gostr\OneDrive\Desktop\medBLock"
docker-compose up --build
```

All services — database, backend, frontend, ML, and blockchain — will start automatically.

Navigate to **http://localhost:3000** in your browser.

---

## Environment Configuration

### Required Variables — `backend/.env`

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | API Gateway port | `4000` |
| `NODE_ENV` | Runtime environment | `development` |
| `JWT_SECRET` | Secret key for JWT signing | `a_strong_random_secret` |
| `DB_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/medblock` |
| `FASTAPI_ML_URL` | ML service base URL | `http://192.168.1.10:8000` |
| `GO_BLOCKCHAIN_URL` | Blockchain service base URL | `http://192.168.1.11:5000` |

---

## System Verification

After all services are running, validate each layer:

### 1. API Gateway Health Check
```
GET http://localhost:4000/health
→ 200 OK: { "status": "OK", "timestamp": "..." }
```

### 2. End-to-End Flow Checklist

| Step | Action | Expected Result |
| :---: | :--- | :--- |
| 1 | Navigate to `/register` and create an account | Redirect to `/dashboard` |
| 2 | Navigate to `/login` with credentials | JWT token stored; redirect to `/dashboard` |
| 3 | Access `/dashboard` without logging in | Redirect to `/login` (Protected Route working) |
| 4 | Navigate to `/predict`, add symptoms, submit | Disease prediction + confidence + blockchain hash |
| 5 | Navigate to `/history` | List of past consultations |
| 6 | Navigate to `/verify`, enter a hash | Blockchain verification result |
| 7 | Click Logout | JWT cleared; redirect to `/login` |

---

## Troubleshooting Reference

| Symptom | Root Cause | Resolution |
| :--- | :--- | :--- |
| `ECONNREFUSED` on `/predict` | ML service is not running | ML Engineer must start FastAPI service |
| `ECONNREFUSED` on `/verify` | Blockchain service is not running | Blockchain Engineer must start Go service |
| `401 Unauthorized` on API calls | JWT token is missing or expired | Log out and log in again |
| Tailwind CSS not applied | Vite server needs restart | Stop server (`Ctrl+C`) and run `npm run dev` again |
| CORS error in browser console | Incorrect IP in `.env` | Update `FASTAPI_ML_URL` / `GO_BLOCKCHAIN_URL` in `.env` |
| `password authentication failed` | Wrong DB credentials | Verify `DB_URL` in `.env` matches PostgreSQL config |
| Frontend blank after login | PostCSS config not loaded | Restart Vite dev server |
