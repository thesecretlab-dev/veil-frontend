# VEIL Frontend

**[veil.markets](https://veil.markets)** â€” Privacy-native prediction markets on Avalanche.

Award-winning UI with film grain, magnetic components, character reveal animations, noise reveals, parallax headings, and a 3D R3F tetrahedron hero. 30+ pages across markets, governance, agents, docs, and ecosystem.

## Features

- **Live Polymarket Feed** â€” Real market data with 10s polling, CLOB order book depth
- **Dual Market Engine** â€” Route through Polymarket (0.03% fee) or VEIL-native markets (earn VEIL)
- **AI Oracle** â€” Grok 4.2 resolves social/political/non-financial markets
- **Agent Portal** â€” ANIMA agent lifecycle dashboard, ecosystem directory
- **Governance** â€” veVEIL voting, proposal creation, forum integration
- **Investor Deck** â€” Interactive pitch deck with live metrics

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D**: React Three Fiber / Three.js
- **Animation**: Framer Motion, GSAP
- **Data**: Polymarket CLOB + Gamma API

## Routes (Selection)

| Route | Page |
|-------|------|
| `/` | Landing â€” exploreveil with 3D hero |
| `/app` | Market dashboard with live Polymarket feeds |
| `/app/market/[id]` | Market detail â€” prices, order book, payout calculator |
| `/app/agents` | ANIMA agent fleet monitoring |
| `/app/ecosystem` | Portal directory with 3D geometric icons |
| `/gov` | Governance hub â€” proposals, voting, forum |
| `/docs` | Protocol documentation |
| `/investor-deck` | Interactive investor presentation |

## Local Development

```bash
npm install
npm run dev
```

Runs on webpack (not Turbopack) for local stability.

### Environment

```env
# Optional â€” defaults to public Polymarket endpoints
POLYMARKET_GAMMA_API=https://gamma-api.polymarket.com
POLYMARKET_CLOB_API=https://clob.polymarket.com
```

## API Routes

| Endpoint | Description |
|----------|-------------|
| `GET /api/markets` | Aggregated market listings |
| `GET /api/markets/:id` | Market detail + metadata |
| `GET /api/markets/:id/latest-trade` | Most recent trade data |

## Brand System

Shared brand components in `components/brand.tsx`:

- `VeilHeader` / `VeilFooter` â€” Consistent nav + TSL branding
- `FilmGrain` â€” Cinematic grain overlay
- `MagneticComponent` â€” Mouse-tracking magnetic interaction
- `CharReveal` / `NoiseReveal` â€” Text reveal animations

## Links

- **Live**: [veil.markets](https://veil.markets)
- **Ecosystem**: [thesecretlab.app](https://thesecretlab.app)
- **Org**: [github.com/thesecretlab-dev](https://github.com/thesecretlab-dev)

---

*Markets for machines. Interfaces for humans.*
