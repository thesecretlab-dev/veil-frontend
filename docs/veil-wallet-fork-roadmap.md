# VEIL Wallet Fork Roadmap

## Goal
Ship a branded, privacy-focused MetaMask fork that works as an injected EVM wallet for VEIL Markets, then make it the default wallet path in the app.

## Fast Execution Plan
1. Fork MetaMask extension and lock to a known stable upstream tag.
2. Rebrand immediately (`VEIL Wallet` name, icons, extension metadata, theme).
3. Add VEIL-first network presets and one-click network switch.
4. Add privacy defaults:
   - telemetry off by default
   - no third-party analytics
   - optional private RPC / relay routing
5. Add provider fingerprint for app detection (`window.ethereum.isVeilWallet = true`).
6. Package signed builds for Chrome and Brave first.

## Security Gates (Non-Negotiable)
1. No custom crypto primitives.
2. Keep MetaMask signing flow unchanged unless audited.
3. Run dependency and SAST checks in CI on every merge.
4. Require two maintainers for release tag signing.
5. Publish reproducible build steps.

## VEIL Frontend Integration Contract
1. Wallet should expose:
   - `eth_requestAccounts`
   - `eth_accounts`
   - `personal_sign`
   - `wallet_switchEthereumChain`
2. Wallet should set `isVeilWallet` on injected provider.
3. App falls back to MetaMask/Coinbase when VEIL Wallet is not installed.

## Current App Status
1. VEIL Wallet is now listed in the in-app wallet picker.
2. MetaMask and Coinbase injected flows are available.
3. WalletConnect is marked as next rollout.

## Next Build Sprint
1. Create `veil-wallet` repo from MetaMask fork and pin upstream commit.
2. Implement rebrand + provider flag.
3. Release internal alpha build and connect it to VEIL frontend.
4. Run signing and whitelist smoke tests end-to-end on staging.
