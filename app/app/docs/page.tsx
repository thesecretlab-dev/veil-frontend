"use client"

import { LegalPageLayout } from "@/components/legal-page-layout"
import { useState } from "react"

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<string>("")

  return (
    <LegalPageLayout title="VEIL Protocol Documentation">
      {/* Video Section */}
      <div className="mb-12 rounded-lg border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
        <h2
          className="mb-4 text-xl font-light transition-all duration-500 hover:text-white hover:scale-105"
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            textShadow: "0 0 15px rgba(16, 185, 129, 0.2), 0 0 30px rgba(16, 185, 129, 0.1)",
            filter: "blur(0.3px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textShadow =
              "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3), 0 0 60px rgba(16, 185, 129, 0.2)"
            e.currentTarget.style.filter = "brightness(1.3)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.2), 0 0 30px rgba(16, 185, 129, 0.1)"
            e.currentTarget.style.filter = "blur(0.3px)"
          }}
        >
          Protocol Overview
        </h2>
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <video className="h-full w-full object-cover" controls playsInline preload="metadata">
            <source
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VEIL__Private_Prediction_Market%20%281%29%20%281%29-JGXk1HjMpD6dOOaenAvxTN8dTixdah.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Table of Contents */}
      <nav className="mb-12 rounded-lg border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
        <h2
          className="mb-4 text-xl font-light"
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            textShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
            filter: "blur(0.3px)",
          }}
        >
          Contents
        </h2>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
          <div>
            <h3
              className="text-sm font-light mb-2"
              style={{
                color: "rgba(16, 185, 129, 0.7)",
                filter: "blur(0.3px)",
              }}
            >
              Part I: Technical Architecture
            </h3>
            <ul
              className="space-y-2 text-sm"
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                filter: "blur(0.3px)",
              }}
            >
              {[
                ["Abstract", "tech-abstract"],
                ["1. Introduction", "introduction"],
                ["2. Background & Motivation", "background"],
                ["3. Threat Model & Goals", "threat-model"],
                ["4. System Overview", "system-overview"],
                ["5. Encrypted Mempool", "encrypted-mempool"],
                ["6. Shielded Ledger & ZK", "shielded-ledger"],
                ["7. Markets & Matching", "markets-matching"],
                ["8. Resolution & Dispute", "resolution"],
                ["9. Economics & Depth", "economics-depth"],
                ["10. Governance", "governance-tech"],
                ["11. Implementation", "implementation"],
                ["12. Evaluation & SLOs", "evaluation"],
                ["13. Failure Playbooks", "failure-playbooks"],
                ["14. Conclusion", "tech-conclusion"],
              ].map(([label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} className="hover:text-emerald-400 transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3
              className="text-sm font-light mb-2"
              style={{
                color: "rgba(16, 185, 129, 0.7)",
                filter: "blur(0.3px)",
              }}
            >
              Part II: Token Economics
            </h3>
            <ul
              className="space-y-2 text-sm"
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                filter: "blur(0.3px)",
              }}
            >
              {[
                ["Abstract", "econ-abstract"],
                ["1. Design Goals", "design-goals"],
                ["2. Economic Actors", "economic-actors"],
                ["3. Token Objects", "token-objects"],
                ["4. Utilities & Rights", "utilities"],
                ["5. Market Quality SLOs", "market-quality"],
                ["6. Fees & Router", "fees-router"],
                ["7. MSRB Depth Bank", "msrb"],
                ["8. POL & Buyback", "pol"],
                ["9. Operator Economics", "operator-economics"],
                ["10. Supply & Distribution", "supply-distribution"],
                ["11. Worked Examples", "worked-examples"],
                ["12. Conclusion", "econ-conclusion"],
              ].map(([label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} className="hover:text-emerald-400 transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* PART I: TECHNICAL ARCHITECTURE */}
      <div className="space-y-12">
        <div className="text-center mb-16">
          <h1
            className="text-4xl font-light mb-4 transition-all duration-500 hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              textShadow: "0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.15)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow =
                "0 0 30px rgba(16, 185, 129, 0.6), 0 0 60px rgba(16, 185, 129, 0.3), 0 0 90px rgba(16, 185, 129, 0.2)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.15)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            Part I: Technical Architecture
          </h1>
          <p
            className="text-lg font-light"
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              filter: "blur(0.3px)",
            }}
          >
            Privacy-Native Prediction Markets on an Avalanche L1 Subnet
          </p>
        </div>

        {/* Abstract */}
        <section id="tech-abstract" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            Abstract
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              VEIL is a privacy-native prediction market running on a dedicated Avalanche L1 Subnet. It combines an{" "}
              <strong className="text-white/80">encrypted mempool</strong> (threshold-encrypted transactions), a{" "}
              <strong className="text-white/80">shielded ledger</strong> (commitment-nullifier model with ZK-SNARKs),
              and <strong className="text-white/80">uniform batch auctions</strong> to prevent order leakage and
              front-running while maintaining regulatory transparency through selective disclosure.
            </p>
            <p>
              The system achieves <strong className="text-white/80">sub-second finality</strong> via Avalanche
              consensus, <strong className="text-white/80">deterministic replay</strong> for audits, and{" "}
              <strong className="text-white/80">objective slashing</strong> for misbehaving operators. This document
              specifies the cryptographic primitives, VM implementation (HyperSDK), oracle resolution with VRF-selected
              committees, and service-level objectives (SLOs) that govern market quality.
            </p>
          </div>
        </section>

        {/* 1. Introduction */}
        <section id="introduction" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            1. Introduction
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              Prediction markets aggregate dispersed information into a single price, but existing designs leak order
              flow to validators, searchers, and competing traders. This{" "}
              <strong className="text-white/80">alpha leakage</strong> discourages informed participation and degrades
              price discovery.
            </p>
            <p>
              VEIL solves this by running on a <strong className="text-white/80">privacy-first Avalanche Subnet</strong>{" "}
              where:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white/80">Orders are encrypted</strong> until batch close (threshold
                cryptography)
              </li>
              <li>
                <strong className="text-white/80">Balances are shielded</strong> (commitment-nullifier model +
                ZK-SNARKs)
              </li>
              <li>
                <strong className="text-white/80">Uniform batch auctions</strong> clear at a single price per window
              </li>
              <li>
                <strong className="text-white/80">Selective disclosure</strong> allows compliance without public
                surveillance
              </li>
            </ul>
            <p>
              The result is a venue where professional traders can express views without being front-run, while
              regulators and auditors retain the ability to verify rule compliance through deterministic replay and
              cryptographic proofs.
            </p>
          </div>
        </section>

        {/* 2. Background & Motivation */}
        <section id="background" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            2. Background & Motivation
          </h2>

          <h3
            className="text-xl font-light mb-4 mt-6 transition-all duration-500 hover:text-white"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.25)"
              e.currentTarget.style.filter = "brightness(1.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 10px rgba(16, 185, 129, 0.2)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            2.1 The Alpha Leakage Problem
          </h3>
          <div
            className="space-y-4 leading-relaxed mb-6"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>Public mempools expose pending transactions to validators and searchers who can:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white/80">Front-run</strong> informed orders by inserting their own trades first
              </li>
              <li>
                <strong className="text-white/80">Back-run</strong> to capture arbitrage after large moves
              </li>
              <li>
                <strong className="text-white/80">Sandwich</strong> trades between buy and sell orders
              </li>
              <li>
                <strong className="text-white/80">Copy</strong> strategies by observing order patterns
              </li>
            </ul>
            <p>
              This MEV extraction taxes informed traders and reduces their willingness to participate, degrading the
              market's information aggregation function.
            </p>
          </div>

          <h3
            className="text-xl font-light mb-4 mt-6 transition-all duration-500 hover:text-white"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.25)"
              e.currentTarget.style.filter = "brightness(1.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 10px rgba(16, 185, 129, 0.2)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            2.2 Existing Approaches
          </h3>
          <div
            className="space-y-4 leading-relaxed mb-6"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>Prior solutions include:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white/80">Private mempools</strong> (Flashbots Protect): Centralized,
                trust-based, no cryptographic guarantees
              </li>
              <li>
                <strong className="text-white/80">Commit-reveal schemes</strong>: Two-phase overhead, vulnerable to
                censorship between phases
              </li>
              <li>
                <strong className="text-white/80">TEE-based solutions</strong>: Hardware trust assumptions, side-channel
                risks
              </li>
              <li>
                <strong className="text-white/80">ZK rollups</strong>: High proving costs, limited programmability for
                complex markets
              </li>
            </ul>
            <p>
              VEIL combines the best elements: <strong className="text-white/80">threshold encryption</strong> for
              mempool privacy, <strong className="text-white/80">ZK-SNARKs</strong> for balance privacy, and{" "}
              <strong className="text-white/80">batch auctions</strong> for fair price formation, all on a dedicated
              Subnet with sub-second finality.
            </p>
          </div>

          <h3
            className="text-xl font-light mb-4 mt-6 transition-all duration-500 hover:text-white"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.25)"
              e.currentTarget.style.filter = "brightness(1.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 10px rgba(16, 185, 129, 0.2)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            2.3 Why Avalanche Subnets
          </h3>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>Avalanche Subnets provide:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white/80">Dedicated validator set</strong>: Custom hardware, KYC'd operators,
                slashable bonds
              </li>
              <li>
                <strong className="text-white/80">Sub-second finality</strong>: Avalanche consensus with 1-2s block
                times
              </li>
              <li>
                <strong className="text-white/80">Custom VM</strong>: HyperSDK for optimized batch clearing and ZK
                verification
              </li>
              <li>
                <strong className="text-white/80">Warp messaging</strong>: Native cross-chain communication for oracle
                data and asset bridges
              </li>
              <li>
                <strong className="text-white/80">Elastic validators</strong>: Scale validator count based on volume and
                security needs
              </li>
            </ul>
            <p>
              This architecture allows VEIL to enforce privacy at the consensus layer while maintaining compatibility
              with the broader Avalanche ecosystem for liquidity and composability.
            </p>
          </div>
        </section>

        {/* 3. Threat Model & Goals */}
        <section id="threat-model" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            3. Threat Model & Goals
          </h2>

          <h3
            className="text-xl font-light mb-4 mt-6 transition-all duration-500 hover:text-white"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.25)"
              e.currentTarget.style.filter = "brightness(1.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 10px rgba(16, 185, 129, 0.2)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            3.1 Adversaries
          </h3>
          <div
            className="space-y-4 leading-relaxed mb-6"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>We consider the following adversaries:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white/80">Malicious validators</strong> (up to f &lt; n/3): Attempt to decrypt
                orders early, censor transactions, or collude on price manipulation
              </li>
              <li>
                <strong className="text-white/80">Network observers</strong>: Monitor transaction timing, sizes, and
                patterns to infer order flow
              </li>
              <li>
                <strong className="text-white/80">Compromised operators</strong>: Oracle attestors or keepers who
                deviate from protocol rules
              </li>
              <li>
                <strong className="text-white/80">Side-channel attackers</strong>: Exploit timing, power, or cache
                patterns in TEE implementations
              </li>
              <li>
                <strong className="text-white/80">Regulatory adversaries</strong>: Demand selective disclosure of
                specific user activity without compromising global privacy
              </li>
            </ul>
          </div>

          <h3
            className="text-xl font-light mb-4 mt-6 transition-all duration-500 hover:text-white"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.25)"
              e.currentTarget.style.filter = "brightness(1.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 10px rgba(16, 185, 129, 0.2)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            3.2 Security Goals
          </h3>
          <div
            className="space-y-4 leading-relaxed mb-6"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white/80">Order privacy</strong>: No party (including validators) learns order
                details before batch close
              </li>
              <li>
                <strong className="text-white/80">Balance privacy</strong>: User balances and positions are hidden from
                public view
              </li>
              <li>
                <strong className="text-white/80">Fair execution</strong>: All orders in a batch receive the same
                uniform price; no preferential treatment
              </li>
              <li>
                <strong className="text-white/80">Censorship resistance</strong>: Valid transactions cannot be
                permanently excluded (liveness guarantee)
              </li>
              <li>
                <strong className="text-white/80">Deterministic replay</strong>: Auditors can verify all state
                transitions without trusting operators
              </li>
              <li>
                <strong className="text-white/80">Selective disclosure</strong>: Authorized parties can prove specific
                facts (e.g., "user X traded Y amount") without revealing all activity
              </li>
            </ul>
          </div>

          <h3
            className="text-xl font-light mb-4 mt-6 transition-all duration-500 hover:text-white"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.25)"
              e.currentTarget.style.filter = "brightness(1.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 10px rgba(16, 185, 129, 0.2)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            3.3 Non-Goals
          </h3>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white/80">Anonymity</strong>: VEIL does not hide user identities from regulators
                (KYC/AML compliance required)
              </li>
              <li>
                <strong className="text-white/80">Perfect privacy</strong>: Metadata (timing, size) may leak some
                information; we minimize but do not eliminate all side channels
              </li>
              <li>
                <strong className="text-white/80">Unbounded scalability</strong>: Batch clearing has throughput limits;
                we target 10k-100k orders/batch, not millions
              </li>
            </ul>
          </div>
        </section>

        {/* 4. System Overview */}
        <section id="system-overview" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            4. System Overview
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>VEIL's architecture consists of four layers:</p>
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                <h4 className="text-white/80 font-medium mb-2">1. Encrypted Mempool</h4>
                <p className="text-sm text-white/60">
                  Threshold-encrypted transactions prevent validators from reading order details before batch close
                </p>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                <h4 className="text-white/80 font-medium mb-2">2. Shielded Ledger</h4>
                <p className="text-sm text-white/60">
                  Commitment-nullifier model with ZK-SNARKs hides balances and positions from public view
                </p>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                <h4 className="text-white/80 font-medium mb-2">3. Batch Clearing</h4>
                <p className="text-sm text-white/60">
                  Uniform price auctions every 2-5 seconds ensure fair execution without preferential treatment
                </p>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                <h4 className="text-white/80 font-medium mb-2">4. Oracle Resolution</h4>
                <p className="text-sm text-white/60">
                  VRF-selected committees with BLS signatures and dispute windows ensure accurate outcomes
                </p>
              </div>
            </div>
            <p>
              The system runs on a dedicated Avalanche Subnet with custom HyperSDK VM optimized for batch clearing and
              ZK verification. Validators post slashable bonds and are subject to objective penalties for rule
              violations.
            </p>
          </div>
        </section>

        {/* 5. Encrypted Mempool */}
        <section id="encrypted-mempool" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            5. Encrypted Mempool
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              Orders are encrypted using threshold cryptography (BLS12-381) where decryption requires cooperation from
              t-of-n validators. This prevents any single validator or minority coalition from reading orders before
              batch close.
            </p>
            <p>
              <strong className="text-white/80">Key generation:</strong> Distributed key generation (DKG) ceremony
              produces validator key shares. <strong className="text-white/80">Encryption:</strong> Users encrypt orders
              to the committee public key. <strong className="text-white/80">Decryption:</strong> At batch close, t
              validators provide decryption shares; the clearing engine combines them to reveal orders.
            </p>
            <p>
              <strong className="text-white/80">Security:</strong> As long as fewer than t validators collude, orders
              remain confidential until the designated reveal time.
            </p>
          </div>
        </section>

        {/* 6. Shielded Ledger & ZK */}
        <section id="shielded-ledger" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            6. Shielded Ledger & ZK
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              VEIL uses a UTXO-like shielded ledger with commitment-nullifier pairs and ZK-SNARKs for privacy and
              efficiency. Each balance is represented by a commitment, and spends are authorized by revealing a
              nullifier derived from the previous commitment.
            </p>
            <p>
              <strong className="text-white/80">Commitments</strong> are pseudonymous public identifiers.{" "}
              <strong className="text-white/80">Nullifiers</strong> are unique, one-time secrets that prove ownership
              without revealing the commitment. Double-spending is prevented by checking that nullifiers have not been
              spent before.
            </p>
            <p>
              <strong className="text-white/80">ZK-SNARKs</strong> are used to generate proofs that a transaction is
              valid (e.g., has sufficient balance, correct signatures) without revealing any underlying transaction
              details, ensuring privacy for users.
            </p>
          </div>
        </section>

        {/* 7. Markets & Matching */}
        <section id="markets-matching" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            7. Markets & Matching
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              VEIL supports prediction markets where users can bet on future events. The core matching engine operates
              via uniform batch auctions, clearing all orders within a specified time window (e.g., 2 seconds) at a
              single, volume-weighted average price.
            </p>
            <p>
              <strong className="text-white/80">Order types</strong> include limit and market orders.{" "}
              <strong className="text-white/80">Matching logic</strong> prioritizes executable orders to find the
              clearing price that maximizes the total volume matched. This prevents slippage and front-running by
              ensuring all participants receive the same price.
            </p>
            <p>
              <strong className="text-white/80">Market creation</strong> is permissioned and requires governance
              approval, ensuring only legitimate and well-defined markets are listed.
            </p>
          </div>
        </section>

        {/* 8. Resolution & Dispute */}
        <section id="resolution" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            8. Resolution & Dispute
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              Market outcomes are determined by a decentralized oracle committee selected via verifiable random
              functions (VRFs). This committee, composed of bonded operators, attests to the ground truth of market
              outcomes.
            </p>
            <p>
              <strong className="text-white/80">Attestation process:</strong> Committee members sign a final outcome
              using BLS signatures. <strong className="text-white/80">Dispute resolution:</strong> A defined dispute
              window allows any participant to challenge an outcome by posting a bond. If the challenge is successful,
              the challenger receives their bond back, and the committee members are slashed. Otherwise, the bond is
              forfeited.
            </p>
            <p>
              This mechanism ensures accurate and tamper-proof resolution while providing economic incentives for
              truthful reporting and a robust dispute mechanism.
            </p>
          </div>
        </section>

        {/* 9. Slashing & Penalties */}
        <section id="slashing" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            9. Slashing & Penalties
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              VEIL enforces protocol rules through a slashing mechanism tied to bonded validators and oracle operators.
              Malicious behavior, such as attempting to decrypt orders prematurely, colluding on prices, or submitting
              false oracle attestations, will result in a forfeiture of a portion of the operator's bond.
            </p>
            <p>
              <strong className="text-white/80">Slashing conditions</strong> are defined in the protocol and detected
              via on-chain monitoring and dispute resolution. The amount slashed depends on the severity of the offense.
              These penalties serve as a credible deterrent against bad actors.
            </p>
            <p>
              <strong className="text-white/80">Economic security</strong> is paramount; slashing ensures that operators
              have skin in the game and are aligned with the protocol's integrity.
            </p>
          </div>
        </section>

        {/* 10. Governance */}
        <section id="governance-tech" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            10. Governance
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              Protocol parameters, such as batch clearing intervals, oracle committee sizes, and slashing penalties, are
              governed by the VEIL token holders.
            </p>
            <p>
              <strong className="text-white/80">On-chain governance</strong> proposals are submitted, voted upon, and
              executed via smart contracts. This allows for decentralized evolution of the protocol based on community
              consensus.
            </p>
            <p>
              <strong className="text-white/80">Parameter tuning</strong> ensures the system adapts to changing market
              conditions and security needs, maintaining optimal performance and fairness.
            </p>
          </div>
        </section>

        {/* 11. Implementation */}
        <section id="implementation" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            11. Implementation
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              VEIL is implemented as a custom Virtual Machine (VM) on the Avalanche Subnet platform, leveraging the
              HyperSDK framework. This allows for optimized transaction processing, custom state transitions, and
              efficient ZK-SNARK verification.
            </p>
            <p>
              <strong className="text-white/80">Smart contracts</strong> handle market creation, token logic, and
              governance interactions. <strong className="text-white/80">Cryptography</strong> utilizes BLS12-381 for
              threshold encryption and Groth16 for ZK-SNARK proofs.
            </p>
            <p>
              <strong className="text-white/80">Subnet validators</strong> are responsible for transaction validation,
              block production, and consensus, inheriting Avalanche's robust security guarantees.
            </p>
          </div>
        </section>

        {/* 12. Evaluation & SLOs */}
        <section id="evaluation" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            12. Evaluation & SLOs
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              VEIL's performance is evaluated against stringent Service Level Objectives (SLOs) to ensure market quality
              and user experience.
            </p>
            <p>
              <strong className="text-white/80">Key SLOs include:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white/80">Batch Clearing Latency:</strong> 99.9% of batches clear within 5
                seconds.
              </li>
              <li>
                <strong className="text-white/80">Order Privacy:</strong> 100% guarantee against pre-reveal.
              </li>
              <li>
                <strong className="text-white/80">Market Depth:</strong> Average bid-ask spread &lt; 0.5% for top 10
                markets.
              </li>
              <li>
                <strong className="text-white/80">Uptime:</strong> 99.95% availability of the Subnet.
              </li>
              <li>
                <strong className="text-white/80">ZK Proof Generation:</strong> Average proof generation time &lt; 1
                second.
              </li>
            </ul>
            <p>
              These SLOs are monitored, and deviations trigger governance review and potential parameter adjustments.
            </p>
          </div>
        </section>

        {/* 13. Failure Playbooks */}
        <section id="failure-playbooks" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            13. Failure Playbooks
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              Detailed playbooks are defined to address various failure scenarios, ensuring prompt and effective
              mitigation. These include protocols for validator collusion, oracle failures, smart contract exploits, and
              network congestion.
            </p>
            <p>
              <strong className="text-white/80">Response mechanisms</strong> involve governance action, emergency
              upgrades, and potential temporary halts to prevent further loss and restore system integrity.
            </p>
            <p>
              <strong className="text-white/80">Auditable logs</strong> and deterministic replay capabilities are
              crucial for post-mortem analysis and identifying root causes.
            </p>
          </div>
        </section>

        {/* 14. Conclusion */}
        <section id="tech-conclusion" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            14. Conclusion
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              VEIL represents a significant advancement in prediction market technology, addressing the fundamental
              problem of alpha leakage through a novel combination of privacy-preserving primitives and efficient batch
              clearing on a dedicated Avalanche Subnet.
            </p>
            <p>
              By prioritizing order and balance privacy, fair execution, and robust resolution mechanisms, VEIL unlocks
              new possibilities for professional participation, information aggregation, and regulatory compliance in
              the decentralized prediction market landscape.
            </p>
          </div>
        </section>

        {/* PART II: TOKEN ECONOMICS */}
        <div className="text-center my-16 pt-16 border-t border-white/10">
          <h1
            className="text-4xl font-light mb-4 transition-all duration-500 hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              textShadow: "0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.15)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow =
                "0 0 30px rgba(16, 185, 129, 0.6), 0 0 60px rgba(16, 185, 129, 0.3), 0 0 90px rgba(16, 185, 129, 0.2)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.15)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            Part II: Token Economics
          </h1>
          <p
            className="text-lg font-light"
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              filter: "blur(0.3px)",
            }}
          >
            Economic Design & Incentive Mechanisms
          </p>
        </div>

        {/* Economics Abstract */}
        <section id="econ-abstract" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            Abstract
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              VEIL's token economy converts protocol fees into owned liquidity depth rather than extracting rent. The
              system routes{" "}
              <strong className="text-white/80">70% of fees to the Market Scoring Rule Bank (MSRB)</strong> for market
              depth, <strong className="text-white/80">20% to buyback-and-make</strong> for protocol-owned liquidity
              (POL), and <strong className="text-white/80">10% to operations</strong>.
            </p>
            <p>
              This creates a compounding liquidity machine: better depth → tighter spreads → more volume → more fees →
              deeper markets. The token (VEIL) governs parameters, secures operators via slashable bonds, and aligns
              incentives without perpetual emissions.
            </p>
          </div>
        </section>

        {/* 1. Design Goals */}
        <section id="design-goals" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            1. Design Goals
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>VEIL's economic design achieves three objectives simultaneously:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white/80">Fund and deepen market liquidity</strong> that the protocol itself
                controls (POL)
              </li>
              <li>
                <strong className="text-white/80">Align incentives</strong> for truthful price discovery without
                exposing orders to predatory flow
              </li>
              <li>
                <strong className="text-white/80">Credibly commit</strong> to predictable rules so professional users
                and regulators can assess system behavior
              </li>
            </ul>
            <p>
              We avoid rent-seeking emissions, prefer chain-owned assets, and recycle protocol fees into market depth
              via an explicit "buyback-and-make" policy rather than symbolic burns. The result is a compounding
              liquidity machine where better market quality begets more volume, which in turn deepens the books again.
            </p>
          </div>
        </section>

        {/* 2. Economic Actors */}
        <section id="economic-actors" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            2. Economic Actors
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>The VEIL ecosystem involves several key economic actors:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white/80">Traders:</strong> Participate in markets by placing buy/sell orders.
              </li>
              <li>
                <strong className="text-white/80">Operators:</strong> Run validator nodes, provide liquidity, and
                participate in oracle committees. They stake VEIL tokens and are subject to slashing.
              </li>
              <li>
                <strong className="text-white/80">Protocol:</strong> The smart contracts and logic that govern market
                creation, clearing, and fee distribution. It accrues protocol-owned liquidity (POL).
              </li>
              <li>
                <strong className="text-white/80">Governance Participants:</strong> VEIL token holders who vote on
                protocol parameters and upgrades.
              </li>
              <li>
                <strong className="text-white/80">Regulators/Auditors:</strong> Can leverage selective disclosure and
                deterministic replay for compliance verification.
              </li>
            </ul>
          </div>
        </section>

        {/* 3. Token Objects */}
        <section id="token-objects" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            3. Token Objects
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>The VEIL token serves multiple functions:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white/80">Governance:</strong> Voting on protocol upgrades and parameter
                changes.
              </li>
              <li>
                <strong className="text-white/80">Staking:</strong> Operators must stake VEIL to secure the network and
                earn rewards.
              </li>
              <li>
                <strong className="text-white/80">Bonding:</strong> Used to back operators' commitments to honest
                behavior.
              </li>
              <li>
                <strong className="text-white/80">Fee Payment:</strong> Potentially used for specific protocol fees.
              </li>
            </ul>
          </div>
        </section>

        {/* 4. Utilities & Rights */}
        <section id="utilities" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            4. Utilities & Rights
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>VEIL token holders have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white/80">Vote</strong> on protocol proposals (parameter changes, upgrades).
              </li>
              <li>
                <strong className="text-white/80">Delegate</strong> voting power to other participants.
              </li>
              <li>
                <strong className="text-white/80">Stake</strong> VEIL to become an operator or delegate to operators.
              </li>
              <li>
                <strong className="text-white/80">Receive</strong> a share of network fees (subject to operator
                economics).
              </li>
            </ul>
          </div>
        </section>

        {/* 5. Market Quality SLOs */}
        <section id="market-quality" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            5. Market Quality SLOs
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              The protocol's success hinges on delivering high-quality prediction markets. Key SLOs define acceptable
              market performance:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white/80">Tight Spreads:</strong> For the top 10 markets, the average bid-ask
                spread should remain below 0.5%.
              </li>
              <li>
                <strong className="text-white/80">Deep Liquidity:</strong> For top markets, liquidity sufficient to
                handle orders up to $10,000 without exceeding a 1% price impact.
              </li>
              <li>
                <strong className="text-white/80">Fast Execution:</strong> 99.9% of orders should be matched and settled
                within 5 seconds.
              </li>
              <li>
                <strong className="text-white/80">Low Slippage:</strong> Market orders should experience minimal
                slippage relative to the prevailing price at the time of submission.
              </li>
            </ul>
            <p>
              These metrics are actively monitored, and deviations will trigger governance actions to improve market
              depth and efficiency.
            </p>
          </div>
        </section>

        {/* 6. Fees & Router */}
        <section id="fees-router" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            6. Fees & Router
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              A small trading fee (e.g., 0.1%) is charged on all transactions. These fees are strategically allocated to
              drive protocol growth and liquidity.
            </p>
            <p>
              <strong className="text-white/80">Fee Distribution:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white/80">70% to MSRB (Market Depth Bank):</strong> Directly funds market
                liquidity.
              </li>
              <li>
                <strong className="text-white/80">20% to POL (Protocol-Owned Liquidity):</strong> Used for
                buyback-and-make operations, increasing the protocol's owned assets.
              </li>
              <li>
                <strong className="text-white/80">10% to Operations:</strong> Covers ongoing development, security, and
                marketing efforts.
              </li>
            </ul>
            <p>
              The fee router ensures seamless and transparent distribution of collected fees according to these
              parameters.
            </p>
          </div>
        </section>

        {/* 7. MSRB (Market Depth Bank) */}
        <section id="msrb" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            7. MSRB (Market Depth Bank)
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              The Market Scoring Rule Bank (MSRB) is a dedicated pool funded by protocol fees (70%). Its primary purpose
              is to enhance market liquidity by providing capital that tightens bid-ask spreads and reduces slippage.
            </p>
            <p>
              Capital in the MSRB is dynamically deployed to markets based on their activity and liquidity needs,
              effectively acting as a decentralized market maker. This ensures that VEIL markets remain deep and
              efficient, attracting more professional traders.
            </p>
            <p>
              The MSRB is governed by the protocol and operates transparently, ensuring that its contribution to market
              depth is verifiable.
            </p>
          </div>
        </section>

        {/* 8. POL & Buyback-and-Make */}
        <section id="pol" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            8. POL & Buyback-and-Make
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              A portion of protocol fees (20%) is allocated to Protocol-Owned Liquidity (POL) through a
              "buyback-and-make" mechanism. This strategy aims to build a significant treasury of assets that benefit
              the entire ecosystem.
            </p>
            <p>
              <strong className="text-white/80">Buyback-and-make:</strong> The protocol uses fees to buy assets (e.g.,
              stablecoins, VEIL tokens) and then provides them as liquidity in key markets. This creates a virtuous
              cycle: protocol revenue fuels POL, which deepens markets, attracting more trading volume and generating
              higher protocol revenue.
            </p>
            <p>
              This approach creates sustainable value for VEIL token holders and ensures the long-term health and
              resilience of the prediction market.
            </p>
          </div>
        </section>

        {/* 9. Operator Economics */}
        <section id="operator-economics" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            9. Operator Economics
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              Operators are incentivized to run secure and reliable infrastructure through a combination of fee revenue
              and potential slashing penalties.
            </p>
            <p>
              <strong className="text-white/80">Revenue Streams:</strong> Operators earn a share of protocol fees (10%
              allocation) and can potentially earn trading fees from providing liquidity.
            </p>
            <p>
              <strong className="text-white/80">Staking & Slashing:</strong> To operate, nodes must stake VEIL tokens.
              Honest participation is rewarded, while malicious actions or downtime result in slashing (forfeiture of
              staked tokens), aligning operator incentives with network integrity.
            </p>
          </div>
        </section>

        {/* 10. Supply & Distribution */}
        <section id="supply-distribution" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            10. Supply & Distribution
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              The VEIL token has a fixed maximum supply, designed to prevent inflationary pressures and ensure long-term
              value accrual.
            </p>
            <p>
              <strong className="text-white/80">Initial Distribution:</strong> Tokens will be distributed among
              ecosystem development, founding team, early investors, community incentives, and public sale.
            </p>
            <p>
              <strong className="text-white/80">Vesting schedules</strong> will be implemented for team and investor
              tokens to ensure alignment with protocol growth and long-term commitment.
            </p>
          </div>
        </section>

        {/* 11. Worked Examples */}
        <section id="worked-examples" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            11. Worked Examples
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>Illustrative examples of how the fee distribution and POL buyback mechanisms function in practice:</p>
            <p>
              <strong className="text-white/80">Scenario 1: High Volume Market</strong> - A market generates $1M in
              daily trading volume with a 0.1% fee. This yields $1,000 in fees. 70% ($700) goes to MSRB, 20% ($200) to
              POL buyback, 10% ($100) to operations.
            </p>
            <p>
              <strong className="text-white/80">Scenario 2: POL Growth</strong> - The $200 from POL buyback is used to
              purchase stablecoins and add liquidity to the MSRB, increasing its depth. This attracts more traders,
              leading to potentially higher volume and fees in subsequent periods.
            </p>
          </div>
        </section>

        {/* 12. Conclusion */}
        <section id="econ-conclusion" className="scroll-mt-20">
          <h2
            className="text-2xl font-light mb-6 transition-all duration-500 hover:text-white hover:scale-105"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
              filter: "blur(0.3px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "brightness(1.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.3)"
              e.currentTarget.style.filter = "blur(0.3px)"
            }}
          >
            12. Conclusion
          </h2>
          <div
            className="space-y-4 leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              filter: "blur(0.3px)",
            }}
          >
            <p>
              VEIL's tokenomics are designed to create a self-reinforcing ecosystem where protocol revenue directly
              enhances market quality and liquidity. By prioritizing the MSRB and POL through a buyback-and-make
              strategy, VEIL establishes a sustainable model that benefits traders, operators, and token holders alike.
            </p>
            <p>
              This economic framework, combined with robust technical design, positions VEIL as a leading platform for
              private and efficient prediction markets.
            </p>
          </div>
        </section>

        {/* Footer note about investor deck */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p
            className="text-sm text-center"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              filter: "blur(0.3px)",
            }}
          >
            For institutional investors and partners, additional materials including financial projections and
            go-to-market strategy are available in the{" "}
            <a
              href="/app/investor-deck"
              className="text-emerald-400/60 hover:text-emerald-400 transition-colors underline"
            >
              investor deck
            </a>
            .
          </p>
        </div>
      </div>
    </LegalPageLayout>
  )
}
