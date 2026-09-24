# Surplus-to-Shelter API

Standalone TypeScript/Express backend for the existing React frontend. It runs beside the frontend in `server/`; it does not require frontend source changes. All API payloads use the existing frontend field names and responses use `{ data: ... }`.

## Setup

1. Install Node.js LTS.
2. Copy `.env.example` to `.env`. Set `MONGODB_URI` to your MongoDB Atlas connection string; add the app host to Atlas Network Access and use a database user. `CLIENT_ORIGIN` defaults to `http://localhost:5173`.
3. Run `npm install`.
4. Run `npm run seed` to create 6 donations, 6 shelter requests, 5 volunteers, an active rescue and sample notifications.
5. Run `npm run dev`. With `PORT=3000` in `.env`, the API listens on port 3000 by default. Run `npm run build` for a strict TypeScript check and production build.

## Endpoints

All routes are under `/api`. Lists return `{ data: [...] }`; successful mutations and single-resource reads return `{ data: ... }`; validation errors return HTTP 400 and `{ error: ... }`.

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/health` | API and MongoDB connection state |
| POST | `/donations` | Create a donation (server sets id, status and createdAt) |
| GET | `/donations` | List donations; filter by `status`, `category`, `dietary` |
| GET | `/donations/:id` | Get one donation |
| POST | `/requests` | Create a shelter request (server sets id, receivedMeals and status) |
| GET | `/requests` | List requests; filter by `urgency`, `status` |
| GET | `/volunteers` | List volunteers; filter by `status` |
| GET | `/match/:donationId` | Get the top three ranked shelter candidates |
| POST | `/match/dispatch` | Dispatch to a shelter and selected/nearest available volunteer |
| GET | `/missions/active` | Get the most recent active mission |
| GET | `/missions/:id` | Get one mission |
| PATCH | `/missions/:id/status` | Append a timeline event and update related records |
| PATCH | `/missions/:id/location` | Update simulated volunteer position and ETA |
| GET | `/notifications` | List notifications |
| PATCH | `/notifications/:id/read` | Mark one notification read |
| PATCH | `/notifications/read-all` | Mark every notification read |
| GET | `/analytics/overview` | Calculate dashboard KPIs from stored records |

The match engine uses haversine distance, meal-deficit fit, urgency/deadline, and dietary compatibility. Jain requests only match Jain donations. Estimates for food value and CO₂ use editable per-meal assumptions in the analytics controller because no value or emissions fields exist in the frontend model.
