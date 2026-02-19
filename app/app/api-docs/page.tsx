import { LegalPageLayout } from "@/components/legal-page-layout"

export default function ApiDocsPage() {
  return (
    <LegalPageLayout title="API Documentation" lastUpdated="February 2026">
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
          REST API
        </h2>
        <p
          className="mb-4 leading-relaxed"
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            fontFamily: "var(--font-space-grotesk)",
            filter: "blur(0.3px)",
          }}
        >
          Base URL:{" "}
          <code
            className="rounded bg-black/30 px-2 py-1"
            style={{
              color: "rgba(16, 185, 129, 0.8)",
              fontFamily: "monospace",
            }}
          >
            https://api.veil.markets/v1
          </code>
        </p>
        <div className="space-y-6">
          <div>
            <h3
              className="mb-2 font-semibold"
              style={{
                color: "rgba(16, 185, 129, 0.8)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 10px rgba(16, 185, 129, 0.3)",
                filter: "blur(0.3px)",
              }}
            >
              GET /markets
            </h3>
            <p
              className="mb-2"
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              Fetch all active markets with current prices, volume, and metadata.
            </p>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.4)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
                fontSize: "0.875rem",
              }}
            >
              Query params: category, status, limit, offset
            </p>
          </div>
          <div>
            <h3
              className="mb-2 font-semibold"
              style={{
                color: "rgba(16, 185, 129, 0.8)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 10px rgba(16, 185, 129, 0.3)",
                filter: "blur(0.3px)",
              }}
            >
              GET /markets/:id
            </h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              Get detailed information about a specific market including resolution criteria and historical data.
            </p>
          </div>
          <div>
            <h3
              className="mb-2 font-semibold"
              style={{
                color: "rgba(16, 185, 129, 0.8)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 10px rgba(16, 185, 129, 0.3)",
                filter: "blur(0.3px)",
              }}
            >
              GET /markets/:id/orderbook
            </h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              Retrieve the current order book for a market with bid/ask prices and liquidity depth.
            </p>
          </div>
          <div>
            <h3
              className="mb-2 font-semibold"
              style={{
                color: "rgba(16, 185, 129, 0.8)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 10px rgba(16, 185, 129, 0.3)",
                filter: "blur(0.3px)",
              }}
            >
              POST /orders
            </h3>
            <p
              className="mb-2"
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              Place a new order on a market. Requires wallet authentication and signature.
            </p>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.4)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
                fontSize: "0.875rem",
              }}
            >
              Body: marketId, outcome, amount, price, signature
            </p>
          </div>
          <div>
            <h3
              className="mb-2 font-semibold"
              style={{
                color: "rgba(16, 185, 129, 0.8)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 10px rgba(16, 185, 129, 0.3)",
                filter: "blur(0.3px)",
              }}
            >
              GET /user/:address/positions
            </h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              Get all open positions for a wallet address. Requires authentication.
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
          WebSocket API
        </h2>
        <p
          className="mb-4 leading-relaxed"
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            fontFamily: "var(--font-space-grotesk)",
            filter: "blur(0.3px)",
          }}
        >
          Connect to:{" "}
          <code
            className="rounded bg-black/30 px-2 py-1"
            style={{
              color: "rgba(16, 185, 129, 0.8)",
              fontFamily: "monospace",
            }}
          >
            wss://api.veil.markets/ws
          </code>
        </p>
        <p
          className="mb-6 leading-relaxed"
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            fontFamily: "var(--font-space-grotesk)",
            filter: "blur(0.3px)",
          }}
        >
          Subscribe to real-time market updates, order book changes, and trade executions via WebSocket connections.
        </p>
        <div className="space-y-4">
          <div>
            <h3
              className="mb-2 font-semibold"
              style={{
                color: "rgba(16, 185, 129, 0.8)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 10px rgba(16, 185, 129, 0.3)",
                filter: "blur(0.3px)",
              }}
            >
              Subscribe to Market
            </h3>
            <code
              className="block rounded bg-black/30 p-3"
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: "monospace",
                fontSize: "0.875rem",
              }}
            >
              {`{ "action": "subscribe", "channel": "market", "marketId": "btc-100k" }`}
            </code>
          </div>
          <div>
            <h3
              className="mb-2 font-semibold"
              style={{
                color: "rgba(16, 185, 129, 0.8)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 10px rgba(16, 185, 129, 0.3)",
                filter: "blur(0.3px)",
              }}
            >
              Subscribe to Order Book
            </h3>
            <code
              className="block rounded bg-black/30 p-3"
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: "monospace",
                fontSize: "0.875rem",
              }}
            >
              {`{ "action": "subscribe", "channel": "orderbook", "marketId": "btc-100k" }`}
            </code>
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
          Authentication
        </h2>
        <p
          className="mb-4 leading-relaxed"
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            fontFamily: "var(--font-space-grotesk)",
            filter: "blur(0.3px)",
          }}
        >
          VEIL uses wallet-based authentication. Sign a message with your wallet to receive an API key:
        </p>
        <ol
          className="list-inside list-decimal space-y-3"
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            fontFamily: "var(--font-space-grotesk)",
            filter: "blur(0.3px)",
          }}
        >
          <li>Request a challenge message from POST /auth/challenge</li>
          <li>Sign the message with your wallet</li>
          <li>Submit the signature to POST /auth/verify</li>
          <li>Receive an API key valid for 24 hours</li>
          <li>Include the API key in the Authorization header for authenticated requests</li>
        </ol>
      </section>
    </LegalPageLayout>
  )
}
