# VEIL Ecosystem Surface Translation Matrix

Protocol reality -> UI surface -> allowed wording -> forbidden wording

Updated: 2026-02-22  
Machine-readable source: `surface-translation-registry.json` (same folder, schema `v2`)

## How To Use This

1. Find the feature in the registry before writing claims.
2. Use the registry fields to drive UI:
   - `implemented`
   - `validated_local`
   - `production_ready`
   - `live`
   - `ui_action_policy`
3. If `validated_local=true` and `production_ready=false`, copy must include a qualifier (`local`, `testnet`, `in development`, `preview`).
4. If `implemented=scaffolded`, the surface is a design or harness, not a live user flow.
5. EVM rails must always be framed as interoperability, not private execution.

## Shared Vocabulary (Recommended)

Use these terms consistently:

- `Local PASS`
- `In Progress`
- `Scaffolded`
- `Preview`
- `NO-GO`
- `Interop Rail`
- `Strict-Private`

Avoid vague hype terms:

- `soon`
- `almost ready`
- `fully private` (unless production-gated evidence supports it)
- `live` (unless actually live)

## Launch Ops / Status Surfaces

| Surface | Protocol Reality | Allowed Wording | Forbidden Wording |
|---|---|---|---|
| Launch banner / status badge | Launch is `NO-GO`, 6/12 local gates pass | `NO-GO for production. Gate-based progress is public.` | `Launching now`, `Mainnet ready`, `Almost launched` |
| Rehearsal status | `G11` FAIL | `Full launch rehearsal is still pending.` | `Launch rehearsal complete` |
| Key ceremony / admin rotation | `G10` FAIL | `Production key ceremony and admin rotation remain blockers.` | `Validator set finalized`, `Admin rotation complete` |

## Privacy Surfaces (Highest Sensitivity)

| Surface | Protocol Reality | Allowed Wording | Forbidden Wording |
|---|---|---|---|
| Proof-gated consensus | `G1` PASS (local) | `Proof-gated consensus enforced in local VEIL profile.` | `Production private consensus live` |
| Mempool privacy | `G2` IN PROGRESS, local rollout pass | `Threshold-keyed mempool privacy is locally validated; production rollout evidence pending.` | `Mempool is private`, `No one can see your transactions` |
| ZK circuit scope | `G3` PASS (local) | `Shielded-ledger-v1 circuit assurance is archived locally.` | `ZK-protected mainnet` |
| Overall privacy claim | Mixed local + pending production gates | `Privacy primitives are implemented and tested locally; production rollout remains gated.` | `Fully private chain`, `Private by default on mainnet` |

Rule:

- Do not use unqualified privacy claims until launch-critical privacy gates are closed with production evidence (`G2`, plus operational blockers impacting launch readiness like `G10`, `G11`).

## Interop / EVM / Wallet Surfaces

| Surface | Protocol Reality | Allowed Wording | Forbidden Wording |
|---|---|---|---|
| Companion EVM | Interoperability rail, not private engine | `Companion EVM interoperability rails` | `Private EVM`, `EVM privacy layer` |
| Bridge / round-trip | `G6` IN PROGRESS | `Bridge readiness is in progress; round-trip closure pending.` | `Bridge is live`, `Cross-chain transfers work` |
| Wallet compatibility | Design + in-progress rails | `Designed for EVM wallet interoperability through companion rails.` | `Connect and trade privately now` |
| Intent relays | Wired paths, not production-complete | `Intent relay paths are wired for interoperability testing.` | `Intents execute live in production` |

## Economics / Treasury / VAI Surfaces

| Surface | Protocol Reality | Allowed Wording | Forbidden Wording |
|---|---|---|---|
| Tokenomics / flywheel | Design + validation in progress | `Economic flywheel design is under staged validation.` | `Flywheel is live`, `Treasury is accruing value on mainnet` |
| COL / treasury controls | `G4` IN PROGRESS | `Treasury/COL controls are implemented, with production freeze pending.` | `COL locks are live`, `Treasury controls active on mainnet` |
| VAI risk controls | `G5` IN PROGRESS | `VAI risk controls exist; production validation is pending.` | `Stable`, `Pegged`, `Backed stablecoin is live` |

## ANIMA / ZER0ID / Dev Surfaces

| Surface | Protocol Reality | Allowed Wording | Forbidden Wording |
|---|---|---|---|
| ANIMA Tier 0 SDK/runtime | Local milestone shipped and tested | `ANIMA Tier 0 native SDK/runtime baseline implemented with local tests.` | `Agents live on mainnet`, `Agents trade privately on VEIL` |
| ANIMA Tier 0 live flow | Harness scaffold only (LB-11 pending) | `Live Tier 0 strict-private harness is scaffolded and pending runtime/proof fixtures.` | `Live private agent flow running` |
| ZER0ID SDK / identity | SDK/dev work in progress | `ZER0ID SDK and identity tooling are in active development.` | `Live private identity verification` |
| Developer SDK docs | Preview docs/maps available | `Developer SDKs and action maps are available in preview.` | `Stable API`, `Mainnet-ready dev platform` |

## Governance / Validator Operator Surfaces

| Surface | Protocol Reality | Allowed Wording | Forbidden Wording |
|---|---|---|---|
| Validator operator status | Ops blockers remain (`G10`) | `Operator readiness depends on key ceremony and admin rotation completion.` | `Validators ready for production launch` |
| Governance controls | Governance-facing surfaces are not production-live | `Governance/operator controls are under staged rollout.` | `Governance live on mainnet` |

## CTA / Button Policy (Use Registry `ui_action_policy`)

Preferred CTA states:

- `enabled`: safe to expose now (usually docs, external data, or preview tooling)
- `docs_only`: capability/info surface only, not a live product action
- `waitlist`: planned UX flow that should not route into non-production execution
- `disabled`: visible but blocked by current gate or readiness state
- `hidden`: should not be shown yet because it implies a capability that is not operational

Examples:

- Polymarket external route: `enabled` (external)
- Companion bridge transfer: `disabled` (G6 pending)
- Native private trading CTA: `hidden` (not operational user flow)
- ANIMA docs CTA: `docs_only`

## Review Protocol (Frontend + Protocol)

1. Protocol truth owner updates `surface-translation-registry.json`.
2. Frontend reads diff and maps affected UI surfaces.
3. Frontend PR includes:
   - registry diff
   - evidence/checklist references
   - screenshots of affected surfaces
4. No claim ships without both:
   - protocol truth approval
   - UX/copy fit approval
