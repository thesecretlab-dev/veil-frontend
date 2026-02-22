# Diagnostics Package

- generated_at: 2026-02-20T14:06:40.7437988-05:00
- job_id: `4800e4e6-e431-4966-b85f-885e4e16b41d`
- status: `succeeded`
- worker_container: `evmbench-worker-4800e4e6-e431-4966-b85f-885e4e16b41d`

## Files
- `manifest.json`: machine-readable diagnostics index
- `docker-logs/*.log`: backend/proxy/service logs (tail capture)
- `worker/*.log`: worker-side codex and runner logs when available
- `../run-metadata.json`: polling timeline and run metadata
- `../source-commentary.json`: code-focused commentary per contract
- `../contract-file-digests.json`: SHA256 and line/byte counts
- `../audited-sources/`: exact code snapshot audited in this run
