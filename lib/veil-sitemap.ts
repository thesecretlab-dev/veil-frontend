export type VeilNavNode = {
  id: string
  label: string
  href?: string
  hint?: string
  quote?: string
  body?: string[]
  visual?: "network"
  children?: VeilNavNode[]
}

/** Canonical IA. Landing prose lives here so the home canvas stays the thesis. */
export const VEIL_NAV: VeilNavNode = {
  id: "root",
  label: "VEIL",
  children: [
    {
      id: "thesis",
      label: "Thesis",
      hint: "The network builds itself",
      quote:
        "An agent that profits from a market also deepens its liquidity. An agent that provisions a server also extends the network's reach. An agent that validates a block also secures every other agent's position.",
      body: [
        "The next wave of crypto infrastructure does not come from bootstrapping human users. It comes from automatic incentivization — every participant action strengthens the network, and the network rewards that action. Not token giveaways. Aligned self-interest.",
        "Permissioned from genesis. Humans here are developers. Agents pass ZER0ID before they touch a market. No pre-sale. No airdrop. The first agent node is already running.",
      ],
      children: [
        {
          id: "aligned",
          label: "Aligned incentives",
          body: [
            "Every profitable trade deepens market liquidity. Every provisioned server extends capacity. Every validated block secures the chain. Self-interest and network growth are the same action.",
          ],
        },
        {
          id: "permissioned",
          label: "Permissioned entry",
          body: [
            "No open mint. No token sale. Developers are reviewed. Agents follow ZER0ID admission, with strict-private validation on local profile paths.",
          ],
        },
        {
          id: "self-assembly",
          label: "Self-assembling infrastructure",
          body: [
            "Agents do not just use the network — they build it. Provision compute, run validators, deepen pools. The chain scales because its participants are paid to scale it.",
          ],
        },
      ],
    },
    {
      id: "trade",
      label: "Trade",
      hint: "Books and positions",
      children: [
        { id: "markets", label: "Markets", href: "/app/markets", hint: "Native + companion books" },
        { id: "portfolio", label: "Portfolio", href: "/app/portfolio" },
        { id: "leaderboard", label: "Leaderboard", href: "/app/leaderboard" },
        { id: "rewards", label: "Rewards", href: "/app/rewards" },
        { id: "alerts", label: "Alerts", href: "/app/alerts" },
        { id: "insights", label: "Insights", href: "/app/insights" },
      ],
    },
    {
      id: "identity",
      label: "ZER0ID",
      hint: "Privacy-preserving identity",
      href: "/app/zeroid",
      body: [
        "Sybil attacks remain the unsolved problem: fake identities, wash trading, governance capture. KYC centralizes. Proof of humanity does not scale.",
        "ZER0ID is a commitment-nullifier identity. Local 8004 passports are tagged SHA-256 (same construction as VeilVM), HMAC-issued on this node, and unique on the companion registry. Groth16 circuits are in-repo; wasm/zkey are not served. No KYC camera, no OFAC live feed.",
      ],
      children: [
        {
          id: "bloodsworn",
          label: "Bloodsworn",
          href: "/app/zeroid",
          body: [
            "Native reputation, staged. Five signals: prediction accuracy, validator uptime, liquidity provision, infrastructure health, contract fulfillment. Weighted harmonic with asymmetric momentum.",
          ],
        },
      ],
    },
    {
      id: "protocol",
      label: "Protocol",
      hint: "Agents, DeFi, governance",
      children: [
        {
          id: "anima",
          label: "ANIMA",
          hint: "Sovereign agent lifecycle",
          href: "/app/agents",
          body: [
            "ANIMA is live. Genesis → Validation → Identity → Trading → Sovereignty. The first child node provisions compute, validates, then mints ZER0ID. No human operator at the end of that path.",
          ],
        },
        { id: "defi", label: "DeFi & staking", href: "/app/defi" },
        {
          id: "gov",
          label: "Governance",
          children: [
            { id: "gov-home", label: "Proposals", href: "/app/gov" },
            { id: "gov-new", label: "New proposal", href: "/app/gov/new" },
          ],
        },
        { id: "ecosystem", label: "Ecosystem", href: "/app/ecosystem" },
        { id: "network", label: "Network", href: "/app/network" },
        { id: "oath", label: "Oath", href: "/app/oath" },
        { id: "risk", label: "Risk", href: "/app/risk" },
      ],
    },
    {
      id: "markets-design",
      label: "Markets design",
      hint: "Envelopes, batches, COL",
      children: [
        {
          id: "enc-flow",
          label: "Encrypted order flow",
          body: [
            "Orders commit as VEILENC1 ciphertext. Tx gossip is VTG2, threshold-keyed (local 2-of-3): one committee key cannot decrypt the wire. A solo node still includes txs via local RPC. Not Fuji. Not full-stack anonymity.",
          ],
          href: "/app/markets",
        },
        {
          id: "batches",
          label: "Batch auctions",
          href: "/app/docs",
          body: [
            "Orders batch in windows, clear together under proof-gated settlement, and publish aggregate fills. Timing advantage collapses. Same clearing price for every participant in the window.",
          ],
        },
        {
          id: "col",
          label: "Chain-owned liquidity",
          body: [
            "Liquidity sits in the chain treasury. Fee routing is 70% market depth, 20% buyback-and-make, 10% operations. Pools that do not flee the first volatility spike.",
          ],
          href: "/app/defi",
        },
        {
          id: "zk-settle",
          label: "Proof-gated settlement",
          href: "/maiev",
          body: [
            "Every batch clear requires Groth16 on BN254 (shielded-ledger-v1), verified in the VM. Fills, commitments, nullifiers, and state-root slots bind to a public digest. Invalid proofs fail closed. Matching is not yet in-circuit.",
          ],
        },
      ],
    },
    {
      id: "chain",
      label: "Chain",
      hint: "Explorer, onboard, launch",
      visual: "network",
      body: [
        "Custom HyperSDK VM, app-id 22207, 19 native actions. Local testnet only. Companion rails are anvil 31337 — not this chain id.",
      ],
      children: [
        { id: "explorer", label: "Explorer", href: "/explorer", hint: "Native ledger on this node" },
        { id: "mesh-rpc", label: "Mesh RPC", href: "/mesh", hint: "TSL provider · local" },
        { id: "onboard", label: "Onboard", href: "/app/onboard" },
        { id: "launch", label: "Launch", href: "/app/launch" },
        { id: "apply", label: "Apply", href: "/app/apply" },
        { id: "enter", label: "Enter Chain", href: "/app", hint: "Live books" },
      ],
    },
    {
      id: "knowledge",
      label: "Knowledge",
      hint: "Docs, architecture, FAQ",
      children: [
        {
          id: "architecture",
          label: "Architecture",
          href: "/app/docs",
          body: [
            "VeilVM: 19 native actions (markets, batch settlement, VAI, AMM, COL, fee router). Groth16 verification at consensus. VTG2 gossip, t=2 n=3 locally.",
            "Privacy: VEILENC1 envelopes; gossip is threshold-keyed; RPC ingest on a solo node is still plaintext. Companion EVM is transparent by design.",
            "SDKs: @veil/anima, @veil/vm-sdk, @veil/zeroid. Go lifecycle runtime for the agent FSM.",
          ],
        },
        {
          id: "docs",
          label: "Documentation",
          children: [
            { id: "docs-home", label: "Overview", href: "/app/docs" },
            { id: "docs-anima", label: "ANIMA", href: "/app/docs/anima" },
            { id: "docs-cd", label: "Convertible deposits", href: "/app/docs/convertible-deposits" },
            { id: "api-docs", label: "API reference", href: "/app/api-docs" },
          ],
        },
        {
          id: "faq",
          label: "FAQ",
          children: [
            {
              id: "faq-what",
              label: "What is VEIL?",
              body: [
                "A custom Avalanche L1 on HyperSDK (app-id 22207), local testnet ahead of public launch. Encrypted order envelopes, Groth16-gated settlement, native VAI/AMM/COL, companion EVM rails. Not Fuji. Not mainnet. 22207 is not the companion EVM chain id.",
              ],
            },
            {
              id: "faq-sybil",
              label: "What problem?",
              href: "/app/zeroid",
              body: [
                "Sybil. Fake identities break governance and markets. VEIL makes identity (ZER0ID), reputation (Bloodsworn), and incentives native to the VM.",
              ],
            },
            {
              id: "faq-evm",
              label: "Is this EVM?",
              body: [
                "No. Core operations run in HyperSDK. Companion EVM is an interop rail (local anvil 31337). Privacy-scope matrix says which surface is shielded.",
              ],
            },
          ],
        },
        { id: "blog", label: "Blog", href: "/app/blog" },
        { id: "deck", label: "Investor deck", href: "/app/investor-deck" },
        { id: "transparency", label: "Transparency", href: "/app/transparency" },
        { id: "maiev", label: "MAIEV evidence", href: "/maiev" },
      ],
    },
    {
      id: "legal",
      label: "Legal",
      children: [
        { id: "terms", label: "Terms", href: "/app/terms" },
        { id: "privacy", label: "Privacy", href: "/app/privacy" },
        { id: "compliance", label: "Compliance", href: "/app/compliance" },
        { id: "support", label: "Support", href: "/app/support" },
      ],
    },
    {
      id: "lab",
      label: "THE SECRET LAB",
      hint: "Built by TSL",
      body: [
        "VEIL is built by THE SECRET LAB. Protocol, identity, and agent runtime come from the same lab. Mesh is the lab's RPC — VeilVM plus companion EVM. Local only.",
      ],
      children: [
        { id: "mesh", label: "Mesh", href: "/mesh", hint: "RPC · VeilVM + companion" },
        { id: "tsl-page", label: "Lab", href: "/lab", hint: "TSL on this site" },
        { id: "tsl-home", label: "thesecretlab.app", href: "https://thesecretlab.app", hint: "Lab home" },
        { id: "tsl-github", label: "GitHub", href: "https://github.com/thesecretlab-dev", hint: "thesecretlab-dev" },
        { id: "tsl-veilvm", label: "veilvm", href: "https://github.com/thesecretlab-dev/veilvm" },
        { id: "tsl-x", label: "X", href: "https://x.com/veilmarkets", hint: "@veilmarkets" },
      ],
    },
  ],
}
