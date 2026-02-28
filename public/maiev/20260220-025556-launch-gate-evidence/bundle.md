# VEIL Launch-Gate Evidence Bundle

- Generated: 2026-02-20T03:10:44.723Z
- Node URL: `http://127.0.0.1:9660`
- Chain ID: `TEV1x8r8HjAwdDhj3GhkpyxKrLLKXFHHxYEYeW8jdnsLFFgVa`
- Verdict: **PASS**

## Checks

| Check | Status | Duration (s) | Accepted | Rejected | Missed | Output Dir | Notes |
|---|---|---:|---:|---:|---:|---|---|
| backup-takeover-primary-fails | PASS | 212.0 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-025556-backup-takeover-primary-fails` | primary prover rejected under backup authority gate |
| backup-takeover-backup-recovers | PASS | 215.1 | 1 | 0 | 0 | `./zkbench-out-evidence-20260220-025556-backup-takeover-backup-recovers` | accepted=1, rejected=0, missed=0 |
| synthetic-negative | PASS | 6.0 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-025556-synthetic-negative` | expected fail-close proof rejection observed (non-zero exit) |
| malformed-proof | PASS | 216.6 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-025556-malformed-proof` | expected malformed-proof rejection observed (non-zero exit) |
| timeout-drill-b1 | PASS | 223.3 | 0 | 0 | 0 | `./zkbench-out-evidence-20260220-025556-timeout-drill-b1` | expected timeout/deadline failure observed (non-zero exit) |

## Artifacts

- backup-takeover-primary-fails
  - summary: ``
  - stdout: `evidence-bundles\20260220-025556-launch-gate-evidence\logs\backup-takeover-primary-fails.stdout.log`
  - stderr: `evidence-bundles\20260220-025556-launch-gate-evidence\logs\backup-takeover-primary-fails.stderr.log`
- backup-takeover-backup-recovers
  - summary: `zkbench-out-evidence-20260220-025556-backup-takeover-backup-recovers\summary.json`
  - stdout: `evidence-bundles\20260220-025556-launch-gate-evidence\logs\backup-takeover-backup-recovers.stdout.log`
  - stderr: `evidence-bundles\20260220-025556-launch-gate-evidence\logs\backup-takeover-backup-recovers.stderr.log`
- synthetic-negative
  - summary: ``
  - stdout: `evidence-bundles\20260220-025556-launch-gate-evidence\logs\synthetic-negative.stdout.log`
  - stderr: `evidence-bundles\20260220-025556-launch-gate-evidence\logs\synthetic-negative.stderr.log`
- malformed-proof
  - summary: ``
  - stdout: `evidence-bundles\20260220-025556-launch-gate-evidence\logs\malformed-proof.stdout.log`
  - stderr: `evidence-bundles\20260220-025556-launch-gate-evidence\logs\malformed-proof.stderr.log`
- timeout-drill-b1
  - summary: ``
  - stdout: `evidence-bundles\20260220-025556-launch-gate-evidence\logs\timeout-drill-b1.stdout.log`
  - stderr: `evidence-bundles\20260220-025556-launch-gate-evidence\logs\timeout-drill-b1.stderr.log`

