# RapidAid

AI-powered emergency coordination platform for India — connecting **citizens**, **ambulance operators**, and **hospital coordinators** in real time.

One tap triggers SOS dispatch, live ambulance tracking, AI first-aid guidance, and hospital prep before the patient arrives.

---

## Live demo (local)

After starting the dev servers (see below), open the demo hub:

| App | URL |
|-----|-----|
| **Demo hub** | http://localhost:3000/demo |
| **Citizen PWA** | http://localhost:3000/citizen?demo=1 |
| **Ambulance PWA** | http://localhost:3000/ambulance?demo=1 |
| **Hospital dashboard** | http://localhost:3000/dashboard?demo=1 |
| **Sign in** | http://localhost:3000/auth/signin |

> If port 3000 is busy, Next.js uses **3001** — replace `3000` with `3001` in the URLs above.

Demo mode uses mock data and simulated sockets — no signup or database required.

---

## Project structure

```
RapidAid/
├── src/                 # Next.js 14 — marketing site, auth, hospital dashboard
├── citizen-pwa/         # Vite + React PWA (citizen mobile app)
├── ambulance-pwa/       # Vite + React PWA (ambulance operator app)
├── backend/             # Express + MongoDB + Socket.io + Claude AI API
├── public/citizen/      # Built citizen PWA (generated, gitignored)
├── public/ambulance/    # Built ambulance PWA (generated, gitignored)
└── scripts/             # PWA build & icon generation
```

---

## Tech stack

| Layer | Stack |
|-------|--------|
| Web & dashboard | Next.js 14, React 18, Tailwind CSS, shadcn/ui, Recharts |
| Citizen / Ambulance apps | Vite, React, Tailwind, PWA (service worker), React Query |
| Backend | Express, Mongoose, Socket.io, JWT, bcrypt |
| AI | Anthropic Claude (streaming first-aid) |
| Auth | Phone OTP (Twilio), email verification (hospital), JWT sessions |
| Maps | OpenStreetMap + React Leaflet (no API key) |

---

## Quick start

### Prerequisites

- **Node.js 18+**
- **npm**

### 1. Install dependencies

```bash
# Root (Next.js + scripts)
npm install

# PWAs
cd citizen-pwa && npm install && cd ..
cd ambulance-pwa && npm install && cd ..

# Backend
cd backend && npm install && cd ..
```

### 2. Environment variables

**Frontend** — copy and edit at the repo root:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
NEXT_PUBLIC_DEMO_MODE=true
```

**Backend** — copy and edit:

```bash
cp backend/.env.example backend/.env
```

Minimum for local dev:

```env
PORT=4000
CLIENT_URL=http://localhost:3000,http://localhost:3001
JWT_SECRET=your-dev-secret
OTP_DEV_MODE=true
MONGODB_URI=mongodb+srv://...   # optional — see note below
```

### 3. Run locally

**Terminal 1 — API**

```bash
cd backend
npm run dev
```

API: http://localhost:4000  
Health: http://localhost:4000/health

**Terminal 2 — Frontend (builds PWAs automatically)**

```bash
npm run dev
```

Site: http://localhost:3000 (or 3001)

### MongoDB note

If Atlas is unreachable, the backend automatically falls back to an **in-memory MongoDB** in development and auto-seeds demo accounts. Data resets when the server stops.

To use a real database:

```bash
cd backend
npm run seed
```

---

## Demo login accounts

After seeding (or in-memory auto-seed), password for all accounts is **`password123`**:

| Role | Identifier |
|------|------------|
| Citizen | `+919876543210` |
| Ambulance | `+919876543220` |
| Hospital | `emergency@kemhospital.dev` |

On the sign-in page, use the quick-login links after running seed.

---

## Scripts

### Root

| Command | Description |
|---------|-------------|
| `npm run dev` | Build PWAs if missing, start Next.js dev server |
| `npm run build` | Build PWAs + production Next.js bundle |
| `npm run build:pwas` | Build citizen & ambulance apps into `public/` |
| `npm run lint` | ESLint |

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with file watch |
| `npm start` | Production start |
| `npm run seed` | Reset and seed MongoDB |

---

## API overview

Base URL: `http://localhost:4000/api`

| Route | Description |
|-------|-------------|
| `GET /health` | Health check |
| `POST /api/auth/login` | Email/phone login |
| `POST /api/auth/register/citizen` | Citizen signup (OTP) |
| `POST /api/auth/register/ambulance` | Ambulance signup (OTP) |
| `POST /api/auth/register/hospital` | Hospital registration |
| `POST /api/ai/first-aid` | Claude streaming first-aid |
| `GET /api/hospital/me/cases` | Hospital incoming cases |

Real-time events via **Socket.io** on the same host as the API (`NEXT_PUBLIC_SOCKET_URL`).

---

## Deployment

| Service | Role |
|---------|------|
| **Vercel** | Next.js site + embedded PWAs (`vercel.json`, `npm run build:vercel`) |
| **Railway / Render** | Backend API (`backend/Procfile`, `railway.json`, `render.yaml`) |
| **MongoDB Atlas** | Production database |

Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` in Vercel to your deployed API URL.

---

## Features by role

### Citizen
- Hold-to-activate SOS (3 seconds)
- Live ambulance ETA and tracking
- AI first-aid step guidance
- Digital Medical ID (offline-capable PWA)

### Ambulance
- On-duty standby and dispatch alerts
- Turn-by-turn map (OpenStreetMap)
- Patient vitals capture en route
- Status updates (en route → pickup → hospital)

### Hospital
- Operations overview with live metrics
- Incoming cases table with timeline
- Resource management (ICU beds, trauma bays, blood inventory)
- Critical alert banner

---

## License

Private — hackathon / portfolio project.

---

## Repository

https://github.com/sudipseth416-cmyk/RapidAid
