# VEIL Ecosystem Handshake Workspace (Claude Frontend + Protocol)

Cross-agent coordination files for full VEIL ecosystem surface translation:

- VeilVM protocol and privacy surfaces
- companion EVM interoperability rails
- treasury, tokenomics, and VAI surfaces
- ANIMA, ZER0ID, and developer surfaces
- launch ops, validator, and governance status surfaces

## Files

| File | Purpose | Owner |
|---|---|---|
| `surface-translation-registry.json` | Machine-readable source of truth for VEIL ecosystem claims, badges, and CTA gating | Protocol truth owner updates; frontend consumes |
| `surface-translation-matrix.md` | Human-readable copy guidance with allowed/forbidden wording across ecosystem domains | Protocol + frontend review |

## Rules

1. No hardcoded claims: frontend surfaces should consume the registry for stateful copy/badges/CTA decisions.
2. Every claim change requires both checks: protocol truth check and UX/copy fit check.
3. PRs touching claims must include: registry update, evidence/checklist reference, and screenshots of affected surfaces.
4. Launch status authority is `VEIL_PRODUCTION_LAUNCH_CHECKLIST.md`, not frontend sentiment.
5. `validated_local` must never be translated as `live` or `production_ready`.
6. Privacy scope must be explicit in copy and badges.
7. EVM rails are interoperability surfaces, not the private execution engine.

## Workflow

```text
Protocol change -> update registry + matrix
               -> frontend consumes registry diff
               -> frontend proposes UI/copy changes
               -> protocol/frontend review before merge
```

## Required Domain Coverage (Ecosystem-Wide)

The registry/matrix should cover at minimum:

- `protocol`
- `privacy`
- `interop`
- `economics`
- `treasury`
- `stablecoin_vai`
- `anima`
- `zeroid`
- `wallets`
- `governance`
- `launch_ops`
- `developer_experience`

## Current Snapshot (2026-02-22)

- Launch posture: `NO-GO`
- Launch gates: `6 PASS (local) / 4 IN PROGRESS / 2 FAIL`
- ANIMA Tier 0: local SDK/runtime/test baseline pushed; live strict-private flow still scaffolded/pending runtime fixtures
- Companion EVM: interoperability framing only, not the private execution engine

## Truth Sources (Authoritative)

- `C:\Users\Josh\hypersdk\examples\veilvm\VEIL_PRODUCTION_LAUNCH_CHECKLIST.md`
- `C:\Users\Josh\Desktop\private-github-ready-20260219\veil-frontend\docs\here-and-now-handoff-2026-02-22.md`
- `C:\Users\Josh\Desktop\veil-automaton\docs\veil-native-api-v1-mapping.md`
- `C:\Users\Josh\Desktop\veil-automaton\docs\anima-native-v1-task-board.md`
