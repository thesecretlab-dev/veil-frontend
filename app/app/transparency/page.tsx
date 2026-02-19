"use client"

import { AppShaderBackground } from "@/components/app-shader-background"
import { Download, ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TransparencyPage() {
  const metrics = [
    { label: "Windows On Time", value: "99.7%", target: "≥99.5%", status: "healthy" },
    { label: "Avg Move at Standard Clip", value: "0.8%", target: "≤1%", status: "healthy" },
    { label: "Markets Hidden (Thin)", value: "12%", target: "Monitor", status: "neutral" },
    { label: "Accuracy After Resolution", value: "94.2%", target: "≥90%", status: "healthy" },
  ]

  const policies = [
    {
      title: "Delays",
      description:
        "Public odds are delayed 5 minutes to protect market integrity. This prevents front-running and ensures fair execution for all participants.",
    },
    {
      title: "Minimum Crowd",
      description:
        "Markets require minimum participation (10+ unique participants or $5k+ notional) before live odds are shown. Thin markets show daily summaries only.",
    },
    {
      title: "Rounding",
      description:
        "Published odds are rounded to the nearest percentage point. Full precision is available via API for qualified users.",
    },
    {
      title: "When We Hide a Market",
      description:
        "Markets are hidden when: (1) participation drops below minimum thresholds, (2) dispute is active, or (3) regulatory concerns arise. Users are notified 24h in advance when possible.",
    },
  ]

  const monthlyLetters = [
    {
      month: "January 2025",
      date: "2025-01-31",
      highlights: "Record volume, 3 new market categories, improved SLA metrics",
      pdfUrl: "#",
    },
    {
      month: "December 2024",
      date: "2024-12-31",
      highlights: "Year-end review, governance updates, Q1 2025 roadmap",
      pdfUrl: "#",
    },
    {
      month: "November 2024",
      date: "2024-11-30",
      highlights: "Election markets post-mortem, accuracy analysis",
      pdfUrl: "#",
    },
  ]

  return (
    <div className="min-h-screen relative">
      <AppShaderBackground />

      <div className="relative z-10 min-h-screen px-8 py-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 mb-8 text-sm font-light transition-all hover:gap-3"
            style={{
              color: "rgba(16, 185, 129, 0.7)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Markets
          </Link>

          {/* Hero */}
          <div className="mb-12 text-center">
            <h1
              className="text-5xl font-light mb-4 transition-all hover:scale-105"
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
              }}
            >
              Transparency
            </h1>
            <p
              className="text-lg font-light max-w-2xl mx-auto"
              style={{
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              Our commitment to open, verifiable, and accountable markets.
            </p>
          </div>

          {/* Metrics */}
          <div className="mb-12">
            <h2
              className="text-2xl font-light mb-6"
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
              }}
            >
              Key Metrics
            </h2>
            <div className="grid grid-cols-4 gap-6">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border backdrop-blur-xl p-6"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    borderColor:
                      metric.status === "healthy"
                        ? "rgba(16, 185, 129, 0.2)"
                        : metric.status === "warning"
                          ? "rgba(234, 179, 8, 0.2)"
                          : "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div
                    className="text-3xl font-light mb-2 tabular-nums"
                    style={{
                      color:
                        metric.status === "healthy"
                          ? "rgba(16, 185, 129, 0.9)"
                          : metric.status === "warning"
                            ? "rgba(234, 179, 8, 0.9)"
                            : "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {metric.value}
                  </div>
                  <div className="text-sm font-light mb-1" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    {metric.label}
                  </div>
                  <div className="text-xs font-light" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                    Target: {metric.target}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div className="mb-12">
            <h2
              className="text-2xl font-light mb-6"
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
              }}
            >
              Policies (Plain English)
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {policies.map((policy) => (
                <div
                  key={policy.title}
                  className="rounded-xl border backdrop-blur-xl p-6"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <h3
                    className="text-lg font-light mb-3"
                    style={{
                      color: "rgba(16, 185, 129, 0.9)",
                      textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
                    }}
                  >
                    {policy.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    {policy.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Letters */}
          <div className="mb-12">
            <h2
              className="text-2xl font-light mb-6"
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
              }}
            >
              Monthly Letters
            </h2>
            <div className="space-y-4">
              {monthlyLetters.map((letter) => (
                <div
                  key={letter.month}
                  className="rounded-xl border backdrop-blur-xl p-6 flex items-center justify-between hover:border-emerald-500/30 transition-all"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-light mb-2" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                      {letter.month}
                    </h3>
                    <p className="text-sm font-light mb-2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      {letter.highlights}
                    </p>
                    <span className="text-xs font-light" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                      Published {letter.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={letter.pdfUrl}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-all hover:scale-105"
                      style={{
                        background: "rgba(16, 185, 129, 0.1)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                        color: "rgba(16, 185, 129, 0.9)",
                      }}
                    >
                      <Download className="h-4 w-4" />
                      PDF
                    </a>
                    <a
                      href={letter.pdfUrl}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-all hover:scale-105"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      HTML
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Changelog */}
          <div>
            <h2
              className="text-2xl font-light mb-6"
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
              }}
            >
              Recent Changes
            </h2>
            <div
              className="rounded-xl border backdrop-blur-xl p-6"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                borderColor: "rgba(255, 255, 255, 0.08)",
              }}
            >
              <div className="space-y-4">
                {[
                  {
                    date: "2025-01-15",
                    change: "Reduced delay from 10m to 5m for flagship markets",
                    type: "Improvement",
                  },
                  {
                    date: "2025-01-10",
                    change: "Added confidence bands to all market displays",
                    type: "Feature",
                  },
                  {
                    date: "2025-01-05",
                    change: "Updated minimum crowd threshold from 5 to 10 participants",
                    type: "Policy",
                  },
                  { date: "2024-12-20", change: "Launched receipt verification system", type: "Feature" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0">
                    <span
                      className="px-2 py-1 rounded text-xs font-light whitespace-nowrap"
                      style={{
                        background:
                          item.type === "Feature"
                            ? "rgba(16, 185, 129, 0.1)"
                            : item.type === "Policy"
                              ? "rgba(59, 130, 246, 0.1)"
                              : "rgba(234, 179, 8, 0.1)",
                        border: `1px solid ${item.type === "Feature" ? "rgba(16, 185, 129, 0.2)" : item.type === "Policy" ? "rgba(59, 130, 246, 0.2)" : "rgba(234, 179, 8, 0.2)"}`,
                        color:
                          item.type === "Feature"
                            ? "rgba(16, 185, 129, 0.9)"
                            : item.type === "Policy"
                              ? "rgba(59, 130, 246, 0.9)"
                              : "rgba(234, 179, 8, 0.9)",
                      }}
                    >
                      {item.type}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-light mb-1" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                        {item.change}
                      </p>
                      <span className="text-xs font-light" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                        {item.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
