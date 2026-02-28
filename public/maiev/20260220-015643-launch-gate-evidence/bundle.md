# VEIL Launch-Gate Evidence Bundle

- Generated: 2026-02-20T02:15:21.711Z
- Node URL: `http://127.0.0.1:9660`
- Chain ID: `2DJ5iQHB2JNjPKZHqCL4XABS6BFqSM74GGGJooKq8tD8Kk3zoy`
- Verdict: **PASS**

## Checks

| Check | Status | Duration (s) | Accepted | Rejected | Missed | Output Dir | Notes |
|---|---|---:|---:|---:|---:|---|---|
| shielded-smoke | PASS | 221.7 | 1 | 0 | 0 | `./zkbench-out-evidence-20260220-015643-shielded-smoke` | accepted=1, rejected=0, missed=0 |
| backup-takeover-primary-fails | PASS | 213.3 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-015643-backup-takeover-primary-fails` | primary prover rejected under backup authority gate |
| backup-takeover-backup-recovers | PASS | 213.9 | 1 | 0 | 0 | `./zkbench-out-evidence-20260220-015643-backup-takeover-backup-recovers` | accepted=1, rejected=0, missed=0 |
| synthetic-negative | PASS | 6.5 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-015643-synthetic-negative` | expected fail-close proof rejection observed (non-zero exit) |
| malformed-proof | PASS | 226.8 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-015643-malformed-proof` | expected malformed-proof rejection observed (non-zero exit) |
| timeout-drill-b8 | PASS | 215.9 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-015643-timeout-drill-b8` | expected timeout/deadline failure observed (non-zero exit) |

## Artifacts

- shielded-smoke
  - summary: `zkbench-out-evidence-20260220-015643-shielded-smoke\summary.json`
  - stdout: `evidence-bundles\20260220-015643-launch-gate-evidence\logs\shielded-smoke.stdout.log`
  - stderr: `evidence-bundles\20260220-015643-launch-gate-evidence\logs\shielded-smoke.stderr.log`
- backup-takeover-primary-fails
  - summary: ``
  - stdout: `evidence-bundles\20260220-015643-launch-gate-evidence\logs\backup-takeover-primary-fails.stdout.log`
  - stderr: `evidence-bundles\20260220-015643-launch-gate-evidence\logs\backup-takeover-primary-fails.stderr.log`
- backup-takeover-backup-recovers
  - summary: `zkbench-out-evidence-20260220-015643-backup-takeover-backup-recovers\summary.json`
  - stdout: `evidence-bundles\20260220-015643-launch-gate-evidence\logs\backup-takeover-backup-recovers.stdout.log`
  - stderr: `evidence-bundles\20260220-015643-launch-gate-evidence\logs\backup-takeover-backup-recovers.stderr.log`
- synthetic-negative
  - summary: ``
  - stdout: `evidence-bundles\20260220-015643-launch-gate-evidence\logs\synthetic-negative.stdout.log`
  - stderr: `evidence-bundles\20260220-015643-launch-gate-evidence\logs\synthetic-negative.stderr.log`
- malformed-proof
  - summary: ``
  - stdout: `evidence-bundles\20260220-015643-launch-gate-evidence\logs\malformed-proof.stdout.log`
  - stderr: `evidence-bundles\20260220-015643-launch-gate-evidence\logs\malformed-proof.stderr.log`
- timeout-drill-b8
  - summary: ``
  - stdout: `evidence-bundles\20260220-015643-launch-gate-evidence\logs\timeout-drill-b8.stdout.log`
  - stderr: `evidence-bundles\20260220-015643-launch-gate-evidence\logs\timeout-drill-b8.stderr.log`

