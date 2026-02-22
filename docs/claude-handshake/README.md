# Claude Frontend Handshake Workspace

Purpose: keep frontend surface copy, badges, buttons, and feature claims aligned with current protocol reality.

This folder is the handshake lane between:

- protocol/VM/SDK truth (VEIL + ANIMA backend state)
- frontend surface translation (what users see and what we claim)

## Files

- `surface-translation-registry.json`
  - Machine-readable feature/status registry for frontend rendering and claim gating.
- `surface-translation-matrix.md`
  - Human-readable translation guide (allowed wording vs forbidden wording).

## Working Rules

1. Do not promote `local` to `production` without evidence and checklist updates.
2. Distinguish `implemented`, `validated_local`, `production_ready`, and `live`.
3. Separate privacy scope:
   - `vm-native-private`
   - `evm-interop-public`
   - `mixed`
4. Launch status must follow the launch checklist, not frontend sentiment.
5. If a claim changes, update the registry first, then update UI copy.

## Current Truth Sources (Authoritative)

- `C:\Users\Josh\hypersdk\examples\veilvm\VEIL_PRODUCTION_LAUNCH_CHECKLIST.md`
- `C:\Users\Josh\Desktop\private-github-ready-20260219\veil-frontend\docs\here-and-now-handoff-2026-02-22.md`
- `C:\Users\Josh\Desktop\veil-automaton\docs\veil-native-api-v1-mapping.md`
- `C:\Users\Josh\Desktop\veil-automaton\docs\anima-native-v1-task-board.md`

## Current Snapshot (2026-02-22)

- Launch posture: `NO-GO`
- Launch gates: `6 PASS (local) / 4 IN PROGRESS / 2 FAIL`
- ANIMA Tier 0: SDK/runtime baseline pushed with local unit coverage; live strict-private flow still scaffolded/pending real runtime fixtures

