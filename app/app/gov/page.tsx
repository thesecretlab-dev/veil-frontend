"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Vote,
  Shield,
  Clock,
  Users,
  ChevronRight,
  X,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Send,
  MessageSquare,
  TrendingUp,
  Lock,
  Eye,
  EyeOff,
  Hash,
  ArrowRight,
  Zap,
  BarChart3,
  Globe,
  Coins,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
} from "lucide-react";

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

  const cardClass = "rounded-xl border border-white/10 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300";
  const cardBg = "rgba(255,255,255,0.03)";

  return (
    <div className="min-h-screen bg-slate-900/90 text-white">
      {/* ── Stats Bar ── */}
      <div className="border-b border-white/10" style={{ background: cardBg }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <s.icon className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">{s.label}</p>
                  <p className="text-lg font-mono font-semibold text-white/90">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* ── Hero ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Vote className="w-8 h-8 text-emerald-500" />
            <h1
              className="text-5xl font-bold tracking-tight"
              style={{ textShadow: "0 0 30px rgba(255,255,255,0.4), 0 0 50px rgba(16,185,129,0.25)" }}
            >
              Governance
            </h1>
          </div>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Shape the future of VEIL. Vote on proposals, delegate your veVEIL, and participate in protocol governance with commit-reveal privacy.
          </p>

          <div className="flex items-center justify-center gap-4">
            {connected ? (
              <div className={`${cardClass} px-5 py-3 flex items-center gap-3`} style={{ background: cardBg }}>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm text-white/60">Connected</span>
                <span className="font-mono text-sm text-white/90">0x7a3B...f92E</span>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-sm text-emerald-500 font-mono">24,500 veVEIL</span>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setWalletOpen(true)}
                className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-shadow"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* ── Active Proposals ── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              Active Proposals
            </h2>
            <span className="text-sm text-white/40">
              {PROPOSALS.filter((p) => p.status === "active").length} active
            </span>
          </div>

          <div className="space-y-4">
            {PROPOSALS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`${cardClass} p-6 shadow-[0_0_20px_rgba(16,185,129,0.05)]`}
                style={{ background: cardBg }}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-emerald-500 font-semibold">{p.id}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          p.status === "active"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-white/5 text-white/40 border border-white/10"
                        }`}
                      >
                        {p.status === "active" ? "Voting Active" : "Pending"}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-white/40">
                        <Clock className="w-3 h-3" />
                        {p.timeLeft}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white/90">{p.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{p.description}</p>

                    {p.status === "active" && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-emerald-400 flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            For {p.forPct}% ({p.forVotes} veVEIL)
                          </span>
                          <span className="text-red-400 flex items-center gap-1">
                            Against {p.againstPct}% ({p.againstVotes} veVEIL)
                            <ThumbsDown className="w-3 h-3" />
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${p.forPct}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/40">
                          <span>Quorum: {p.quorum}%</span>
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                              <div className="h-full rounded-full bg-emerald-500/60" style={{ width: `${p.quorum}%` }} />
                            </div>
                            {p.quorum >= 66 ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-white/30 pt-1">
                      <span>by {p.author}</span>
                      <span>{p.created}</span>
                    </div>
                  </div>

                  {p.status === "active" && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleVote(p)}
                      className="px-5 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors flex items-center gap-2 shrink-0"
                    >
                      <Vote className="w-4 h-4" />
                      Cast Vote
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Two-column: Forum + Delegation ── */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Forum */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              Forum
            </h2>
            <div className="space-y-2">
              {FORUM_THREADS.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className={`${cardClass} p-4 cursor-pointer group`}
                  style={{ background: cardBg }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wider ${
                            t.tag === "Discussion"
                              ? "bg-blue-500/15 text-blue-400"
                              : t.tag === "Research"
                              ? "bg-purple-500/15 text-purple-400"
                              : t.tag === "Proposal"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-orange-500/15 text-orange-400"
                          }`}
                        >
                          {t.tag}
                        </span>
                        <span className="text-xs text-white/30">{t.lastActive}</span>
                      </div>
                      <p className="text-sm text-white/80 truncate group-hover:text-white transition-colors">{t.title}</p>
                      <p className="text-xs text-white/30 mt-0.5">{t.author}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1 text-xs text-white/40">
                        <MessageSquare className="w-3 h-3" />
                        {t.replies}
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Delegation */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              Delegate
            </h2>
            <div className={`${cardClass} p-5 space-y-4`} style={{ background: cardBg }}>
              <p className="text-sm text-white/50">Delegate your veVEIL voting power to a trusted address.</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-white/40 uppercase tracking-wider">Delegate Address</label>
                  <input
                    type="text"
                    value={delegateAddr}
                    onChange={(e) => setDelegateAddr(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-mono text-white/90 placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Your veVEIL</span>
                    <span className="font-mono text-white/70">24,500</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Currently delegated</span>
                    <span className="font-mono text-white/70">0</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!delegateAddr || !connected}
                  className="w-full py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Delegate Votes
                </motion.button>
              </div>
              {!connected && (
                <p className="text-xs text-white/30 text-center">Connect wallet to delegate</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────── Wallet Connect Modal ─────────── */}
      <AnimatePresence>
        {walletOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setWalletOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl border border-white/10 p-6 space-y-6 shadow-[0_0_60px_rgba(16,185,129,0.08)]"
              style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,0.95))" }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-500" />
                  Connect Wallet
                </h3>
                <button onClick={() => setWalletOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                  <X className="w-4 h-4 text-white/40" />
                </button>
              </div>

              <p className="text-sm text-white/40">Select a wallet to connect to VEIL Governance.</p>

              <div className="grid grid-cols-2 gap-3">
                {WALLETS.map((w, i) => (
                  <motion.button
                    key={w.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={w.status === "ready" ? { scale: 1.03, borderColor: `${w.color}40` } : {}}
                    whileTap={w.status === "ready" ? { scale: 0.97 } : {}}
                    onClick={() => handleConnect(w.id)}
                    disabled={w.status !== "ready"}
                    className={`relative p-4 rounded-xl border border-white/10 flex flex-col items-center gap-3 transition-all duration-200 ${
                      w.status === "ready" ? "hover:bg-white/[0.04] cursor-pointer" : "opacity-40 cursor-not-allowed"
                    }`}
                    style={{ background: cardBg }}
                  >
                    <div className="p-2 rounded-xl" style={{ background: `${w.color}10` }}>
                      {w.icon}
                    </div>
                    <span className="text-sm font-medium text-white/80">{w.name}</span>
                    <span
                      className={`absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                        w.status === "ready"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-white/5 text-white/30"
                      }`}
                    >
                      {w.status === "ready" ? "Ready" : "Soon"}
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-white/25 pt-2">
                <Lock className="w-3 h-3" />
                <span>Connections are end-to-end encrypted</span>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setVoteModal(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl border border-white/10 p-6 space-y-5 shadow-[0_0_60px_rgba(16,185,129,0.08)]"
              style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,0.95))" }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Vote className="w-5 h-5 text-emerald-500" />
                  Cast Vote — {voteModal.id}
                </h3>
                <button onClick={() => setVoteModal(null)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                  <X className="w-4 h-4 text-white/40" />
                </button>
              </div>

              <p className="text-sm text-white/60">{voteModal.title}</p>

              {/* Phase indicator */}
              <div className="flex items-center gap-2 text-xs">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${votePhase === "choose" ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-white/30"}`}>
                  <Hash className="w-3 h-3" /> Choose
                </div>
                <ArrowRight className="w-3 h-3 text-white/20" />
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${votePhase === "commit" ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-white/30"}`}>
                  <EyeOff className="w-3 h-3" /> Commit
                </div>
                <ArrowRight className="w-3 h-3 text-white/20" />
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${votePhase === "committed" ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-white/30"}`}>
                  <Eye className="w-3 h-3" /> Reveal
                </div>
              </div>

              {votePhase === "choose" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setVoteChoice("for")}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        voteChoice === "for"
                          ? "border-emerald-500/50 bg-emerald-500/10"
                          : "border-white/10 hover:border-emerald-500/20"
                      }`}
                      style={{ background: voteChoice === "for" ? undefined : cardBg }}
                    >
                      <ThumbsUp className={`w-5 h-5 mx-auto mb-2 ${voteChoice === "for" ? "text-emerald-400" : "text-white/40"}`} />
                      <span className={`text-sm font-medium ${voteChoice === "for" ? "text-emerald-400" : "text-white/60"}`}>Vote For</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setVoteChoice("against")}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        voteChoice === "against"
                          ? "border-red-500/50 bg-red-500/10"
                          : "border-white/10 hover:border-red-500/20"
                      }`}
                      style={{ background: voteChoice === "against" ? undefined : cardBg }}
                    >
                      <ThumbsDown className={`w-5 h-5 mx-auto mb-2 ${voteChoice === "against" ? "text-red-400" : "text-white/40"}`} />
                      <span className={`text-sm font-medium ${voteChoice === "against" ? "text-red-400" : "text-white/60"}`}>Vote Against</span>
                    </motion.button>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-start gap-2">
                    <Lock className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-white/40 leading-relaxed">
                      Your vote is private until the reveal phase. A cryptographic hash commitment will be submitted first, then revealed after the voting period ends.
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!voteChoice || !connected}
                    onClick={handleCommit}
                    className="w-full py-3 rounded-xl bg-emerald-500 text-white font-medium shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Submit Commitment
                  </motion.button>
                  {!connected && <p className="text-xs text-white/30 text-center">Connect wallet to vote</p>}
                </div>
              )}

              {votePhase === "commit" && (
                <div className="space-y-4 text-center py-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                    <Zap className="w-8 h-8 text-emerald-500 mx-auto" />
                  </motion.div>
                  <p className="text-sm text-white/60">Submitting hash commitment...</p>
                  <p className="text-xs font-mono text-white/30 break-all px-4">{commitHash}</p>
                </div>
              )}

              {votePhase === "committed" && (
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm text-white/80 font-medium">Commitment Submitted</p>
                    <p className="text-xs text-white/40 mt-1">Your vote will be revealed after the voting period ends.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40">Commitment Hash</span>
                      <button onClick={copyHash} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300">
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="text-[10px] font-mono text-white/30 break-all">{commitHash}</p>
                  </div>
                  <button
                    onClick={() => setVoteModal(null)}
                    className="w-full py-2.5 rounded-xl border border-white/10 text-sm text-white/60 hover:bg-white/5 transition-colors"
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
