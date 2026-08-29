# Privacy scope matrix (v1)

Date: 2026-08-29  
Runlist: **D07** (local). Canonical: veil-docs `specs/VEIL_LOCAL_RUNTIME_STATUS_2026-08-27.md`.

Clients should use Mesh (`:8787`) not the node. Mesh `/v1/evm` is anvil 31337. Mesh `/v1/core` is HyperSDK app-id 22207. Local RPC ingest to the producer is still plaintext.

| Surface | Private? | Notes |
|---|---|---|
| VeilVM `CommitOrder` envelope | Native UX envelopes are `VEILENC1` AES-256-GCM. Commitment = sha256(ciphertext). | Local operator path. Window key is revealed on `RevealBatch`. |
| VeilVM reveal / proof / clear | `/native/settle-batch`. Clear requires ≥1 reveal share + groth16 `shielded-ledger-v1`. | Digest-binds fills + commitment/nullifier/state-root slots. Not in-circuit matching. Not anonymous after reveal. |
| Companion `IntentSubmitted` | Commitment + nullifier + envelopeHash only | Relayer holds envelope off-chain. Local anvil e2e PASS. |
| Companion ERC-20 / DEX / VAI | Public if deployed | Not v1 rails. Do not ship. |
| Frontend Polymarket catalog | Public | External venue. Not VEIL settlement. |
| Kalshi | N/A | Not in tree. |
| Encrypted gossip + threshold decrypt | **VTG2 2-of-3 in the local binary** | Shamir + X25519. `t>=2` required when encryption is required. Outer VTG1 rejected. One key cannot decrypt. Shared AES is not a private mempool. Local RPC `SubmitTx` is still plaintext ingest. |

Do not claim full-stack anonymity. Do not claim live private markets on Fuji/mainnet.
