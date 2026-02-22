# VEIL Launch-Gate Evidence Bundle

- Generated: 2026-02-20T20:19:03.404Z
- Node URL: `http://127.0.0.1:9660`
- Chain ID: `2CdK3iHBweFSZhh5XBgLYDaC2U7SoyqEzDaTRhmMFwSLLCm1Xb`
- Verdict: **PASS**

## Checks

| Check | Status | Duration (s) | Accepted | Rejected | Missed | Output Dir | Notes |
|---|---|---:|---:|---:|---:|---|---|
| backup-takeover-primary-fails | PASS | 271.4 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-200231-backup-takeover-primary-fails` | primary prover rejected under backup authority gate |
| backup-takeover-backup-recovers | PASS | 224.9 | 1 | 0 | 0 | `./zkbench-out-evidence-20260220-200231-backup-takeover-backup-recovers` | accepted=1, rejected=0, missed=0 |
| malformed-proof | PASS | 220.9 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-200231-malformed-proof` | expected malformed-proof rejection observed (non-zero exit) |
| timeout-drill-b8 | PASS | 218.9 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-200231-timeout-drill-b8` | expected timeout/deadline failure observed (non-zero exit) |

## Artifacts

- backup-takeover-primary-fails
  - summary: ``
  - stdout: `evidence-bundles\20260220-200231-launch-gate-evidence\logs\backup-takeover-primary-fails.stdout.log`
  - stderr: `evidence-bundles\20260220-200231-launch-gate-evidence\logs\backup-takeover-primary-fails.stderr.log`
- backup-takeover-backup-recovers
  - summary: `zkbench-out-evidence-20260220-200231-backup-takeover-backup-recovers\summary.json`
  - stdout: `evidence-bundles\20260220-200231-launch-gate-evidence\logs\backup-takeover-backup-recovers.stdout.log`
  - stderr: `evidence-bundles\20260220-200231-launch-gate-evidence\logs\backup-takeover-backup-recovers.stderr.log`
- malformed-proof
  - summary: ``
  - stdout: `evidence-bundles\20260220-200231-launch-gate-evidence\logs\malformed-proof.stdout.log`
  - stderr: `evidence-bundles\20260220-200231-launch-gate-evidence\logs\malformed-proof.stderr.log`
- timeout-drill-b8
  - summary: ``
  - stdout: `evidence-bundles\20260220-200231-launch-gate-evidence\logs\timeout-drill-b8.stdout.log`
  - stderr: `evidence-bundles\20260220-200231-launch-gate-evidence\logs\timeout-drill-b8.stderr.log`

