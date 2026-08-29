# VEIL Frontend

**[veil.markets](https://veil.markets)** — UI for VEIL. This tree serves the **local** stack. Local ≠ Fuji ≠ mainnet.

v1: VeilVM (19 actions, IDs 0–18, supply 990,999,000) + companion rails on **anvil 31337** (WVEIL / intent gateways / faucet / ZER0ID registry). HyperSDK **app-id 22207 is not an EVM chain id**. See `thesecretlab-dev/veil-docs` `architecture/VEIL_STACK.md`.

## Local stack (this machine)

| Surface | URL | Notes |
|---|---|---|
| UI | http://127.0.0.1:3000 | `next dev --webpack` |
| Markets | http://127.0.0.1:3000/app | Native books on local VeilVM |
| Explorer | http://127.0.0.1:3000/explorer | First-party HyperSDK explorer. Not Blockscout. |
| Mesh RPC | http://127.0.0.1:8787 | TSL RPC. Clients should hit Mesh, not the node. |
| Order router | http://127.0.0.1:9098 | `/orders`, `/markets`, `/native/faucet` |
| VeilVM | http://127.0.0.1:9660 | HyperSDK HTTP |
| Companion EVM | http://127.0.0.1:8545 | chain id **31337** |

Owner: Task Scheduler `VEIL-local-genesis-node` (`veilvm/scripts/start-local-daemon.ps1`). Idempotent — does not kill healthy processes.

Copy `runtime.example.env` to `.env.local`. Do not set `VEIL_LIVE=1` to claim a public network.

## Features

- **Native markets** — Create/trade on local VeilVM (`POST /api/orders` → router `CommitOrder`).
- **Polymarket catalog** — External CLOB-priced rows. Catalog only unless `POLYMARKET_CLOB_LIVE=1`. Not VeilVM settlement.
- **Explorer** — Height, blocks, txs, pool via Mesh indexer/core/veil lanes.
- **Mesh** — `/v1/core`, `/v1/veil`, `/v1/indexer`, `/v1/evm`.
- **ZER0ID** — Companion nullifier registry on 31337. Groth16 wasm/zkey not served.
- **Faucet** — Header button drips HyperSDK VEIL. Companion `VeilFaucet.claim()` drips anvil ETH.

## Stack

- **Framework**: Next.js 16 (App Router), webpack in `dev`
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Motion**: Framer Motion; landing uses WGSL shaders (not a public 3D R3F hero)
- **Wallets**: Companion wagmi on 31337 / Mesh EVM lane — never app-id 22207

## Routes (selection)

| Route | Page |
|---|---|
| `/` | Branding landing |
| `/app` | Native markets |
| `/app/market/[id]` | Market detail |
| `/explorer` | VeilVM explorer |
| `/mesh` | Mesh RPC product |
| `/app/zeroid` | ZER0ID console |
| `/app/onboard` | Local citizen path |
| `/app/defi` | DeFi + Mesh |
| `/app/docs` | Protocol documentation |

## Local development

```bash
npm install
npm run dev          # UI :3000
npm run mesh         # RPC :8787 (or let the genesis daemon start it)
```

Requires the local VeilVM daemon (`:9660`, `:8545`, `:9098`). See `veilvm/scripts/start-local-daemon.ps1`.

## API routes

| Endpoint | Description |
|---|---|
| `GET /api/markets` | Native books + optional Polymarket catalog |
| `POST /api/orders` | Native `CommitOrder` (polygon passthrough is 501) |
| `POST /api/native/faucet` | HyperSDK VEIL faucet |
| `GET /api/explorer/home` | Tip, recent blocks/txs, pool |
| `POST /api/mesh/v1/:lane` | Mesh JSON-RPC proxy (`core` / `veil` / `indexer` / `evm`) |
| `GET /api/network-status` | Local readiness matrix |
| `GET/POST /api/zeroid/*` | Issue / bind / lookup (31337 registry) |

## Links

- **Site**: [veil.markets](https://veil.markets) (frontend; public L1 not live)
- **Ecosystem**: [thesecretlab.app](https://thesecretlab.app)
- **Org**: [github.com/thesecretlab-dev](https://github.com/thesecretlab-dev)

---

*Markets for machines. Interfaces for humans.*
