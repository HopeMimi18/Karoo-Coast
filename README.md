# Karoo & Coast — Journey Weaver

Karoo & Coast is a digital rail-tourism journey companion built for the Geekulcha 2027 Train Tourism Hackathon brief: creatively geomap, animate and localise the rail journey from Pretoria to Cape Town while promoting South African attractions, culture and stories along the route.

## Product idea

**Your train journey becomes part of the destination.**

The product combines the information hierarchy of modern railway and airport passenger systems with a South African tourism layer:

- **MOVE** — journey progress, next station, ETA-style guidance and optional GPS route matching.
- **DISCOVER** — route-aware `WindowCast™` alerts reveal landscapes, heritage and stories at the moment they matter.
- **EXPERIENCE** — `Station Mode` links rail stops to attractions, local stories, passport stamps, quizzes and future tourism-partner actions.

## What makes this version different

### Journey Intelligence

The live journey screen now has an airport-style status panel showing route progress, current area, next actual station, estimated arrival time and remaining distance. The interface explicitly labels **DEMO MODE** versus **GPS MODE** so the prototype does not pretend simulated journey data is live railway operations.

### WindowCast™

A route-aware experience layer triggers selected moments as the train approaches them. It can tell a traveller to look outside, look right or look up when the underlying researched story supports that guidance. Current prototype moments include the Witwatersrand, Vaal, !Gariep/Orange River, Karoo night sky, Three Sisters, Hex River tunnels/valley and the Table Mountain reveal.

### Station Mode

Every stopping station can now expose a tourism-discovery panel. Instead of ending at “you reached Kimberley”, the product can continue into “what should I discover, eat or book here?”. Major stops include curated real restaurants plus hotels, guest houses or B&Bs, with direct Maps searches for current directions and operating details. Remote railway sidings are labelled honestly when a useful nearby listing could not be verified. Production availability and booking should ultimately come from verified tourism-partner feeds.

### GPS route matching

The “I'm on the train” button uses browser geolocation only after the user chooses it. The prototype snaps the device to the nearest sampled route point when the device is sufficiently close to the mapped corridor. This is a positioning prototype, not live train tracking.

### Offline-friendly shell

A lightweight service worker caches visited same-origin app resources so previously loaded screens and story content can remain available more gracefully when connectivity drops. External map tiles and live Supabase data still require connectivity unless a future production offline-map strategy is added.

## Pretoria route correction

The hackathon brief starts in Pretoria, so this version starts at **Pretoria Station (km 0)**.

- The **Pretoria → Johannesburg Park** gateway is represented station-to-station using public Gautrain station coordinates and is visually shown as a schematic segment.
- From **Johannesburg Park Station → Cape Town**, the detailed Cape main-line geometry continues to use the existing OpenStreetMap relation 950176 dataset.
- Existing researched stop distances south of Johannesburg are shifted by the Pretoria gateway distance so the whole experience is measured from Pretoria.

This distinction is intentionally visible in the product rather than claiming the entire corridor has the same geometry precision.

## Research inspiration

The product direction was influenced by passenger-experience patterns used internationally, while keeping South African tourism as the core purpose:

- **Japan / JR East** — station collecting and digital stamp culture.
- **Norway** — journey-synchronised landscape and audio storytelling.
- **Switzerland / SBB** — personal journey companion information hierarchy.
- **Germany / DB** — digital travel companion and contextual journey stages.
- **France / SNCF** — proactive passenger information and journey updates.
- **Schiphol Airport** — location-aware passenger guidance and nearby points of interest.
- **Heathrow Airport** — end-to-end passenger journey guidance and contextual recommendations.

The goal is not to copy any one system. Karoo & Coast combines useful patterns around South African landscapes, languages, communities, local tourism and railway heritage.

## Core routes

- `/` — product home and value proposition.
- `/journey` — animated map, Journey Intelligence, WindowCast, GPS mode and Station Mode.
- `/guide` — researched route guide.
- `/plan` — itinerary planning.
- `/passport` — digital rail passport and leg badges.
- `/quiz` — route challenge.
- `/stories` — community stories.
- `/threads` — diamonds, water, names and conflict storylines.
- `/about` — implementation, accuracy notes and global research inspiration.

## Technology

- React 19
- TypeScript
- TanStack Start / Router
- Vite
- Tailwind CSS
- Leaflet
- OpenStreetMap / CARTO basemap
- Supabase
- Browser Geolocation API
- Web Speech API
- Progressive Web App service worker

## Local development

You need Node.js and npm.

```sh
npm install
npm run dev
```

Production build:

```sh
npm run build
```

## Accuracy and production notes

This is a hackathon prototype. Journey times are approximate, the Pretoria gateway is schematic, GPS mode is route matching rather than operator-grade live train tracking, and tourism service/facility data needs verification before production use. Real-time train status, platform data, safety notices, accessibility status, opening hours and booking actions should only be added from authoritative operators or verified tourism partners.
