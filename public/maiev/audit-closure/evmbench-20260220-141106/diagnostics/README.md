# Diagnostics Package

- generated_at: 2026-02-20T14:12:28.1060858-05:00
- job_id: `5bc128ab-b89d-4123-a4ec-53db026bc07d`
- status: `succeeded`
- worker_container: `evmbench-worker-5bc128ab-b89d-4123-a4ec-53db026bc07d`

## Files
- `manifest.json`: machine-readable diagnostics index
- `docker-logs/*.log`: backend/proxy/service logs (tail capture)
- `worker/*.log`: worker-side codex and runner logs when available
- `../run-metadata.json`: polling timeline and run metadata
- `../source-commentary.json`: code-focused commentary per contract
- `../contract-file-digests.json`: SHA256 and line/byte counts
- `../audited-sources/`: exact code snapshot audited in this run
