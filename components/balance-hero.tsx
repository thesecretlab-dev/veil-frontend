"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Sparkles, Award } from "lucide-react"

interface BalanceHeroProps {
  balance: number
  usdValue: number
  change24h: number
  rewardGain?: number
}

export function BalanceHero({ balance, usdValue, change24h, rewardGain = 0 }: BalanceHeroProps) {
  const [displayBalance, setDisplayBalance] = useState(balance)
  const [showGain, setShowGain] = useState(false)
  const [isGlowing, setIsGlowing] = useState(false)

  useEffect(() => {
    setDisplayBalance(balance)
  }, [balance])

  useEffect(() => {
    if (rewardGain > 0) {
      setShowGain(true)
      setIsGlowing(true)
      setTimeout(() => setShowGain(false), 2000)
      setTimeout(() => setIsGlowing(false), 500)
    }
  }, [rewardGain])

  // Determine rank based on balance
  const getRank = (bal: number) => {
    if (bal >= 1000000) return { name: "Whale", color: "rgba(168, 85, 247, 0.9)", icon: "🐋" }
    if (bal >= 500000) return { name: "Dolphin", color: "rgba(59, 130, 246, 0.9)", icon: "🐬" }
    if (bal >= 100000) return { name: "Shark", color: "rgba(16, 185, 129, 0.9)", icon: "🦈" }
    if (bal >= 50000) return { name: "Octopus", color: "rgba(20, 184, 166, 0.9)", icon: "🐙" }
    if (bal >= 10000) return { name: "Fish", color: "rgba(34, 197, 94, 0.9)", icon: "🐟" }
    return { name: "Shrimp", color: "rgba(251, 191, 36, 0.9)", icon: "🦐" }
  }

  const rank = getRank(displayBalance)
  const isPositive = change24h >= 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl p-8 backdrop-blur-xl"
      style={{
        background: `linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(20, 184, 166, 0.05) 100%)`,
        border: "1px solid rgba(16, 185, 129, 0.2)",
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: `rgba(16, 185, 129, ${0.3 + Math.random() * 0.4})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {isGlowing && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6" style={{ color: rank.color }} />
            </motion.div>
            <div>
              <div className="text-sm" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                Total wVEIL Balance
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: rank.color }}>
                  {rank.icon} {rank.name}
                </span>
                <Award className="w-4 h-4" style={{ color: rank.color }} />
              </div>
            </div>
          </div>

          {/* 24h Change */}
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-xl"
            style={{
              background: isPositive ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
              border: `1px solid ${isPositive ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" style={{ color: "rgba(16, 185, 129, 0.9)" }} />
            ) : (
              <TrendingDown className="w-4 h-4" style={{ color: "rgba(239, 68, 68, 0.9)" }} />
            )}
            <span
              className="text-sm font-bold"
              style={{ color: isPositive ? "rgba(16, 185, 129, 0.9)" : "rgba(239, 68, 68, 0.9)" }}
            >
              {isPositive ? "+" : ""}
              {change24h.toFixed(2)}%
            </span>
            <span className="text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              24h
            </span>
          </motion.div>
        </div>

        {/* Main Balance Display */}
        <div className="text-center mb-4 relative">
          <motion.div
            className="font-mono font-bold mb-2"
            style={{
              fontSize: "4rem",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 1) 0%, rgba(20, 184, 166, 1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 40px rgba(16, 185, 129, 0.5)",
              filter: "drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))",
            }}
            animate={{
              filter: [
                "drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))",
                "drop-shadow(0 0 30px rgba(16, 185, 129, 0.8))",
                "drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {displayBalance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
          </motion.div>

          <AnimatePresence>
            {showGain && rewardGain > 0 && (
              <motion.div
                className="absolute top-0 right-1/4 font-mono font-bold text-2xl"
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -40, scale: 1 }}
                exit={{ opacity: 0, y: -60 }}
                transition={{ duration: 2, ease: "easeOut" }}
                style={{
                  color: "rgba(16, 185, 129, 1)",
                  textShadow: "0 0 20px rgba(16, 185, 129, 0.8)",
                }}
              >
                +{rewardGain.toFixed(4)}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="text-2xl font-semibold"
            style={{ color: "rgba(255, 255, 255, 0.7)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.div>
        </div>

        {/* Progress bar to next rank */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              Progress to next rank
            </span>
            <span className="text-xs font-medium" style={{ color: rank.color }}>
              {balance >= 1000000 ? "Max Rank!" : `${Math.min(100, ((balance % 1000000) / 10000) * 100).toFixed(0)}%`}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.1)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${rank.color} 0%, rgba(16, 185, 129, 0.6) 100%)`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${balance >= 1000000 ? 100 : Math.min(100, ((balance % 1000000) / 10000) * 100)}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
