# The Locals Kathmandu — Website Starter

A full-stack starter built from the supplied project overview. It includes a modern responsive public website, event content, a support/donation area, contact submissions, and a lightweight admin dashboard.

## Included pages
- Home
- Our Events
- About Us
- Our Team
- Contact
- Support Us
- Admin Dashboard

## Stack
- Frontend: React + Vite + React Router + Lucide icons
- Backend: Node.js + Express
- Storage for the starter: JSON file (`server/data/content.json`)

The JSON storage keeps the demo very easy to run. For production, replace it with Supabase, Neon/Postgres, Firebase, Cloudflare D1, or another managed database.

## Run locally

```bash
cd the-locals-website
npm install
npm run install:all
npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:4000
Admin: http://localhost:5173/admin

## Build frontend

```bash
npm run build
```

## Admin capabilities in this starter
- Add, edit, and remove events
- Edit donation title/message/account information
- Set donation QR image URL
- View contact form submissions

## Before production launch
1. Replace the placeholder TL logo with the official The Locals logo.
2. Replace placeholder event artwork and team cards with official photography.
3. Add admin authentication before exposing `/admin` publicly.
4. Move JSON persistence to a managed production database.
5. Configure the frontend API base URL with an environment variable.
6. Add official donation QR and verified payment details.
7. Add analytics, sitemap, metadata, OpenGraph imagery, and final SEO copy.

## Deployment direction
The frontend is suitable for Vercel or Cloudflare Pages. The API can be adapted to Vercel Functions, Cloudflare Workers, Render, Railway, or another Node-compatible platform. For a true Vercel/Cloudflare production architecture, use a managed DB or Cloudflare D1 rather than local JSON storage.
