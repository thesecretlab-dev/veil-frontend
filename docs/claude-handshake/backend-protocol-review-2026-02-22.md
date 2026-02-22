# Backend Protocol Review for Claude Handshake (2026-02-22)

Reviewer: backend/protocol agent  
Scope: frontend surface claims vs current VEIL/ANIMA protocol truth

## Summary

Claude's handshake package is useful and directionally correct:

- `docs/claude-handshake/frontend-status-brief.md` is strong and actionable
- `docs/claude-handshake/surface-translation-registry.json` is useful for claim gating
- `app/lib/surface-translation-registry.ts` exists and includes typed helpers for component consumption

Two flagged issues are confirmed:

1. `41 vs 42` VM action count mismatch is real.
2. Stale threshold rollout evidence ID on transparency page is real.

## Confirmed Truth (Use These)

1. Canonical action count
- VeilVM action IDs are `0..41`, which is **42 total actions**.
- Evidence: `C:\Users\Josh\Desktop\veil-automaton\docs\veil-native-api-v1-mapping.md:5`

2. Latest local threshold rollout pointer (current backend latest)
- Use `tkroll-20260222-014454` as the current canonical local latest pointer (unless intentionally referencing a historical run).
- Evidence pointer source: `C:\Users\Josh\hypersdk\examples\veilvm\evidence-bundles\threshold-keying-rollout\latest.txt`

## Findings (Frontend Surface Corrections)

### P1: Stale threshold rollout evidence ID on transparency page

Current stale ID:
- `tkroll-20260221-235446`

Locations:
- `app/app/transparency/page.tsx:54`
- `app/app/transparency/page.tsx:103`
- `app/app/transparency/page.tsx:229`

Action:
- Update to `tkroll-20260222-014454` (or switch the UI to a "latest pointer" phrasing if you want to avoid future stale IDs).

Recommended wording pattern:
- `Local rollout audit passing (latest: tkroll-20260222-014454)`

### P1: VM action count is wrong (`41` should be `42`)

Locations:
- `app/exploreveil/page.tsx:841`
- `app/exploreveil/page.tsx:1590`

Current:
- `41 VM Actions`
- `VeilVM running on HyperSDK with 41 native actions...`

Action:
- Change to `42`.

Why:
- Action IDs are `0..41` inclusive => 42 actions.

### P1: Roadmap overclaims completion for non-live/non-production systems

Locations:
- `app/exploreveil/page.tsx:1591`
- `app/exploreveil/page.tsx:1592`

Issues:
- `M1` says `Complete` and includes:
  - `Bloodsworn reputation at VM level`
  - `ANIMA Go runtime`
- `M2` says `Complete` for:
  - `COL vault`, `VAI stablecoin`, `bond markets`, `vVEIL staking`, `RBS`, `YRF`

Protocol-truth problem:
- These are not all live/operational production features.
- Several are design/runtime-path/local-validation/in-progress status only.

Action:
- Reclassify wording/status to reflect current truth (example):
  - `M1`: `In Progress` or `SDK Baseline + Design`
  - `M2`: `In Progress` or `Implemented in Design/Runtime, Production Freeze Pending`

Suggested replacement (M1):
- `Identity + Reputation + SDKs` -> `In Progress`
- `ZER0ID and Bloodsworn surfaces are designed/scaffolded; ANIMA TypeScript SDK baseline is implemented; runtime and live execution paths are still in progress.`

Suggested replacement (M2):
- `Tokenomics + Stability` -> `In Progress`
- `Tokenomics, COL, VAI, and treasury/risk controls are implemented in design/runtime paths; production freeze and validation remain pending (G4/G5).`

### P1: Metadata overclaims "private prediction markets" as current product reality

Locations:
- `app/layout.tsx:80`
- `app/app/investor-deck/layout.tsx:7`
- `app/app/investor-deck/layout.tsx:11`
- `app/app/investor-deck/layout.tsx:18`

Current risk:
- Present-tense positioning implies operational private prediction markets.

Action:
- Qualify with development/testnet status, or frame as architecture/goal.

Safer examples:
- `Privacy-first prediction market infrastructure under active development on a custom Avalanche L1`
- `VEIL is building privacy-native market infrastructure for sovereign agents`

### P1: ExploreVeil copy likely overstates ZER0ID/Bloodsworn/native-market live status

Representative lines to review:
- `app/exploreveil/page.tsx:698`
- `app/exploreveil/page.tsx:699`
- `app/exploreveil/page.tsx:927`

Risk:
- Present-tense wording can read as live transaction-layer enforcement for ZER0ID/Bloodsworn participation.

Action:
- Audit these sections against the handshake registry and matrix.
- Convert live/absolute wording to `designed`, `implemented locally`, `in development`, or `planned` as appropriate.

## Notes on Claude Handshake Package (Good / Keep)

1. `app/lib/surface-translation-registry.ts` appears aligned with ecosystem-style fields
- Includes typed fields such as `domain`, `surface_owners`, and `ui_action_policy`.
- Good direction for component consumption.

Reference snippet:
- `app/lib/surface-translation-registry.ts:33`

2. TS helper already contains the updated threshold rollout pointer
- Reference:
  - `app/lib/surface-translation-registry.ts:113`

## Integration Recommendation (Protocol + Frontend)

1. Use `docs/claude-handshake/surface-translation-registry.json` as canonical truth artifact.
2. Keep `app/lib/surface-translation-registry.ts` as typed frontend adapter/helper.
3. Ensure JSON and TS helper stay in schema sync (one should generate/derive from the other long-term).
4. Frontend PRs touching claims should include:
- registry diff
- file/line claim changes
- screenshots
- checklist/evidence references

## Immediate Next Actions for Claude (Suggested Order)

1. Fix transparency stale `tkroll` IDs (`app/app/transparency/page.tsx`)
2. Fix action count `41 -> 42` in `exploreveil`
3. Rewrite roadmap `M1/M2` status/copy to remove overclaims
4. Qualify metadata copy in `app/layout.tsx` and `app/app/investor-deck/layout.tsx`
5. Run a targeted claim audit of `exploreveil` ZER0ID/Bloodsworn sections against the registry/matrix
6. Commit/push:
- `docs/claude-handshake/frontend-status-brief.md`
- `app/lib/surface-translation-registry.ts`

