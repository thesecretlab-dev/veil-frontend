"use client"

import { AppShaderBackground } from "@/components/app-shader-background"
import Link from "next/link"

const rewardTiers = [
  { tier: "Diamond", minVolume: "$100,000", multiplier: "3x", color: "rgba(147, 197, 253, 0.8)" },
  { tier: "Platinum", minVolume: "$50,000", multiplier: "2.5x", color: "rgba(203, 213, 225, 0.8)" },
  { tier: "Gold", minVolume: "$25,000", multiplier: "2x", color: "rgba(251, 191, 36, 0.8)" },
  { tier: "Silver", minVolume: "$10,000", multiplier: "1.5x", color: "rgba(156, 163, 175, 0.8)" },
  { tier: "Bronze", minVolume: "$1,000", multiplier: "1x", color: "rgba(180, 83, 9, 0.8)" },
]

const upcomingAirdrops = [
  { date: "Jan 15, 2025", amount: "10,000 VEIL", requirement: "Trade $5,000+ volume", status: "Upcoming" },
  { date: "Feb 1, 2025", amount: "25,000 VEIL", requirement: "Top 100 traders", status: "Upcoming" },
  { date: "Mar 1, 2025", amount: "50,000 VEIL", requirement: "Early adopters", status: "Upcoming" },
]

export default function RewardsPage() {
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
                  Rewards & Airdrops
                </h1>
                <p
                  className="mt-2 text-sm"
                  style={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  Earn VEIL tokens by trading on the platform
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Your Stats */}
          <div
            className="mb-8 rounded-xl border border-white/10 p-8 backdrop-blur-xl"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              boxShadow: "0 0 40px rgba(16, 185, 129, 0.15)",
            }}
          >
            <h2
              className="mb-6 text-2xl font-bold"
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
              }}
            >
              Your Rewards Status
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div
                  className="text-sm"
                  style={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  Current Tier
                </div>
                <div
                  className="mt-2 text-3xl font-bold"
                  style={{
                    color: "rgba(251, 191, 36, 0.9)",
                    fontFamily: "var(--font-space-grotesk)",
                    textShadow: "0 0 20px rgba(251, 191, 36, 0.3)",
                  }}
                >
                  Gold
                </div>
              </div>
              <div>
                <div
                  className="text-sm"
                  style={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  Earned VEIL
                </div>
                <div
                  className="mt-2 text-3xl font-bold"
                  style={{
                    color: "rgba(16, 185, 129, 0.9)",
                    fontFamily: "var(--font-space-grotesk)",
                    textShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  12,847
                </div>
              </div>
              <div>
                <div
                  className="text-sm"
                  style={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  Reward Multiplier
                </div>
                <div
                  className="mt-2 text-3xl font-bold"
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontFamily: "var(--font-space-grotesk)",
                    textShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  2.0x
                </div>
              </div>
            </div>
          </div>

          {/* Reward Tiers */}
          <div className="mb-8">
            <h2
              className="mb-4 text-2xl font-bold"
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
              }}
            >
              Reward Tiers
            </h2>
            <div className="grid gap-4 md:grid-cols-5">
              {rewardTiers.map((tier) => (
                <div
                  key={tier.tier}
                  className="rounded-xl border border-white/10 p-6 backdrop-blur-xl transition-all hover:scale-105"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    boxShadow: `0 0 30px ${tier.color.replace("0.8", "0.15")}`,
                  }}
                >
                  <div
                    className="mb-3 text-xl font-bold"
                    style={{
                      color: tier.color,
                      fontFamily: "var(--font-space-grotesk)",
                      textShadow: `0 0 15px ${tier.color.replace("0.8", "0.3")}`,
                    }}
                  >
                    {tier.tier}
                  </div>
                  <div
                    className="mb-2 text-sm"
                    style={{
                      color: "rgba(255, 255, 255, 0.5)",
                      fontFamily: "var(--font-space-grotesk)",
                    }}
                  >
                    Min. Volume
                  </div>
                  <div
                    className="mb-3 font-bold"
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontFamily: "var(--font-space-grotesk)",
                    }}
                  >
                    {tier.minVolume}
                  </div>
                  <div
                    className="text-2xl font-bold"
                    style={{
                      color: "rgba(16, 185, 129, 0.9)",
                      fontFamily: "var(--font-space-grotesk)",
                    }}
                  >
                    {tier.multiplier}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Airdrops */}
          <div>
            <h2
              className="mb-4 text-2xl font-bold"
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
              }}
            >
              Upcoming Airdrops
            </h2>
            <div className="space-y-4">
              {upcomingAirdrops.map((airdrop, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-white/10 p-6 backdrop-blur-xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    boxShadow: "0 0 30px rgba(16, 185, 129, 0.1)",
                  }}
                >
                  <div>
                    <div
                      className="mb-1 text-sm"
                      style={{
                        color: "rgba(255, 255, 255, 0.5)",
                        fontFamily: "var(--font-space-grotesk)",
                      }}
                    >
                      {airdrop.date}
                    </div>
                    <div
                      className="mb-2 text-2xl font-bold"
                      style={{
                        color: "rgba(16, 185, 129, 0.9)",
                        fontFamily: "var(--font-space-grotesk)",
                        textShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      {airdrop.amount}
                    </div>
                    <div
                      className="text-sm"
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontFamily: "var(--font-space-grotesk)",
                      }}
                    >
                      {airdrop.requirement}
                    </div>
                  </div>
                  <div
                    className="rounded-lg px-4 py-2"
                    style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      color: "rgba(16, 185, 129, 0.9)",
                      fontFamily: "var(--font-space-grotesk)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    {airdrop.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
