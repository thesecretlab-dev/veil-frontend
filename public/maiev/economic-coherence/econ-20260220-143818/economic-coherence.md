# VEIL Economic Coherence Audit

- generated_at: `2026-02-20T19:38:18.054Z`
- overall_pass: `true`
- run_dir: `.`

## Findings

- No findings.

## Checks

| Check | Result | Notes |
|---|---|---|
| `E01_SUPPLY_INVARIANT` | PASS | totalSupply=1191449050, computed=1191449050 (alloc+locked+live) |
| `E02_FEE_ROUTER_SUM` | PASS | feeRouterMsrbBips+feeRouterColBips+feeRouterOpsBips=10000 |
| `E03_BACKING_FLOOR` | PASS | reserve=650000, debt=650000, floor=10000 |
| `E04_EPOCH_MINT_BOUNDS` | PASS | epochLimit=32500, debt=650000 |
| `E05_KEEP3R_POOL_2PCT` | PASS | effectiveKeep3rPool=23828981, target(2%)=23828981, explicitInGenesis=23828981 |
| `E06_DOC_TOTAL_SUPPLY_ALIGNMENT` | PASS | genesis=1191449050, runbook=1191449050, executionPackage=1191449050 |
| `E07_DOC_KEEP3R_ALIGNMENT` | PASS | targetKeep3r=23828981, runbook=23828981, executionPackage=23828981 |
| `E08_COL_RELEASE_PARAMS` | PASS | maxReleaseBips=15, epochSeconds=86400, maxReleasePerEpoch=1350000, maxReleasePerDay=1350000 |
| `E09_REFERENCE_SLIPPAGE` | PASS | referenceTrade=100 VAI, impact=0.967%, target<=1.000% |

## Liquidity Capacity

- target_slippage: `1.000%`
- reference_trade_vai: `100`
- max_trade_vai_at_target_slippage: `105.0000`
- reserve_vai_needed_for_reference_trade: `14100.43`
- reserve_scale_factor_vs_current: `0.9524x`

| Trade (VAI) | Price Impact |
|---|---|
| 1 | 0.307% |
| 5 | 0.334% |
| 10 | 0.367% |
| 20 | 0.434% |
| 50 | 0.635% |
| 100 | 0.967% |
| 200 | 1.625% |
| 500 | 3.548% |
| 1000 | 6.590% |

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
    "runbookTotalSupply": 1191449050,
    "executionTotalSupply": 1191449050,
    "runbookKeep3rPool": 23828981,
    "executionKeep3rPool": 23828981
  },
  "templateTotalSupply": 1191449050
}
```


