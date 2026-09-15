# DevOps Lab 2: MERN Stack Cloud Database Migration & Git Governance

**Course:** MCA Trimester 5 — DevOps Lab (Lab 2)  
**Student Name:** Achindra Sharma  
**Register Number:** 2547105  
**Class / Section:** 4MCA A  
**Application:** Cloud-Native MERN Book Management System  
**Database:** MongoDB Atlas (Cloud NoSQL Database)  
**Repository:** [https://github.com/Achindra2003/devops-lab2-mern-book-crud](https://github.com/Achindra2003/devops-lab2-mern-book-crud)  

---

## 1. Project Overview & DevOps Architecture

This project is a full-stack **MERN (MongoDB, Express, React, Node.js)** Book Management application migrated from a local database instance to **MongoDB Atlas** cloud infrastructure.

The project implements production-grade DevOps engineering practices:
- **Cloud Database Migration:** Resilient connection handling with credentials masking, connection state lifecycle listeners, and graceful process teardown.
- **Git Hygiene & Security Guardrails:** Comprehensive `.gitignore` strictly omitting `.env`, `node_modules`, and `dist` build artifacts.
- **Client-Side Git Hooks (`.githooks/`):** Pre-commit security scanning blocking accidental staging of credentials or merge conflict markers, and commit-msg linting enforcing **Conventional Commits**.
- **Continuous Integration (`.github/workflows/ci.yml`):** Automated multi-stage GitHub Actions pipeline testing backend syntax, frontend Vite build, and secret leakage.
- **Observability Telemetry (`/api/health`):** Liveness/readiness probe reporting real-time Atlas latency, readyState, uptime, and memory consumption.
- **12-Factor App Decoupling:** Environment-driven API endpoints without hardcoded localhost URLs.

---

## 2. Architecture Diagram

```
+--------------------------------------------------------+
|                      React 19 + Vite                   |
|       (Tailwind CSS v4, React Router 7, Hook Form)     |
|             VITE_API_URL -> http://localhost:8000/api  |
+---------------------------+----------------------------+
                            |
                     REST HTTP / JSON
                            |
+---------------------------v----------------------------+
|                   Node.js + Express API                |
|  - Auth Middleware (JWT Verification)                  |
|  - Books CRUD Controllers                              |
|  - Telemetry & Health Check Probe (/api/health)        |
+---------------------------+----------------------------+
                            |
                      TLS / Mongoose
                            |
+---------------------------v----------------------------+
|                 MongoDB Atlas Cluster                  |
|     (Cloud Replica Set with Automated Failover)        |
|    mongodb+srv://<user>:<pwd>@cluster0.../bookstore    |
+--------------------------------------------------------+
```

---

## 3. MongoDB Atlas Migration Guide

### Step 1: Create a Cluster on MongoDB Atlas
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Deploy a free tier **M0 Cluster** (AWS / Azure / GCP).
3. Under **Security -> Database Access**, create a database user (e.g. `devops_admin`) with password authentication and `readWriteAnyDatabase` privileges.
4. Under **Security -> Network Access**, click **Add IP Address** and add `0.0.0.0/0` (allow access from anywhere for development/evaluator testing) or your current public IP.

### Step 2: Retrieve your Connection String
1. In your Atlas cluster, click **Connect -> Drivers**.
2. Copy the connection URI:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bookstore?retryWrites=true&w=majority
   ```
3. Replace `<username>` and `<password>` with your database user credentials.

### Step 3: Configure Environment Variables
Inside `backend/.env`:
```env
PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bookstore?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1h
```

---

## 4. Quickstart & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Achindra2003/devops-lab2-mern-book-crud.git
cd devops-lab2-mern-book-crud
```

### 2. Configure Git Hooks
To activate client-side commit validation and security scanning:
```bash
git config core.hooksPath .githooks
```

### 3. Backend Setup & Atlas Connectivity Check
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB Atlas connection URI

# Test Atlas connectivity and seed initial sample data
npm run seed

# Run server in development mode
npm run dev
```
The API server starts on `http://localhost:8000`.

### 4. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```
The client starts on `http://localhost:5173`.

---

## 5. API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API status and greeting | No |
| `GET` | `/api/health` | Telemetry probe (DB state, Atlas latency, uptime) | No |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No |
| `GET` | `/api/books` | Fetch books created by authenticated user | Yes (Bearer Token) |
| `GET` | `/api/books/:id` | Fetch specific book details | Yes (Bearer Token) |
| `POST` | `/api/books` | Create a new book entry | Yes (Bearer Token) |
| `PUT` | `/api/books/:id` | Update an existing book entry | Yes (Bearer Token) |
| `DELETE` | `/api/books/:id` | Remove a book entry | Yes (Bearer Token) |

---

## 6. Git Hygiene & Ignored Assets

The root `.gitignore` enforces strict security standards:
- **`env`**: `.env`, `*.env`, `.env.*` are completely ignored to ensure database secrets are never pushed to GitHub.
- **`node_modules`**: Excluded across root, `backend/node_modules/`, and `frontend/node_modules/`.
- **`dist`**: Excluded across root and `frontend/dist/` to avoid checking in compiled assets.

---

## 7. Self-Learning & DevOps Highlights

Detailed explanations, trade-offs, and reflections are documented in [`docs/SELF_LEARNING.md`](docs/SELF_LEARNING.md):
1. **Cloud-Native Health & Readiness Telemetry (`/api/health`)**
2. **Client-Side Git Security Hooks (`.githooks/`)**
3. **Automated Continuous Integration (`.github/workflows/ci.yml`)**
4. **12-Factor App Environment Decoupling**
5. **Database Resiliency & Automated Seeding**
