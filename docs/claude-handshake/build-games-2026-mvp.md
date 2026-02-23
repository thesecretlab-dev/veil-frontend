# Build Games 2026 MVP Contract

Updated: 2026-02-23

## Canonical MVP

`User sends $100 in AVAX, gets a live cloud server + Codex access + ANIMA agent validating the VEIL network and working live in under 20 minutes.`

## Hard Acceptance Criteria

1. A real AVAX payment transaction is observed and archived.
2. A new cloud instance is provisioned from that payment flow.
3. Codex can execute commands in the provisioned environment.
4. ANIMA executes VEIL validation checks and returns evidence from the provisioned environment.
5. End-to-end elapsed time from payment detected to validation complete is `<= 20 minutes`.

## 20-Minute Budget

| Stage | Max Time | Owner | Required Evidence |
|---|---:|---|---|
| Payment observed (`$100 AVAX`) | 2 min | Codex | payment tx hash + timestamp + value snapshot |
| Cloud server provisioned | 7 min | Codex | provider instance id + public endpoint + provision log |
| Codex access confirmed | 3 min | Codex | command result proof (`whoami`, `pwd`, `git --version`) |
| ANIMA VEIL validation run | 7 min | Codex | VEIL readiness response + chain check + ANIMA run log |
| Evidence bundle finalized | 1 min | Claude + Codex | MVP run JSON + UI status update |

## MVP Run Evidence Contract

1. Write machine-readable run status to `docs/claude-handshake/build-games-2026-mvp-tracker.json`.
2. Archive per-run result as `public/maiev/mvp-run-<timestamp>.json`.
3. Expose a UI panel driven by the tracker and latest run artifact.
4. Do not mark MVP `complete` unless every hard criterion passes within SLA.

## Canonical Run Command

```bash
pnpm.cmd exec tsx src/index.ts --build-games-mvp \
  --payment-tx 0xYOUR_TX_HASH \
  --payment-to 0xRECIPIENT \
  --conway-api-key $CONWAY_API_KEY \
  --control-sandbox-id YOUR_EXISTING_SANDBOX_ID \
  --veil-rpc-url-remote https://YOUR_VEIL_RPC_FOR_CLOUD \
  --veil-rpc-url-local http://127.0.0.1:9660 \
  --tracker-path C:/Users/Josh/Desktop/private-github-ready-20260219/veil-frontend/docs/claude-handshake/build-games-2026-mvp-tracker.json \
  --publish-dir C:/Users/Josh/Desktop/private-github-ready-20260219/veil-frontend/public/maiev
```

Low-credit continuity mode:

1. If Conway credits are `0` and new sandbox provisioning returns `402 INSUFFICIENT_CREDITS`, set `--control-sandbox-id` to a currently running sandbox.
2. In this mode, M2 records a reused sandbox (probe-verified) instead of creating a brand-new one.
3. Treat reused-sandbox runs as continuity validation evidence; keep at least one recent fresh-provision pass when credits are available.

Run source:
- `C:\Users\Josh\Desktop\veil-automaton\src\mvp\build-games-mvp.ts`

## Standalone VEIL RPC Requirement (Cloud Validation)

`M4_ANIMA_VALIDATE_VEIL` requires a cloud-reachable VEIL RPC URL for the remote probe path.

Required wiring:

1. Keep local node RPC healthy on `http://127.0.0.1:9660`.
2. Expose it through a standalone HTTPS tunnel endpoint.
3. Pass that endpoint into `--veil-rpc-url-remote`.
4. Keep `--veil-rpc-url-local http://127.0.0.1:9660` for operator-side local proof.

Canonical runbook:
- `C:\Users\Josh\hypersdk\examples\veilvm\VEIL_STANDALONE_RPC_RUNBOOK.md`

Current live standalone endpoint:
- `https://veil-rpc.thesecretlab.app`

## Execution Split (Claude + Codex)

| Workstream | Primary Owner | Scope |
|---|---|---|
| Payment + provisioning pipeline | Codex | Payment detection, server creation, command bootstrap |
| VEIL runtime validation pipeline | Codex | Health checks, chain checks, ANIMA validation command path |
| MVP status UI + user-facing flow | Claude | Funding-progress UX, live timeline, success/fail messaging |
| Claim/copy enforcement | Claude + Codex | Registry/matrix alignment and no-overclaim policy |

## Current Starting Baseline

1. Launch checklist snapshot is `GO FOR PRODUCTION` with `13/13` gate pass (`PASS`/`PASS local`) as of 2026-02-22.
2. ANIMA Tier 0 unit coverage is passing locally.
3. Live Tier 0 harness still requires real env wiring and non-placeholder receipts for production-style proof.

## Failure Conditions

1. Flow exceeds 20 minutes.
2. Payment is detected but provisioning fails.
3. Server is provisioned but Codex cannot execute.
4. Codex executes but ANIMA cannot produce VEIL validation evidence.
5. Any UI copy claims success without matching artifacts.
