# VEIL Economic Flywheel Audit

- generated_at: `2026-02-20T19:22:14.587Z`
- run_dir: `.`
- execute_state_changes: `false`
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
| `C07_KEEP3R_JOB_GATING` | PASS | Skipped state-changing gating probe (read-only mode). |
| `C08_KEEP3R_INFRA_JOBS` | FAIL | VeilTreasury:off, OrderIntentGateway:off, LiquidityIntentGateway:off |
| `C09_KEEP3R_CREDITS_POSITIVE` | PASS | availableCreditsWei=1000000000000000000 |
| `C10_CHAIN_CONNECTION` | PASS | chainId=22207 |

## Findings

- [critical] F001: Full VAI/DAI suite is incomplete in active scope. Missing 9/10: Vat.sol, Jug.sol, Pot.sol, Spot.sol, Dog.sol, Vow.sol, DaiJoin.sol, GemJoin.sol, Clip.sol
- [high] F002: Keep3r infra jobs are not fully enabled for treasury/order/liquidity gateways.
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

- No transactions executed (read-only mode).

## Integration Notes

- Job wiring target set: `VeilTreasury`, `VeilOrderIntentGateway`, `VeilLiquidityIntentGateway`.
- Keep3r payout function `worked()` is callable only by addresses flagged in `jobs`.
- No direct contract path currently triggers `worked()` from treasury/gateway contracts (manual/external caller still required).


