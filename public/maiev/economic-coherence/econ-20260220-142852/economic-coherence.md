# VEIL Economic Coherence Audit

- generated_at: `2026-02-20T19:28:52.246Z`
- overall_pass: `false`
- run_dir: `C:\Users\Josh\hypersdk\examples\veilvm\evidence-bundles\economic-coherence\econ-20260220-142852`

## Findings

- [high] ECON-002: Documented TOTAL_SUPPLY does not match active genesis totalSupply; source-of-truth mismatch for launch economics.
- [high] ECON-003: Documented KEEP3R_PROGRAM_POOL does not match 2% target implied by active genesis totalSupply.
- [high] ECON-004: Primary pool depth is insufficient for 100 VAI at <=1% impact; increase depth before launch claims.

## Checks

| Check | Result | Notes |
|---|---|---|
| `E01_SUPPLY_INVARIANT` | PASS | totalSupply=1191449050, computed=1191449050 (alloc+locked+live) |
| `E02_FEE_ROUTER_SUM` | PASS | feeRouterMsrbBips+feeRouterColBips+feeRouterOpsBips=10000 |
| `E03_BACKING_FLOOR` | PASS | reserve=650000, debt=650000, floor=10000 |
| `E04_EPOCH_MINT_BOUNDS` | PASS | epochLimit=32500, debt=650000 |
| `E05_KEEP3R_POOL_2PCT` | PASS | effectiveKeep3rPool=23828981, target(2%)=23828981, explicitInGenesis=23828981 |
| `E06_DOC_TOTAL_SUPPLY_ALIGNMENT` | FAIL | genesis=1191449050, runbook=990999000, executionPackage=990999000 |
| `E07_DOC_KEEP3R_ALIGNMENT` | FAIL | targetKeep3r=23828981, runbook=19819980, executionPackage=19819980 |
| `E08_COL_RELEASE_PARAMS` | PASS | maxReleaseBips=15, epochSeconds=86400, maxReleasePerEpoch=1350000, maxReleasePerDay=1350000 |
| `E09_REFERENCE_SLIPPAGE` | FAIL | referenceTrade=100 VAI, impact=5.032%, target<=1.000% |

## Liquidity Capacity

- target_slippage: `1.000%`
- reference_trade_vai: `100`
- max_trade_vai_at_target_slippage: `14.1911`
- reserve_vai_needed_for_reference_trade: `14100.43`
- reserve_scale_factor_vs_current: `7.0467x`

| Trade (VAI) | Price Impact |
|---|---|
| 1 | 0.350% |
| 5 | 0.548% |
| 10 | 0.794% |
| 20 | 1.284% |
| 50 | 2.723% |
| 100 | 5.032% |
| 200 | 9.335% |
| 500 | 20.184% |
| 1000 | 33.456% |

## Tokenomics Snapshot

```json
{
  "genesisPath": "C:\\Users\\Josh\\hypersdk\\examples\\veilvm\\genesis.launchpad.json",
  "genesisTemplatePath": "C:\\Users\\Josh\\hypersdk\\examples\\veilvm\\genesis.json",
  "totalSupply": 1191449050,
  "computedSupply": 1191449050,
  "allocations": 250000000,
  "colVaultLocked": 900000000,
  "colVaultLive": 41449050,
  "keep3rPoolExplicit": 23828981,
  "keep3rPoolEffective": 23828981,
  "keep3rTarget": 23828981,
  "reserve": 650000,
  "debt": 650000,
  "epochLimit": 32500,
  "floor": 10000,
  "releaseBips": 15,
  "releaseEpochSeconds": 86400,
  "maxReleasePerEpoch": 1350000,
  "maxReleasePerDay": 1350000,
  "feeRouter": {
    "msrb": 7000,
    "col": 2000,
    "ops": 1000,
    "sum": 10000
  },
  "docs": {
    "runbookTotalSupply": 990999000,
    "executionTotalSupply": 990999000,
    "runbookKeep3rPool": 19819980,
    "executionKeep3rPool": 19819980
  },
  "templateTotalSupply": 1191449050
}
```

