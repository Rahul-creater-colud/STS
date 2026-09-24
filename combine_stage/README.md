# Surplus-to-Shelter

## Setup

1. `npm run install:all` — installs the root runner and both app dependencies.
2. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` to your MongoDB Atlas URI. Allow your IP address in Atlas Network Access. The API defaults to port 3000 and the frontend to port 5173.
3. Only for an empty/demo database, set `SEED_ALLOW_DESTRUCTIVE=true` in `server/.env`, then run `npm run seed`. The seed command replaces demo collections; remove the flag afterward.
4. `npm run dev` — starts backend on :3000 and frontend on :5173 together.

Frontend: `frontend/` (Vite + React + TypeScript)

Backend: `server/` (Node.js + Express + MongoDB Atlas)

Register donor, NGO, or volunteer accounts in the app. To create the first administrator, set `ADMIN_EMAIL` and a 12+ character `ADMIN_PASSWORD` in `server/.env` before starting the backend. Admin accounts cannot be created through public registration.

The frontend authenticates with the API and loads donations, requests, volunteers, missions, notifications, and analytics from `frontend/src/services/api.ts`. `frontend/src/data/mockData.ts` remains available for demo presentation defaults.
