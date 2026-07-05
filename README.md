<div align="center">

# 🫘 BeanAI — Not one AI. A panel that argues first.

**Six AI minds analyze your decision — facts, risks, emotions, opportunities — then debate each other before reaching a verdict.**

A callable, on-chain **reasoning agent** built on the **CROO Agent Protocol (CAP)**.
Humans use it on the web; other agents hire it A2A and pay per analysis in USDC.

Built for the **CROO Agent Hackathon** · Track: *Research & Intelligence Agents*

</div>

---

## What it is

Most AI gives you a single, agreeable answer. BeanAI runs your decision through **six independent "thinking hats"** (Edward de Bono's model), each with a distinct job, then forces them to **debate** in a second round so conflicts and blind spots surface — before a final synthesis produces a confidence-scored verdict with a **verifiable SHA-256 receipt**.

| Hat | Mind | Role |
|-----|------|------|
| ⚪ White | `FACT`  | Verifiable facts & data (live web search) |
| 🔴 Red   | `FEEL`  | Emotion, intuition, gut feeling |
| ⚫ Black | `RISK`  | Risks, hidden assumptions, failure modes |
| 🟡 Yellow| `GAIN`  | Opportunities, upside, best-case |
| 🟢 Green | `WILD`  | Creative alternatives, what-ifs |
| 🔵 Blue  | `MERGE` | Synthesis, verdict, next steps |

## Why it's an Agent (CAP / A2A)

BeanAI isn't just a web app — it's a **service agent with a wallet**. Any agent on the CROO network can hire it through CAP:

- It **listens** for orders over the CAP WebSocket, **auto-accepts** negotiations, runs the full six-hat engine **with no human in the loop**, and **delivers** a structured JSON verdict.
- Payment is metered **per analysis in USDC** and **settled on-chain** by the protocol.
- Output is clean JSON + a SHA-256 proof, so a calling agent can plug the verdict straight into its pipeline.

### CAP SDK methods used
Provider side ([`croo/provider.py`](croo/provider.py)):

| SDK | Purpose |
|-----|---------|
| `AgentClient(Config(...), sdk_key)` | Authenticated agent client |
| `client.connect_websocket()` | Subscribe to live CAP events |
| `EventType.NEGOTIATION_CREATED` → `client.accept_negotiation(id)` | Accept incoming hire requests |
| `client.get_negotiation(id)` | Filter by our `service_id` |
| `EventType.ORDER_PAID` → `client.get_order(id)` | Start work once USDC is paid |
| `client.deliver_order(id, DeliverOrderRequest(DeliverableType.SCHEMA, ...))` | Deliver the verdict on-chain |

Requester/self-hire demo ([`croo/requester_test.py`](croo/requester_test.py)) uses
`NegotiateOrderRequest` → `client.get_delivery(order_id)` to generate a real on-chain transaction.

---

## Architecture

```
┌── Frontend (Next.js, /frontend) ─────────────┐     ┌── Backend (FastAPI) ──────────────────────┐
│  Marketing pages · Workspace (analyze /      │     │  api/routers: analyze · report · minds ·   │
│  results / history) · Auth (email magic-link,│ ──▶ │    utility                                  │
│  Google OAuth, MetaMask) · per-user history ·│     │  engine: runner · discussion · chat ·      │
│  Obsidian knowledge graph · live debate chat │     │    graph · quality · refiner · intake      │
└──────────────────────────────────────────────┘     │  minds: 6 hats + verifier                   │
                                                      │  clients: groq · gemini · tavily            │
        ┌── CROO Agent Protocol (CAP) ──┐            │  croo/provider.py  (A2A WebSocket worker)   │
Other   │  hire · pay USDC · settle on- │  ◀────────▶ │  storage.py  (reports + SHA-256 proof)      │
agents  │  chain · deliver JSON verdict │            └────────────────────────────────────────────┘
        └───────────────────────────────┘
```

**Engine highlights**
- Six hats run **in parallel**, each with a **quality-refinement loop** (self-critique → refine).
- **Round 2 debate** — every mind reads the others and pushes back.
- **Live interactive chat** — challenge the panel; hats reply short and argue back in real time.
- **Resilience** — per-hat retry + graceful degrade, so a single flaky LLM/search connection never fails a whole analysis.
- **Knowledge graph** — concepts + relations extracted and rendered as an interactive force-directed graph.

**Tech:** FastAPI · Gemini · Groq · Tavily · CROO SDK · Next.js 16 · React 19 · d3-force · framer-motion · jose (JWT auth) · viem (wallet auth).

---

## Getting started (local)

### 1. Backend
```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # then fill in your keys
python start.py               # runs the API (:8000) + the CROO A2A worker together
# or, API only:  uvicorn main:app --reload
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env.local    # then fill in your values
npm run dev                   # http://localhost:3000
```

Health check: `GET http://localhost:8000/api/health`

---

## Environment variables

**Backend (`.env`)** — see [`.env.example`](.env.example)

| Var | What |
|-----|------|
| `GROQ_API_KEY`, `GEMINI_API_KEY`, `TAVILY_API_KEY` | LLM + web-search providers |
| `CROO_SDK_KEY`, `CROO_API_URL`, `CROO_WS_URL` | CAP credentials + endpoints |
| `CROO_SERVICE_ID`, `CROO_AGENT_ID` | Your Agent Store listing IDs |
| `FRONTEND_URL` | Deployed frontend origin (CORS) |
| `PORT` | Set by the host in production |

**Frontend (`frontend/.env.example`)**

| Var | What |
|-----|------|
| `NEXT_PUBLIC_API_URL` | Backend base URL |
| `AUTH_SECRET` | JWT session secret (generate a new one for prod) |
| `SMTP_*` | Direct-mail magic-link login (optional in dev) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth (optional) |
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CROO_STORE_URL` | Public URLs |

---

## Deploy (24/7)

The backend must run as an **always-on process** (it holds the CAP WebSocket and runs background analyses) — not serverless.

- **Backend** → Railway / Fly / a VPS. Uses the `Procfile` (`web: python start.py`) and `$PORT`. Mount a **persistent volume** on `reports/` so history + receipts survive restarts.
- **Frontend** → Vercel (root directory `frontend`).
- Point `NEXT_PUBLIC_API_URL` (frontend) and `FRONTEND_URL` (backend) at each other, and register your production Google OAuth redirect URI: `https://<frontend>/api/auth/google/callback`.

---

## Submission checklist (CROO Agent Hackathon)

- [x] **Integrated with CAP** — callable, accepts USDC, settles on-chain ([`croo/provider.py`](croo/provider.py))
- [x] **Open source** — MIT ([`LICENSE`](LICENSE))
- [x] **README + setup + SDK methods + integration notes** (this file)
- [ ] **Listed on CROO Agent Store** — publish & confirm discoverable
- [ ] **Demo video (≤5 min)**
- [ ] **BUIDL filed on DoraHacks**

## License

MIT © 2026 Propeller — see [LICENSE](LICENSE).
