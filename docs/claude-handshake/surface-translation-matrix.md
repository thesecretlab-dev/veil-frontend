# VEIL Ecosystem Surface Translation Matrix

Protocol reality -> UI surface -> allowed wording -> forbidden wording

Updated: 2026-02-23  
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
- `GO FOR PRODUCTION`
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
| Launch banner / status badge | Launch is `GO FOR PRODUCTION`; snapshot is `13 PASS (PASS/PASS local) / 0 IN PROGRESS / 0 FAIL` across `G0..G12` | `GO FOR PRODUCTION (2026-02-22). Gate evidence is public.` | `Fully live across every route`, `All features unrestricted` |
| Rehearsal status | `G11` PASS | `Launch rehearsal gate is complete and archived.` | `Unsigned launch packet` |
| Key ceremony / admin rotation | `G10` PASS (local evidence) | `Key ceremony and admin rotation gate is closed locally.` | `All launch blockers removed` |
| ANIMA runtime readiness | `G12` PASS (local evidence) | `ANIMA runtime readiness is passing in local launch evidence; rollout remains route-gated.` | `All agent routes are live private by default` |

## Privacy Surfaces (Highest Sensitivity)

| Surface | Protocol Reality | Allowed Wording | Forbidden Wording |
|---|---|---|---|
| Proof-gated consensus | `G1` PASS (local) | `Proof-gated consensus enforced in local VEIL profile.` | `Production private consensus live` |
| Mempool privacy | `G2` PASS (local evidence) | `Threshold-keyed mempool privacy is implemented and locally validated; staged rollout qualifiers still apply.` | `Mempool is private`, `No one can see your transactions` |
| ZK circuit scope | `G3` PASS (local) | `Shielded-ledger-v1 circuit assurance is archived locally.` | `ZK-protected mainnet` |
| Overall privacy claim | Core privacy gates pass locally with route-scoped rollout policy | `Privacy primitives are implemented and locally validated; route-level rollout qualifiers remain mandatory.` | `Fully private chain`, `Private by default on mainnet` |

Rule:

- Keep privacy claims route-scoped even when launch gates are closed in checklist evidence.

## Interop / EVM / Wallet Surfaces

| Surface | Protocol Reality | Allowed Wording | Forbidden Wording |
|---|---|---|---|
| Companion EVM | Interoperability rail, not private engine | `Companion EVM interoperability rails` | `Private EVM`, `EVM privacy layer` |
| Bridge / round-trip | `G6` PASS (local evidence) | `Bridge/relay readiness checks are passing in current launch evidence; operator rollout still stages public activation.` | `Bridge private by default` |
| Wallet compatibility | Design + in-progress rails | `Designed for EVM wallet interoperability through companion rails.` | `Connect and trade privately now` |
| Intent relays | Wired paths, not production-complete | `Intent relay paths are wired for interoperability testing.` | `Intents execute live in production` |

## Economics / Treasury / VAI Surfaces

| Surface | Protocol Reality | Allowed Wording | Forbidden Wording |
|---|---|---|---|
| Tokenomics / flywheel | Runtime + gate validation pass locally | `Economic flywheel and treasury controls pass current launch checklist local evidence.` | `Guaranteed returns`, `Risk-free yields` |
| COL / treasury controls | `G4` PASS (local evidence) | `Treasury/COL controls are implemented with passing launch-gate evidence.` | `Unrestricted treasury operations live` |
| VAI risk controls | `G5` PASS (local evidence) | `VAI risk controls are implemented with passing launch-gate evidence.` | `Permanent peg guarantee` |

## ANIMA / ZER0ID / Dev Surfaces

| Surface | Protocol Reality | Allowed Wording | Forbidden Wording |
|---|---|---|---|
| ANIMA Tier 0 SDK/runtime | Local baseline shipped and tested | `ANIMA Tier 0 native SDK/runtime baseline implemented with local tests.` | `Agents live on mainnet`, `Agents trade privately on VEIL` |
| ANIMA runtime hardening controls | Local hardening active (wallet encryption, idempotent commit retries, encrypted order envelope, log redaction guards) | `ANIMA runtime hardening controls are enabled for local strict-private development and evidence capture.` | `Production-hardened live gateway`, `Externally audited production runtime` |
| ANIMA Tier 0 live flow | Readiness bundle PASS (local evidence) | `Tier 0 strict-private readiness is passing in local evidence; staged rollout policy still applies.` | `Every agent route is fully live private by default` |
| ZER0ID SDK / identity | SDK/dev workstream active | `ZER0ID SDK and identity tooling are in active development with staged rollout.` | `Universal live identity verification` |
| Developer SDK docs | Preview docs/maps available | `Developer SDKs and action maps are available in preview.` | `Stable API`, `Mainnet-ready dev platform` |

## Governance / Validator Operator Surfaces

| Surface | Protocol Reality | Allowed Wording | Forbidden Wording |
|---|---|---|---|
| Validator operator status | `G10` PASS in current evidence | `Key ceremony and admin rotation are complete in current launch evidence; operator rollout still stages activation.` | `Validators ready for production launch` |
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
- Companion bridge transfer: `disabled` (operator staged, not public default)
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
