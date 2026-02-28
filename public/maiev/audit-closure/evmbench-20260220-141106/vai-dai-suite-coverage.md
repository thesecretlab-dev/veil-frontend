# VAI/DAI Full Suite Coverage

- timestamp: 2026-02-20T14:12:27.5688107-05:00
- job_id: `5bc128ab-b89d-4123-a4ec-53db026bc07d`
- status: `succeeded`
- expected_components: `10`
- present_components: `1`
- missing_components: `9`

| Contract | Component | Present | Status | Notes |
|---|---|---|---|---|
| `VeilVAI.sol` | Stable Token | yes | succeeded | ERC20 stablecoin implementation |
| `Vat.sol` | Core Accounting | no | missing-from-repo-scope | Core debt/collateral accounting engine |
| `Jug.sol` | Stability Fee | no | missing-from-repo-scope | Rate accrual module |
| `Pot.sol` | Savings Rate | no | missing-from-repo-scope | Savings module for stable holders |
| `Spot.sol` | Oracle Spot | no | missing-from-repo-scope | Price feed and collateral valuation |
| `Dog.sol` | Liquidations | no | missing-from-repo-scope | Liquidation trigger/auction start |
| `Vow.sol` | Surplus/Deficit | no | missing-from-repo-scope | Debt accounting and settlement |
| `DaiJoin.sol` | Stable Join | no | missing-from-repo-scope | Adapter joining stable into core accounting |
| `GemJoin.sol` | Collateral Join | no | missing-from-repo-scope | Adapter joining collateral into core accounting |
| `Clip.sol` | Auction House | no | missing-from-repo-scope | Collateral auction mechanism |
