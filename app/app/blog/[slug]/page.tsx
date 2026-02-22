import type React from "react"
import Link from "next/link"
import { AppShaderBackground } from "@/components/app-shader-background"
import { TriangleLogo } from "@/components/triangle-logo"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts: Record<
    string,
    { title: string; date: string; author: { name: string; role: string }; content: React.ReactNode }
  > = {
    "introducing-veil": {
      title: "Why We're Building VEIL",
      date: "March 15, 2024",
      author: { name: "Relic", role: "Founder" },
      content: (
        <>
          <p className="mb-6">
            VEIL is a custom Avalanche L1 built with HyperSDK for privacy-scoped prediction markets. This isn&apos;t
            another EVM fork with a token bolted on — it&apos;s a purpose-built execution environment where privacy,
            identity, and market mechanics are native to the virtual machine.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">The Problem</h2>
          <p className="mb-6">
            Existing prediction markets are fully transparent. Every position, every balance, every trade is visible
            to anyone. This creates real problems: front-running, copy-trading, and targeted manipulation. Sybil
            attacks remain the fundamental unsolved problem — fake identities break governance, wash trading distorts
            markets, airdrop farming extracts value.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">Our Approach</h2>
          <p className="mb-6">
            VEIL addresses this by making identity (ZER0ID), reputation (Bloodsworn), and economic incentives native
            to the VM — not bolted-on smart contracts that can be gamed. The chain is permissioned: every participant
            is either a developer or a verified autonomous agent.
          </p>
          <p className="mb-6">
            We use threshold-keyed encrypted mempools for order privacy, Groth16 ZK-SNARKs for proof-gated settlement,
            and a shielded ledger for balance privacy. Privacy isn&apos;t an application-layer feature — it&apos;s
            enforced at the consensus level.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">Why Avalanche HyperSDK</h2>
          <p className="mb-6">
            We evaluated every major framework. HyperSDK gives us the flexibility to define custom VM actions with
            native proof verification, custom mempool semantics, and economic routing — none of which are possible
            with Subnet-EVM or standard L2 rollups.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">Current Status</h2>
          <p className="mb-6">
            VEIL is under active development. The custom VM is implemented with 42 native actions. Launch posture
            remains NO-GO while production gates are being closed. We publish all progress transparently on our
            transparency page and MAIEV evidence archive.
          </p>
        </>
      ),
    },
    "zero-knowledge-proofs": {
      title: "Zero-Knowledge Proofs in VEIL's Design",
      date: "March 10, 2024",
      author: { name: "Relic", role: "Founder" },
      content: (
        <>
          <p className="mb-6">
            Zero-knowledge proofs are central to VEIL&apos;s privacy architecture. This post covers how we integrate
            Groth16 ZK-SNARKs into the VeilVM for proof-gated settlement, identity verification, and shielded
            ledger operations.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">Why ZK-SNARKs</h2>
          <p className="mb-6">
            We specifically use Groth16 over BN254 for proof-gated consensus. The &ldquo;succinct&rdquo; property
            means proofs are small — a few hundred bytes regardless of computation complexity. Verification is
            fast enough to run in the VM&apos;s action execution path without degrading throughput.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">How It Works in VeilVM</h2>
          <p className="mb-6">
            VeilVM enforces a private-only admission gate. Core market operations (CommitOrder, RevealBatch,
            ClearBatch, SubmitBatchProof) require proof verification before execution. Public-path AMM operations
            are rejected at consensus in strict mode.
          </p>
          <p className="mb-6">
            The shielded ledger uses commitment-nullifier patterns. Agents prove balance sufficiency and transaction
            validity without exposing amounts or positions. ZER0ID identity proofs use the same circuit family for
            uniqueness verification without revealing agent state.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">Implementation Status</h2>
          <p className="mb-6">
            Proof-gated consensus (G1) passes in local validation. The shielded ledger circuit assurance (G3) is
            archived locally. Production rollout evidence for the full privacy pipeline (G2) remains in progress.
            All implementation status is tracked in the production launch checklist.
          </p>
        </>
      ),
    },
    "token-airdrop": {
      title: "VEIL Token Economics: Design Principles",
      date: "March 5, 2024",
      author: { name: "Relic", role: "Founder" },
      content: (
        <>
          <p className="mb-6">
            The VEIL token is the economic engine of the network. This post covers the design principles behind
            the token economy — not as marketing material, but as engineering documentation.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">Fixed Supply</h2>
          <p className="mb-6">
            Fixed supply at genesis, no hidden mint paths. 80-90% locked in a VM-enforced chain-owned liquidity
            (COL) vault with deterministic epoch-based releases capped at 0.15% per epoch. Launch float is
            intentionally low (3-5%). There is no fast unlock path.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">Fee Routing</h2>
          <p className="mb-6">
            All protocol revenue routes through a 70/20/10 split: 70% to market depth (MSRB), 20% to
            buyback-and-make, 10% to operations. This is enforced at the VM level, not by governance vote.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">VAI Stablecoin</h2>
          <p className="mb-6">
            VAI is designed as a native stablecoin backed by exogenous reserves with on-chain solvency checks
            enforced at consensus. VAI risk controls (G5) are implemented but production validation remains
            pending. No stability or peg claims should be assumed until G5 is closed.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">Current Status</h2>
          <p className="mb-6">
            Tokenomics and treasury controls (G4) are implemented in design/runtime paths. Production parameter
            freeze is pending. No token distribution event has occurred or been scheduled.
          </p>
        </>
      ),
    },
    "avalanche-subnets": {
      title: "Building on Avalanche: Why HyperSDK",
      date: "February 28, 2024",
      author: { name: "Relic", role: "Founder" },
      content: (
        <>
          <p className="mb-6">
            VEIL runs on a custom VM built with Avalanche&apos;s HyperSDK — not a Subnet-EVM fork. This post
            covers the technical rationale and tradeoffs.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">Why Not Subnet-EVM</h2>
          <p className="mb-6">
            Subnet-EVM is great for EVM compatibility but locks you into EVM semantics. VEIL needs custom
            mempool behavior (threshold-encrypted sealed order flow), native proof verification in the execution
            path, and custom economic routing — none of which fit cleanly into the EVM model.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">HyperSDK Advantages</h2>
          <ul className="mb-6 list-disc space-y-2 pl-6">
            <li>Custom action types (42 defined for VeilVM)</li>
            <li>Native proof verification in action execution</li>
            <li>Custom mempool semantics (sealed order flow, admission control)</li>
            <li>Deterministic batch clearing with configurable window timing</li>
            <li>Inherits Avalanche consensus finality and security</li>
          </ul>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">Companion EVM</h2>
          <p className="mb-6">
            A companion EVM layer provides interoperability for standard tooling, wallets, and DeFi integrations.
            The companion EVM is an interoperability rail — not the private execution engine. Privacy claims
            apply only to VeilVM-native paths.
          </p>
        </>
      ),
    },
    "market-resolution": {
      title: "Market Resolution: Oracle Design for VEIL",
      date: "February 20, 2024",
      author: { name: "Relic", role: "Founder" },
      content: (
        <>
          <p className="mb-6">
            Fair market resolution is critical to prediction market integrity. VEIL uses a dual resolution
            system: decentralized oracle consensus for financial/sports markets, and the Grok 4.2 AI oracle
            for social and political markets.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">Oracle Architecture</h2>
          <p className="mb-6">
            Multiple independent data providers submit outcomes. Validators stake tokens and reach consensus
            through economic incentives. Disputed outcomes can be challenged through a bonded dispute path
            with time-locked resolution windows.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">AI Oracle</h2>
          <p className="mb-6">
            For markets that don&apos;t have clean data feeds (social predictions, political outcomes, cultural
            events), VEIL routes resolution through an AI oracle. This is a design decision — not all markets
            can be resolved by price feeds alone.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">Implementation Status</h2>
          <p className="mb-6">
            Oracle and resolution mechanisms are in the design/implementation phase. The current frontend
            routes through Polymarket for live market data. Native VEIL market resolution is part of the
            production launch gate requirements.
          </p>
        </>
      ),
    },
    "privacy-native-prediction-markets": {
      title: "On Privacy-Native Prediction Markets: Architecture Notes",
      date: "April 1, 2024",
      author: { name: "Relic", role: "Founder" },
      content: (
        <>
          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">
            Price Discovery Demands Two Kinds of Light
          </h2>
          <p className="mb-6">
            Prediction markets live at the intersection of two incompatible instincts. Transparency — open ledgers
            yield accountability. Tactical opacity — price discovery is adversarial and information has half-life.
            Traders who reveal intent too early donate alpha to the fastest copycat in the room.
          </p>
          <p className="mb-6">
            VEIL&apos;s thesis: privacy during formation, transparency at resolution. The engineering question is
            whether you can deliver that as a chain property — not duct-taped at the app edge — without denting
            liveness, fairness, or cost.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">
            Why a Custom VM
          </h2>
          <p className="mb-6">
            A prediction market needs three levers under its own control: mempool semantics (sealed vs. cleartext,
            ordering, admission), execution semantics (batch cadence, clearing rules, market maker invariants),
            and economic routing (how fees feed depth, security, operations and privacy). A dedicated Avalanche L1
            with HyperSDK gives all three.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">
            Sealed Order Flow
          </h2>
          <p className="mb-6">
            VeilVM uses threshold encryption: clients encrypt under the epoch key; blocks carry ciphertexts
            ordered before content is known; a committee posts partial decryptions the chain aggregates. This
            addresses the worst MEV path: reordering on information. Threshold-keyed mempool privacy is locally
            validated; production rollout evidence is pending (G2).
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">
            Batch Auctions
          </h2>
          <p className="mb-6">
            Continuous matching rewards latency. Batch auctions flip the bias: trade in sealed windows, clear
            once at a uniform price. Path dependence disappears; speed is less valuable; correct sizing and
            pricing wins.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">
            Shielded Ledger
          </h2>
          <p className="mb-6">
            Encrypted mempool protects intents in flight; a shielded note ledger protects balances at rest.
            The state machine moves commitments and nullifiers, not public balances. Viewing keys are
            first-class — &ldquo;private by default, auditable by choice.&rdquo;
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">
            Chain-Owned Liquidity as Native Mixer
          </h2>
          <p className="mb-6">
            Protocol-owned liquidity adds a third privacy layer by mixing value flows at the liquidity layer.
            Because the protocol itself owns and operates core liquidity conduits, every epoch routes many
            independent streams through a pooled balance sheet, creating plausible unlinkability even when
            some interactions touch public rails.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-light etched-text">
            Current Status
          </h2>
          <p className="mb-6">
            These are architectural design principles. Implementation status varies by component — proof-gated
            consensus passes locally (G1), threshold keying passes locally with production rollout pending (G2),
            shielded ledger circuits are archived (G3). Full production launch remains NO-GO. See the
            transparency page for current gate status.
          </p>
        </>
      ),
    },
  }

  const post = posts[slug]

  if (!post) {
    return (
      <div className="relative min-h-screen">
        <AppShaderBackground />
        <div className="relative flex min-h-screen items-center justify-center">
          <p className="etched-text">Post not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <AppShaderBackground />

      <div className="relative">
        <div className="border-b border-white/5 bg-black/20 backdrop-blur-md">
          <div className="container mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/app" className="flex items-center gap-3">
              <TriangleLogo size={32} />
              <span className="text-xl font-light tracking-wider etched-text">VEIL</span>
            </Link>
            <Link
              href="/app/blog"
              className="flex items-center gap-2 text-sm transition-colors hover:text-emerald-400 etched-text"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>

        <article className="container mx-auto max-w-3xl px-6 py-16">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-lg font-light text-emerald-400">{post.author.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-light etched-text">{post.author.name}</p>
              <p className="text-sm etched-text opacity-40">{post.author.role}</p>
            </div>
          </div>

          <h1 className="mb-2 text-4xl font-light tracking-tight etched-text">{post.title}</h1>
          <p className="mb-12 text-sm etched-text opacity-40">{post.date}</p>
          <div className="prose-custom space-y-6 font-light leading-relaxed etched-text">{post.content}</div>
        </article>
      </div>
    </div>
  )
}
