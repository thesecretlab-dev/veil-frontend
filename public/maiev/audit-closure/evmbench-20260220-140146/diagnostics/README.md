# Diagnostics Package

- generated_at: 2026-02-20T14:03:07.5779856-05:00
- job_id: `a7f4fc4f-5c8a-4db1-b56d-5f8aadaace09`
- status: `succeeded`
- worker_container: `evmbench-worker-a7f4fc4f-5c8a-4db1-b56d-5f8aadaace09`

## Files
- `manifest.json`: machine-readable diagnostics index
- `docker-logs/*.log`: backend/proxy/service logs (tail capture)
- `worker/*.log`: worker-side codex and runner logs when available
- `../run-metadata.json`: polling timeline and run metadata
- `../source-commentary.json`: code-focused commentary per contract
- `../contract-file-digests.json`: SHA256 and line/byte counts
- `../audited-sources/`: exact code snapshot audited in this run
