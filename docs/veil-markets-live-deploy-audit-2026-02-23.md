# VEIL.markets Live Deploy Audit (2026-02-23)

This audit was run against the live site (not local repo rendering) using the closed-alpha key gate.

## Direct Answer: Whitepaper Location

- The whitepaper-style surface on live is `https://veil.markets/app/docs`.
- There is no separate public `https://veil.markets/docs` page.
- In this repo, that surface maps to `app/app/docs/page.tsx`.

## Live Crawl Evidence

- Crawl artifact: `<local-path-removed>`
- Crawl scope: sitemap routes + discovered internal links (259 URLs crawled).
- Canonical truth baseline used:
  - `<local-path-removed>` (decision `GO FOR PRODUCTION`, all gates pass/pass-local)
  - `<local-path-removed>` (owner-key LP custody caveat is non-gate operational blocker)

## Live Copy Drift (High Priority)

1. `https://veil.markets/app/agents`
   - Live text still shows `Launch Posture NO-GO`.
2. `https://veil.markets/app/defi`
   - Live text says launch gates are `still NO-GO`.
3. `https://veil.markets/app/ecosystem`
   - Live text says routes are preview/docs-only while launch gates remain `NO-GO`.
4. `https://veil.markets/app/blog/introducing-veil`
   - Live text says launch posture remains `NO-GO`.
5. `https://veil.markets/app/blog/privacy-native-prediction-markets`
   - Live text says full production launch remains `NO-GO`.
6. `https://veil.markets/app/gov`
   - Live text says voting/delegation are gated until launch readiness is closed.
7. `https://veil.markets/app/investor-deck`
   - Live KPI still shows `6/12` launch gates and in-progress framing.
8. `https://veil.markets/app/support`
   - Live FAQ says trading remains gated until launch checklist closure.
9. `https://veil.markets/app/terms`
   - Live text says preview-only until launch gates are fully closed.
10. `https://veil.markets/app/transparency`
    - Live panel still shows `6 / 12`, `NO-GO`, and `Current Critical Gap` language.
11. `https://veil.markets/app/veil`
    - Live text still uses `Testnet mode active` and preview-only launch-status wording.
12. `https://veil.markets/maiev`
    - Live text still shows launch posture `NO-GO` with `6/12` gates.

## Whitepaper/Docs Surface Status

- `https://veil.markets/app/docs` is reachable and content-rich.
- It does not currently expose the obvious stale `NO-GO`/`6/12` strings listed above.
- Operationally, it is still part of the same stale deploy context because core launch-status surfaces around it are outdated.

## Recommended Wording Baseline For Live

Use this as the default launch sentence across status surfaces:

`Launch authority is GO FOR PRODUCTION (2026-02-22). All launch gates are PASS/PASS(local); treasury-owned LP actions remain signer-custody blocked pending owner migration or controlled redeploy.`


