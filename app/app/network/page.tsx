"use client"

import { VeilFooter, VeilHeader } from "@/components/brand"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const childNodes = [
  {
    key: "child-001",
    label: "Child 001",
    nodeId: "NodeID-A4yqq7yUCQV3CPsVaEGVATLNgHc2fd7vC",
    state: "LIVE / PEERED",
    color: "rgba(16, 185, 129, 0.95)",
    orbitSeconds: 34,
    radius: 110,
    direction: 1,
  },
  {
    key: "child-002",
    label: "Child 002",
    nodeId: "Reserved lane",
    state: "NEXT SLOT",
    color: "rgba(234, 179, 8, 0.9)",
    orbitSeconds: 42,
    radius: 155,
    direction: -1,
  },
  {
    key: "child-003",
    label: "Child 003",
    nodeId: "Reserved lane",
    state: "NEXT SLOT",
    color: "rgba(59, 130, 246, 0.9)",
    orbitSeconds: 50,
    radius: 200,
    direction: 1,
  },
] as const

export default function NetworkPage() {
  return (
    <div className="relative min-h-screen" style={{ background: "#060606" }}>
      <VeilHeader />
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />

      <nav
        className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-8 py-5"
        style={{
          background: "rgba(6, 6, 6, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
        }}
      >
        <Link
          href="/app/transparency"
          className="flex items-center gap-2 text-sm transition-all hover:gap-3"
          style={{ color: "rgba(16, 185, 129, 0.7)", fontFamily: "var(--font-space-grotesk)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Developer Journal
        </Link>
        <span
          className="text-xs uppercase tracking-[0.3em]"
          style={{ color: "rgba(255, 255, 255, 0.25)", fontFamily: "var(--font-space-grotesk)" }}
        >
          VEIL / Network
        </span>
      </nav>

      <main className="relative z-10 mx-auto max-w-[1080px] px-6 pb-24 pt-32">
        <section className="mb-10 text-center">
          <p
            className="mb-4 text-xs uppercase tracking-[0.4em]"
            style={{ color: "rgba(16, 185, 129, 0.5)", fontFamily: "var(--font-space-grotesk)" }}
          >
            Live Topology
          </p>
          <h1
            className="mb-4 text-5xl font-light md:text-6xl"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              color: "rgba(255, 255, 255, 0.92)",
              letterSpacing: "-0.03em",
            }}
          >
            Mainnet Core with Orbiting Child Nodes
          </h1>
          <p
            className="mx-auto max-w-2xl text-base font-light md:text-lg"
            style={{ color: "rgba(255, 255, 255, 0.4)", fontFamily: "var(--font-figtree)" }}
          >
            This surface tracks live VEIL mainnet topology from the operator perspective.
          </p>
        </section>

        <section
          className="rounded-[24px] p-6 md:p-8"
          style={{
            background: "rgba(255, 255, 255, 0.018)",
            border: "1px solid rgba(16, 185, 129, 0.18)",
          }}
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="relative mx-auto h-[360px] w-[360px] sm:h-[420px] sm:w-[420px]">
              {[110, 155, 200].map((radius) => (
                <div
                  key={radius}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: radius * 2,
                    height: radius * 2,
                    border: "1px dashed rgba(255, 255, 255, 0.14)",
                  }}
                />
              ))}

              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div
                  className="flex h-36 w-36 flex-col items-center justify-center rounded-full text-center"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 25%, rgba(16,185,129,0.36), rgba(16,185,129,0.12) 48%, rgba(16,185,129,0.05) 100%)",
                    border: "1px solid rgba(16, 185, 129, 0.45)",
                    boxShadow: "0 0 40px rgba(16, 185, 129, 0.25)",
                  }}
                >
                  <p
                    className="text-[10px] uppercase tracking-[0.18em]"
                    style={{ color: "rgba(255,255,255,0.58)", fontFamily: "var(--font-space-grotesk)" }}
                  >
                    VEIL Mainnet
                  </p>
                  <p
                    className="mt-1 text-[11px]"
                    style={{ color: "rgba(255,255,255,0.92)", fontFamily: "var(--font-space-grotesk)" }}
                  >
                    NodeID-BRW...
                  </p>
                  <p
                    className="mt-1 text-[10px]"
                    style={{ color: "rgba(16,185,129,0.9)", fontFamily: "var(--font-space-grotesk)" }}
                  >
                    Live Core
                  </p>
                </div>
              </motion.div>

              {childNodes.map((node) => (
                <motion.div
                  key={node.key}
                  className="absolute left-1/2 top-1/2"
                  animate={{ rotate: node.direction > 0 ? 360 : -360 }}
                  transition={{ duration: node.orbitSeconds, repeat: Infinity, ease: "linear" }}
                >
                  <div style={{ transform: `translateX(${node.radius}px)` }}>
                    <span
                      className="block h-4 w-4 rounded-full"
                      style={{
                        background: node.color,
                        boxShadow: `0 0 14px ${node.color}`,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              <div
                className="rounded-[14px] p-4"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(16, 185, 129, 0.22)",
                }}
              >
                <p
                  className="text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: "rgba(16,185,129,0.85)", fontFamily: "var(--font-space-grotesk)" }}
                >
                  Mainnet Core
                </p>
                <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-figtree)" }}>
                  NodeID-BRWmyj4aQPgx1suA3Le9km1aF6sQnmVyw
                </p>
                <p
                  className="mt-1 text-xs"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-space-grotesk)" }}
                >
                  endpoint: 127.0.0.1:9660
                </p>
              </div>

              {childNodes.map((node) => (
                <div
                  key={`meta-${node.key}`}
                  className="rounded-[14px] p-4"
                  style={{
                    background: "rgba(255, 255, 255, 0.015)",
                    border: `1px solid ${
                      node.state === "LIVE / PEERED" ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.12)"
                    }`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.88)", fontFamily: "var(--font-figtree)" }}>
                      {node.label}
                    </p>
                    <span
                      className="rounded px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]"
                      style={{
                        color: node.state === "LIVE / PEERED" ? "rgba(16,185,129,0.92)" : "rgba(234,179,8,0.9)",
                        background: node.state === "LIVE / PEERED" ? "rgba(16,185,129,0.1)" : "rgba(234,179,8,0.1)",
                        border: `1px solid ${
                          node.state === "LIVE / PEERED" ? "rgba(16,185,129,0.22)" : "rgba(234,179,8,0.22)"
                        }`,
                        fontFamily: "var(--font-space-grotesk)",
                      }}
                    >
                      {node.state}
                    </span>
                  </div>
                  <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-space-grotesk)" }}>
                    {node.nodeId}
                  </p>
                </div>
              ))}

              <div
                className="rounded-[14px] p-4"
                style={{
                  background: "rgba(255, 255, 255, 0.01)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-space-grotesk)" }}>
                  Last evidence sync: 2026-02-24
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <VeilFooter />
    </div>
  )
}
