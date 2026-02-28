# VEIL VM Privacy Audit

- generated_at: `2026-02-20T20:54:07.308Z`
- source_bundle: `.`
- overall_pass: `true`

## Core VM/Privacy Checks

| Check | Result | Notes |
|---|---|---|
| `shielded-smoke` | PASS | pass |
| `backup-takeover` | PASS | pass |
| `synthetic-negative` | PASS | pass |
| `malformed-proof` | PASS | pass |
| `timeout-drill` | PASS | pass |

## Privacy Mechanism Verdict

| Mechanism | Status | Notes |
|---|---|---|
| `M1_PROOF_GATED_CLEAR` | PASS | Shielded smoke accepted with proof path |
| `M2_FAIL_CLOSE_NEGATIVE` | PASS | Synthetic mismatch rejected (fail-close) |
| `M3_MALFORMED_PROOF_REJECT` | PASS | Malformed proof envelope rejected |
| `M4_TIMEOUT_ENFORCEMENT` | PASS | Proof deadline timeout enforced |
| `M5_BACKUP_PROVER_TAKEOVER` | PASS | Primary rejected under backup authority, backup signer recovers |

## Findings

- none

## Metrics Snapshot

- chain_id: `2CdK3iHBweFSZhh5XBgLYDaC2U7SoyqEzDaTRhmMFwSLLCm1Xb`
- node_url: `http://127.0.0.1:9660`
- runner: `docker`
- docker_image: `veilvm-zkbench-evidence:local`
- proof_mode: `groth16`
- proof_circuit_id: `shielded-ledger-v1`
- accepted_batches: `1`
- rejected_batches: `0`
- missed_proof_deadlines: `0`
- proof_submissions: `1`
- proof_submission_errors: `0`

## Source Artifacts

- bundle_json: `.`
- bundle_md: `.`

