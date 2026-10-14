# MÁV Vonatinfó (Next.js / Vercel)

A `mav-track` (NestJS) és `mav-track-client` (Vite + React) egyesítése egyetlen Next.js (App Router) projektben. Adatbázis nincs.

- `src/client` – a régi React kliens, változatlan kinézettel (böngészőben renderel, Leaflet miatt)
- `src/app/api/vehicles`, `src/app/api/trips/[id]` – a régi NestJS végpontok Route Handlerként
- `src/server` – EMMA kliens, jármű/járat szolgáltatások

## Vercel telepítés

1. Töltsd fel a mappát egy git repóba (GitHub/GitLab/Bitbucket).
2. Vercel → Add New → Project → importáld a repót. Ha a repó gyökerében több mappa van, a Root Directory legyen `mav-track-new`.
3. A Framework Preset automatikusan Next.js lesz, környezeti változót nem kell megadni.
4. Deploy.

## Helyi futtatás

```
npm install
npm run dev
```

## Különbségek a régi verzióhoz képest

- Nincs adatbázis: a járat útvonalát (polyline) minden járat-lekérésnél az EMMA-tól kapjuk (az 1 perces memória-cache megmaradt).
- A jármű- és járat-cache a szerverless példány memóriájában él (a 3 / 1 perces TTL megmaradt), hideg indításnál újratöltődik.
- Az idő-számítás (menetrendi nap, késés) explicit `Europe/Budapest` időzónát használ, mert Vercelen a szerver UTC-ben fut.
- Nincs CORS / `ALLOWED_ORIGINS` / `VITE_BACKEND_URL`: a kliens és az API ugyanazon az origin-en van.
