# VEIL Launch-Gate Evidence Bundle

- Generated: 2026-02-20T01:56:06.379Z
- Node URL: `http://127.0.0.1:9660`
- Chain ID: `2DJ5iQHB2JNjPKZHqCL4XABS6BFqSM74GGGJooKq8tD8Kk3zoy`
- Verdict: **FAIL**

## Checks

| Check | Status | Duration (s) | Accepted | Rejected | Missed | Output Dir | Notes |
|---|---|---:|---:|---:|---:|---|---|
| shielded-smoke | PASS | 211.3 | 1 | 0 | 0 | `./zkbench-out-evidence-20260220-014450-shielded-smoke` | accepted=1, rejected=0, missed=0 |
| backup-takeover-primary-fails | PASS | 218.2 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-014450-backup-takeover-primary-fails` | primary prover rejected under backup authority gate |
| backup-takeover-backup-recovers | PASS | 220.0 | 1 | 0 | 0 | `./zkbench-out-evidence-20260220-014450-backup-takeover-backup-recovers` | accepted=1, rejected=0, missed=0 |
| synthetic-negative | PASS | 5.6 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-014450-synthetic-negative` | expected fail-close proof rejection observed (non-zero exit) |
| malformed-proof | FAIL | 0.9 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-014450-malformed-proof` | unexpected process exit code 1 |
| timeout-drill-b8 | FAIL | 1.0 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-014450-timeout-drill-b8` | unexpected process exit code 1 |
| timeout-drill-b32 | FAIL | 1.2 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-014450-timeout-drill-b32` | unexpected process exit code 1 |

## Artifacts

- shielded-smoke
  - summary: `zkbench-out-evidence-20260220-014450-shielded-smoke\summary.json`
  - stdout: `evidence-bundles\20260220-014450-launch-gate-evidence\logs\shielded-smoke.stdout.log`
  - stderr: `evidence-bundles\20260220-014450-launch-gate-evidence\logs\shielded-smoke.stderr.log`
- backup-takeover-primary-fails
  - summary: ``
  - stdout: `evidence-bundles\20260220-014450-launch-gate-evidence\logs\backup-takeover-primary-fails.stdout.log`
  - stderr: `evidence-bundles\20260220-014450-launch-gate-evidence\logs\backup-takeover-primary-fails.stderr.log`
- backup-takeover-backup-recovers
  - summary: `zkbench-out-evidence-20260220-014450-backup-takeover-backup-recovers\summary.json`
  - stdout: `evidence-bundles\20260220-014450-launch-gate-evidence\logs\backup-takeover-backup-recovers.stdout.log`
  - stderr: `evidence-bundles\20260220-014450-launch-gate-evidence\logs\backup-takeover-backup-recovers.stderr.log`
- synthetic-negative
  - summary: ``
  - stdout: `evidence-bundles\20260220-014450-launch-gate-evidence\logs\synthetic-negative.stdout.log`
  - stderr: `evidence-bundles\20260220-014450-launch-gate-evidence\logs\synthetic-negative.stderr.log`
- malformed-proof
  - summary: ``
  - stdout: `evidence-bundles\20260220-014450-launch-gate-evidence\logs\malformed-proof.stdout.log`
  - stderr: `evidence-bundles\20260220-014450-launch-gate-evidence\logs\malformed-proof.stderr.log`
- timeout-drill-b8
  - summary: ``
  - stdout: `evidence-bundles\20260220-014450-launch-gate-evidence\logs\timeout-drill-b8.stdout.log`
  - stderr: `evidence-bundles\20260220-014450-launch-gate-evidence\logs\timeout-drill-b8.stderr.log`
- timeout-drill-b32
  - summary: ``
  - stdout: `evidence-bundles\20260220-014450-launch-gate-evidence\logs\timeout-drill-b32.stdout.log`
  - stderr: `evidence-bundles\20260220-014450-launch-gate-evidence\logs\timeout-drill-b32.stderr.log`

