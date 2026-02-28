# VEIL Mainnet Launch Checklist (Ordered)

Last updated: 2026-02-23  
Source-of-truth snapshot: `<local-path-removed>`

This checklist is the ordered go-live path.  
Current canonical state (2026-02-22 snapshot): **GO FOR PRODUCTION** with all gates `PASS`/`PASS (local)`.

## 0. Current Launch Posture (as of 2026-02-20T20:19:46.571Z)

- Overall prelaunch readiness: `false`
- Passed gates: `G0, G1, G2, G7, G8, G9`
- In-progress gates: `G3, G4, G5, G6`
- Failed gates: `G10, G11`

Blocking notes from readiness report:

- `G3`: production circuit assurance package still pending
- `G4`: treasury/COL lock production freeze pending
- `G5`: risk controls production validation pack pending
- `G6`: VEIL <-> C-Chain relay round-trip blocked by local subnet validator reachability/quorum
- `G10`: temporary admin key posture still present
- `G11`: full production rehearsal packet not completed

## 1. Security Governance Hard-Stop (Must Pass First)

1. Complete hardened ownership posture (`G10`).
2. Remove temporary admin EOA dependence for treasury and keep3r controls.
3. Record signed ownership/role map as launch evidence.

Acceptance criteria:

- No temporary admin key remains in privileged contract paths.
- Ownership/control model is documented and reproducible.
- Ownership evidence is updated and attached to launch packet.

Evidence references:

- `public/maiev/prelaunch-readiness-20260220-151946.json`
- `public/maiev/flywheel-audit/flywheel-20260220-145840/flywheel-audit.md`
- `public/maiev/admin-rotation/rotation-20260220-150046/ownership-rotation.md`

## 2. Production Rehearsal Packet (Must Pass Second)

1. Close `G11` by running the full production rehearsal packet end-to-end.
2. Include launch gate drills, rollback drill, and operator handoff evidence.
3. Bundle artifacts into a single final packet for sign-off.

Acceptance criteria:

- Rehearsal packet marked complete with operator sign-off.
- All required attachments are present (logs, summaries, config snapshots).
- Packet stored in MAIEV path and referenced by latest readiness file.

Evidence references:

- `public/maiev/prelaunch-readiness-20260220-151946.json`
- `public/maiev/20260220-202857-launch-gate-evidence/bundle.md`

## 3. VM Privacy + Proof Assurance (Close `G3`)

1. Keep runtime gate on `shielded-ledger-v1`.
2. Finalize full production circuit assurance package (not local-only checks).
3. Re-run privacy drill suite and attach results.

Acceptance criteria:

- Production-grade circuit assurance package attached.
- Fail-close, malformed-proof, timeout, and backup takeover tests pass.
- No unresolved privacy findings.

Evidence references:

- `public/maiev/vm-privacy-audit/vmprivacy-20260220-155511/vm-privacy-audit.md`
- `public/maiev/20260220-202857-launch-gate-evidence/bundle.md`

## 4. Treasury / COL / Risk Validation (Close `G4` and `G5`)

1. Freeze treasury/COL configuration intended for mainnet launch.
2. Complete production validation pack for risk controls.
3. Confirm economic invariants and policy bounds after freeze.

Acceptance criteria:

- Treasury/COL lock status frozen for launch parameters.
- Risk validation pack marked complete and attached.
- Economic coherence checks remain pass after freeze.

Evidence references:

- `public/maiev/prelaunch-readiness-20260220-151946.json`
- `public/maiev/economic-coherence/econ-20260220-143818/economic-coherence.md`
- `public/maiev/flywheel-audit/flywheel-20260220-145840/flywheel-audit.md`
- `public/maiev/launchpad/launchpad.state.json`
- `public/maiev/launchpad/launchpad-freeze-2026-02-20T17-43-39-084Z.json`

## 4A. vVEIL / gVEIL Emissions Policy (Launch-Critical)

1. Use an Olympus-style rebasing lane for `vVEIL`.
2. Drive `vVEIL` APY from **liquidity target gap** (algorithmic controller), not fixed APR.
3. Keep `gVEIL` as non-rebasing wrapper/governance units backed by `vVEIL` index.
4. Bias policy toward growth while respecting hard caps and risk controls.
5. Enforce hard pause / cooldown of emissions if launch gates regress or risk controls fail.

Required policy definitions before launch:

- vVEIL rebase rule: `vVEIL_next = vVEIL_now * (1 + epochRebaseRate)`.
- Dynamic APY rule: `apy = clamp(base + growthFloor + min(maxGapBonus, gapRatio * gain), apyFloor, apyCap)`.
- Gap rule: `gapRatio = max(0, (targetReserve - observedReserve) / targetReserve)`.
- gVEIL wrapper rule: non-rebasing units represent claim on indexed vVEIL (wrap/unwrap path deterministic).
- Reward cap rule: bounded by release controls and epoch limits (`E04`, `E08`) plus governance guardrails.
- Governance rule: parameter changes require timelocked governance approval.

Acceptance criteria:

- Dynamic APY controller parameters are documented, timelocked, and reproducible.
- Gap-to-APY response is verifiable from latest liquidity depth snapshot.
- gVEIL wrapper/index behavior is documented and test-covered.
- Emission/reward controls are included in rehearsal packet sign-off.

Evidence references:

- `public/maiev/liquidity-depth/liquidity-20260220-143741/liquidity-depth.json`
- `app/api/liquidity-depth/route.ts`
- `public/maiev/economic-coherence/econ-20260220-143818/economic-coherence.md`
- `public/maiev/prelaunch-readiness-20260220-151946.json`

## 5. Bridge and Relay Round-Trip (Close `G6`)

1. Keep Chainlink and Avalanche mainnet bridge checks green.
2. Resolve validator reachability/quorum issue blocking VEIL <-> C-Chain round-trip.
3. Execute and record successful bi-directional relay proof.

Acceptance criteria:

- Mainnet bridge status remains pass.
- Relay round-trip succeeds with evidence.
- No unresolved bridge/relay issues in readiness report.

Evidence references:

- `public/maiev/mainnet-bridge-live-status-latest.json`
- `public/maiev/prelaunch-readiness-20260220-151946.json`

## 6. Contract + Keeper Runtime Confirmation (Reconfirm Before Go-Live)

1. Reconfirm audit closure remains zero-findings for launch target set.
2. Reconfirm flywheel runtime checks remain pass for treasury/keep3r/gateways.
3. Reconfirm keep3r credits and active keeper state are healthy.

Acceptance criteria:

- Audit closure status succeeded with 0 unresolved findings.
- Flywheel runtime checks remain pass (including job wiring and credits).
- Companion registry checks remain pass for active deployment set.

Evidence references:

- `public/maiev/prelaunch-readiness-20260220-151946.json`
- `public/maiev/flywheel-audit/flywheel-20260220-145840/flywheel-audit.md`
- `public/maiev/audit-closure/latest.txt`

## 7. Final Go/No-Go Verification (Single Decision Gate)

1. Rebuild fresh readiness artifact.
2. Confirm all gates `G0` through `G11` are `PASS`.
3. Confirm `overallPass: true`.
4. Freeze launch artifact pointers (`latest` files) and timestamp.
5. Issue final launch approval.

Go decision rule:

- **GO** only when all gates are PASS and `overallPass` is true.
- **NO-GO** only if any gate regresses to FAIL or IN PROGRESS in a newer verification run.

Final evidence set to attach in launch approval:

- `public/maiev/prelaunch-readiness-*.json` (latest pass)
- `public/maiev/mainnet-bridge-live-status-latest.json`
- `public/maiev/20260220-202857-launch-gate-evidence/bundle.md` (or latest replacement)
- `public/maiev/vm-privacy-audit/latest-report.html`
- `public/maiev/flywheel-audit/flywheel-20260220-145840/flywheel-audit.md` (or latest replacement)
- `public/maiev/economic-coherence/econ-20260220-143818/economic-coherence.md` (or latest replacement)

## 8. Launch-Day Operational Sequence

1. Confirm no config drift since final verification.
2. Verify bridge, router, and chain status before opening public flows.
3. Open market/deFi surfaces in controlled order.
4. Monitor launch metrics and gate health continuously.
5. If critical regression occurs, pause launch and execute rollback procedure from rehearsal packet.

