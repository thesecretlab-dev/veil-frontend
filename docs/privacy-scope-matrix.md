# VEIL Privacy Scope Matrix

Last updated: 2026-08-24

Canonical layering: `veil-docs/architecture/VEIL_STACK.md`.

This matrix is the source for claim wording in UI, docs, and assistant responses.

## Scope by Surface

| Surface | Current Behavior | Privacy Status | Evidence |
| --- | --- | --- | --- |
| VEIL VM proof-gated lane | Commit / reveal / proof / clear. Private when verifier is strict. Not live on Fuji/mainnet. | Private (VM lane, local-only until Fuji) | `veilvm` actions 2–4, 17 |
| Order intents on companion EVM | `submitIntent(commitment, nullifier)`. Events emit ids/commitment/nullifier/nonce. Trader stored for cancel auth, not in events. Envelope off-chain. | Commitment-only on the wire | `contracts/bridge/VeilOrderIntentGateway.sol` |
| Liquidity intents on companion EVM | Same commit-only pattern. | Commitment-only on the wire | `contracts/bridge/VeilLiquidityIntentGateway.sol` |
| Parked companion VAI / UniV2 | ERC-20 and pool logs would be public **if deployed**. Not v1 rails. | Public (do not ship in v1) | parked `VeilVAI.sol`, `VeilUniV2Dex.sol` |
| veil.markets | Polymarket feeds. Not VeilVM settlement. | Public / external | frontend README |

## Claim Policy

- Do not claim complete anonymity or full-stack privacy.
- Do claim privacy for VEIL VM shielded lanes when the flow stays inside proof-gated execution paths.
- Explicitly state that companion EVM rails are transparent by design.

