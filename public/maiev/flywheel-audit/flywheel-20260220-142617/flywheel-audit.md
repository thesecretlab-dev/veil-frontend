# VEIL Economic Flywheel Audit

- generated_at: `2026-02-20T19:26:17.889Z`
- run_dir: `.`
- execute_state_changes: `true`
- overall_pass: `false`

## Runtime Checks

| Check | Result | Notes |
|---|---|---|
| `C01_BYTECODE_PRESENT` | PASS | All expected contracts have bytecode. |
| `C02_PAIR_REGISTRY` | PASS | Factory pair=0x39b8Ee60Ac0c733884E08Bc5112f35726CCc95db, configured=0x39b8Ee60Ac0c733884E08Bc5112f35726CCc95db |
| `C03_VAI_MINTER_LINK` | PASS | VAI.minter=0x93789412A4b682D397f9B485c324BbaAabf8EED6 |
| `C04_TREASURY_KEEP3R_LINK` | PASS | Treasury.keep3r=0xc093Cb259B2322fb709F7096eD5D1f25121eBbFc |
| `C05_KEEPER_ACTIVE` | PASS | isKeeper(0x698acAcB4446ACaE951b5b9872a8bDC0C3c64A55)=true |
| `C06_POOL_RESERVES_NONZERO` | PASS | reserve0=2000000000000000000000, reserve1=2000000000000000000 |
| `C07_KEEP3R_JOB_GATING` | PASS | Non-job caller cannot execute worked(). |
| `C99_EXECUTION_PATH` | FAIL | Execution probe failed: nonce has already been used (transaction="0x02f8748256bf3501850ba43b7401827541947c93f4a42c91edce9286a5d88da13b5d1cea8116872386f26fc1000084d0e30db0c080a0a423a2ecf8d3b739fd9c662ab4440ed177e285312901ef1783bdb11ef19502baa013453f62ba9dd18d73be2e4b6c6ff9ae2444a664f99b8e2ee0e053b8e4fdc6bf", info={ "error": { "code": -32000, "message": "nonce too low: next nonce 54, tx nonce 53" } }, code=NONCE_EXPIRED, version=6.16.0) |
| `C08_KEEP3R_INFRA_JOBS` | PASS | VeilTreasury:on, OrderIntentGateway:on, LiquidityIntentGateway:on |
| `C09_KEEP3R_CREDITS_POSITIVE` | PASS | availableCreditsWei=1000000000000000000 |
| `C10_CHAIN_CONNECTION` | PASS | chainId=22207 |

## Findings

- [critical] F001: Full VAI/DAI suite is incomplete in active scope. Missing 9/10: Vat.sol, Jug.sol, Pot.sol, Spot.sol, Dog.sol, Vow.sol, DaiJoin.sol, GemJoin.sol, Clip.sol
- [medium] F003: Treasury remains owned by temporary admin EOA; migrate to hardened control before launch.
- [medium] F004: Keep3r registry is owned by temporary admin EOA; migrate to hardened control before launch.
- [high] F005: Stateful flywheel probe failed: nonce has already been used (transaction="0x02f8748256bf3501850ba43b7401827541947c93f4a42c91edce9286a5d88da13b5d1cea8116872386f26fc1000084d0e30db0c080a0a423a2ecf8d3b739fd9c662ab4440ed177e285312901ef1783bdb11ef19502baa013453f62ba9dd18d73be2e4b6c6ff9ae2444a664f99b8e2ee0e053b8e4fdc6bf", info={ "error": { "code": -32000, "message": "nonce too low: next nonce 54, tx nonce 53" } }, code=NONCE_EXPIRED, version=6.16.0)

## VAI/DAI Suite Coverage

- expected_components: `10`
- present_components: `1`
- missing_components: `9`

| Contract | Component | Present |
|---|---|---|
| `VeilVAI.sol` | Stable Token | yes |
| `Vat.sol` | Core Accounting | no |
| `Jug.sol` | Stability Fee | no |
| `Pot.sol` | Savings Rate | no |
| `Spot.sol` | Oracle Spot | no |
| `Dog.sol` | Liquidations | no |
| `Vow.sol` | Surplus/Deficit | no |
| `DaiJoin.sol` | Stable Join | no |
| `GemJoin.sol` | Collateral Join | no |
| `Clip.sol` | Auction House | no |

## Transaction Trace

| Step | Tx Hash | Status | Block | Gas Used |
|---|---|---|---|---|
| keep3r.setJob(VeilTreasury,true) | `0x8a590f7d5438dd94ea8731063d556e6af0e26c1ba67f4f877e48d74520ccce8f` | SUCCESS | 61 | 47699 |
| keep3r.setJob(OrderIntentGateway,true) | `0x339bda21b1823db84ffc65ce7a07d419f92969de36303e55bac7e5e05370aa5f` | SUCCESS | 62 | 47699 |
| keep3r.setJob(LiquidityIntentGateway,true) | `0x4b9ffd1bda6cc6312b2b2f4548559298435b03b33cffd588056de5bbeb8b354a` | SUCCESS | 63 | 47699 |

## Integration Notes

- Job wiring target set: `VeilTreasury`, `VeilOrderIntentGateway`, `VeilLiquidityIntentGateway`.
- Keep3r payout function `worked()` is callable only by addresses flagged in `jobs`.
- No direct contract path currently triggers `worked()` from treasury/gateway contracts (manual/external caller still required).


