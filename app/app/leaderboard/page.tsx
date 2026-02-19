"use client"

import { AppShaderBackground } from "@/components/app-shader-background"
import Link from "next/link"

const leaderboardData = [
  { rank: 1, address: "0x742d...35a3", volume: "$2,847,392", profit: "+$284,739", winRate: "68%", trades: 1247 },
  { rank: 2, address: "0x8f3c...92b1", volume: "$2,103,847", profit: "+$189,346", winRate: "64%", trades: 892 },
  { rank: 3, address: "0x1a9e...47d2", volume: "$1,892,103", profit: "+$151,368", winRate: "62%", trades: 743 },
  { rank: 4, address: "0x5c2b...83f9", volume: "$1,647,291", profit: "+$131,783", winRate: "61%", trades: 634 },
  { rank: 5, address: "0x9d4a...26e8", volume: "$1,523,847", profit: "+$121,908", winRate: "59%", trades: 589 },
  { rank: 6, address: "0x3e7f...91c4", volume: "$1,392,103", profit: "+$111,368", winRate: "58%", trades: 521 },
  { rank: 7, address: "0x6b8c...45a7", volume: "$1,284,736", profit: "+$102,779", winRate: "57%", trades: 478 },
  { rank: 8, address: "0x2f1d...68b3", volume: "$1,147,291", profit: "+$91,783", winRate: "56%", trades: 423 },
  { rank: 9, address: "0x7a3e...92f5", volume: "$1,023,847", profit: "+$81,908", winRate: "55%", trades: 387 },
  { rank: 10, address: "0x4c9b...37d1", volume: "$947,103", profit: "+$75,768", winRate: "54%", trades: 356 },
]

export default function LeaderboardPage() {
  return (
    <div className="relative min-h-screen">
      <AppShaderBackground />

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 backdrop-blur-xl" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href="/app"
                  className="mb-2 inline-flex items-center gap-2 text-sm transition-all hover:text-emerald-400"
                  style={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M10 12L6 8l4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Back to Markets
                </Link>
                <h1
                  className="text-4xl font-bold"
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontFamily: "var(--font-space-grotesk)",
                    textShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
                    filter: "blur(0.3px)",
                  }}
                >
                  Leaderboard
                </h1>
                <p
                  className="mt-2 text-sm"
                  style={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  Top traders on VEIL this month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {[
              { label: "Total Volume", value: "$47.2M", change: "+12.4%" },
              { label: "Active Traders", value: "8,392", change: "+8.7%" },
              { label: "Markets Traded", value: "1,247", change: "+15.2%" },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 p-6 backdrop-blur-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  boxShadow: "0 0 30px rgba(16, 185, 129, 0.1)",
                }}
              >
                <div
                  className="text-sm"
                  style={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  {stat.label}
                </div>
                <div
                  className="mt-2 text-3xl font-bold"
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontFamily: "var(--font-space-grotesk)",
                    textShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-1 text-sm"
                  style={{
                    color: "rgba(16, 185, 129, 0.8)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard Table */}
          <div
            className="overflow-hidden rounded-xl border border-white/10 backdrop-blur-xl"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              boxShadow: "0 0 40px rgba(16, 185, 129, 0.1)",
            }}
          >
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 border-b border-white/10 px-6 py-4">
              {["Rank", "Trader", "Volume", "Profit", "Win Rate", "Trades"].map((header) => (
                <div
                  key={header}
                  className="text-sm font-medium"
                  style={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  {header}
                </div>
              ))}
            </div>

            {/* Table Rows */}
            {leaderboardData.map((trader) => (
              <div
                key={trader.rank}
                className="grid grid-cols-6 gap-4 border-b border-white/5 px-6 py-4 transition-all hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  {trader.rank <= 3 && (
                    <span className="text-2xl">{trader.rank === 1 ? "🥇" : trader.rank === 2 ? "🥈" : "🥉"}</span>
                  )}
                  <span
                    className="font-bold"
                    style={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontFamily: "var(--font-space-grotesk)",
                    }}
                  >
                    #{trader.rank}
                  </span>
                </div>
                <div
                  className="font-mono"
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  {trader.address}
                </div>
                <div
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  {trader.volume}
                </div>
                <div
                  style={{
                    color: "rgba(16, 185, 129, 0.9)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  {trader.profit}
                </div>
                <div
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  {trader.winRate}
                </div>
                <div
                  style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  {trader.trades}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
