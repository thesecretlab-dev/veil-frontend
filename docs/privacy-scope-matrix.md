# Privacy scope matrix (v1)

Date: 2026-08-24  
Runlist: **D07**

| Surface | Private? | Notes |
|---|---|---|
| VeilVM `CommitOrder` envelope | On-chain bytes are opaque. Cleartext is not in events. | Private when proof-gated + strict verifier. |
| VeilVM reveal / proof / clear | Reveal is the unblinding step. | Not anonymous after reveal. |
| Companion `IntentSubmitted` | Commitment + nullifier + envelopeHash only | Relayer holds envelope off-chain. |
| Companion ERC-20 / DEX / VAI | Public if deployed | Not v1 rails. Do not ship. |
| Frontend Polymarket catalog | Public | External venue. Not VEIL settlement. |
| Kalshi | N/A | Not in tree. |
| Encrypted gossip + threshold decrypt | **Not in v1 binary** | D06 FAIL until implemented. Shared-key-only would also FAIL. |

Do not claim full-stack anonymity. Do not claim live private markets on Fuji/mainnet.
