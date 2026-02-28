# VEIL Economic Flywheel Audit

- generated_at: `2026-02-20T19:58:40.306Z`
- run_dir: `.`
- execute_state_changes: `false`
- overall_pass: `true`

## Runtime Checks

| Check | Result | Notes |
|---|---|---|
| `C01_BYTECODE_PRESENT` | PASS | All expected contracts have bytecode. |
| `C02_PAIR_REGISTRY` | PASS | Factory pair=0x39b8Ee60Ac0c733884E08Bc5112f35726CCc95db, configured=0x39b8Ee60Ac0c733884E08Bc5112f35726CCc95db |
| `C03_VAI_MINTER_LINK` | PASS | VAI.minter=0x93789412A4b682D397f9B485c324BbaAabf8EED6 |
| `C04_TREASURY_KEEP3R_LINK` | PASS | Treasury.keep3r=0xc093Cb259B2322fb709F7096eD5D1f25121eBbFc |
| `C05_KEEPER_ACTIVE` | PASS | isKeeper(0x698acAcB4446ACaE951b5b9872a8bDC0C3c64A55)=true |
| `C06_POOL_RESERVES_NONZERO` | PASS | reserve0=14805449999999992982797, reserve1=14790677821618659713 |
| `C07_KEEP3R_JOB_GATING` | PASS | Skipped state-changing gating probe (read-only mode). |
| `C08_KEEP3R_INFRA_JOBS` | PASS | VeilTreasury:on, OrderIntentGateway:on, LiquidityIntentGateway:on |
| `C09_KEEP3R_CREDITS_POSITIVE` | PASS | availableCreditsWei=1001800000000000000 |
| `C10_CHAIN_CONNECTION` | PASS | chainId=22207 |

## Findings

- [medium] F003: Treasury remains owned by temporary admin EOA; migrate to hardened control before launch.
- [medium] F004: Keep3r registry is owned by temporary admin EOA; migrate to hardened control before launch.

## VAI/DAI Suite Coverage

- expected_components: `10`
- present_components: `10`
- missing_components: `0`

| Contract | Component | Present |
|---|---|---|
| `VeilVAI.sol` | Stable Token | yes |
| `Vat.sol` | Core Accounting | yes |
| `Jug.sol` | Stability Fee | yes |
| `Pot.sol` | Savings Rate | yes |
| `Spot.sol` | Oracle Spot | yes |
| `Dog.sol` | Liquidations | yes |
| `Vow.sol` | Surplus/Deficit | yes |
| `DaiJoin.sol` | Stable Join | yes |
| `GemJoin.sol` | Collateral Join | yes |
| `Clip.sol` | Auction House | yes |

## Transaction Trace

- No transactions executed (read-only mode).

## Integration Notes

- Job wiring target set: `VeilTreasury`, `VeilOrderIntentGateway`, `VeilLiquidityIntentGateway`.
- Keep3r payout function `worked()` is callable only by addresses flagged in `jobs`.
- No direct contract path currently triggers `worked()` from treasury/gateway contracts (manual/external caller still required).


