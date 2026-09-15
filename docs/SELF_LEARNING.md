# Self-Learning Report: DevOps & Cloud Database Governance

**Course:** MCA Trimester 5 — DevOps Lab (Lab 2)  
**Student Name:** Achindra Sharma (2547105)  
**Context:** Migrating MERN Stack to MongoDB Atlas with Git/GitHub Governance  

---

## 1. Why Beyond Baseline?

The baseline exercise required taking a standard MERN application, switching the database target to MongoDB Atlas, setting up a Git repository with `.gitignore` covering environment files, `node_modules`, and `dist`, and pushing the project to GitHub.

Anyone can update a connection string in `.env` and run `git push`. But in actual DevOps practice, moving an application from a local daemon (`localhost:27017`) to a remote cloud managed cluster (`mongodb+srv://...`) introduces real operational concerns:
- How does the application behave when the network drops or the cloud cluster rebalances?
- How do we know the database is actually reachable without inspecting server logs manually?
- How do we prevent team members from accidentally committing their raw Atlas passwords into GitHub history?
- How do we verify pull requests before they break production?

We treated this lab as an opportunity to implement the engineering controls that turn a simple tutorial app into a cloud-ready, governed service.

---

## 2. Initiative 1: Telemetry & Cloud Health Probes (`/api/health`)

### The Problem
When running locally, if MongoDB is down, `localhost` throws an immediate socket reset. When moving to MongoDB Atlas, connectivity issues can be nuanced: DNS resolution failures for SRV records, IP whitelist rejections, authentication failures, or transient cloud network latency spikes.

Without an observability endpoint, the only way to know if the backend is connected to Atlas is to either trigger an API request that fails or inspect console output.

### What We Implemented
We implemented an active health check probe at `GET /api/health`:
```javascript
app.get("/api/health", async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const isDbHealthy = dbState === 1;

    let dbLatencyMs = null;
    if (isDbHealthy && mongoose.connection.db) {
        const start = Date.now();
        await mongoose.connection.db.admin().ping();
        dbLatencyMs = Date.now() - start;
    }

    res.status(isDbHealthy ? 200 : 503).json({
        status: isDbHealthy ? "UP" : "DEGRADED",
        uptimeSeconds: Math.floor(process.uptime()),
        database: {
            state: dbStateMap[dbState],
            connected: isDbHealthy,
            host: mongoose.connection.host,
            latencyMs: dbLatencyMs
        },
        system: {
            nodeVersion: process.version,
            memoryUsageMB: Math.round(process.memoryUsage().rss / (1024 * 1024))
        }
    });
});
```

### Why This Matters for DevOps
In containerized and cloud platforms (Kubernetes, AWS ECS, Google Cloud Run), orchestrators use **Liveness** and **Readiness** probes to decide whether to route traffic to an instance or restart it. If Atlas is temporarily unreachable, the endpoint returns `503 Service Unavailable`, preventing the orchestrator from sending user traffic to an unhealthy pod while reporting the exact round-trip ping time in milliseconds.

---

## 3. Initiative 2: Client-Side Security Git Hooks (`.githooks/`)

### The Problem
Once a password or secret is committed into a Git repository and pushed to GitHub, it remains in the Git reflog and commit tree even if a follow-up commit deletes the file. Automated scrapers on GitHub index public repositories within seconds, leading to immediate database compromise.

Relying solely on developers remembering not to type `git add .env` is fundamentally flawed.

### What We Implemented
We authored two client-side Git hooks stored in `.githooks/`:

1. **`pre-commit` hook:**
   - Intercepts `git commit` before the commit object is written.
   - Inspects staged files using `git diff --cached --name-only` to block any `.env` file (while permitting `.env.example`).
   - Scans diff hunks for staged MongoDB connection strings containing plaintext credentials (`mongodb+srv://<username>:<password>@`).
   - Rejects commits containing raw merge conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).

2. **`commit-msg` hook:**
   - Enforces the **Conventional Commits** format (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`).
   - Keeps the repository history clear and enables automatic changelog generation.

### Hook Configuration
We wire the hooks into the repository via:
```bash
git config core.hooksPath .githooks
```
This avoids requiring external npm dependencies (like Husky) while keeping the security rules version-controlled directly in the repo.

---

## 4. Initiative 3: Automated Multi-Job CI Pipeline (`.github/workflows/ci.yml`)

### The Problem
In a collaborative team setup, developers might submit pull requests where:
- Backend code has invalid syntax or uncaught syntax errors.
- Frontend React code breaks during production bundling (`vite build`) even if it ran in local dev mode.
- Accidental `.env` files or secret keys slip past local reviews.

### What We Implemented
We configured a GitHub Actions CI workflow with three independent jobs:
1. **`backend-ci`:** Runs on Node 20, caches npm packages, executes `node --check` across all server files, controllers, and routes, and verifies that `.env.example` contains required configuration keys.
2. **`frontend-ci`:** Runs ESLint and validates that `npm run build` produces a clean production bundle without bundling errors.
3. **`security-scan`:** Scans the checked-out repository to guarantee no un-ignored `.env` files exist and verifies zero conflict markers remain in any tracked file.

---

## 5. Initiative 4: 12-Factor Decoupling of Frontend API Endpoint

### The Problem
The frontend code had `http://localhost:8000/api` hardcoded in `frontend/src/services/api.js`. In production, the backend might run on a distinct domain (e.g. `https://api.example.com`). Hardcoding `localhost` breaks the Twelve-Factor App principle of **Config in the Environment**.

### What We Implemented
We updated the API client to read the environment variable first:
```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
```
We also provided `frontend/.env.example` so any deployment target (Vercel, Netlify, Docker) can configure the API endpoint through standard environment variables.

---

## 6. Initiative 5: Database Seeding & Verification Script (`backend/scripts/seed.js`)

### The Problem
When evaluators or teammates clone a fresh repository and point it to a new MongoDB Atlas cluster, testing the CRUD operations requires manually creating a user account, logging in, acquiring a JWT, and typing book data manually.

### What We Implemented
We wrote an automated seeding script runnable via `npm run seed` in `backend/`:
- Verifies Atlas cluster connectivity using `serverSelectionTimeoutMS: 5000`.
- Hashes a secure demo user password using `bcryptjs`.
- Inserts curated DevOps literature ("The Phoenix Project", "Site Reliability Engineering", "Accelerate") linked to the test user's ObjectId.
- Reports clear success or actionable troubleshooting diagnostics (e.g., if the user forgot to whitelist their IP in Atlas).

---

## 7. Key Takeaways & Reflections

1. **Security belongs at the boundary:** The combination of a strict `.gitignore` plus client-side Git hooks ensures that sensitive Atlas credentials cannot accidentally leak into public GitHub history.
2. **Observability is not optional in cloud migrations:** Running against Atlas means network hops exist where local loopback didn't. Having `/api/health` measure actual database ping latency gives instant visibility into cloud connection health.
3. **Automated validation saves hours:** Having GitHub Actions run syntax checks and production builds on every push catches subtle import mistakes before code is ever merged.
