# VEIL.markets Verbiage Audit (2026-02-23)

Scope: full sweep of route pages under `app/**/page.tsx`, shared copy sources, and docs surfaces in `docs/**` for launch/readiness wording alignment.

## Canonical Product Truth Used For This Audit

- `C:\Users\Josh\hypersdk\examples\veilvm\VEIL_PRODUCTION_LAUNCH_CHECKLIST.md:52-70`
  - Snapshot date: `2026-02-22`
  - Gates `G0..G12`: all `PASS` or `PASS (local)`
  - Decision line: `GO FOR PRODUCTION`
- `C:\Users\Josh\hypersdk\examples\veilvm\LIVE_DEVLOG.md:53-65`
  - Launch posture is green in latest pointers.
  - Remaining non-gate operator blocker: unrecovered hardened owner key blocks treasury-owned LP actions on existing production contracts until ownership migration or redeploy.

Recommended universal status sentence for UI copy:

`Launch authority is GO FOR PRODUCTION (2026-02-22). All launch gates are PASS/PASS(local); operator-owned treasury LP actions remain signer-custody blocked pending owner migration/redeploy.`

## Root Cause Drift (Must Fix First)

1. `docs/claude-handshake/surface-translation-registry.json:48-52`
   - Current: `decision=NO-GO`, `gates_passing_local=8`, `gates_in_progress=5`.
   - Needed: sync to checklist snapshot (`GO FOR PRODUCTION`, `13/13`, `0 in progress`, `0 failing`).
2. `app/lib/surface-translation-registry.ts:10`
   - Consumes the stale JSON above, so any UI using `getLaunchStatus()` inherits wrong copy.
3. `app/api/portal-status/route.ts:86-99`
   - Picks latest `public/maiev/prelaunch-readiness-*.json`.
   - Current latest in repo is stale: `public/maiev/prelaunch-readiness-20260222-033500.json:3` (`overallPass=false` and old failing gates).

## Required Verbiage Changes (Routes/Components)

1. `app/app/defi/page.tsx:14`
   - Current: "launch gates are still NO-GO."
   - Change to GO decision + staged feature-gating language (not launch-failure language).
2. `app/app/ecosystem/page.tsx:294`
   - Current logic hardcodes `isNoGo = launch.decision === "NO-GO"`.
   - Change to neutral launch-state handling (GO now true), and decouple route availability from legacy NO-GO branch.
3. `app/app/ecosystem/page.tsx:422`
   - Current: "launch gates remain NO-GO."
   - Replace with "GO FOR PRODUCTION; some routes remain staged by feature policy."
4. `app/app/agents/page.tsx:431`
   - Current stat: `Launch Posture = NO-GO`.
   - Set to `GO FOR PRODUCTION` (or "GO (local evidence set)").
5. `app/app/agents/page.tsx:524`
   - Current: "awaiting LB-11 runtime/proof fixtures."
   - Outdated; G12 now PASS(local). Update to readiness-evidence-complete wording.
6. `app/app/blog/[slug]/page.tsx:54`
   - Current: "Launch posture remains NO-GO..."
   - Replace with current decision state and date.
7. `app/app/blog/[slug]/page.tsx:94`
   - Current: "G2 remains in progress."
   - Update to current gate snapshot wording.
8. `app/app/blog/[slug]/page.tsx:284`
   - Current: "Full production launch remains NO-GO."
   - Replace with GO-for-production language plus operator caveat where relevant.
9. `app/app/investor-deck/page.tsx:564`
   - Current KPI: `6/12 Launch Gates`.
   - Update to `13/13` snapshot framing.
10. `app/app/investor-deck/page.tsx:565`
    - Current: `Chain ID (Testnet)`.
    - Remove "Testnet" label; use precise runtime label.
11. `app/app/investor-deck/page.tsx:819`
    - Current: strict-private flows "in progress."
    - Update to "readiness evidence complete (local)" wording.
12. `app/app/investor-deck/page.tsx:828`
    - Current: G4/G5 pending language.
    - Update to current gate closure snapshot.
13. `app/app/investor-deck/page.tsx:837-839`
    - Current: G10/G11 listed as pending milestones.
    - Move to completed milestones.
14. `app/app/investor-deck/page.tsx:968`
    - Current milestone chain ends with "Production Launch Gates (Blocked)".
    - Replace with completed launch-gate milestone language.
15. `app/exploreveil/page.tsx:843`
    - Current logic maps `NO-GO -> Testnet` else `Live`.
    - Once registry is corrected, UI flips automatically; still update label semantics to avoid testnet/mainnet confusion.
16. `app/exploreveil/page.tsx:698`
    - Current ANIMA FAQ says strict-private end-to-end is still being validated.
    - Update to "readiness bundle pass achieved (local evidence)" with rollout qualifier.
17. `app/exploreveil/page.tsx:1592-1595`
    - Current roadmap keeps M1/M2/M3 in-progress or upcoming.
    - Reclassify launch-gate milestone to completed; adjust adjacent milestone text to actual operator state.
18. `app/app/support/page.tsx:46`
    - Current FAQ says trading gated "until launch checklist closure."
    - Launch checklist is closed; switch to staged rollout/operator-policy wording.
19. `app/app/terms/page.tsx:169-170`
    - Current says staged launch until gates close.
    - Replace with GO decision state + feature-level staged rollout.
20. `app/app/terms/page.tsx:185-186`
    - Current says production privacy remains gated pending final launch criteria.
    - Replace with route-scope privacy statement (VM shielded lanes vs transparent companion rails).
21. `app/app/gov/page.tsx:351`
    - Current says governance gated "until launch readiness is closed."
    - Launch readiness is closed; wording should say governance feature rollout remains staged.
22. `app/app/onboard/page.tsx:1381`
    - Current says preview artifacts remain until launch gates are closed.
    - Replace with "launch gates closed; this page remains simulation/training."
23. `app/app/privacy/page.tsx:144-145`
    - Current says production rollout remains gated.
    - Replace with route-scope privacy statement without stale launch-gate claim.
24. `app/app/rewards/page.tsx:84`
    - Current says distribution inactive "until production launch."
    - Replace with explicit policy toggle language (distribution staged by protocol/operator settings).
25. `app/app/veil/layout.tsx:7,11,18`
    - Metadata says launch readiness remains in-progress.
    - Replace with GO decision state and feature-toggle qualifier.
26. `app/app/veil/page.tsx:61-62`
    - Current pool mode labels: "Testnet pilot."
    - Update to current environment wording.
27. `app/app/veil/page.tsx:96`
    - Current fallback reason: "Execution remains gated by launch readiness."
    - Replace with "gated by feature/operator policy."
28. `app/app/veil/page.tsx:604`
    - Current: "Production execution remains gated by launch status."
    - Replace with non-stale staged-execution explanation.
29. `components/wallet-connect.tsx:355`
    - Current: "launch gates remain in progress."
    - Replace with "connectivity is staged by route/policy."
30. `app/maiev/page.tsx:293,305,308`
    - Pulls stale decision/counters from registry; will correct automatically after registry sync.

## Required Verbiage Changes (Docs + Whitepaper/Reference Surfaces)

1. `docs/mainnet-launch-checklist.md:1-191`
   - Entire file is pinned to `2026-02-20` NO-GO state and old gate failures.
   - Replace with current launch authority snapshot or hard-link directly to `veilvm` checklist.
2. `docs/claude-handshake/README.md:56-60`
   - Replace NO-GO + 8/5/0 snapshot with current GO + 13/0/0 framing.
3. `docs/claude-handshake/frontend-status-brief.md:9-16`
   - Replace stale G12 in-progress narrative with current pass state.
4. `docs/claude-handshake/backend-protocol-review-2026-02-22.md:22-26`
   - Update gate board snapshot and associated copy assumptions.
5. `docs/claude-handshake/surface-translation-matrix.md:44-47` and related rows
   - Update launch/privacy/interop/economics rows that still encode in-progress blockers as current state.
6. `docs/claude-handshake/surface-translation-registry.json:48-301`
   - Primary source-of-truth correction required; current JSON still encodes NO-GO worldview.
7. `docs/here-and-now-handoff-2026-02-22.md:7`
   - "support scope for G12 only" is stale because G12 is now pass in checklist snapshot.

Whitepaper coverage:

- No standalone whitepaper file or route was found in this repo.
- Whitepaper wording references found in `app/app/transparency/page.tsx:149`, `app/app/transparency/page.tsx:152`, `app/app/transparency/page.tsx:331`; these references are historically framed and not in direct conflict.
- If a separate whitepaper is hosted outside this repo, its URL/path must be added for direct copy audit.

## Route Coverage (All Pages Reviewed)

- `app/page.tsx` - no launch-status mismatch found.
- `app/app/page.tsx` - no launch-status mismatch found.
- `app/app/agents/page.tsx` - changes required.
- `app/app/alerts/page.tsx` - no launch-status mismatch found.
- `app/app/api-docs/page.tsx` - no launch-status mismatch found.
- `app/app/blog/page.tsx` - no launch-status mismatch found.
- `app/app/blog/[slug]/page.tsx` - changes required.
- `app/app/compliance/page.tsx` - optional softening only; no hard contradiction found.
- `app/app/defi/page.tsx` - changes required.
- `app/app/docs/page.tsx` - no launch-status mismatch found.
- `app/app/ecosystem/page.tsx` - changes required.
- `app/app/gov/page.tsx` - changes required.
- `app/app/insights/page.tsx` - no hard launch contradiction found.
- `app/app/investor-deck/page.tsx` - changes required.
- `app/app/leaderboard/page.tsx` - no launch-status mismatch found.
- `app/app/market/[id]/page.tsx` - no launch-status mismatch found.
- `app/app/markets/page.tsx` - no launch-status mismatch found.
- `app/app/oath/page.tsx` - no hard launch contradiction found.
- `app/app/onboard/page.tsx` - changes required.
- `app/app/portfolio/page.tsx` - no launch-status mismatch found.
- `app/app/privacy/page.tsx` - changes required.
- `app/app/rewards/page.tsx` - changes required.
- `app/app/risk/page.tsx` - no launch-status mismatch found.
- `app/app/support/page.tsx` - changes required.
- `app/app/terms/page.tsx` - changes required.
- `app/app/transparency/page.tsx` - largely aligned; keep as canonical frontend narrative.
- `app/app/veil/page.tsx` - changes required.
- `app/exploreveil/page.tsx` - changes required.
- `app/legacy/page.tsx` - no launch-status mismatch found.
- `app/maiev/page.tsx` - indirect correction via registry sync required.

## Implementation Order (Copy Hygiene)

1. Correct `docs/claude-handshake/surface-translation-registry.json`.
2. Verify derived behavior in `app/lib/surface-translation-registry.ts` consumers (`/exploreveil`, `/app/ecosystem`, `/maiev`, `/app/veil`).
3. Replace hardcoded stale strings in route pages/components listed above.
4. Replace or retire stale docs (`docs/mainnet-launch-checklist.md`, handshake docs).
5. Refresh `public/maiev/prelaunch-readiness-*.json` latest artifact and/or adjust API selection logic to canonical latest pointer source.
