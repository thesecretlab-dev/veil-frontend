# VEIL Launch-Gate Evidence Bundle

- Generated: 2026-02-20T02:33:25.395Z
- Node URL: `http://127.0.0.1:9660`
- Chain ID: `2DJ5iQHB2JNjPKZHqCL4XABS6BFqSM74GGGJooKq8tD8Kk3zoy`
- Verdict: **FAIL**

## Checks

| Check | Status | Duration (s) | Accepted | Rejected | Missed | Output Dir | Notes |
|---|---|---:|---:|---:|---:|---|---|
| backup-takeover-primary-fails | PASS | 213.1 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-022936-backup-takeover-primary-fails` | primary prover rejected under backup authority gate |
| backup-takeover-backup-recovers | FAIL | 0.9 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-022936-backup-takeover-backup-recovers` | process exit code 1 |

## Artifacts

- backup-takeover-primary-fails
  - summary: ``
  - stdout: `evidence-bundles\20260220-022936-launch-gate-evidence\logs\backup-takeover-primary-fails.stdout.log`
  - stderr: `evidence-bundles\20260220-022936-launch-gate-evidence\logs\backup-takeover-primary-fails.stderr.log`
- backup-takeover-backup-recovers
  - summary: ``
  - stdout: `evidence-bundles\20260220-022936-launch-gate-evidence\logs\backup-takeover-backup-recovers.stdout.log`
  - stderr: `evidence-bundles\20260220-022936-launch-gate-evidence\logs\backup-takeover-backup-recovers.stderr.log`

