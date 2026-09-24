# Surplus-to-Shelter API

Node.js 20+, Express 4 and MongoDB Atlas backend for the AmiHacks food rescue demo. Safety windows are demo defaults, not food-safety advice; validate against FSSAI and local guidance before real use.

## Setup

```sh
npm i
npm run dev
npm test
```

Before starting, copy `.env.example` to `.env` and set `MONGODB_URI` to the URI from Atlas Connect > Drivers. Use a database user and allow the app host in Atlas Network Access. Set `ADMIN_EMAIL` and a private 12+ character `ADMIN_PASSWORD` to bootstrap the administrator. Before intentionally running `npm run seed`, set `SEED_ALLOW_DESTRUCTIVE=true` and a private 12+ character `SEED_DEMO_PASSWORD` in `.env`; the seed removes and replaces demo collections. Remove the destructive flag afterward. Demo seeding is blocked in production.

## Architecture

```text
Express routes -> services/repositories -> MongoDB Atlas
       |                 |
       +-> domain (food clock, matching, routing, impact)
       +-> SSE stream
Scheduler -> deadline checks -> audit events -> SSE
```

The domain code uses plain JavaScript. MongoDB collections are accessed through repository modules under `src/db/repos`.

## API walkthrough

1. After intentionally seeding, log in with a demo email and the configured `SEED_DEMO_PASSWORD`; otherwise register a donor or use the bootstrap administrator credentials.
2. Post: `curl -s localhost:3000/api/donations -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"item_text":"Dal chawal","qty_plates":40,"food_type":"cooked_veg","pickup_lat":17.38,"pickup_lng":78.48}'`.
3. Login as a shelter, list `/api/offers`, then `POST /api/offers/:id/accept`.
4. Login as a driver, list `/api/tasks/available`, claim a task, and submit the task OTPs to `/pickup` and `/deliver`.

## Three-minute demo

Run seed and start the API; sign in as a donor, post a cooked donation, then set demo weather to hot and speed to 60 using `/api/sim/config`. Show the donation clock and offer, decline an offer as its shelter, and show a subsequent offer or the open retry state. Capacity split and simulated clock controls are planned for the complete demo flow.

## Notes

`GET /api/stream` sends server-sent events. CORS allows localhost frontends. Food clocks exclude configurable 30-minute serve buffer and 10-minute safety margin. Never use this demo in production without reviewing safety, privacy, auth, and operating requirements.
