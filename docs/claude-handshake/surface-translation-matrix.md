# Surface Translation Matrix (Claude Handshake)

Use this to translate protocol reality into frontend copy without drift.

Date: 2026-02-22

## 1) Launch Status

Protocol reality:

- Launch checklist is authoritative.
- Current state is `NO-GO` with `6 PASS (local) / 4 IN PROGRESS / 2 FAIL`.

Allowed wording:

- "Production launch is currently NO-GO while remaining gates are closed."
- "We publish gate status and evidence as work progresses."

Forbidden wording:

- "Launching now"
- "Mainnet ready"
- "Production private L1 is live"

## 2) Private Execution / Privacy

Protocol reality:

- VM-native strict-private path is the intended private execution path.
- Local threshold-keyed mempool path is implemented and locally validated.
- Production ceremony/rollout evidence remains pending (`G2`, `G10`, `G11` impact).

Allowed wording:

- "Privacy-first VM-native execution path"
- "Local threshold-keyed privacy path validated"
- "Production rollout evidence pending"

Forbidden wording:

- "Fully private in production" (until launch gates close)
- "Unconditionally live private transactions"

## 3) EVM Compatibility

Protocol reality:

- Companion EVM is for interoperability rails.
- It is not the private execution engine.
- Bridge/relay readiness is still in progress (`G6`).

Allowed wording:

- "EVM interoperability rails"
- "Wallet compatibility + bridge/intent rails"
- "Privacy is enforced on VeilVM native paths"

Forbidden wording:

- "EVM side is private"
- "Private execution happens on the companion EVM"

## 4) ANIMA SDK / Agent Runtime

Protocol reality:

- ANIMA Native v1 Tier 0 SDK/runtime baseline is pushed.
- Local unit suites pass.
- Live strict-private flow is scaffolded but not yet executed with real runtime/proof fixtures.

Allowed wording:

- "ANIMA Tier 0 native SDK/runtime baseline shipped"
- "Local test coverage passing"
- "Live strict-private Tier 0 harness scaffolded (execution pending fixtures)"

Forbidden wording:

- "ANIMA agents are live on private mainnet flow"
- "Tier 0 live private orchestration is already running"

## 5) Buttons / CTA Guidance

If feature is local-only:

- Use `Docs`, `Dev Journal`, `Preview`, or `Coming Soon`
- Optional badge: `Local Validation`

If feature is scaffolded only:

- Use `Preview`, `Spec`, `Roadmap`
- Badge: `Scaffolded`

If launch gate dependent:

- Add small note tied to checklist status (`NO-GO`, `In Progress`, `Pending`)

Avoid:

- "Launch", "Start Trading", "Use Private Agent" on surfaces that require production-complete gates

