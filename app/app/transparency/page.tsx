"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowLeft } from "lucide-react"

type Tone = "mint" | "amber" | "blue" | "rose"
type EntryStatus = "Completed" | "In Progress" | "Needs Follow-Up"

const handFont = `"Segoe Print", "Bradley Hand", "Comic Sans MS", cursive`
const labelFont = "var(--font-space-grotesk)"
const displayFont = "var(--font-instrument-serif)"

const boardMetrics: { label: string; value: string; note: string; tone: Tone }[] = [
  {
    label: "Launch Gates",
    value: "13 / 13 PASS",
    note: "Checklist snapshot now marks all gates PASS or PASS (local).",
    tone: "mint",
  },
  {
    label: "Decision State",
    value: "GO FOR PRODUCTION",
    note: "Checklist decision line flipped after full sign-off rows were completed.",
    tone: "mint",
  },
  {
    label: "Deployment Readiness",
    value: "READY",
    note: "mainnet-deployment latest pointer reports deployment_ready=true.",
    tone: "blue",
  },
  {
    label: "Live Runtime Target",
    value: "aQ8Ct8...AGSWs",
    note: "Order router is now explicitly pinned to the new launched self-host chain.",
    tone: "amber",
  },
]

const canonicalRefs: { label: string; value: string; note: string; tone: Tone }[] = [
  {
    label: "Launch Authority",
    value: "VEIL_PRODUCTION_LAUNCH_CHECKLIST.md",
    note: "Decision line: GO FOR PRODUCTION. Sign-off sheet: 6/6 PASS.",
    tone: "blue",
  },
  {
    label: "Live Runtime Log",
    value: "LIVE_DEVLOG.md",
    note: "Latest operator execution entry: 2026-02-22 18:15:21 -05:00.",
    tone: "mint",
  },
  {
    label: "Readiness Pointer",
    value: "mdprep-20260222-230652",
    note: "evidence-bundles/mainnet-deployment/latest.txt",
    tone: "amber",
  },
  {
    label: "Self-Host Execution Pointer",
    value: "launch-20260222-181521-operator-execution",
    note: "evidence-bundles/self-host-launch/latest.txt",
    tone: "rose",
  },
]

const journalEntries: {
  date: string
  title: string
  status: EntryStatus
  note: string
  sideNote: string
  adjustment: string
}[] = [
  {
    date: "2026-02-22 18:15 -05:00",
    title: "Operator execution aligned to new chain target",
    status: "Completed",
    note:
      "Ran smoke on the newly launched chain, then rebound router runtime to ORDER_CHAIN_ID=aQ8Ct8... so traffic and execution both hit the same chain.",
    sideNote:
      "Verification stamps: router /health now returns chainId=aQ8Ct8..., and platform.getBlockchainStatus reports Validating.",
    adjustment:
      "Old router target (2u12...) was automatically discovered earlier. We forced explicit chain pinning to remove ambiguity.",
  },
  {
    date: "2026-02-22 18:04 -05:00",
    title: "GO posture + live chain creation executed",
    status: "Completed",
    note:
      "Filled sign-off rows, switched decision state to GO FOR PRODUCTION, fixed readiness parser match, and issued live CreateBlockchain on self-host node.",
    sideNote:
      "Created chain: aQ8Ct8Hwwn71EeJw2eyPQJhu8mwHVoyGT8dDGgGu3svQAGSWs.",
    adjustment:
      "First attempt failed due illegal name character. Updated UUP defaults to alphanumeric chain names.",
  },
  {
    date: "2026-02-22 17:46 -05:00",
    title: "Strict signer policy became mandatory launch input",
    status: "Completed",
    note:
      "Strict critical-phase now reads required signer addresses from launch-packet signer policy and fails closed on missing required signatures.",
    sideNote:
      "Policy artifact stored under git-ignored secrets path to keep key material organized.",
    adjustment:
      "Unsigned mode remains available only as explicit dry-run path.",
  },
  {
    date: "2026-02-22 14:22 -05:00",
    title: "G6 relay closure captured with frontier failure trail",
    status: "Completed",
    note:
      "Resolved relay replay progression, captured ENVELOPE_PRIVACY_REJECTED and MARKET_PREP_FAILED frontier conditions, and archived passing seeded replay evidence.",
    sideNote:
      "Mainnet Teleporter + Chainlink live checks passed with funded relayer profile.",
    adjustment:
      "Historical non-VENC1 intents are intentionally rejected by hardened ingress.",
  },
  {
    date: "2026-02-22 13:22 -05:00",
    title: "ANIMA launch gate moved to explicit readiness control",
    status: "Completed",
    note:
      "ANIMA guardrails wired into prelaunch and critical-phase checks with evidence package and launch-copy constraints to avoid overclaims.",
    sideNote:
      "Tier 0 strict-private fixture mapping now recorded in readiness evidence bundle.",
    adjustment:
      "Any frontend claim remains gated by evidence status, not planned intent.",
  },
  {
    date: "2026-02-22",
    title: "Remote AVAcloud path prepared, not executed in this run",
    status: "In Progress",
    note:
      "UUP template for AVAcloud remains available and validated for dry-run workflow, but this cycle intentionally executed self-host-first launch path.",
    sideNote:
      "Remote execution requires explicit P-chain signer and subnet context in template/env inputs.",
    adjustment:
      "No remote key values are rendered on this page. Canonical artifacts only.",
  },
]

const changeTape: { kind: string; detail: string; date: string; tone: Tone }[] = [
  {
    kind: "Operator",
    detail: "Router explicitly pinned to launched chain id.",
    date: "2026-02-22",
    tone: "amber",
  },
  {
    kind: "Readiness",
    detail: "Deployment bundle recommendation is READY_FOR_OPERATOR_MAINNET_EXECUTION.",
    date: "2026-02-22",
    tone: "blue",
  },
  {
    kind: "Policy",
    detail: "Sign-off rows completed and decision line set to GO FOR PRODUCTION.",
    date: "2026-02-22",
    tone: "mint",
  },
  {
    kind: "Hardening",
    detail: "Strict signer policy parser accepts GO and GO FOR PRODUCTION decision forms.",
    date: "2026-02-22",
    tone: "rose",
  },
]

function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { once: true, margin: "-90px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 26 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.21, 0.61, 0.35, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

function toneToken(tone: Tone) {
  if (tone === "mint") {
    return { bg: "rgba(151, 237, 197, 0.28)", ink: "rgba(8, 61, 45, 0.9)", edge: "rgba(35, 140, 99, 0.35)" }
  }
  if (tone === "amber") {
    return { bg: "rgba(253, 225, 145, 0.38)", ink: "rgba(92, 53, 0, 0.92)", edge: "rgba(170, 111, 16, 0.32)" }
  }
  if (tone === "rose") {
    return { bg: "rgba(250, 182, 197, 0.33)", ink: "rgba(102, 26, 48, 0.92)", edge: "rgba(175, 66, 102, 0.36)" }
  }
  return { bg: "rgba(173, 216, 255, 0.3)", ink: "rgba(18, 52, 84, 0.94)", edge: "rgba(55, 114, 161, 0.33)" }
}

function statusToken(status: EntryStatus) {
  if (status === "Completed") {
    return { bg: "rgba(110, 227, 173, 0.28)", ink: "rgba(6, 78, 59, 0.92)", border: "rgba(23, 130, 90, 0.33)" }
  }
  if (status === "In Progress") {
    return { bg: "rgba(255, 224, 124, 0.35)", ink: "rgba(95, 57, 0, 0.92)", border: "rgba(171, 111, 14, 0.35)" }
  }
  return { bg: "rgba(255, 189, 189, 0.36)", ink: "rgba(112, 21, 21, 0.9)", border: "rgba(170, 56, 56, 0.34)" }
}

export default function TransparencyPage() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background:
          "radial-gradient(circle at 15% -5%, rgba(176, 209, 255, 0.28), transparent 46%), radial-gradient(circle at 83% 8%, rgba(255, 206, 145, 0.33), transparent 45%), linear-gradient(180deg, #f3ebd4 0%, #efe4ca 44%, #e5d9bc 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(49, 74, 110, 0.05) 0px, rgba(49, 74, 110, 0.05) 1px, transparent 1px, transparent 36px)",
        }}
      />

      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-5 py-4 md:px-10"
        style={{
          background: "rgba(244, 236, 215, 0.88)",
          borderBottom: "1px solid rgba(95, 83, 59, 0.22)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Link
          href="/app"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-[0.08em] uppercase transition-colors"
          style={{
            fontFamily: labelFont,
            color: "rgba(59, 46, 29, 0.88)",
            border: "1px solid rgba(111, 92, 64, 0.28)",
            background: "rgba(252, 246, 230, 0.7)",
          }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to App
        </Link>
        <span className="text-[11px] tracking-[0.25em] uppercase" style={{ fontFamily: labelFont, color: "rgba(80, 58, 26, 0.75)" }}>
          VEIL LIVE DEVLOG
        </span>
      </nav>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-10 md:px-8">
        <ScrollReveal>
          <section className="mb-10 rounded-[28px] p-6 md:p-10" style={{ background: "rgba(255, 250, 236, 0.76)", border: "1px solid rgba(111, 91, 62, 0.2)", boxShadow: "0 30px 60px rgba(76, 52, 19, 0.12)" }}>
            <p className="mb-3 text-xs tracking-[0.24em] uppercase" style={{ fontFamily: labelFont, color: "rgba(92, 70, 34, 0.62)" }}>
              Notebook Snapshot - 2026-02-22
            </p>
            <h1 className="text-4xl leading-tight md:text-6xl" style={{ fontFamily: displayFont, color: "rgba(43, 30, 15, 0.92)", letterSpacing: "-0.02em" }}>
              VEIL Launch Field Journal
            </h1>
            <p className="mt-4 max-w-3xl text-lg md:text-xl" style={{ fontFamily: handFont, color: "rgba(70, 50, 23, 0.85)", lineHeight: 1.55 }}>
              This page is now treated as a handwritten operations notebook: canonical pointers, side-notes, and adjustments are color-coded so readers can follow what changed and why.
            </p>
          </section>
        </ScrollReveal>

        <section className="mb-14 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <ScrollReveal>
            <div className="rounded-[26px] p-6 md:p-7" style={{ background: "rgba(255, 252, 244, 0.82)", border: "1px solid rgba(103, 84, 56, 0.22)" }}>
              <h2 className="mb-5 text-2xl md:text-3xl" style={{ fontFamily: displayFont, color: "rgba(45, 31, 14, 0.92)" }}>
                Launch Board
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {boardMetrics.map((item) => {
                  const tone = toneToken(item.tone)
                  return (
                    <div key={item.label} className="rounded-2xl p-4" style={{ background: tone.bg, border: `1px solid ${tone.edge}` }}>
                      <p className="text-[11px] tracking-[0.14em] uppercase" style={{ fontFamily: labelFont, color: tone.ink }}>
                        {item.label}
                      </p>
                      <p className="mt-2 text-2xl" style={{ fontFamily: displayFont, color: tone.ink }}>
                        {item.value}
                      </p>
                      <p className="mt-2 text-sm" style={{ fontFamily: handFont, color: tone.ink, opacity: 0.85 }}>
                        {item.note}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="rounded-[26px] p-6 md:p-7" style={{ background: "rgba(255, 248, 232, 0.83)", border: "1px solid rgba(103, 84, 56, 0.22)" }}>
              <h2 className="mb-4 text-2xl md:text-3xl" style={{ fontFamily: displayFont, color: "rgba(45, 31, 14, 0.92)" }}>
                Canonical Pointers
              </h2>
              <div className="space-y-3">
                {canonicalRefs.map((item, idx) => {
                  const tone = toneToken(item.tone)
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + idx * 0.08, duration: 0.45 }}
                      className="rounded-xl px-4 py-3"
                      style={{ background: tone.bg, border: `1px solid ${tone.edge}` }}
                    >
                      <p className="text-[11px] tracking-[0.11em] uppercase" style={{ fontFamily: labelFont, color: tone.ink }}>
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm md:text-base" style={{ fontFamily: displayFont, color: tone.ink }}>
                        {item.value}
                      </p>
                      <p className="mt-1 text-sm" style={{ fontFamily: handFont, color: tone.ink, opacity: 0.86 }}>
                        {item.note}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </ScrollReveal>
        </section>

        <section className="mb-14">
          <ScrollReveal>
            <h2 className="mb-6 text-3xl md:text-4xl" style={{ fontFamily: displayFont, color: "rgba(40, 28, 12, 0.92)" }}>
              Field Notes and Margins
            </h2>
          </ScrollReveal>

          <div className="space-y-6">
            {journalEntries.map((entry, idx) => {
              const status = statusToken(entry.status)
              const rotate = idx % 2 === 0 ? -0.5 : 0.45
              return (
                <ScrollReveal key={`${entry.date}-${entry.title}`} delay={idx * 0.05}>
                  <article
                    className="rounded-[24px] p-5 md:p-7"
                    style={{
                      background: "rgba(255, 253, 247, 0.9)",
                      border: "1px solid rgba(96, 74, 44, 0.22)",
                      transform: `rotate(${rotate}deg)`,
                      boxShadow: "0 16px 34px rgba(81, 57, 23, 0.09)",
                    }}
                  >
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <span
                        className="rounded-full px-3 py-1 text-[11px] tracking-[0.11em] uppercase"
                        style={{ fontFamily: labelFont, background: status.bg, color: status.ink, border: `1px solid ${status.border}` }}
                      >
                        {entry.status}
                      </span>
                      <span className="text-xs" style={{ fontFamily: labelFont, color: "rgba(88, 65, 34, 0.66)" }}>
                        {entry.date}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-[2rem]" style={{ fontFamily: displayFont, color: "rgba(39, 25, 10, 0.93)", lineHeight: 1.12 }}>
                      {entry.title}
                    </h3>
                    <p className="mt-3 text-[1.03rem]" style={{ fontFamily: handFont, color: "rgba(68, 49, 22, 0.88)", lineHeight: 1.7 }}>
                      {entry.note}
                    </p>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl p-4" style={{ background: "rgba(250, 236, 174, 0.42)", border: "1px solid rgba(156, 121, 17, 0.24)" }}>
                        <p className="text-[11px] tracking-[0.12em] uppercase" style={{ fontFamily: labelFont, color: "rgba(90, 62, 3, 0.84)" }}>
                          Side Note
                        </p>
                        <p className="mt-2 text-sm" style={{ fontFamily: handFont, color: "rgba(89, 62, 2, 0.84)", lineHeight: 1.58 }}>
                          {entry.sideNote}
                        </p>
                      </div>
                      <div className="rounded-xl p-4" style={{ background: "rgba(255, 214, 226, 0.4)", border: "1px solid rgba(176, 70, 109, 0.28)" }}>
                        <p className="text-[11px] tracking-[0.12em] uppercase" style={{ fontFamily: labelFont, color: "rgba(112, 24, 56, 0.84)" }}>
                          Adjustment
                        </p>
                        <p className="mt-2 text-sm" style={{ fontFamily: handFont, color: "rgba(109, 23, 53, 0.84)", lineHeight: 1.58 }}>
                          {entry.adjustment}
                        </p>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              )
            })}
          </div>
        </section>

        <section className="rounded-[26px] p-6 md:p-7" style={{ background: "rgba(255, 249, 235, 0.86)", border: "1px solid rgba(101, 81, 50, 0.23)" }}>
          <ScrollReveal>
            <h2 className="mb-4 text-2xl md:text-3xl" style={{ fontFamily: displayFont, color: "rgba(43, 31, 14, 0.92)" }}>
              Change Tape
            </h2>
            <p className="mb-5 text-sm md:text-base" style={{ fontFamily: handFont, color: "rgba(78, 57, 28, 0.82)" }}>
              Color legend: green = launch state, blue = canonical source, yellow = active runtime routing, pink = policy parser and guard adjustments.
            </p>
          </ScrollReveal>
          <div className="space-y-3">
            {changeTape.map((item, idx) => {
              const tone = toneToken(item.tone)
              return (
                <ScrollReveal key={`${item.kind}-${idx}`} delay={0.06 * idx}>
                  <div className="flex flex-wrap items-center gap-3 rounded-xl px-4 py-3" style={{ background: tone.bg, border: `1px solid ${tone.edge}` }}>
                    <span className="rounded-full px-2.5 py-1 text-[11px] tracking-[0.11em] uppercase" style={{ fontFamily: labelFont, color: tone.ink, border: `1px solid ${tone.edge}` }}>
                      {item.kind}
                    </span>
                    <p className="flex-1 text-sm md:text-base" style={{ fontFamily: handFont, color: tone.ink }}>
                      {item.detail}
                    </p>
                    <span className="text-xs" style={{ fontFamily: labelFont, color: tone.ink, opacity: 0.72 }}>
                      {item.date}
                    </span>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="relative z-10 px-6 pb-8 pt-10 text-center">
        <p className="text-xs tracking-[0.15em] uppercase" style={{ fontFamily: labelFont, color: "rgba(88, 67, 37, 0.65)" }}>
          VEIL Live Notebook - Canonical pointers only - Updated for operator execution
        </p>
      </footer>
    </div>
  )
}
