# FootballTicketClub

Independent **comparison marketplace** for football (and related live event) tickets. Compare partner prices and seating options, then continue to the partner site to purchase. **FootballTicketClub does not sell tickets** and does not process ticket payments.

## Stack

- React 19 + TypeScript
- Vite 8
- React Router 7
- Tailwind CSS 4
- GSAP (+ `@gsap/react`), Lenis
- Radix UI primitives, Embla Carousel, Zustand, Lucide icons
- Oxlint

## Setup

```bash
npm install
npm run dev      # local development
npm run build   # typecheck + production build
npm run preview # preview the production build
npm run lint    # oxlint
```

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/football/:competition` | Competition (e.g. `/football/premier-league`) |
| `/match/:slug` | Match detail (partner table or stadium map) |
| `*` | Redirects to `/` |

## Folder structure

```
src/
  assets/           # Static assets
  components/
    competition/    # Competition page sections
    home/           # Home page sections
    layout/         # Navbar, Footer, Layout, mobile nav
    match/          # Match page sections (partners, stadium map)
    modal/          # Newsletter modal
    motion/         # Page loader, cursor, motion root
    seo/            # Document title/meta + JSON-LD helpers
    ui/             # Shared UI primitives
  data/             # Mock competitions, matches, FAQs, etc.
  hooks/            # Lenis, scroll, motion hooks
  lib/              # utils, format, gsap, motion tokens
  pages/            # Route-level pages
  store/            # Zustand stores
  App.tsx           # Router + lazy page imports
  index.css         # Tailwind + design tokens (@theme)
  main.tsx
```

## Design tokens & motion

**Colors, typography, radii, shadows, container spacing** live in `src/index.css` under `@theme`. Change CSS variables there (e.g. `--color-brand`, `--font-sans`, `--container-max`) to retune the look site-wide.

**Animation timings** (GSAP durations, reveal stagger, magnetic strength, Ken Burns, cursor lag) live in `src/lib/motion.ts` as the `MOTION` object. Prefer editing that file over hard-coding durations in components.

## Crests & logos

Club crests, competition marks, and partner wordmarks in the UI are **placeholders** (initials, colors, generic shapes). They are not official trademarks and should be replaced with licensed assets before any real-world launch.
