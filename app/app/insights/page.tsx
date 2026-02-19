"use client"

import { useState } from "react"
import { AppShaderBackground } from "@/components/app-shader-background"
import { Copy, Download, Plus, Trash2, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { INSIGHTS_PRODUCTS } from "@/lib/products"
import { InsightsCheckout } from "@/components/insights-checkout"

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<"dashboards" | "api" | "receipts" | "packages">("dashboards")
  const [checkoutProductId, setCheckoutProductId] = useState<string | null>(null)
  const [currentPlan, setCurrentPlan] = useState<string>("insights-standard")

  const apiKeys = [
    {
      id: "1",
      name: "Production API",
      key: "veil_live_••••••••••••3x9k",
      created: "2025-01-15",
      lastUsed: "2 hours ago",
    },
    { id: "2", name: "Development", key: "veil_test_••••••••••••7m2p", created: "2025-01-10", lastUsed: "5 days ago" },
  ]
  const [showNewKeyModal, setShowNewKeyModal] = useState(false)

  const markets = [
    {
      id: 1,
      name: "Trump wins 2024",
      odds: "62%",
      confidence: "±3%",
      change: "+2%",
      health: "Healthy",
      lastUpdate: "5m ago",
    },
    {
      id: 2,
      name: "Bitcoin > $100k by EOY",
      odds: "45%",
      confidence: "±5%",
      change: "-1%",
      health: "Healthy",
      lastUpdate: "5m ago",
    },
    {
      id: 3,
      name: "Lakers win NBA Finals",
      odds: "18%",
      confidence: "±4%",
      change: "+3%",
      health: "Thin",
      lastUpdate: "5m ago",
    },
    {
      id: 4,
      name: "Fed cuts rates in Q1",
      odds: "73%",
      confidence: "±2%",
      change: "0%",
      health: "Healthy",
      lastUpdate: "5m ago",
    },
  ]

  const receipts = [
    {
      id: "0x7f3a...9b2c",
      market: "Trump wins 2024",
      action: "Fill",
      timestamp: "2025-01-17 14:32:18",
      status: "Verified",
    },
    {
      id: "0x4e1d...5k8p",
      market: "Bitcoin > $100k",
      action: "Settlement",
      timestamp: "2025-01-17 12:15:42",
      status: "Verified",
    },
    {
      id: "0x9c2f...3n7q",
      market: "Lakers win Finals",
      action: "Fill",
      timestamp: "2025-01-17 09:48:55",
      status: "Verified",
    },
  ]

  const handleUpgrade = (productId: string) => {
    if (productId === "insights-standard") {
      setCurrentPlan(productId)
    } else {
      setCheckoutProductId(productId)
    }
  }

  return (
    <div className="min-h-screen relative">
      <AppShaderBackground />

      <div className="relative z-10 min-h-screen px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-all hover:scale-105 group"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Markets
            </Link>
          </div>

          {/* Hero */}
          <div className="mb-12 text-center">
            <h1
              className="text-5xl font-light mb-4 transition-all hover:scale-105"
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
              }}
            >
              Insights Hub
            </h1>
            <p
              className="text-lg font-light max-w-2xl mx-auto"
              style={{
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              We sell probabilities, not people.
            </p>
            <p
              className="text-sm font-light mt-2"
              style={{
                color: "rgba(16, 185, 129, 0.7)",
              }}
            >
              No wallet data. Aggregated, delayed, verified.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-8 border-b border-white/5">
            {[
              { id: "dashboards", label: "Live Dashboards" },
              { id: "api", label: "API" },
              { id: "receipts", label: "Receipts" },
              { id: "packages", label: "Packages" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="px-6 py-3 text-sm font-light transition-all relative group"
                style={{
                  color: activeTab === tab.id ? "rgba(16, 185, 129, 0.9)" : "rgba(255, 255, 255, 0.5)",
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{
                      background: "rgba(16, 185, 129, 0.8)",
                      boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Dashboards Tab */}
          {activeTab === "dashboards" && (
            <div className="space-y-6">
              <div
                className="rounded-xl border backdrop-blur-xl p-6 transition-all hover:border-emerald-500/20"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2
                      className="text-xl font-light mb-1 transition-all hover:text-shadow-glow"
                      style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        textShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
                      }}
                    >
                      Market Odds (Delayed 5m)
                    </h2>
                    <p className="text-xs font-light" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                      Aggregated from all sealed windows. No individual order data.
                    </p>
                  </div>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-all hover:scale-105"
                    style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      color: "rgba(16, 185, 129, 0.9)",
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download 24h CSV
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th
                          className="text-left py-3 px-4 text-xs font-light"
                          style={{ color: "rgba(255, 255, 255, 0.4)" }}
                        >
                          Market
                        </th>
                        <th
                          className="text-left py-3 px-4 text-xs font-light"
                          style={{ color: "rgba(255, 255, 255, 0.4)" }}
                        >
                          Odds
                        </th>
                        <th
                          className="text-left py-3 px-4 text-xs font-light"
                          style={{ color: "rgba(255, 255, 255, 0.4)" }}
                        >
                          Confidence
                        </th>
                        <th
                          className="text-left py-3 px-4 text-xs font-light"
                          style={{ color: "rgba(255, 255, 255, 0.4)" }}
                        >
                          Change
                        </th>
                        <th
                          className="text-left py-3 px-4 text-xs font-light"
                          style={{ color: "rgba(255, 255, 255, 0.4)" }}
                        >
                          Health
                        </th>
                        <th
                          className="text-left py-3 px-4 text-xs font-light"
                          style={{ color: "rgba(255, 255, 255, 0.4)" }}
                        >
                          Last Update
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {markets.map((market) => (
                        <tr key={market.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 text-sm font-light" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                            {market.name}
                          </td>
                          <td
                            className="py-3 px-4 text-sm font-light tabular-nums"
                            style={{ color: "rgba(16, 185, 129, 0.9)" }}
                          >
                            {market.odds}
                          </td>
                          <td
                            className="py-3 px-4 text-sm font-light tabular-nums"
                            style={{ color: "rgba(255, 255, 255, 0.6)" }}
                          >
                            {market.confidence}
                          </td>
                          <td
                            className="py-3 px-4 text-sm font-light tabular-nums"
                            style={{
                              color: market.change.startsWith("+")
                                ? "rgba(16, 185, 129, 0.9)"
                                : market.change.startsWith("-")
                                  ? "rgba(239, 68, 68, 0.9)"
                                  : "rgba(255, 255, 255, 0.6)",
                            }}
                          >
                            {market.change}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className="px-2 py-1 rounded-full text-xs font-light"
                              style={{
                                background:
                                  market.health === "Healthy" ? "rgba(16, 185, 129, 0.1)" : "rgba(234, 179, 8, 0.1)",
                                border: `1px solid ${market.health === "Healthy" ? "rgba(16, 185, 129, 0.2)" : "rgba(234, 179, 8, 0.2)"}`,
                                color:
                                  market.health === "Healthy" ? "rgba(16, 185, 129, 0.9)" : "rgba(234, 179, 8, 0.9)",
                              }}
                            >
                              {market.health}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm font-light" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                            {market.lastUpdate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5">
                  <a
                    href="/app/docs"
                    target="_blank"
                    className="inline-flex items-center gap-2 text-xs font-light transition-all hover:text-emerald-400"
                    style={{ color: "rgba(255, 255, 255, 0.5)" }}
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Learn about our privacy model and delay policies
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* API Tab */}
          {activeTab === "api" && (
            <div className="space-y-6">
              {/* API Keys */}
              <div
                className="rounded-xl border backdrop-blur-xl p-6 transition-all hover:border-emerald-500/20"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-xl font-light"
                    style={{
                      color: "rgba(255, 255, 255, 0.9)",
                      textShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
                    }}
                  >
                    API Keys
                  </h2>
                  <button
                    onClick={() => setShowNewKeyModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-all hover:scale-105"
                    style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      color: "rgba(16, 185, 129, 0.9)",
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Create New Key
                  </button>
                </div>

                <div className="space-y-3">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                      style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        borderColor: "rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-light" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                            {key.name}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-light"
                            style={{
                              background: "rgba(16, 185, 129, 0.1)",
                              border: "1px solid rgba(16, 185, 129, 0.2)",
                              color: "rgba(16, 185, 129, 0.9)",
                            }}
                          >
                            Active
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-4 text-xs font-light"
                          style={{ color: "rgba(255, 255, 255, 0.4)" }}
                        >
                          <span>Created {key.created}</span>
                          <span>•</span>
                          <span>Last used {key.lastUsed}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <code
                          className="px-3 py-1.5 rounded font-mono text-xs"
                          style={{
                            background: "rgba(0, 0, 0, 0.3)",
                            color: "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {key.key}
                        </code>
                        <button
                          className="p-2 rounded-lg transition-all hover:bg-white/5"
                          style={{ color: "rgba(255, 255, 255, 0.5)" }}
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg transition-all hover:bg-red-500/10"
                          style={{ color: "rgba(239, 68, 68, 0.7)" }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quickstart */}
              <div
                className="rounded-xl border backdrop-blur-xl p-6"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <h2
                  className="text-xl font-light mb-4"
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    textShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  Quickstart
                </h2>
                <pre
                  className="p-4 rounded-lg overflow-x-auto text-xs font-mono"
                  style={{
                    background: "rgba(0, 0, 0, 0.3)",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.veil.markets/v1/markets

# Response (delayed 5m, aggregated)
{
  "markets": [
    {
      "id": "trump-2024",
      "odds": 0.62,
      "confidence": 0.03,
      "delayed_minutes": 5
    }
  ]
}`}
                </pre>
              </div>

              {/* Usage Meter */}
              <div
                className="rounded-xl border backdrop-blur-xl p-6"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <h2
                  className="text-xl font-light mb-4"
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    textShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  Usage This Month
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-light" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        API Calls
                      </span>
                      <span className="text-sm font-light tabular-nums" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                        12,450 / 50,000
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: "rgba(255, 255, 255, 0.05)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: "25%",
                          background: "linear-gradient(90deg, rgba(16, 185, 129, 0.8), rgba(16, 185, 129, 0.5))",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Receipts Tab */}
          {activeTab === "receipts" && (
            <div className="space-y-6">
              <div
                className="rounded-xl border backdrop-blur-xl p-6"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <h2
                  className="text-xl font-light mb-6"
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    textShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  Recent Receipts
                </h2>

                <div className="space-y-3">
                  {receipts.map((receipt) => (
                    <div
                      key={receipt.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                      style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        borderColor: "rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <code
                            className="px-2 py-1 rounded font-mono text-xs"
                            style={{
                              background: "rgba(0, 0, 0, 0.3)",
                              color: "rgba(16, 185, 129, 0.9)",
                            }}
                          >
                            {receipt.id}
                          </code>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-light"
                            style={{
                              background: "rgba(16, 185, 129, 0.1)",
                              border: "1px solid rgba(16, 185, 129, 0.2)",
                              color: "rgba(16, 185, 129, 0.9)",
                            }}
                          >
                            {receipt.status}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-4 text-xs font-light"
                          style={{ color: "rgba(255, 255, 255, 0.4)" }}
                        >
                          <span>{receipt.market}</span>
                          <span>•</span>
                          <span>{receipt.action}</span>
                          <span>•</span>
                          <span>{receipt.timestamp}</span>
                        </div>
                      </div>
                      <button
                        className="p-2 rounded-lg transition-all hover:bg-white/5"
                        style={{ color: "rgba(255, 255, 255, 0.5)" }}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Packages Tab */}
          {activeTab === "packages" && (
            <div className="grid grid-cols-3 gap-6">
              {INSIGHTS_PRODUCTS.map((pkg) => {
                const isCurrentPlan = currentPlan === pkg.id
                const isFree = pkg.priceInCents === 0

                return (
                  <div
                    key={pkg.id}
                    className="rounded-xl border backdrop-blur-xl p-6"
                    style={{
                      background:
                        pkg.id === "insights-enterprise" ? "rgba(16, 185, 129, 0.05)" : "rgba(255, 255, 255, 0.02)",
                      borderColor:
                        pkg.id === "insights-enterprise" ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <h3
                      className="text-2xl font-light mb-2"
                      style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        textShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
                      }}
                    >
                      {pkg.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-3xl font-light" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                        {isFree ? "Free" : `$${(pkg.priceInCents / 100).toFixed(0)}/mo`}
                      </span>
                    </div>
                    <div
                      className="mb-4 px-3 py-1.5 rounded-full text-xs font-light inline-block"
                      style={{
                        background: "rgba(16, 185, 129, 0.1)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                        color: "rgba(16, 185, 129, 0.9)",
                      }}
                    >
                      Delay: {pkg.delay}
                    </div>
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature) => (
                        <li
                          key={feature}
                          className="text-sm font-light flex items-center gap-2"
                          style={{ color: "rgba(255, 255, 255, 0.7)" }}
                        >
                          <div className="w-1 h-1 rounded-full" style={{ background: "rgba(16, 185, 129, 0.7)" }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleUpgrade(pkg.id)}
                      disabled={isCurrentPlan}
                      className="w-full py-2.5 rounded-lg text-sm font-light transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{
                        background:
                          pkg.id === "insights-enterprise" ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        color: "rgba(16, 185, 129, 0.9)",
                      }}
                    >
                      {isCurrentPlan ? "Current Plan" : isFree ? "Downgrade" : "Upgrade"}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {checkoutProductId && (
        <InsightsCheckout productId={checkoutProductId} onClose={() => setCheckoutProductId(null)} />
      )}
    </div>
  )
}
