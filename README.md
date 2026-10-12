# 🪷 SharodUTSAV (শারদোৎসব)
### Full-Stack Real-Time Durga Puja Intelligence & Companion Platform
*(Engineered for 2nd Year CSE B.Tech Capstone & Hackathon Distinction)*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.109-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![SQLAlchemy](https://img.shields.io/badge/ORM-SQLAlchemy%202.0-red?logo=sqlite)](https://www.sqlalchemy.org/)
[![PWA](https://img.shields.io/badge/PWA-Offline--First%20Workbox-blueviolet?logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Docker](https://img.shields.io/badge/Container-Docker%20Compose-2496ED?logo=docker)](https://www.docker.com/)

---

## 📌 Problem Statement & Motivation
During Kolkata Durga Puja (celebrated by over 15 million people and recognized as **UNESCO Intangible Cultural Heritage**), attendees face critical bottlenecks:
1. **Network Blackouts**: 4G/5G mobile connectivity routinely collapses in dense crowds of 80,000+ people around mega-pandals. Traditional online-only apps crash.
2. **No Source of Truth for Queues**: Outdated static guides show generic 30-minute estimates when actual lines exceed 2.5 hours.
3. **Complex Barricade Mazes**: Pandal gates have segregated lanes for VIP Pass holders, General Visitors, and Wheelchair/Senior ramps, confusing attendees.
4. **Safety & Police Partitioning**: Citizens need instant access to **Dial 100**, women helplines, and missing-friend regrouping beacons.

**SharodUTSAV** resolves these bottlenecks via a typed, asynchronous REST API, relational ACID schemas, crowdsourced time-decay queue estimation, dynamic Mermaid.js barricade flowcharts, Leaflet heatmaps, and an offline-resilient PWA service worker.

---

## 🏗️ Architecture & Technology Stack

```
   ┌────────────────────────────────────────────────────────┐
   │                   CLIENT TIER (PWA)                    │
   │   React 18 (Vite) + Tailwind CSS + Lucide Icons        │
   │   Leaflet.js (Map & Heatmap) + Mermaid.js (Flowcharts) │
   │   Vite-PWA Workbox Service Worker (Offline Cache)      │
   │   Web Audio API (1980s Vintage Murphy Radio Simulator) │
   └───────────────────────────┬────────────────────────────┘
                               │ JSON REST API
   ┌───────────────────────────▼────────────────────────────┐
   │                 BACKEND TIER (FastAPI)                 │
   │   FastAPI (Async Python 3.11+, Uvicorn)                │
   │   Pydantic V2 (Input Validation & Serialization)       │
   │   Interactive Swagger Documentation (/docs)            │
   └───────────────────────────┬────────────────────────────┘
                               │ SQLAlchemy 2.0 ORM
   ┌───────────────────────────▼────────────────────────────┐
   │                    DATABASE TIER                       │
   │   SQLite (Zero-config Dev) ➔ PostgreSQL (Prod/Docker) │
   │   3NF Relational Schema with Foreign Key Constraints  │
   └────────────────────────────────────────────────────────┘
```

---

## 🌟 Core Modules & Engineering Features

### 1. Pandal Gate Navigator & Barricade Flowcharts
- **Dynamic Mermaid.js Diagrams**: Interactive flowcharts visualizing gate holding zones (`Entry Gate` ➔ `Barricade Zig-Zag` ➔ `Metal Detector Post` ➔ `Sanctum Mandap` ➔ `Exit Gate`).
- **Crowdsourced Queue Decay Engine**:
  $$\text{Wait}_{\text{new}} = 0.7 \times \text{Wait}_{\text{reported}} + 0.3 \times \text{Wait}_{\text{historical}}$$
- Freshness timestamp display (*"Verified by 18 visitors • Updated 4m ago"*).

### 2. Live Crowd Heatmap & Radar
- Full-screen Leaflet.js interactive canvas overlaying Kolkata.
- Color-coded wait zones: Green ($<30\text{m}$), Amber ($30-60\text{m}$), Red ($>60\text{m}$).
- Real-time GPS beacon positioning.

### 3. Parikrama Route Optimizer
- Greedy nearest-neighbor clustering algorithm with time-budgeting and non-backtracking constraints.
- Generates turn-by-turn schedules with arrival times, viewing buffer, metro gate instructions, and walking distances.

### 4. Transit Hub & Police Parking Directory
- Detailed exit gate guide for Blue and Green Line Metro stations.
- Designated Kolkata Police parking lots (vehicle capacity, hourly tariff, distance to mandap).
- WBTC All-Night special bus corridors.

### 5. Bondhu Group Midpoint & Safe Emergency SOS
- **Midpoint Engine**: Calculates geometric centroid among separated friends and resolves to the lowest average travel-time Metro interchange (e.g. Central / Esplanade).
- **Emergency Safety Beacon**: High-contrast red strobe screen for night crowd signaling + 1-tap **Dial 100** / Kolkata Police Bondhu App link.

### 6. 1980s Vintage Murphy Radio Simulator
- Wooden retro chassis with glowing vacuum tubes.
- Web Audio API white-noise bandpass filter physics.
- Tuned into Birendra Krishna Bhadra's iconic *Mahisasuramardini* broadcast (93.6 MHz).

### 7. Bilingual Bengali (বাংলা) & English Engine
- Complete translation dictionary covering all civic, safety, and cultural nomenclature.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### 1. Start Backend (FastAPI)
```bash
# In project root
python -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```
- API Health Check: `http://localhost:8000/api/health`
- Interactive Swagger UI: `http://localhost:8000/docs`

### 2. Start Frontend (React Vite PWA)
```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Run with Docker Compose
```bash
docker compose up --build
```

---

## 📡 API Endpoints Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/pandals/` | GET | List pandals with zone, search, wait-time, and heritage filters |
| `/api/pandals/{id}` | GET | Detailed pandal view with gate barricades & recent reports |
| `/api/pandals/{id}/report-queue` | POST | Submit crowdsourced wait-time report |
| `/api/pandals/{id}/upvote` | POST | Upvote a pandal's crowd verification score |
| `/api/transit/stations` | GET | Metro exit gate guides and nearby pandal connections |
| `/api/transit/parking` | GET | Kolkata Police designated parking lots |
| `/api/transit/night-buses` | GET | All-night special WBTC bus corridors |
| `/api/itinerary/plan` | POST | Algorithmic Parikrama route optimizer |
| `/api/amenities/` | GET | KMC Swachh washrooms & late-night street food radar |
| `/api/groups/midpoint` | POST | Centroid meeting hub for separated friends |
| `/api/traffic/alerts` | GET | Kolkata Police road diversions & one-way rules |
| `/api/traffic/surge-matrix` | GET | Indicative festive surge multiplier matrix |
| `/api/heritage/radio-channels` | GET | Vintage radio frequencies & Mahalaya audio |
| `/api/heritage/insta-captions` | GET | Curated Bengali & Banglish photo captions |

---

## 🎓 Academic Viva & CSE Portfolio Talking Points
- **Typing & Validation**: Demonstrated using Python Pydantic V2 and TypeScript/JSDoc contracts over unvalidated JavaScript backends.
- **ACID Relational Design**: 3NF schema in SQLAlchemy with foreign keys and cascade rules.
- **Offline Architecture**: Service Worker caching strategies (`NetworkFirst` for live APIs, `CacheFirst` for static assets) ensuring zero crash in dead zones.
- **Audio Synthesis**: Native Web Audio API buffer node for analog white noise static instead of pre-recorded audio loops.
