"use client";

import { VeilFooter } from '@/components/brand'

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Vote,
  Shield,
  Clock,
  Users,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Send,
  MessageSquare,
  Lock,
  Eye,
  EyeOff,
  Hash,
  ArrowRight,
  Zap,
  BarChart3,
  Coins,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
} from "lucide-react";

/* ───────────────────────── ScrollReveal ───────────────────────── */

function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ───────────────────────── constants ───────────────────────── */

const WALLETS = [
  {
    id: "veil",
    name: "VEIL Wallet",
    status: "ready" as const,
    color: "#10b981",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M16 2L4 28h8l4-10 4 10h8L16 2z" fill="#10b981" />
      </svg>
    ),
  },
  {
    id: "metamask",
    name: "MetaMask",
    status: "ready" as const,
    color: "#f6851b",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M27.2 3L17.4 10.4l1.8-4.2L27.2 3z" fill="#E2761B" stroke="#E2761B" strokeWidth="0.25" />
        <path d="M4.8 3l9.7 7.5-1.7-4.3L4.8 3zM23.6 22.2l-2.6 4 5.6 1.5 1.6-5.4-4.6-.1zM3.8 22.3l1.6 5.4 5.6-1.5-2.6-4-4.6.1z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.25" />
        <path d="M10.7 14.1l-1.5 2.3 5.5.2-.2-5.9-3.8 3.4zM21.3 14.1l-3.9-3.5-.1 6 5.5-.3-1.5-2.2z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.25" />
        <path d="M11 26.2l3.3-1.6-2.9-2.2-.4 3.8zM17.7 24.6l3.3 1.6-.4-3.8-2.9 2.2z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.25" />
        <path d="M21 26.2l-3.3-1.6.3 2.1v.9l3-1.4zM11 26.2l3 1.4v-.9l.2-2.1-3.2 1.6z" fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.25" />
        <path d="M14.1 20.5l-2.7-.8 1.9-.9.8 1.7zM17.9 20.5l.8-1.7 2 .9-2.8.8z" fill="#233447" stroke="#233447" strokeWidth="0.25" />
        <path d="M11 26.2l.4-4-3 .1 2.6 3.9zM20.6 22.2l.4 4 2.6-3.9-3-.1zM22.8 16.4l-5.5.3.5 2.8.8-1.7 2 .9 2.2-2.3zM11.4 18.7l2-.9.8 1.7.5-2.8-5.5-.3 2.2 2.3z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.25" />
        <path d="M9.2 16.4l2.3 4.5-.1-2.2-2.2-2.3zM20.6 18.7l-.1 2.2 2.3-4.5-2.2 2.3zM14.7 16.7l-.5 2.8.6 3.2.2-4.2-.3-1.8zM17.3 16.7l-.3 1.8.1 4.2.7-3.2-.5-2.8z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.25" />
      </svg>
    ),
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    status: "ready" as const,
    color: "#0052ff",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <rect width="32" height="32" rx="8" fill="#0052FF" />
        <path d="M16 6a10 10 0 100 20 10 10 0 000-20zm-2.5 12.5a3.54 3.54 0 010-5h5a3.54 3.54 0 010 5h-5z" fill="white" />
      </svg>
    ),
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    status: "soon" as const,
    color: "#3b99fc",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <rect width="32" height="32" rx="8" fill="#3B99FC" />
        <path
          d="M9.6 12.4c3.5-3.5 9.3-3.5 12.8 0l.4.4a.44.44 0 010 .6l-1.4 1.4a.22.22 0 01-.3 0l-.6-.6a6.7 6.7 0 00-9.4 0l-.6.6a.22.22 0 01-.3 0l-1.4-1.4a.44.44 0 010-.6l.8-.4zm15.8 3l1.3 1.2a.44.44 0 010 .6l-5.7 5.7a.44.44 0 01-.6 0l-4-4.1a.11.11 0 00-.2 0l-4 4a.44.44 0 01-.7 0L5.8 17.2a.44.44 0 010-.6l1.3-1.3a.44.44 0 01.6 0l4 4.1a.11.11 0 00.2 0l4-4a.44.44 0 01.7 0l4 4a.11.11 0 00.2 0l4-4a.44.44 0 01.6 0z"
          fill="white"
        />
      </svg>
    ),
  },
];

const PROPOSALS = [
  {
    id: "VIP-7",
    title: "Increase MSRB Cap to $5M",
    description: "Raise the maximum single-round betting cap from $2M to $5M to accommodate growing market demand and institutional participation.",
    status: "active" as const,
    forPct: 72,
    againstPct: 28,
    forVotes: "1,440,000",
    againstVotes: "560,000",
    quorum: 68,
    timeLeft: "2d 14h",
    author: "0x7a3B...f92E",
    created: "Feb 18, 2026",
  },
  {
    id: "VIP-8",
    title: "Add wBTC/USDC Market",
    description: "Deploy a new prediction market pair for wrapped Bitcoin against USDC with privacy-preserving order flow.",
    status: "active" as const,
    forPct: 89,
    againstPct: 11,
    forVotes: "2,136,000",
    againstVotes: "264,000",
    quorum: 85,
    timeLeft: "1d 6h",
    author: "0x2cF1...83aD",
    created: "Feb 17, 2026",
  },
  {
    id: "VIP-9",
    title: "Reduce Oracle Latency Target",
    description: "Lower the target oracle update latency from 500ms to 200ms across all supported price feeds.",
    status: "pending" as const,
    forPct: 0,
    againstPct: 0,
    forVotes: "0",
    againstVotes: "0",
    quorum: 0,
    timeLeft: "starts in 2d",
    author: "0x91eC...4b7F",
    created: "Feb 20, 2026",
  },
];

const FORUM_THREADS = [
  { id: 1, title: "Privacy implications of VIP-7 cap increase", author: "0xaB3c...91fE", replies: 23, lastActive: "2h ago", tag: "Discussion" },
  { id: 2, title: "Oracle latency benchmarks — current vs proposed", author: "0x5dF2...c8A1", replies: 14, lastActive: "5h ago", tag: "Research" },
  { id: 3, title: "Treasury diversification strategy Q1 2026", author: "0x7a3B...f92E", replies: 41, lastActive: "1d ago", tag: "Proposal" },
  { id: 4, title: "veVEIL staking rewards — analysis and projections", author: "0x2cF1...83aD", replies: 8, lastActive: "3h ago", tag: "Analysis" },
];

const STATS = [
  { label: "Total veVEIL", value: "12.4M", icon: Coins },
  { label: "Active Proposals", value: "3", icon: FileText },
  { label: "Participation Rate", value: "67.3%", icon: BarChart3 },
  { label: "Treasury Balance", value: "$8.2M", icon: Shield },
];

const NAV_LINKS = ["Protocol", "Markets", "Governance", "Docs"];

/* ───────────────────────── status pill helper ───────────────────────── */

function statusPill(status: string) {
  const map: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    rejected: "bg-red-500/10 text-red-400 border-red-500/25",
    closed: "bg-white/5 text-white/30 border-white/10",
  };
  return map[status] || map.closed;
}

function statusLabel(status: string) {
  const map: Record<string, string> = { active: "Voting Active", pending: "Pending", rejected: "Rejected", closed: "Closed" };
  return map[status] || status;
}

/* ───────────────────────── component ───────────────────────── */

export default function GovernancePage() {
  const [walletOpen, setWalletOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [voteModal, setVoteModal] = useState<(typeof PROPOSALS)[number] | null>(null);
  const [voteChoice, setVoteChoice] = useState<"for" | "against" | null>(null);
  const [votePhase, setVotePhase] = useState<"choose" | "commit" | "committed">("choose");
  const [delegateAddr, setDelegateAddr] = useState("");
  const [copied, setCopied] = useState(false);

  const commitHash = useMemo(() => {
    if (!voteModal || !voteChoice) return "";
    return "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  }, [voteModal, voteChoice]);

  function handleConnect(walletId: string) {
    if (WALLETS.find((w) => w.id === walletId)?.status !== "ready") return;
    setConnected(true);
    setConnectedWallet(walletId);
    setWalletOpen(false);
  }

  function handleVote(proposal: (typeof PROPOSALS)[number]) {
    setVoteModal(proposal);
    setVoteChoice(null);
    setVotePhase("choose");
  }

  function handleCommit() {
    setVotePhase("commit");
    setTimeout(() => setVotePhase("committed"), 2000);
  }

  function copyHash() {
    navigator.clipboard.writeText(commitHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  /* shared card style */
  const card = "rounded-[20px] border transition-all duration-700 ease-in-out";
  const cardBorder = "border-[rgba(255,255,255,0.04)]";
  const cardHover = "hover:border-emerald-500/20 hover:shadow-[0_0_40px_rgba(16,185,129,0.06)]";
  const cardBg = "rgba(255,255,255,0.015)";

  return (
    <div className="relative min-h-screen text-white" style={{ background: "#060606", fontFamily: "var(--font-figtree), sans-serif" }}>

      {/* ─── Film Grain Overlay ─── */}
      <div
        className="fixed inset-0 z-[9999] pointer-events-none"
        style={{
          opacity: 0.035,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* ─── Fixed Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl" style={{ background: "rgba(6,6,6,0.8)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-[1400px] mx-auto px-8 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
              <path d="M16 2L4 28h8l4-10 4 10h8L16 2z" fill="rgba(16,185,129,0.9)" />
            </svg>
            <span className="text-[15px] font-semibold tracking-[0.12em]" style={{ fontFamily: "var(--font-instrument-serif), serif", color: "rgba(255,255,255,0.92)" }}>
              VEIL
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-[13px] tracking-[0.06em] transition-colors duration-500"
                style={{
                  fontFamily: "var(--font-space-grotesk), monospace",
                  color: link === "Governance" ? "rgba(16,185,129,0.8)" : "rgba(255,255,255,0.35)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.92)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = link === "Governance" ? "rgba(16,185,129,0.8)" : "rgba(255,255,255,0.35)")}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Launch App */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2 rounded-full text-[12px] font-medium tracking-[0.08em] transition-all duration-700"
            style={{
              fontFamily: "var(--font-space-grotesk), monospace",
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              color: "rgba(16,185,129,0.8)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(16,185,129,0.15)";
              e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(16,185,129,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(16,185,129,0.08)";
              e.currentTarget.style.borderColor = "rgba(16,185,129,0.2)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Launch App
          </motion.button>
        </div>
      </nav>

      {/* ─── Content ─── */}
      <div className="relative z-10 pt-[72px]">

        {/* ── Stats Bar ── */}
        <div style={{ background: "rgba(255,255,255,0.01)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="max-w-[1400px] mx-auto px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-center gap-4">
                  <div className="p-2.5 rounded-[14px]" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.08)" }}>
                    <s.icon className="w-4 h-4" style={{ color: "rgba(16,185,129,0.6)" }} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.4em]" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(16,185,129,0.4)" }}>
                      {s.label}
                    </p>
                    <p className="text-[20px] font-semibold mt-0.5" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(255,255,255,0.92)" }}>
                      {s.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-8 py-20 space-y-28">

          {/* ── Hero ── */}
          <ScrollReveal>
            <div className="text-center space-y-8 max-w-3xl mx-auto">
              <p className="text-[9px] uppercase tracking-[0.4em]" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(16,185,129,0.4)" }}>
                01 — GOVERNANCE
              </p>
              <h1
                className="text-6xl md:text-7xl font-medium leading-[1.05] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-instrument-serif), serif", color: "rgba(255,255,255,0.92)" }}
              >
                Shape the Future<br />of VEIL
              </h1>
              <p className="text-[17px] leading-relaxed max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.35)" }}>
                Governance interface preview for staged rollout. Launch authority is GO FOR PRODUCTION, while voting
                and delegation remain feature-gated by operator policy.
              </p>

              <div className="flex items-center justify-center gap-4 pt-4">
                {connected ? (
                  <div
                    className={`${card} ${cardBorder} px-6 py-3.5 flex items-center gap-4`}
                    style={{ background: cardBg }}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[12px] tracking-[0.06em]" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(255,255,255,0.35)" }}>Connected</span>
                    <span className="text-[13px]" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(255,255,255,0.92)" }}>0x7a3B...f92E</span>
                    <div className="h-4 w-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <span className="text-[13px]" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(16,185,129,0.7)" }}>24,500 veVEIL</span>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setWalletOpen(true)}
                    className="px-8 py-3.5 rounded-full font-medium flex items-center gap-3 transition-all duration-700"
                    style={{
                      fontFamily: "var(--font-space-grotesk), monospace",
                      fontSize: "13px",
                      letterSpacing: "0.06em",
                      background: "rgba(16,185,129,0.12)",
                      border: "1px solid rgba(16,185,129,0.25)",
                      color: "rgba(16,185,129,0.9)",
                      boxShadow: "0 0 40px rgba(16,185,129,0.08)",
                    }}
                  >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </motion.button>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* ── Active Proposals ── */}
          <section className="space-y-10">
            <ScrollReveal>
              <div className="flex items-end justify-between">
                <div className="space-y-3">
                  <p className="text-[9px] uppercase tracking-[0.4em]" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(16,185,129,0.4)" }}>
                    02 — PROPOSALS
                  </p>
                  <h2 className="text-4xl font-medium tracking-[-0.01em]" style={{ fontFamily: "var(--font-instrument-serif), serif", color: "rgba(255,255,255,0.92)" }}>
                    Active Proposals
                  </h2>
                </div>
                <span className="text-[12px]" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(255,255,255,0.2)" }}>
                  {PROPOSALS.filter((p) => p.status === "active").length} active
                </span>
              </div>
            </ScrollReveal>

            <div className="space-y-5">
              {PROPOSALS.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 0.1}>
                  <div
                    className={`${card} ${cardBorder} ${cardHover} p-8 group`}
                    style={{ background: cardBg }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(16,185,129,0.7)" }}>
                            {p.id}
                          </span>
                          <span className={`text-[10px] px-3 py-1 rounded-full font-medium uppercase tracking-[0.15em] border ${statusPill(p.status)}`}
                            style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>
                            {statusLabel(p.status)}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px]" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(255,255,255,0.2)" }}>
                            <Clock className="w-3 h-3" />
                            {p.timeLeft}
                          </div>
                        </div>
                        <h3 className="text-[22px] font-medium tracking-[-0.01em]" style={{ fontFamily: "var(--font-instrument-serif), serif", color: "rgba(255,255,255,0.92)" }}>
                          {p.title}
                        </h3>
                        <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {p.description}
                        </p>

                        {p.status === "active" && (
                          <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between text-[11px]" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>
                              <span className="flex items-center gap-1.5" style={{ color: "rgba(16,185,129,0.7)" }}>
                                <ThumbsUp className="w-3 h-3" />
                                For {p.forPct}% — {p.forVotes} veVEIL
                              </span>
                              <span className="flex items-center gap-1.5" style={{ color: "rgba(239,68,68,0.6)" }}>
                                Against {p.againstPct}% — {p.againstVotes} veVEIL
                                <ThumbsDown className="w-3 h-3" />
                              </span>
                            </div>
                            <div className="h-[6px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.6), rgba(16,185,129,0.3))", width: `${p.forPct}%` }}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${p.forPct}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px]" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(255,255,255,0.2)" }}>
                              <span>Quorum: {p.quorum}%</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                                  <div className="h-full rounded-full" style={{ background: "rgba(16,185,129,0.4)", width: `${p.quorum}%` }} />
                                </div>
                                {p.quorum >= 66 ? (
                                  <CheckCircle2 className="w-3 h-3" style={{ color: "rgba(16,185,129,0.6)" }} />
                                ) : (
                                  <AlertCircle className="w-3 h-3" style={{ color: "rgba(245,158,11,0.6)" }} />
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-5 text-[11px] pt-1" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(255,255,255,0.15)" }}>
                          <span>by {p.author}</span>
                          <span>{p.created}</span>
                        </div>
                      </div>

                      {p.status === "active" && (
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleVote(p)}
                          className="px-7 py-3 rounded-full text-[12px] font-medium flex items-center gap-2.5 shrink-0 transition-all duration-700"
                          style={{
                            fontFamily: "var(--font-space-grotesk), monospace",
                            letterSpacing: "0.06em",
                            background: "rgba(16,185,129,0.06)",
                            border: "1px solid rgba(16,185,129,0.15)",
                            color: "rgba(16,185,129,0.8)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(16,185,129,0.12)";
                            e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)";
                            e.currentTarget.style.boxShadow = "0 0 30px rgba(16,185,129,0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(16,185,129,0.06)";
                            e.currentTarget.style.borderColor = "rgba(16,185,129,0.15)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <Vote className="w-3.5 h-3.5" />
                          Cast Vote
                        </motion.button>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* ── Two-column: Forum + Delegation ── */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Forum */}
            <div className="lg:col-span-2 space-y-8">
              <ScrollReveal>
                <div className="space-y-3">
                  <p className="text-[9px] uppercase tracking-[0.4em]" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(16,185,129,0.4)" }}>
                    03 — DISCOURSE
                  </p>
                  <h2 className="text-4xl font-medium tracking-[-0.01em]" style={{ fontFamily: "var(--font-instrument-serif), serif", color: "rgba(255,255,255,0.92)" }}>
                    Forum
                  </h2>
                </div>
              </ScrollReveal>
              <div className="space-y-3">
                {FORUM_THREADS.map((t, i) => (
                  <ScrollReveal key={t.id} delay={i * 0.06}>
                    <div
                      className={`${card} ${cardBorder} ${cardHover} p-5 cursor-pointer group`}
                      style={{ background: cardBg }}
                    >
                      <div className="flex items-center justify-between gap-5">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-medium uppercase tracking-[0.2em] ${
                                t.tag === "Discussion"
                                  ? "bg-blue-500/8 text-blue-400/70 border border-blue-500/15"
                                  : t.tag === "Research"
                                  ? "bg-purple-500/8 text-purple-400/70 border border-purple-500/15"
                                  : t.tag === "Proposal"
                                  ? "bg-emerald-500/8 text-emerald-400/70 border border-emerald-500/15"
                                  : "bg-orange-500/8 text-orange-400/70 border border-orange-500/15"
                              }`}
                              style={{ fontFamily: "var(--font-space-grotesk), monospace" }}
                            >
                              {t.tag}
                            </span>
                            <span className="text-[10px]" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(255,255,255,0.15)" }}>
                              {t.lastActive}
                            </span>
                          </div>
                          <p className="text-[14px] truncate transition-colors duration-500 group-hover:text-white/90" style={{ color: "rgba(255,255,255,0.55)" }}>
                            {t.title}
                          </p>
                          <p className="text-[11px] mt-1" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(255,255,255,0.15)" }}>
                            {t.author}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="flex items-center gap-1.5 text-[11px]" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(255,255,255,0.2)" }}>
                            <MessageSquare className="w-3 h-3" />
                            {t.replies}
                          </div>
                          <ChevronRight className="w-4 h-4 transition-colors duration-500" style={{ color: "rgba(255,255,255,0.1)" }} />
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Delegation */}
            <div className="space-y-8">
              <ScrollReveal delay={0.15}>
                <div className="space-y-3">
                  <p className="text-[9px] uppercase tracking-[0.4em]" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(16,185,129,0.4)" }}>
                    04 — DELEGATE
                  </p>
                  <h2 className="text-4xl font-medium tracking-[-0.01em]" style={{ fontFamily: "var(--font-instrument-serif), serif", color: "rgba(255,255,255,0.92)" }}>
                    Delegate
                  </h2>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div className={`${card} ${cardBorder} ${cardHover} p-7 space-y-5`} style={{ background: cardBg }}>
                  <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Delegate your veVEIL voting power to a trusted address.
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.4em]" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(16,185,129,0.4)" }}>
                        Delegate Address
                      </label>
                      <input
                        type="text"
                        value={delegateAddr}
                        onChange={(e) => setDelegateAddr(e.target.value)}
                        placeholder="0x..."
                        className="w-full px-4 py-3 rounded-[14px] text-[13px] focus:outline-none transition-all duration-500"
                        style={{
                          fontFamily: "var(--font-space-grotesk), monospace",
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          color: "rgba(255,255,255,0.92)",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
                      />
                    </div>
                    <div className="p-4 rounded-[14px] space-y-2" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
                      <div className="flex justify-between text-[11px]" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>
                        <span style={{ color: "rgba(255,255,255,0.2)" }}>Your veVEIL</span>
                        <span style={{ color: "rgba(255,255,255,0.55)" }}>24,500</span>
                      </div>
                      <div className="flex justify-between text-[11px]" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>
                        <span style={{ color: "rgba(255,255,255,0.2)" }}>Currently delegated</span>
                        <span style={{ color: "rgba(255,255,255,0.55)" }}>0</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!delegateAddr || !connected}
                      className="w-full py-3 rounded-full text-[12px] font-medium flex items-center justify-center gap-2.5 transition-all duration-700 disabled:opacity-20 disabled:cursor-not-allowed"
                      style={{
                        fontFamily: "var(--font-space-grotesk), monospace",
                        letterSpacing: "0.06em",
                        background: "rgba(16,185,129,0.08)",
                        border: "1px solid rgba(16,185,129,0.2)",
                        color: "rgba(16,185,129,0.8)",
                      }}
                    >
                      <Send className="w-3.5 h-3.5" />
                      Delegate Votes
                    </motion.button>
                  </div>
                  {!connected && (
                    <p className="text-[11px] text-center" style={{ color: "rgba(255,255,255,0.15)" }}>Connect wallet to delegate</p>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* ─── Footer ─── */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="max-w-[1400px] mx-auto px-8 py-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                  <path d="M16 2L4 28h8l4-10 4 10h8L16 2z" fill="rgba(16,185,129,0.5)" />
                </svg>
                <span className="text-[13px] tracking-[0.1em]" style={{ fontFamily: "var(--font-instrument-serif), serif", color: "rgba(255,255,255,0.3)" }}>
                  VEIL
                </span>
              </div>
              <div className="flex items-center gap-10">
                {["Docs", "GitHub", "Discord", "Twitter"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-[11px] uppercase tracking-[0.25em] transition-colors duration-500"
                    style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(255,255,255,0.2)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(16,185,129,0.6)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
                  >
                    {link}
                  </a>
                ))}
              </div>
              <p className="text-[10px]" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(255,255,255,0.1)" }}>
                © 2026 VEIL Protocol
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* ─────────── Wallet Connect Modal ─────────── */}
      <AnimatePresence>
        {walletOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={() => setWalletOpen(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-[24px] p-8 space-y-7"
              style={{
                background: "linear-gradient(160deg, rgba(12,12,12,0.98), rgba(6,6,6,0.99))",
                border: "1px solid rgba(255,255,255,0.04)",
                boxShadow: "0 0 80px rgba(16,185,129,0.05), 0 40px 80px rgba(0,0,0,0.6)",
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[22px] font-medium flex items-center gap-3" style={{ fontFamily: "var(--font-instrument-serif), serif", color: "rgba(255,255,255,0.92)" }}>
                  <Wallet className="w-5 h-5" style={{ color: "rgba(16,185,129,0.6)" }} />
                  Connect Wallet
                </h3>
                <button
                  onClick={() => setWalletOpen(false)}
                  className="p-2 rounded-full transition-colors duration-300"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                >
                  <X className="w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                </button>
              </div>

              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>Select a wallet to connect to VEIL Governance.</p>

              <div className="grid grid-cols-2 gap-4">
                {WALLETS.map((w, i) => (
                  <motion.button
                    key={w.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={w.status === "ready" ? { scale: 1.03 } : {}}
                    whileTap={w.status === "ready" ? { scale: 0.97 } : {}}
                    onClick={() => handleConnect(w.id)}
                    disabled={w.status !== "ready"}
                    className={`relative p-5 rounded-[16px] flex flex-col items-center gap-3.5 transition-all duration-700 ${
                      w.status === "ready" ? "cursor-pointer" : "opacity-30 cursor-not-allowed"
                    }`}
                    style={{
                      background: "rgba(255,255,255,0.015)",
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}
                    onMouseEnter={(e) => {
                      if (w.status === "ready") {
                        e.currentTarget.style.borderColor = `${w.color}30`;
                        e.currentTarget.style.boxShadow = `0 0 30px ${w.color}08`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div className="p-2.5 rounded-[14px]" style={{ background: `${w.color}0a` }}>
                      {w.icon}
                    </div>
                    <span className="text-[12px] font-medium" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(255,255,255,0.6)" }}>
                      {w.name}
                    </span>
                    <span
                      className="absolute top-3 right-3 text-[8px] px-2 py-0.5 rounded-full font-medium uppercase tracking-[0.2em]"
                      style={{
                        fontFamily: "var(--font-space-grotesk), monospace",
                        ...(w.status === "ready"
                          ? { background: "rgba(16,185,129,0.08)", color: "rgba(16,185,129,0.5)", border: "1px solid rgba(16,185,129,0.1)" }
                          : { background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.04)" }),
                      }}
                    >
                      {w.status === "ready" ? "Ready" : "Soon"}
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="flex items-center gap-2.5 text-[10px] pt-2" style={{ color: "rgba(255,255,255,0.12)" }}>
                <Lock className="w-3 h-3" />
                <span style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>Connections are end-to-end encrypted</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────── Vote Modal (Commit-Reveal) ─────────── */}
      <AnimatePresence>
        {voteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={() => setVoteModal(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-[24px] p-8 space-y-6"
              style={{
                background: "linear-gradient(160deg, rgba(12,12,12,0.98), rgba(6,6,6,0.99))",
                border: "1px solid rgba(255,255,255,0.04)",
                boxShadow: "0 0 80px rgba(16,185,129,0.05), 0 40px 80px rgba(0,0,0,0.6)",
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-medium flex items-center gap-3" style={{ fontFamily: "var(--font-instrument-serif), serif", color: "rgba(255,255,255,0.92)" }}>
                  <Vote className="w-5 h-5" style={{ color: "rgba(16,185,129,0.6)" }} />
                  Cast Vote — {voteModal.id}
                </h3>
                <button
                  onClick={() => setVoteModal(null)}
                  className="p-2 rounded-full transition-colors duration-300"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <X className="w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                </button>
              </div>

              <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.4)" }}>{voteModal.title}</p>

              {/* Phase indicator */}
              <div className="flex items-center gap-3 text-[10px]" style={{ fontFamily: "var(--font-space-grotesk), monospace" }}>
                {[
                  { key: "choose", icon: Hash, label: "Choose" },
                  { key: "commit", icon: EyeOff, label: "Commit" },
                  { key: "committed", icon: Eye, label: "Reveal" },
                ].map((phase, idx) => (
                  <div key={phase.key} className="flex items-center gap-2">
                    {idx > 0 && <ArrowRight className="w-3 h-3" style={{ color: "rgba(255,255,255,0.08)" }} />}
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{
                        background: votePhase === phase.key ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${votePhase === phase.key ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)"}`,
                        color: votePhase === phase.key ? "rgba(16,185,129,0.7)" : "rgba(255,255,255,0.2)",
                      }}
                    >
                      <phase.icon className="w-3 h-3" /> {phase.label}
                    </div>
                  </div>
                ))}
              </div>

              {votePhase === "choose" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { choice: "for" as const, icon: ThumbsUp, label: "Vote For", activeColor: "16,185,129" },
                      { choice: "against" as const, icon: ThumbsDown, label: "Vote Against", activeColor: "239,68,68" },
                    ].map((v) => (
                      <motion.button
                        key={v.choice}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setVoteChoice(v.choice)}
                        className="p-5 rounded-[16px] text-center transition-all duration-500"
                        style={{
                          background: voteChoice === v.choice ? `rgba(${v.activeColor},0.06)` : "rgba(255,255,255,0.015)",
                          border: `1px solid ${voteChoice === v.choice ? `rgba(${v.activeColor},0.25)` : "rgba(255,255,255,0.04)"}`,
                        }}
                      >
                        <v.icon className="w-5 h-5 mx-auto mb-2.5" style={{ color: voteChoice === v.choice ? `rgba(${v.activeColor},0.7)` : "rgba(255,255,255,0.2)" }} />
                        <span className="text-[12px] font-medium" style={{
                          fontFamily: "var(--font-space-grotesk), monospace",
                          color: voteChoice === v.choice ? `rgba(${v.activeColor},0.8)` : "rgba(255,255,255,0.35)",
                        }}>
                          {v.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="p-4 rounded-[14px] flex items-start gap-3" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
                    <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "rgba(16,185,129,0.4)" }} />
                    <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.25)" }}>
                      Your vote is private until the reveal phase. A cryptographic hash commitment will be submitted first, then revealed after the voting period ends.
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!voteChoice || !connected}
                    onClick={handleCommit}
                    className="w-full py-3.5 rounded-full font-medium flex items-center justify-center gap-2.5 transition-all duration-700 disabled:opacity-20 disabled:cursor-not-allowed"
                    style={{
                      fontFamily: "var(--font-space-grotesk), monospace",
                      fontSize: "12px",
                      letterSpacing: "0.06em",
                      background: "rgba(16,185,129,0.15)",
                      border: "1px solid rgba(16,185,129,0.3)",
                      color: "rgba(16,185,129,0.9)",
                      boxShadow: "0 0 30px rgba(16,185,129,0.08)",
                    }}
                  >
                    <Lock className="w-4 h-4" />
                    Submit Commitment
                  </motion.button>
                  {!connected && <p className="text-[11px] text-center" style={{ color: "rgba(255,255,255,0.15)" }}>Connect wallet to vote</p>}
                </div>
              )}

              {votePhase === "commit" && (
                <div className="space-y-5 text-center py-6">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                    <Zap className="w-8 h-8 mx-auto" style={{ color: "rgba(16,185,129,0.6)" }} />
                  </motion.div>
                  <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>Submitting hash commitment...</p>
                  <p className="text-[10px] break-all px-6" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(255,255,255,0.15)" }}>
                    {commitHash}
                  </p>
                </div>
              )}

              {votePhase === "committed" && (
                <div className="space-y-5">
                  <div className="text-center py-4">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-3" style={{ color: "rgba(16,185,129,0.6)" }} />
                    <p className="text-[15px] font-medium" style={{ fontFamily: "var(--font-instrument-serif), serif", color: "rgba(255,255,255,0.92)" }}>
                      Commitment Submitted
                    </p>
                    <p className="text-[12px] mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>Your vote will be revealed after the voting period ends.</p>
                  </div>
                  <div className="p-4 rounded-[14px] space-y-3" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(255,255,255,0.2)" }}>
                        Commitment Hash
                      </span>
                      <button onClick={copyHash} className="flex items-center gap-1.5 text-[10px] transition-colors duration-300" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(16,185,129,0.5)" }}>
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="text-[9px] break-all" style={{ fontFamily: "var(--font-space-grotesk), monospace", color: "rgba(255,255,255,0.15)" }}>
                      {commitHash}
                    </p>
                  </div>
                  <button
                    onClick={() => setVoteModal(null)}
                    className="w-full py-3 rounded-full text-[12px] transition-all duration-500"
                    style={{
                      fontFamily: "var(--font-space-grotesk), monospace",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.35)",
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
