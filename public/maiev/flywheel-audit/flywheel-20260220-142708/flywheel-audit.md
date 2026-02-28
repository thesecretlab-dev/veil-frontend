# VEIL Economic Flywheel Audit

- generated_at: `2026-02-20T19:27:08.064Z`
- run_dir: `.`
- execute_state_changes: `true`
- overall_pass: `true`

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
| `C08_KEEP3R_INFRA_JOBS` | PASS | VeilTreasury:on, OrderIntentGateway:on, LiquidityIntentGateway:on |
| `C09_KEEP3R_CREDITS_POSITIVE` | PASS | availableCreditsWei=1001800000000000000 |
| `C10_CHAIN_CONNECTION` | PASS | chainId=22207 |

## Findings

- [critical] F001: Full VAI/DAI suite is incomplete in active scope. Missing 9/10: Vat.sol, Jug.sol, Pot.sol, Spot.sol, Dog.sol, Vow.sol, DaiJoin.sol, GemJoin.sol, Clip.sol
- [medium] F003: Treasury remains owned by temporary admin EOA; migrate to hardened control before launch.
- [medium] F004: Keep3r registry is owned by temporary admin EOA; migrate to hardened control before launch.

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
| wVEIL.deposit(0.01) | `0x515287a79b1cab631c251ce594559e9ba3e50e0f3027b60448cb1266dfb8e67d` | SUCCESS | 64 | 29667 |
| wVEIL.approve(treasury,0.005) | `0x0ca81ee452e34402ed080ab25d1e100120f8f93a646c97dd553d978367bb5128` | SUCCESS | 65 | 46152 |
| treasury.depositVeil(0.005) | `0xc7475d1b0d08e80d24e288ef6e12f9dc1250fedd861e8f94ab0537e0ed7126ea` | SUCCESS | 66 | 63036 |
| treasury.fundKeep3r(0.002) | `0xd260f7a03e53d1be5d80c59d29d63bf6b05918f35cc3fe6d403e937338e6d034` | SUCCESS | 67 | 43029 |
| treasury.mintVAI(admin,3) | `0x17f1c55a7ed4996f8ed5ea4496a6d5eb2880f6a637cc91d74a9a7eab674766d7` | SUCCESS | 68 | 42878 |
| VAI.approve(router,1) | `0x5dc119828eeb142c583b20bc19d6ac43e03dc5be262b14edaa15fc8e5aaecaee` | SUCCESS | 69 | 45962 |
| router.swapExactTokensForTokens(VAI->wVEIL) | `0x97b6b39e3b6bb35b88473661fd13e328dfc4a291c8187b3b409479450f4840fd` | SUCCESS | 70 | 91019 |
| keep3r.setJob(admin,true) | `0x3d3c570799fa3b098efcd2e557187c78dd0135e2581e42cda0924ba68ce69c10` | SUCCESS | 71 | 47699 |
| keep3r.worked(opsKeeper1,payout) | `0x8bb3f589ffb2a2bb822c3fe197c09bb8d3da65a6133a864d9aa44ee5d49064cc` | SUCCESS | 72 | 49328 |
| keep3r.setJob(admin,false) | `0x94269f154cd3eab4d35fc407e7d5c24fbdffce1c5bd33ae4217f4a39f49d8552` | SUCCESS | 73 | 30587 |

## Integration Notes

- Job wiring target set: `VeilTreasury`, `VeilOrderIntentGateway`, `VeilLiquidityIntentGateway`.
- Keep3r payout function `worked()` is callable only by addresses flagged in `jobs`.
- No direct contract path currently triggers `worked()` from treasury/gateway contracts (manual/external caller still required).


