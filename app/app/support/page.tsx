import { LegalPageLayout } from "@/components/legal-page-layout"

export default function SupportPage() {
  return (
    <LegalPageLayout title="Support Center">
      <section>
        <h2
          className="mb-6 text-2xl font-semibold"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            color: "rgba(255, 255, 255, 0.7)",
            textShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
            filter: "blur(0.3px)",
          }}
        >
          Get Help
        </h2>
        <p
          className="mb-6 leading-relaxed"
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            fontFamily: "var(--font-space-grotesk)",
            filter: "blur(0.3px)",
          }}
        >
          Need assistance? Our community and support team are here to help you navigate VEIL and resolve any issues.
        </p>
        <div className="space-y-6">
          <div>
            <h3
              className="mb-2 text-lg font-semibold"
              style={{
                color: "rgba(16, 185, 129, 0.8)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 10px rgba(16, 185, 129, 0.3)",
                filter: "blur(0.3px)",
              }}
            >
              Discord Community
            </h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              Join our Discord for real-time support, community discussions, and direct access to the VEIL team.
            </p>
          </div>
          <div>
            <h3
              className="mb-2 text-lg font-semibold"
              style={{
                color: "rgba(16, 185, 129, 0.8)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 10px rgba(16, 185, 129, 0.3)",
                filter: "blur(0.3px)",
              }}
            >
              Email Support
            </h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              <a href="mailto:support@veil.markets" className="text-emerald-400 hover:text-emerald-300">
                support@veil.markets
              </a>{" "}
              - Response within 24 hours
            </p>
          </div>
          <div>
            <h3
              className="mb-2 text-lg font-semibold"
              style={{
                color: "rgba(16, 185, 129, 0.8)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 10px rgba(16, 185, 129, 0.3)",
                filter: "blur(0.3px)",
              }}
            >
              Documentation
            </h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              Check our comprehensive documentation for guides, tutorials, and technical references.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2
          className="mb-6 text-2xl font-semibold"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            color: "rgba(255, 255, 255, 0.7)",
            textShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
            filter: "blur(0.3px)",
          }}
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3
              className="mb-2 font-semibold"
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              How do I get started on VEIL?
            </h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              Connect your Web3 wallet (MetaMask, WalletConnect, etc.), sign the whitelist message to qualify for VEIL
              token airdrops, and start trading on any market.
            </p>
          </div>
          <div>
            <h3
              className="mb-2 font-semibold"
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              What wallets are supported?
            </h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              VEIL supports MetaMask, WalletConnect, Coinbase Wallet, and any Ethereum-compatible wallet that supports
              Web3 connections.
            </p>
          </div>
          <div>
            <h3
              className="mb-2 font-semibold"
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              How are markets resolved?
            </h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              Markets are resolved by decentralized oracle consensus based on verifiable real-world data sources.
              Resolution is transparent and auditable on-chain.
            </p>
          </div>
          <div>
            <h3
              className="mb-2 font-semibold"
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              Is my trading activity private?
            </h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              Yes. VEIL uses zero-knowledge proofs to ensure your positions, trade history, and wallet balance remain
              private and are only visible to you.
            </p>
          </div>
          <div>
            <h3
              className="mb-2 font-semibold"
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              What are the trading fees?
            </h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              VEIL charges a small protocol fee on winning positions. There are no deposit or withdrawal fees, and no
              bet limits.
            </p>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  )
}
