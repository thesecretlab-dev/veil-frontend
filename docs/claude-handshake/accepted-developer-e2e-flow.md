# Accepted Developer End-to-End Flow (Frontend Spec)

Updated: 2026-02-24
Owner: Protocol + Frontend
Status: Canonical handoff for implementation

## Purpose

Define the full first-time accepted developer journey from approval to market access.

This flow is a superset of the Build Games MVP flow:

- Build Games MVP proves fast bootstrap (`$100 AVAX -> server -> Codex -> ANIMA validation`).
- Accepted developer flow adds full network nativization, ZER0ID passport completion, and strict market unlock gating.

## Product Outcome

A first-time accepted developer completes the following before seeing market trading controls:

1. Accepted and wallet bound.
2. Funding/payment completed.
3. Cloud server provisioned and Codex connected.
4. Nativized into VEIL network.
5. ANIMA validation completed.
6. ZER0ID `8004` passport verified.
7. Validator is actively contributing to network validation.
8. Markets unlock.

## Stage Model (Canonical IDs)

| ID | Stage | Blocking | Completion Evidence |
|---|---|---|---|
| `A0_ACCEPTED` | Developer accepted and enrollment token issued | yes | acceptance record id, issued_at |
| `A1_WALLET_BIND` | Wallet connected and signed | yes | wallet address, signature proof |
| `A2_PAYMENT` | Required AVAX payment observed | yes | tx hash, amount, timestamp |
| `A3_PROVISION` | Cloud instance created | yes | instance id, host, provision logs |
| `A4_CODEX_ACCESS` | Codex command access confirmed | yes | command transcript hash |
| `A5_NETWORK_NATIVIZED` | User environment nativized into VEIL network | yes | node identity, peer evidence, rpc check |
| `A6_ANIMA_VALIDATED` | ANIMA validation run passed | yes | run id, validation report path, timestamp |
| `A7_ZEROID_8004` | ZER0ID passport `8004` completed | yes | passport id `8004`, verification proof |
| `A8_VALIDATOR_ACTIVE` | Validator status active on VEIL | yes | validator id, weight, last-seen heartbeat |
| `A9_MARKETS_UNLOCKED` | Market access granted | terminal | unlock event id, granted_at |

## Hard Unlock Rule

Markets must remain locked until all are true:

1. `A6_ANIMA_VALIDATED = passed`
2. `A7_ZEROID_8004 = passed`
3. `A8_VALIDATOR_ACTIVE = passed`

If any of these regress to failed or expired:

1. Trading actions lock again.
2. Existing positions remain visible read-only.
3. User sees exact failing gate and remediation action.

## Frontend Wizard Contract

## Entry

1. Route: `/app/launch` (or dedicated onboarding route).
2. If accepted-developer record exists and not complete, auto-resume at first incomplete blocking stage.

## Per-Stage UI States

Each stage supports:

1. `pending` (not started)
2. `running`
3. `passed`
4. `failed`
5. `blocked` (upstream stage incomplete)

Required UI fields per stage card:

1. `id`
2. `label`
3. `status`
4. `started_at`
5. `updated_at`
6. `evidence_ref` (or `null`)
7. `error_message` (or `null`)
8. `retry_allowed` (`true|false`)

## Timeline Targets (for UX copy only)

| Segment | Target |
|---|---:|
| `A2` through `A6` | <= 20 minutes |
| `A7` through `A8` | operator/network dependent (show live progress, no fake ETA) |

Do not show a hard ETA where backend cannot guarantee it.

## API/State Shape (minimum)

```json
{
  "user_id": "dev_...",
  "flow_version": "accepted-dev.v1",
  "overall_status": "running",
  "markets_unlocked": false,
  "current_stage": "A6_ANIMA_VALIDATED",
  "stages": [
    {
      "id": "A6_ANIMA_VALIDATED",
      "status": "running",
      "blocking": true,
      "started_at": "2026-02-24T04:20:00Z",
      "updated_at": "2026-02-24T04:22:00Z",
      "evidence_ref": null,
      "error_message": null
    }
  ]
}
```

## Copy Guardrails

Allowed:

1. "In progress"
2. "Pending verification"
3. "Validation complete"
4. "Markets locked until ANIMA + ZER0ID 8004 + validator active"

Forbidden:

1. "Fully live" before `A9_MARKETS_UNLOCKED`
2. "Verified" without evidence object
3. Any implication that Markets is open while `markets_unlocked=false`

## Failure and Recovery Rules

1. Preserve completed evidence; do not reset successful prior stages.
2. Retry only failed current stage unless operator explicitly resets flow.
3. If provisioning environment rotates, keep immutable audit trail linking old and new instance ids.
4. If ZER0ID passport check expires, set `A7_ZEROID_8004=failed` and relock markets.

## Analytics Events (minimum)

1. `accepted_flow_stage_started`
2. `accepted_flow_stage_passed`
3. `accepted_flow_stage_failed`
4. `accepted_flow_markets_unlocked`
5. `accepted_flow_markets_relocked`

Each event includes:

1. `user_id`
2. `stage_id`
3. `flow_version`
4. `timestamp`
5. `evidence_ref` (if present)

## Done Definition (Frontend)

Frontend implementation is complete when:

1. Wizard renders all canonical stage IDs in order.
2. Stage status is driven by backend state, not hardcoded.
3. Markets UI obeys hard unlock rule.
4. Regression from any hard gate relocks market actions.
5. Evidence references are visible on each completed stage.

## Related Files

- `docs/claude-handshake/build-games-2026-mvp.md`
- `docs/claude-handshake/build-games-2026-mvp-tracker.json`
- `docs/claude-handshake/surface-translation-registry.json`
