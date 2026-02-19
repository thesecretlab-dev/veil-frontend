"use client"

import { useState } from "react"
import Link from "next/link"
import { AppShaderBackground } from "@/components/app-shader-background"
import { PortfolioChart } from "@/components/portfolio-chart"
import { Download, Copy, Check } from "lucide-react"

export default function PortfolioPage() {
  const [expandedPosition, setExpandedPosition] = useState<number | null>(null)
  const [expandedTrade, setExpandedTrade] = useState<number | null>(null)
  const [copiedReceipt, setCopiedReceipt] = useState<string | null>(null)

  const positions = [
    {
      id: 1,
      question: "Will Bitcoin reach $100k by end of 2024?",
      outcome: "Yes",
      shares: 250,
      avgPrice: 0.45,
      currentPrice: 0.62,
      value: 155,
      pnl: 42.5,
      pnlPercent: 37.8,
      // Additional details
      entryDate: "2024-01-08",
      marketVolume: "$2.4M",
      totalShares: 5420000,
      yourOwnership: "0.0046%",
      fees: 1.25,
      breakEven: 0.45,
      roi: 37.8,
      daysHeld: 37,
      lastUpdate: "2 hours ago",
      receiptId: "0x7f3a...9b2c",
    },
    {
      id: 2,
      question: "Will there be a US recession in 2024?",
      outcome: "No",
      shares: 180,
      avgPrice: 0.38,
      currentPrice: 0.51,
      value: 91.8,
      pnl: 23.4,
      pnlPercent: 34.2,
      entryDate: "2024-01-12",
      marketVolume: "$1.8M",
      totalShares: 3890000,
      yourOwnership: "0.0046%",
      fees: 0.95,
      breakEven: 0.38,
      roi: 34.2,
      daysHeld: 33,
      lastUpdate: "5 hours ago",
      receiptId: "0x4e1d...5k8p",
    },
    {
      id: 3,
      question: "Will Trump win the 2024 election?",
      outcome: "Yes",
      shares: 320,
      avgPrice: 0.52,
      currentPrice: 0.48,
      value: 153.6,
      pnl: -12.8,
      pnlPercent: -7.7,
      entryDate: "2024-01-05",
      marketVolume: "$8.2M",
      totalShares: 18500000,
      yourOwnership: "0.0017%",
      fees: 1.85,
      breakEven: 0.52,
      roi: -7.7,
      daysHeld: 40,
      lastUpdate: "1 hour ago",
      receiptId: "0x9c2f...3n7q",
    },
  ]

  const history = [
    {
      id: 1,
      date: "2024-01-15",
      time: "14:32 EST",
      question: "Will AI replace 50% of jobs by 2030?",
      outcome: "No",
      type: "Sell",
      shares: 150,
      price: 0.68,
      total: 102,
      pnl: 28.5,
      // Additional details
      entryPrice: 0.49,
      entryDate: "2023-12-20",
      exitPrice: 0.68,
      fees: 1.15,
      netPnl: 27.35,
      holdingPeriod: "26 days",
      roi: 38.8,
      transactionHash: "0x7a9f...3c2d",
      receiptId: "0x7a9f...3c2d",
    },
    {
      id: 2,
      date: "2024-01-14",
      time: "09:15 EST",
      question: "Will Ethereum reach $5k in 2024?",
      outcome: "Yes",
      type: "Buy",
      shares: 200,
      price: 0.42,
      total: 84,
      pnl: 0,
      entryPrice: 0.42,
      entryDate: "2024-01-14",
      exitPrice: null,
      fees: 0.84,
      netPnl: 0,
      holdingPeriod: "31 days",
      roi: 0,
      transactionHash: "0x4b8e...9f1a",
      receiptId: "0x4b8e...9f1a",
    },
  ]

  const totalValue = positions.reduce((sum, pos) => sum + pos.value, 0)
  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0)
  const totalPnLPercent = (totalPnL / (totalValue - totalPnL)) * 100

  const portfolioHistory = [
    { date: "Jan 1", value: 320 },
    { date: "Jan 5", value: 335 },
    { date: "Jan 10", value: 328 },
    { date: "Jan 15", value: 352 },
    { date: "Jan 20", value: 368 },
    { date: "Jan 25", value: 358 },
    { date: "Jan 30", value: 375 },
    { date: "Feb 4", value: 385 },
    { date: "Feb 9", value: 395 },
    { date: "Feb 14", value: totalValue },
  ]

  const handleExportCSV = () => {
    const csvData = [
      ["Date", "Market", "Type", "Outcome", "Shares", "Price", "Total", "P&L", "Receipt ID"],
      ...history.map((trade) => [
        trade.date,
        trade.question,
        trade.type,
        trade.outcome,
        trade.shares,
        trade.price,
        trade.total,
        trade.pnl,
        trade.receiptId,
      ]),
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `veil-portfolio-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleCopyReceipt = (receiptId: string) => {
    navigator.clipboard.writeText(receiptId)
    setCopiedReceipt(receiptId)
    setTimeout(() => setCopiedReceipt(null), 2000)
  }

  return (
    <div className="relative min-h-screen">
      <AppShaderBackground />

      <div className="relative z-10">
        <div className="border-b border-white/5">
          <div className="mx-auto max-w-5xl px-8 py-8">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 text-sm transition-colors hover:text-emerald-400/80"
              style={{
                color: "rgba(255, 255, 255, 0.4)",
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Back to Markets
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-8 py-16">
          <div className="mb-16 flex items-center justify-between">
            <h1
              className="text-5xl font-light tracking-tight"
              style={{
                color: "rgba(255, 255, 255, 0.95)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 40px rgba(16, 185, 129, 0.15)",
              }}
            >
              Portfolio
            </h1>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-all hover:scale-105"
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                color: "rgba(16, 185, 129, 0.9)",
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>

          <div className="mb-20 grid gap-12 md:grid-cols-3">
            <div>
              <div
                className="mb-2 text-xs uppercase tracking-wider"
                style={{
                  color: "rgba(255, 255, 255, 0.3)",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                Total Value
              </div>
              <div
                className="text-4xl font-light"
                style={{
                  color: "rgba(255, 255, 255, 0.95)",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                ${totalValue.toFixed(2)}
              </div>
            </div>

            <div>
              <div
                className="mb-2 text-xs uppercase tracking-wider"
                style={{
                  color: "rgba(255, 255, 255, 0.3)",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                Total P&L
              </div>
              <div
                className="text-4xl font-light"
                style={{
                  color: totalPnL >= 0 ? "rgba(16, 185, 129, 0.95)" : "rgba(239, 68, 68, 0.95)",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
              </div>
            </div>

            <div>
              <div
                className="mb-2 text-xs uppercase tracking-wider"
                style={{
                  color: "rgba(255, 255, 255, 0.3)",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                Return
              </div>
              <div
                className="text-4xl font-light"
                style={{
                  color: totalPnLPercent >= 0 ? "rgba(16, 185, 129, 0.95)" : "rgba(239, 68, 68, 0.95)",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                {totalPnLPercent >= 0 ? "+" : ""}
                {totalPnLPercent.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="mb-24">
            <h2
              className="mb-8 text-sm uppercase tracking-wider"
              style={{
                color: "rgba(255, 255, 255, 0.4)",
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              Portfolio Value
            </h2>
            <div
              className="rounded-lg border border-white/5 bg-black/20 p-8 backdrop-blur-sm"
              style={{
                boxShadow: "0 0 40px rgba(16, 185, 129, 0.05)",
              }}
            >
              <PortfolioChart data={portfolioHistory} />
            </div>
          </div>

          <h2
            className="mb-8 text-sm uppercase tracking-wider"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            Active Positions
          </h2>

          <div className="mb-24 space-y-6">
            {positions.map((position) => (
              <div
                key={position.id}
                className="cursor-pointer rounded-lg border border-white/5 bg-black/10 p-6 backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:bg-black/20"
                onClick={() => setExpandedPosition(expandedPosition === position.id ? null : position.id)}
                style={{
                  boxShadow:
                    expandedPosition === position.id
                      ? "0 0 30px rgba(16, 185, 129, 0.1)"
                      : "0 0 20px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1">
                    <h3
                      className="mb-3 text-lg font-normal"
                      style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        fontFamily: "var(--font-space-grotesk)",
                      }}
                    >
                      {position.question}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span
                        style={{
                          color: "rgba(16, 185, 129, 0.8)",
                          fontFamily: "var(--font-space-grotesk)",
                        }}
                      >
                        {position.outcome}
                      </span>
                      <span
                        style={{
                          color: "rgba(255, 255, 255, 0.3)",
                          fontFamily: "var(--font-space-grotesk)",
                        }}
                      >
                        {position.shares} shares
                      </span>
                      <span
                        style={{
                          color: "rgba(255, 255, 255, 0.3)",
                          fontFamily: "var(--font-space-grotesk)",
                        }}
                      >
                        {position.avgPrice.toFixed(2)}¢ → {position.currentPrice.toFixed(2)}¢
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div
                        className="text-2xl font-light"
                        style={{
                          color: position.pnl >= 0 ? "rgba(16, 185, 129, 0.95)" : "rgba(239, 68, 68, 0.95)",
                          fontFamily: "var(--font-space-grotesk)",
                        }}
                      >
                        {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
                      </div>
                      <div
                        className="text-sm"
                        style={{
                          color: position.pnl >= 0 ? "rgba(16, 185, 129, 0.6)" : "rgba(239, 68, 68, 0.6)",
                          fontFamily: "var(--font-space-grotesk)",
                        }}
                      >
                        {position.pnlPercent >= 0 ? "+" : ""}
                        {position.pnlPercent.toFixed(1)}%
                      </div>
                    </div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="transition-transform"
                      style={{
                        transform: expandedPosition === position.id ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {expandedPosition === position.id && (
                  <div
                    className="mt-6 grid gap-6 border-t border-white/5 pt-6 md:grid-cols-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Receipt ID
                        </span>
                        <div className="flex items-center gap-2">
                          <code
                            className="font-mono"
                            style={{
                              color: "rgba(16, 185, 129, 0.8)",
                              fontSize: "0.875rem",
                            }}
                          >
                            {position.receiptId}
                          </code>
                          <button
                            onClick={() => handleCopyReceipt(position.receiptId)}
                            className="p-1 rounded transition-all hover:bg-white/5"
                            style={{ color: "rgba(16, 185, 129, 0.7)" }}
                          >
                            {copiedReceipt === position.receiptId ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Entry Date
                        </span>
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {position.entryDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Days Held
                        </span>
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {position.daysHeld} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Break Even
                        </span>
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {position.breakEven.toFixed(2)}¢
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Fees Paid
                        </span>
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          ${position.fees.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Market Volume
                        </span>
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {position.marketVolume}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Total Shares
                        </span>
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {position.totalShares.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Your Ownership
                        </span>
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {position.yourOwnership}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Last Update
                        </span>
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {position.lastUpdate}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <h2
            className="mb-8 text-sm uppercase tracking-wider"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            Trading History
          </h2>

          <div className="space-y-6">
            {history.map((trade) => (
              <div
                key={trade.id}
                className="cursor-pointer rounded-lg border border-white/5 bg-black/10 p-6 backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:bg-black/20"
                onClick={() => setExpandedTrade(expandedTrade === trade.id ? null : trade.id)}
                style={{
                  boxShadow:
                    expandedTrade === trade.id ? "0 0 30px rgba(16, 185, 129, 0.1)" : "0 0 20px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1">
                    <h3
                      className="mb-3 text-lg font-normal"
                      style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        fontFamily: "var(--font-space-grotesk)",
                      }}
                    >
                      {trade.question}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span
                        style={{
                          color: trade.type === "Buy" ? "rgba(16, 185, 129, 0.8)" : "rgba(239, 68, 68, 0.8)",
                          fontFamily: "var(--font-space-grotesk)",
                        }}
                      >
                        {trade.type}
                      </span>
                      <span
                        style={{
                          color: "rgba(255, 255, 255, 0.5)",
                          fontFamily: "var(--font-space-grotesk)",
                        }}
                      >
                        {trade.outcome}
                      </span>
                      <span
                        style={{
                          color: "rgba(255, 255, 255, 0.3)",
                          fontFamily: "var(--font-space-grotesk)",
                        }}
                      >
                        {trade.shares} shares @ {trade.price.toFixed(2)}¢
                      </span>
                      <span
                        style={{
                          color: "rgba(255, 255, 255, 0.25)",
                          fontFamily: "var(--font-space-grotesk)",
                        }}
                      >
                        {trade.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {trade.pnl > 0 && (
                      <div
                        className="text-xl font-light"
                        style={{
                          color: "rgba(16, 185, 129, 0.95)",
                          fontFamily: "var(--font-space-grotesk)",
                        }}
                      >
                        +${trade.pnl.toFixed(2)}
                      </div>
                    )}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="transition-transform"
                      style={{
                        transform: expandedTrade === trade.id ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {expandedTrade === trade.id && (
                  <div
                    className="mt-6 grid gap-6 border-t border-white/5 pt-6 md:grid-cols-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Receipt ID
                        </span>
                        <div className="flex items-center gap-2">
                          <code
                            className="font-mono"
                            style={{
                              color: "rgba(16, 185, 129, 0.8)",
                              fontSize: "0.875rem",
                            }}
                          >
                            {trade.receiptId}
                          </code>
                          <button
                            onClick={() => handleCopyReceipt(trade.receiptId)}
                            className="p-1 rounded transition-all hover:bg-white/5"
                            style={{ color: "rgba(16, 185, 129, 0.7)" }}
                          >
                            {copiedReceipt === trade.receiptId ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Transaction Time
                        </span>
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {trade.time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Entry Price
                        </span>
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {trade.entryPrice.toFixed(2)}¢
                        </span>
                      </div>
                      {trade.exitPrice && (
                        <div className="flex justify-between">
                          <span
                            style={{
                              color: "rgba(255, 255, 255, 0.4)",
                              fontFamily: "var(--font-space-grotesk)",
                              fontSize: "0.875rem",
                            }}
                          >
                            Exit Price
                          </span>
                          <span
                            style={{
                              color: "rgba(255, 255, 255, 0.8)",
                              fontFamily: "var(--font-space-grotesk)",
                              fontSize: "0.875rem",
                            }}
                          >
                            {trade.exitPrice.toFixed(2)}¢
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Holding Period
                        </span>
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {trade.holdingPeriod}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Fees
                        </span>
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          ${trade.fees.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Net P&L
                        </span>
                        <span
                          style={{
                            color: trade.netPnl >= 0 ? "rgba(16, 185, 129, 0.95)" : "rgba(239, 68, 68, 0.95)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {trade.netPnl >= 0 ? "+" : ""}${trade.netPnl.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          ROI
                        </span>
                        <span
                          style={{
                            color: trade.roi >= 0 ? "rgba(16, 185, 129, 0.95)" : "rgba(239, 68, 68, 0.95)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {trade.roi >= 0 ? "+" : ""}
                          {trade.roi.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                            fontFamily: "var(--font-space-grotesk)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Transaction Hash
                        </span>
                        <span
                          className="font-mono"
                          style={{
                            color: "rgba(16, 185, 129, 0.8)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {trade.transactionHash}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
