"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { VeilFooter, VeilHeader, FilmGrain } from "@/components/brand"

const WalletGate = dynamic(
  () => import("../components/WalletGate").then((mod) => mod.WalletGate),
  { ssr: false },
)
const ConnectWalletButton = dynamic(
  () => import("../components/WalletGate").then((mod) => mod.ConnectWalletButton),
  { ssr: false },
)
const ProposalForm = dynamic(
  () => import("../components/ProposalForm").then((mod) => mod.ProposalForm),
  { ssr: false },
)

export default function NewProposalPage() {
  return (
    <div className="relative min-h-screen" style={{ background: "#060606" }}>
      <FilmGrain />
      <VeilHeader />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p
            className="mb-6 text-[13px]"
            style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.39)" }}
          >
            Local draft only. Submitting here does not create an on-chain vote.
          </p>
          <div className="mb-8 flex items-center justify-between">
            <Link href="/app/gov" className="text-sm text-white/[0.34] hover:text-white/[0.56] transition-colors">
              ← Governance
            </Link>
            <ConnectWalletButton />
          </div>

          <WalletGate>
            <ProposalForm />
          </WalletGate>
        </motion.div>
      </div>
      <VeilFooter />
    </div>
  )
}
