# factu.guide

Static SEO site + free tools for Spanish autónomos navigating VeriFactu (AEAT)
billing compliance. Monetized via Google AdSense, funnels traffic to the
[`verifactu-mcp`](https://github.com/CHANGEME/verifactu-mcp) open-source MCP
server.

Built with **Astro 6** (Content Layer + Preact islands), **Tailwind v4**
(CSS-first `@theme` tokens), **MDX** for articles, **TypeScript strict**.
Deployed to **Cloudflare Pages**.

- **Spec:** `../verifactu-mcp/docs/superpowers/specs/2026-05-21-factu-guide-design.md`
- **Plan:** `../verifactu-mcp/docs/superpowers/plans/2026-05-21-factu-guide.md`

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Astro dev server on port 4321 |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Biome lint + format check |
| `npm run lint:fix` | Biome auto-fix |
| `npm run format` | Biome format only |
| `npm test` | Vitest unit tests (lib/) |
| `npm run test:cov` | Unit tests with coverage gate (100% lib/) |
| `npm run e2e` | Playwright smoke + axe a11y (requires `npx playwright install` first) |
| `npm run lhci` | Lighthouse CI against the built `dist/` |
| `npx astro check` | Type check + content schema validation |

## Stack

- **Astro 6.3** — static-first, Content Layer API, MDX
- **Preact 10** — interactive islands (NIF validator, IVA calculator, XML generator)
- **Tailwind CSS 4** — Vite plugin, CSS-first `@theme { ... }` tokens
- **Biome 1.9** — lint + format (`.astro` files excluded — Astro provides its own checker)
- **Vitest 4** — unit tests with v8 coverage, 100% threshold on `src/lib/`
- **Playwright** — E2E smoke + axe-core a11y (nightly in CI)
- **Lighthouse CI** — perf/SEO/a11y budgets (nightly in CI)
- **Cloudflare Pages** — hosting, free tier, custom domain

## Architecture

```
src/
├── content.config.ts            # Astro Content Layer: blog + authors collections
├── content/
│   ├── authors/                 # 1 author (Adrián Sánchez)
│   └── blog/                    # Articles by pillar: cumplimiento/, fiscalidad/, casos/
├── lib/                         # Pure logic (tested at 100% coverage)
│   ├── nif.ts                   # DNI/NIE/CIF validator with AEAT control letters
│   ├── iva.ts                   # IVA + IRPF math, banker's rounding, formatEUR (es-ES)
│   ├── verifactu-xml.ts         # Build canonical VeriFactu XML + SHA-256 hash
│   └── seo.ts                   # JSON-LD helpers: Article / WebSite / WebApplication
├── components/
│   ├── ads/                     # AdSlot wrappers (anti-CLS), AdSense loader
│   ├── cta/                     # MCP funnel: McpCallout, Inline, HeroBanner
│   ├── editorial/               # Article anatomy: TOC, AuthorCard, SourcesList, ...
│   ├── gdpr/                    # CmpScripts (Funding Choices) + Ga4Script (Consent Mode v2)
│   ├── layout/                  # Container, Header, Footer
│   ├── seo/                     # JsonLd
│   ├── tools/                   # 3 Preact islands + ToolShell wrapper
│   └── ui/                      # Button, Card, Input, Badge, Alert
├── layouts/
│   ├── BaseLayout.astro         # Modo B (fintech sans) — home, tools, mcp, legal
│   └── ArticleLayout.astro      # Modo A (editorial serif) — /guias/*
├── pages/
│   ├── index.astro              # Home: hero + tools + latest guides + MCP banner
│   ├── herramientas/            # Tools hub + 3 tool pages
│   ├── guias/                   # Guides hub + [pillar]/index + [pillar]/[slug]
│   ├── mcp/index.astro          # verifactu-mcp landing
│   ├── sobre.astro              # E-E-A-T author page
│   ├── contacto.astro           # mailto: contact
│   ├── legal/                   # aviso-legal, privacidad, cookies
│   └── rss.xml.ts               # RSS feed
└── styles/global.css            # Tailwind + @theme tokens + Fontsource imports
```

## Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
|---|---|
| `PUBLIC_ADSENSE_CLIENT` | AdSense publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`). Leave empty in dev to render ad placeholders. |
| `PUBLIC_GA4_ID` | Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`). Required for analytics, gated by consent. |
| `PUBLIC_SITE_URL` | Canonical site URL. Defaults to `https://factu.guide`. |

`astro.config.mjs` hardcodes `site: 'https://factu.guide'` for sitemap/RSS canonical URLs.

## Deployment

Push to `main` → Cloudflare Pages auto-deploy.

CF Pages build settings:
- **Framework preset:** Astro
- **Build command:** `npm run build`
- **Build output:** `dist`
- **Node version:** 22 (set `NODE_VERSION=22` env var in CF Pages settings)
- **Environment variables:** see table above

## CHANGEME placeholders

Before publishing, fill these in:

- `src/content/authors/adrian-sanchez.json` — `sameAs` URLs (GitHub, LinkedIn)
- `src/lib/seo.ts` — `PERSON.sameAs` (same URLs)
- `src/pages/mcp/index.astro` — `MCP_GH` constant (real GitHub URL)
- `src/components/cta/McpCallout.astro` — if you add a direct GitHub link
- `src/pages/legal/aviso-legal.astro` — titular name, NIF, address, jurisdiction
- `public/ads.txt` — publisher ID after AdSense approval

## License

MIT (code). Articles are CC BY 4.0 (TBD — declare in footer when published).
