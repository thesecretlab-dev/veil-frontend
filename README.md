# VEIL Frontend

Frontend application for VEIL web experience.

## Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Local run
```powershell
npm install
npm run dev
```

`npm run dev` is configured to run with webpack (not Turbopack) for local stability.

## Polymarket Bridge
Frontend market routes now read through local Next API endpoints backed by Polymarket:

- `GET /api/markets`
- `GET /api/markets/:id`
- `GET /api/markets/:id/latest-trade`

For Polygon-native markets, the trade UI labels them as `Polygon native` and applies a `0.03%` routing fee when routing liquidity through VEIL.

To override upstream API hosts, set:

- `POLYMARKET_GAMMA_API` (default `https://gamma-api.polymarket.com`)
- `POLYMARKET_CLOB_API` (default `https://clob.polymarket.com`)
- `POLYMARKET_DATA_API` (default `https://data-api.polymarket.com`)
- `POLYMARKET_MARKETS_LIMIT` (default `80`)

Example:

```dotenv
POLYMARKET_GAMMA_API=https://gamma-api.polymarket.com
POLYMARKET_CLOB_API=https://clob.polymarket.com
POLYMARKET_DATA_API=https://data-api.polymarket.com
POLYMARKET_MARKETS_LIMIT=80
```

## VEIL Order Routing
To return VEIL execution tx hashes from accepted orders, set:

- `VEIL_ORDER_API_BASE` (required for real order execution)
- `VEIL_ORDER_API_KEY` (optional bearer token)
- `NEXT_PUBLIC_VEIL_TX_EXPLORER_BASE` (optional, for VEIL tx links)
- `NEXT_PUBLIC_ORACLE_TX_EXPLORER_BASE` (optional, defaults to PolygonScan)

Example:

```dotenv
VEIL_ORDER_API_BASE=http://127.0.0.1:9098
VEIL_ORDER_API_KEY=replace-me
NEXT_PUBLIC_VEIL_TX_EXPLORER_BASE=https://veilscan.example/tx/
NEXT_PUBLIC_ORACLE_TX_EXPLORER_BASE=https://polygonscan.com/tx/
```

In local development, if `VEIL_ORDER_API_BASE` is unset, `/api/orders` defaults to `http://127.0.0.1:9098`.

## Notes
- Keep secrets in environment variables only.
- `.env*` files are ignored.
