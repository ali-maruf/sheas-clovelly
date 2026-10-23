# Shea's Clovelly: website front end

A scroll-driven, single-page front end for **Shea's Clovelly**, an Irish bar & restaurant at 211 & 213 Clovelly Road, Clovelly NSW 2031.

The signature idea is **The Perfect Pour**: sections settle the way a pint of stout settles. The dark body rises, then the cream head forms.

Stack: Vite, React 19, TypeScript, Tailwind CSS v4, React Three Fiber + drei, GSAP ScrollTrigger and Lenis. It is front end only, with no backend.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static output in dist/
npm run preview
```

## Placeholders to fill

Nothing below has been made up. Until real content arrives, each slot shows as a clearly marked placeholder. To hide unfilled slots in production, set `VITE_HIDE_PLACEHOLDERS=true`.

| Placeholder | Where | Notes |
| --- | --- | --- |
| **Logo** `/public/assets/logo-sheas.png` | header, hero, preloader, gift card, footer | The ORIGINAL white script logo on a transparent background, used unchanged. Until the file exists, a neutral "SHEA'S" text label stands in. |
| `{{WEEKLY_EVENTS}}` | `src/data/events.json` | Add entries to each day's `events` array, e.g. `{ "title": "Live music", "time": "7pm", "kind": "music" }`. An empty array shows "What's on: to be announced". |
| `{{GOOGLE_RATING}}` | `src/data/reviews.json`, `src/data/business.json` | e.g. `"4.6"` |
| `{{REVIEW_1}}` … `{{REVIEW_5}}` | `src/data/reviews.json` | Real review text, plus `author`. |
| Gallery photos | `/public/assets/gallery/` | Use the filenames listed in `src/data/gallery.json`: `food.jpg`, `terrace.jpg`, `live-music.jpg`, `match-day.jpg`, `bar.jpg`. A styled panel shows until each photo is added. |
| Menu highlight copy | `src/data/menu.json` | Names only for now. Add descriptions or prices only from the real menu. |

## Structure

```
src/
  styles/tokens.css          colour, type and motion tokens
  data/                      business, hours, events, menu, reviews, gallery (JSON)
  lib/
    hours.ts                 live open/closed status (Australia/Sydney)
    analytics.ts             data-cta click tracking stub, pushes to window.dataLayer
    scroll.ts                Lenis + ScrollTrigger, scroll-scrubbed progress hook
    motion.ts                reduced-motion / low-power detection, deferred start
  three/                     WebGL scenes (lazy-loaded chunks)
    PintScene.tsx            the pour: glass, liquid shader (surge → settle → head), tap, shamrock
    PubScene.tsx             isometric cutaway that assembles, then lights up
    PassScene.tsx            plates slide onto the pass, with steam
  components/
    Header.tsx, MobileBar.tsx
    ui/                      Logo, Shamrock seal, status chip + BookCta, SceneGate, Reveal
    chapters/                one component per chapter, 0–9 + Footer
```

## Behaviour notes

- **Bookings are by phone.** Every "Book a Table" is a `tel:` link. On Sundays (walk-ins only), booking prompts change to "Walk-ins today".
- **Live status** updates every 30 seconds using Sydney time ("Open now · until midnight" / "Closed · opens 8am tomorrow"). Today's hours are highlighted in Visit and on the beer mats.
- **Analytics:** every conversion element has a `data-cta` attribute. `initCtaTracking()` sends clicks to `track()` in `src/lib/analytics.ts`. Connect your provider there.
- **Performance:** three.js is code-split and only loads when a scene is near the viewport. The hero waits for the first interaction, and canvases pause when off-screen. A baked SVG still is the poster and the fallback.
- **Reduced motion / low power** (reduced-motion preference, Save-Data, <4 cores, <4 GB RAM, or no WebGL): no WebGL and no smooth scroll. Stills are shown instead, and the gallery becomes a native horizontal scroller. Use `?3d=1` or `?3d=0` to force either mode.
- **SEO:** the title and meta tags, plus a `BarOrPub`/`Restaurant` JSON-LD block with address, phone and opening hours, are in `index.html`.

Dev-only helpers: `?p=0.5` freezes the pour at a given progress, and `?smooth=0` turns off Lenis.

## Deploy

This is a static Vite build (`dist/`). Vercel detects it automatically, so no config is needed.
