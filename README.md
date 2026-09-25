# CloudPrune AI — Autonomous FinOps Agent Dashboard

An autonomous FinOps agent web application for continuous cloud waste discovery and remediation across multi-cloud environments (AWS, GCP, Azure).

---

## ⚡ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Canvas-Confetti, Vite
- **Backend**: Node.js, Express, TypeScript, TSX
- **Validation**: Strict Zod schemas for LLM output and API payloads
- **LLM Abstraction**: Swappable `AIProvider` interface supporting Google Gemini (official `@google/genai` SDK), OpenAI, and a built-in Heuristic FinOps Engine fallback

---

## 🚀 Key Features

1. **Telemetry Ingestion (`GET /api/instances`)**:
   - Queries telemetry for 12 seed instances with CPU %, memory %, network I/O, disk I/O, tags (`env:prod`, `env:dev`, `team`, `owner`), last deploy timestamp, and monthly cost.
   - Structured via `CloudTelemetryAdapter` interface so real AWS (`DescribeInstances`) or GCP SDK calls can directly replace the mock layer.

2. **AI Fleet Audit (`POST /api/audit`)**:
   - Sends real-time telemetry and past manager feedback to the LLM agent.
   - Strict Zod validation (`llmAuditOutputSchema`) verifies:
     - Executive summary
     - Per-instance verdict: `zombie` (red), `needs-review` (amber), `likely-safe` (green)
     - Confidence score (0–100) per instance
     - One-line reasoning string citing metric ceilings and tags
     - Total estimated monthly savings calculation

3. **Human-in-the-Loop Approval Modal (`POST /api/terminate`)**:
   - Diff-style Before / After fleet cost impact projection.
   - Production safety gates preventing accidental termination of `env:prod` workloads.
   - Optimistic UI updates with rollback on failure.
   - Celebratory confetti burst on successful decommission.

4. **Manager Feedback & Rejection Memory (`POST /api/feedback`)**:
   - Allows engineering managers to reject termination recommendations with structured team tags and preservation justifications.
   - Marks instances as *"Previously Rejected by Manager — Treat Cautiously"* in the dashboard and subsequent AI audits.

5. **Immutable Audit Trail (`GET /api/audit-logs`)**:
   - Full timeline of autonomous audits, human approvals, decommissions, and net cost deltas.

---

## 📊 The 12-Instance FinOps Demo Story

The fleet starts at **~$5,887/mo** with **$3,576/mo (60.7%) recoverable waste**:

| Instance Name | Cloud / Region | Type | Cost/mo | CPU % | Verdict | Story |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `gcp-a2-gpu-notebook-alex` | GCP us-central1-f | `a2-highgpu-1g (A100)` | $2,145 | 0.3% | 💀 Zombie | Departed data scientist's unattached GPU POC bench |
| `qa-loadgen-gatling-cluster-node-02` | GCP us-central1-a | `n2-standard-16` | $582 | 1.2% | 💀 Zombie | Abandoned Q3 load-testing node launched by CI |
| `sandbox-elastic-single-node-abandoned` | Azure East US | `Standard_D8s_v5` | $410 | 0.5% | 💀 Zombie | Dormant observability POC node idle for 114+ days |
| `dev-k8s-spot-orphaned-worker-3` | AWS us-west-2 | `c5.2xlarge` | $248 | 0.9% | 💀 Zombie | Forgotten Kubernetes spot node from legacy checkout cluster |
| `dev-rabbitmq-broker-backup` | AWS us-east-1 | `t3.xlarge` | $121 | 1.1% | 💀 Zombie | Old dev messaging broker from closed JIRA ticket |
| `staging-legacy-memcached-node` | AWS us-west-1 | `m5.large` | $70 | 0.1% | 💀 Zombie | Deprecated memcached instance past its decommission date |
| `qa-e2e-cypress-matrix-agent-04` | AWS us-east-2 | `c5.xlarge` | $124 | 8.6% | ⚠️ Needs Review | Nightly Cypress runner. **Previously rejected by QA Lead** |
| `staging-warehouse-sync-worker` | AWS eu-west-1 | `m5.xlarge` | $140 | 4.2% | ⚠️ Needs Review | Spiky weekly cron job with irregular sync patterns |
| `gcp-n2-adhoc-metabase-test` | GCP europe-west1 | `n2-standard-4` | $146 | 5.1% | ⚠️ Needs Review | BI exploration machine with intermittent developer queries |
| `prod-aurora-postgres-primary` | AWS us-east-1 | `r6g.4xlarge` | $1,050 | 68.4% | 🛡️ Likely Safe | Mission-critical production database (protected by policy) |
| `prod-redis-cluster-cache-01` | AWS us-east-1 | `r6g.2xlarge` | $525 | 41.5% | 🛡️ Likely Safe | Active production cache cluster |
| `prod-edge-ingress-gateway-01` | AWS us-east-1 | `c6i.4xlarge` | $496 | 54.2% | 🛡️ Likely Safe | Production ingress Envoy gateway handling high network I/O |

---

## 🛠️ Setup & Running Locally

### 1. Install Dependencies
```bash
npm run install:all
```
*(Or install in `server` and `client` individually: `cd server && npm install`, `cd ../client && npm install`)*

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
- If you have a Google Gemini key, set `GEMINI_API_KEY=your_key` and `AI_PROVIDER=gemini`.
- If no key is provided, the application runs out of the box with the **Built-in FinOps Heuristic Provider** using the exact same Zod schema validation.

### 3. Run Development Servers
To run both backend (port 3001) and frontend (port 5173) simultaneously:
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 (Backend API on http://localhost:3001)
npm run dev:server

# Terminal 2 (Vite Frontend on http://localhost:5173)
npm run dev:client
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/instances` | Returns all servers with CPU/RAM telemetry, tags, and feedback |
| `POST` | `/api/audit` | Triggers LLM audit across fleet; returns Zod-validated verdicts |
| `GET` | `/api/audit/latest` | Returns cached results of the most recent audit |
| `POST` | `/api/terminate` | Decommissions approved instance IDs with safety checks |
| `POST` | `/api/feedback` | Ingests manager rejection reasoning and tags |
| `GET` | `/api/feedback` | Returns list of all active manager exemptions |
| `GET` | `/api/audit-logs` | Immutable audit trail of all FinOps actions |
| `GET` | `/api/settings` | Current autonomous policy thresholds |
| `POST` | `/api/settings` | Updates autonomous policy thresholds |
| `POST` | `/api/demo/reset` | Resets fleet to 12 initial instances |
