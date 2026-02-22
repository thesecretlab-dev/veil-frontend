# VEIL Privacy Scope Matrix

Last updated: 2026-02-20

This matrix defines which VEIL surfaces are currently private vs public. It is the canonical source for claim wording in UI, docs, and assistant responses.

## Scope by Surface

| Surface | Current Behavior | Privacy Status | Evidence |
| --- | --- | --- | --- |
| VEIL VM proof-gated lane | Shielded lane tests pass for proof-gated clear path, malformed-proof rejection, timeout enforcement, and backup takeover. | Private (VM lane) | `public/maiev/vm-privacy-audit/vmprivacy-20260220-155511/vm-privacy-audit.md` |
| Order intents on companion EVM | Intent struct stores `trader` and amount fields; `IntentSubmitted` event emits these fields. | Public | `public/maiev/audit-closure/evmbench-20260220-141106/audited-sources/VeilOrderIntentGateway.sol` |
| Liquidity intents on companion EVM | Intent struct stores `trader` and amount fields; `LiquidityIntentSubmitted` event emits detailed amounts. | Public | `public/maiev/audit-closure/evmbench-20260220-141106/audited-sources/VeilLiquidityIntentGateway.sol` |
| VAI token on companion EVM | ERC-20 style `Transfer` and `Approval` events expose sender, receiver, and amount. | Public | `public/maiev/audit-closure/evmbench-20260220-141106/audited-sources/VeilVAI.sol` |
| Companion EVM UniV2 pools/router | Pool reserves, swaps, liquidity operations, and logs are explorer-visible. | Public | `public/maiev/audit-closure/evmbench-20260220-141106/audited-sources/VeilUniV2Pair.sol`, `public/maiev/audit-closure/evmbench-20260220-141106/audited-sources/VeilUniV2Router.sol` |

## Claim Policy

- Do not claim complete anonymity or full-stack privacy.
- Do claim privacy for VEIL VM shielded lanes when the flow stays inside proof-gated execution paths.
- Explicitly state that companion EVM rails are transparent by design.

