"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ResponsiveContainer, YAxis, AreaChart, Area, Tooltip, LineChart, Line } from "recharts"
import { CheckCircle, X, ArrowDownUp, ChevronDown, Settings, Copy, Bell } from "lucide-react"
import TriangleLogo from "@/components/triangle-logo"
import { InfoTooltip } from "@/components/info-tooltip"
import { BalanceHero } from "@/components/balance-hero"
import Link from "next/link"

type OperatorRole = "encryption" | "oracle" | "keeper" | null
type RewardsTab = "staking" | "veveil" | "lp"
type VoteChoice = "for" | "against" | "abstain" | null
type SwapPair = "wVEIL/USDC" | "wVEIL/wAVAX" | "wAVAX/USDC" | "USDC/wVEIL" | "wAVAX/wVEIL" | "USDC/wAVAX"

interface KPIs {
  polTvl: number
  weeklyBuyback: number
  msrbNotional: number
  fees7d: number
  sla: number
}

function useAnimatedCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(target)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const startValueRef = useRef(target)

  useEffect(() => {
    // Cancel any existing animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current)
    }

    // Reset start time and value for new animation
    startTimeRef.current = null
    startValueRef.current = count

    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const newCount = Math.floor(startValueRef.current + (target - startValueRef.current) * easeOutQuart)

      setCount(newCount)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        animationRef.current = null
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [target, duration])

  return count
}

export default function VEILfiPage() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [wrongNetwork, setWrongNetwork] = useState(false)
  const [stakeAmount, setStakeAmount] = useState("")
  const [lockAmount, setLockAmount] = useState("")
  const [lockMonths, setLockMonths] = useState(12)
  const [selectedRole, setSelectedRole] = useState<OperatorRole>(null)
  const [activeRewardsTab, setActiveRewardsTab] = useState<RewardsTab>("staking")
  const [voteChoice, setVoteChoice] = useState<Record<number, VoteChoice>>({})
  const [commitHash, setCommitHash] = useState<Record<number, string>>({})
  const [mounted, setMounted] = useState(false)
  const [isStaking, setIsStaking] = useState(false)
  const [isLocking, setIsLocking] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [stakedBalance, setStakedBalance] = useState(25000)
  const [lockedBalance, setLockedBalance] = useState(50000)
  const [lockEndDate, setLockEndDate] = useState<Date | null>(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000))
  const [claimableRewards, setClaimableRewards] = useState(12450)
  const [rewardsBySource, setRewardsBySource] = useState({
    staking: 8200,
    veveil: 2850,
    lp: 1400,
  })

  const [pendingRewards, setPendingRewards] = useState({
    staking: 450,
    veveil: 180,
    lp: 95,
  })

  const [nextRewardUpdate, setNextRewardUpdate] = useState(3600) // seconds until next epoch
  const [rewardHistory, setRewardHistory] = useState([
    { date: "Jan 12", source: "staking", amount: 8200, usd: 3444, tx: "0xabc...def" },
    { date: "Jan 12", source: "veveil", amount: 2850, usd: 1197, tx: "0xdef...ghi" },
    { date: "Jan 5", source: "staking", amount: 7950, usd: 3339, tx: "0xghi...jkl" },
    { date: "Jan 5", source: "lp", amount: 1400, usd: 588, tx: "0xjkl...mno" },
    { date: "Dec 29", source: "staking", amount: 7680, usd: 3226, tx: "0xmno...pqr" },
  ])

  const [historyFilter, setHistoryFilter] = useState<"all" | "staking" | "veveil" | "lp">("all")

  const [selectedPair, setSelectedPair] = useState<SwapPair>("wVEIL/USDC")
  const [swapFromAmount, setSwapFromAmount] = useState("")
  const [swapToAmount, setSwapToAmount] = useState("")
  const [showSlippage, setShowSlippage] = useState(false)
  const [slippage, setSlippage] = useState(0.5)
  const [isSwapping, setIsSwapping] = useState(false)

  const [showActivityFeed, setShowActivityFeed] = useState(false)
  const [hasNewActivity, setHasNewActivity] = useState(true)

  const recentActivity = [
    { type: "stake", amount: 5000, timestamp: "2 min ago", txHash: "0x1a2b3c..." },
    { type: "claim", amount: 125.5, source: "Staking", timestamp: "15 min ago", txHash: "0x4d5e6f..." },
    { type: "swap", from: "USDC", to: "wVEIL", amount: 1000, timestamp: "1 hour ago", txHash: "0x7g8h9i..." },
    { type: "lock", amount: 10000, duration: "12 months", timestamp: "3 hours ago", txHash: "0xj1k2l3..." },
    { type: "vote", proposal: "Increase MSRB Cap", timestamp: "1 day ago", txHash: "0xm4n5o6..." },
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const baseSwapPrices: Record<string, number> = {
    "wVEIL/USDC": 0.42,
    "wVEIL/wAVAX": 0.012,
    "wAVAX/USDC": 35.0,
  }

  const getSwapPrice = (pair: SwapPair): number => {
    if (pair in baseSwapPrices) {
      return baseSwapPrices[pair]
    }
    // For reversed pairs, return 1/price
    const [token1, token2] = pair.split("/")
    const reversedPair = `${token2}/${token1}`
    if (reversedPair in baseSwapPrices) {
      return 1 / baseSwapPrices[reversedPair]
    }
    return 1 // fallback
  }

  const basePairData: Record<
    string,
    { liquidity: number; volume24h: number; priceChange24h: number; priceHistory: { time: string; price: number }[] }
  > = {
    "wVEIL/USDC": {
      liquidity: 2450000,
      volume24h: 485000,
      priceChange24h: 2.4,
      priceHistory: [
        { time: "00:00", price: 0.41 },
        { time: "04:00", price: 0.405 },
        { time: "08:00", price: 0.415 },
        { time: "12:00", price: 0.42 },
        { time: "16:00", price: 0.425 },
        { time: "20:00", price: 0.42 },
      ],
    },
    "wVEIL/wAVAX": {
      liquidity: 1850000,
      volume24h: 325000,
      priceChange24h: -1.2,
      priceHistory: [
        { time: "00:00", price: 0.0122 },
        { time: "04:00", price: 0.0121 },
        { time: "08:00", price: 0.012 },
        { time: "12:00", price: 0.012 },
        { time: "16:00", price: 0.0119 },
        { time: "20:00", price: 0.012 },
      ],
    },
    "wAVAX/USDC": {
      liquidity: 3200000,
      volume24h: 680000,
      priceChange24h: 0.8,
      priceHistory: [
        { time: "00:00", price: 34.8 },
        { time: "04:00", price: 34.5 },
        { time: "08:00", price: 35.2 },
        { time: "12:00", price: 35.0 },
        { time: "16:00", price: 35.3 },
        { time: "20:00", price: 35.0 },
      ],
    },
  }

  const getPairData = (
    pair: SwapPair,
  ): {
    liquidity: number
    volume24h: number
    priceChange24h: number
    priceHistory: { time: string; price: number }[]
  } => {
    if (pair in basePairData) {
      return basePairData[pair]
    }
    // For reversed pairs, use the same data but invert price history
    const [token1, token2] = pair.split("/")
    const reversedPair = `${token2}/${token1}`
    if (reversedPair in basePairData) {
      const data = basePairData[reversedPair]
      return {
        ...data,
        priceChange24h: -data.priceChange24h, // Invert price change
        priceHistory: data.priceHistory.map((point) => ({
          time: point.time,
          price: 1 / point.price, // Invert prices
        })),
      }
    }
    // Fallback
    return {
      liquidity: 0,
      volume24h: 0,
      priceChange24h: 0,
      priceHistory: [],
    }
  }

  const [activeStakeLockTab, setActiveStakeLockTab] = useState<"stake" | "lock">("stake")

  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({
    wVEIL: 125000,
    USDC: 52500,
    wAVAX: 1500,
  })

  const tokenColors: Record<string, string> = {
    wVEIL: "rgba(16, 185, 129, 0.8)", // emerald
    USDC: "rgba(59, 130, 246, 0.8)", // blue
    wAVAX: "rgba(239, 68, 68, 0.8)", // red
  }

  const tokenIcons: Record<string, React.ReactElement> = {
    wVEIL: (
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: "rgba(16, 185, 129, 0.2)", border: "1px solid rgba(16, 185, 129, 0.4)" }}
      >
        <span className="text-xs font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
          V
        </span>
      </div>
    ),
    USDC: (
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: "rgba(59, 130, 246, 0.2)", border: "1px solid rgba(59, 130, 246, 0.4)" }}
      >
        <span className="text-xs font-bold" style={{ color: "rgba(59, 130, 246, 0.9)" }}>
          $
        </span>
      </div>
    ),
    wAVAX: (
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: "rgba(239, 68, 68, 0.2)", border: "1px solid rgba(239, 68, 68, 0.4)" }}
      >
        <span className="text-xs font-bold" style={{ color: "rgba(239, 68, 68, 0.9)" }}>
          A
        </span>
      </div>
    ),
  }

  const [lastRewardGain, setLastRewardGain] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setNextRewardUpdate((prev) => (prev > 0 ? prev - 1 : 3600))
    }, 1000)
    return () => clearInterval(interval)
  }, [mounted])

  useEffect(() => {
    const updateInterval = setInterval(() => {
      // Calculate APR growth per 10 seconds
      const stakingAPR = 0.125 // 12.5%
      const lockBonus = (lockMonths / 48) * 0.08 // Up to 8% bonus
      const lockAPR = 0.125 + lockBonus

      // Calculate rewards per 10 seconds
      const secondsPerYear = 365 * 24 * 60 * 60
      const stakingRewards = (stakedBalance * stakingAPR * 10) / secondsPerYear
      const lockRewards = (lockedBalance * lockAPR * 10) / secondsPerYear
      const totalRewards = stakingRewards + lockRewards

      if (totalRewards > 0) {
        setTokenBalances((prev) => ({
          ...prev,
          wVEIL: prev.wVEIL + totalRewards,
        }))
        setLastRewardGain(totalRewards)

        setClaimableRewards((prev) => prev + totalRewards)
      }
    }, 10000) // Update every 10 seconds

    return () => clearInterval(updateInterval)
  }, [stakedBalance, lockedBalance, lockMonths])

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleStake = async () => {
    if (!walletConnected) {
      showToast("Please connect your wallet first", "error")
      return
    }
    if (!stakeAmount || Number.parseFloat(stakeAmount) <= 0) {
      showToast("Please enter a valid amount", "error")
      return
    }

    const amount = Number.parseFloat(stakeAmount)
    if (amount > tokenBalances.wVEIL) {
      showToast(
        `Insufficient balance. Available: ${tokenBalances.wVEIL.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} wVEIL`,
        "error",
      )
      return
    }

    setIsStaking(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setTokenBalances((prev) => ({
      ...prev,
      wVEIL: prev.wVEIL - amount,
    }))

    setStakedBalance(stakedBalance + amount)
    showToast(`Successfully staked ${stakeAmount} VEIL`, "success")
    setStakeAmount("")
    setIsStaking(false)
  }

  const handleLock = async () => {
    if (!walletConnected) {
      showToast("Please connect your wallet first", "error")
      return
    }
    if (!lockAmount || Number.parseFloat(lockAmount) <= 0) {
      showToast("Please enter a valid amount", "error")
      return
    }

    const amount = Number.parseFloat(lockAmount)
    if (amount > tokenBalances.wVEIL) {
      showToast(
        `Insufficient balance. Available: ${tokenBalances.wVEIL.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} wVEIL`,
        "error",
      )
      return
    }

    setIsLocking(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setTokenBalances((prev) => ({
      ...prev,
      wVEIL: prev.wVEIL - amount,
    }))

    setLockedBalance(lockedBalance + amount)
    showToast(`Successfully locked ${lockAmount} VEIL for ${lockMonths} months`, "success")
    setLockAmount("")
    setIsLocking(false)
  }

  const handleClaim = async () => {
    if (!walletConnected) {
      showToast("Please connect your wallet first", "error")
      return
    }
    if (claimableRewards <= 0) {
      showToast("No rewards to claim", "error")
      return
    }

    setIsClaiming(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setTokenBalances((prev) => ({
      ...prev,
      wVEIL: prev.wVEIL + claimableRewards,
    }))

    showToast(
      `Successfully claimed ${claimableRewards.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} VEIL`,
      "success",
    )
    setClaimableRewards(0)
    setRewardsBySource({ staking: 0, veveil: 0, lp: 0 })
    setIsClaiming(false)
  }

  const handleClaimSource = async (source: "staking" | "veveil" | "lp") => {
    if (!walletConnected) {
      showToast("Please connect your wallet first", "error")
      return
    }
    if (rewardsBySource[source] <= 0) {
      showToast("No rewards to claim from this source", "error")
      return
    }

    setIsClaiming(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const amount = rewardsBySource[source]

    setTokenBalances((prev) => ({
      ...prev,
      wVEIL: prev.wVEIL + amount,
    }))

    showToast(
      `Successfully claimed ${amount.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} VEIL from ${source}`,
      "success",
    )
    setRewardsBySource({ ...rewardsBySource, [source]: 0 })
    setClaimableRewards(claimableRewards - amount)
    setIsClaiming(false)
  }

  const swapPrices: Record<SwapPair, number> = {
    "wVEIL/USDC": 0.42,
    "wVEIL/wAVAX": 0.012,
    "wAVAX/USDC": 35.0,
    "USDC/wVEIL": 1 / 0.42,
    "wAVAX/wVEIL": 1 / 0.012,
    "USDC/wAVAX": 1 / 35.0,
  }

  const calculatePriceImpact = (amount: number, pair: SwapPair): number => {
    const liquidity = getPairData(pair).liquidity // Use helper function
    const impact = (amount / liquidity) * 100
    return impact
  }

  const priceImpact = swapFromAmount
    ? calculatePriceImpact(Number.parseFloat(swapFromAmount) * getSwapPrice(selectedPair), selectedPair) // Use helper function
    : 0

  const handleSwapAmountChange = (value: string, isFrom: boolean) => {
    if (isFrom) {
      setSwapFromAmount(value)
      if (value && !isNaN(Number(value))) {
        const calculated = Number(value) * getSwapPrice(selectedPair) // Use helper function
        setSwapToAmount(calculated.toFixed(6))
      } else {
        setSwapToAmount("")
      }
    } else {
      setSwapToAmount(value)
      if (value && !isNaN(Number(value))) {
        const calculated = Number(value) / getSwapPrice(selectedPair) // Use helper function
        setSwapFromAmount(calculated.toFixed(6))
      } else {
        setSwapFromAmount("")
      }
    }
  }

  const handleSwap = async () => {
    if (!walletConnected) {
      showToast("Please connect your wallet first", "error")
      return
    }
    if (!swapFromAmount || Number.parseFloat(swapFromAmount) <= 0) {
      showToast("Please enter a valid amount", "error")
      return
    }

    const [fromToken, toToken] = getPairTokens(selectedPair)
    const fromAmount = Number.parseFloat(swapFromAmount)
    const toAmount = Number.parseFloat(swapToAmount)

    if (tokenBalances[fromToken] < fromAmount) {
      showToast(`Insufficient ${fromToken} balance`, "error")
      return
    }

    setIsSwapping(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setTokenBalances((prev) => ({
      ...prev,
      [fromToken]: prev[fromToken] - fromAmount,
      [toToken]: prev[toToken] + toAmount,
    }))

    showToast(`Successfully swapped ${swapFromAmount} ${fromToken} for ${swapToAmount} ${toToken}`, "success")
    setSwapFromAmount("")
    setSwapToAmount("")
    setIsSwapping(false)
  }

  const getPairTokens = (pair: SwapPair): [string, string] => {
    return pair.split("/") as [string, string]
  }

  const kpis = useMemo(
    () => ({
      polTvl: 8250000,
      weeklyBuyback: 125000,
      msrbNotional: 2400000,
      fees7d: 48500,
      sla: 99.2,
    }),
    [],
  )

  const animatedPolTvl = useAnimatedCounter(kpis.polTvl, 2000)
  const animatedBuyback = useAnimatedCounter(kpis.weeklyBuyback, 2000)
  const animatedMsrb = useAnimatedCounter(kpis.msrbNotional, 2000)
  const animatedFees = useAnimatedCounter(kpis.fees7d, 2000)

  const buybackLogs = [
    { date: "2025-01-13", wveil: 125000, vwap: 0.42, pair: "WVEIL/USDC.e", lpShares: 45200 },
    { date: "2025-01-06", wveil: 118000, vwap: 0.39, pair: "WVEIL/USDC.e", lpShares: 42800 },
    { date: "2024-12-30", wveil: 112000, vwap: 0.38, pair: "WVEIL/AVAX", lpShares: 38900 },
  ]

  const msrbTiers = [
    { tier: "Flagship", targetB: 500000, utilization: 68, spreadBps: 8, nextTopup: "2h 15m", activeMarkets: 12 },
    { tier: "Standard", targetB: 250000, utilization: 52, spreadBps: 12, nextTopup: "5h 30m", activeMarkets: 34 },
    { tier: "Emerging", targetB: 100000, utilization: 41, spreadBps: 18, nextTopup: "8h 45m", activeMarkets: 67 },
  ]

  const proposals = [
    {
      id: 1,
      title: "Increase MSRB depth for Flagship markets",
      scope: "MSRB Cap",
      endTs: "2025-01-20",
      votingPower: 0,
      quorum: 4000000,
      forVotes: 2800000,
      againstVotes: 450000,
      abstainVotes: 120000,
      status: "active" as const,
      commitPhase: true,
    },
    {
      id: 2,
      title: "Adjust fee band to 50-70 bps",
      scope: "Fee Band",
      endTs: "2025-01-18",
      votingPower: 0,
      quorum: 4000000,
      forVotes: 3200000,
      againstVotes: 280000,
      abstainVotes: 95000,
      status: "active" as const,
      commitPhase: false,
    },
  ]

  const polTvlData = [
    { date: "Dec 1", value: 8200000 },
    { date: "Dec 8", value: 9100000 },
    { date: "Dec 15", value: 9800000 },
    { date: "Dec 22", value: 10500000 },
    { date: "Dec 29", value: 11200000 },
    { date: "Jan 5", value: 11900000 },
    { date: "Jan 12", value: 12450000 },
  ]

  const aprHistoryData = [
    { date: "Dec 1", staking: 11.8, veveil: 18.5 },
    { date: "Dec 8", staking: 12.1, veveil: 19.2 },
    { date: "Dec 15", staking: 12.3, veveil: 19.8 },
    { date: "Dec 22", staking: 12.5, veveil: 20.3 },
    { date: "Dec 29", staking: 12.4, veveil: 20.1 },
    { date: "Jan 5", staking: 12.6, veveil: 20.5 },
    { date: "Jan 12", staking: 12.5, veveil: 20.7 },
  ]

  const vePower = Math.floor((lockMonths / 48) * 100)

  const calculateEstimatedRewards = (amount: number, months = 0) => {
    const baseAPR = 0.125
    const lockBonus = months > 0 ? (months / 48) * 0.08 : 0
    const totalAPR = baseAPR + lockBonus
    const dailyRewards = (amount * totalAPR) / 365
    return {
      daily: dailyRewards,
      weekly: dailyRewards * 7,
      monthly: dailyRewards * 30,
      yearly: amount * totalAPR,
    }
  }

  const setAmountPreset = (percentage: number, isLock: boolean) => {
    const amount = Math.floor((tokenBalances.wVEIL * percentage) / 100)
    if (isLock) {
      setLockAmount(amount.toString())
    } else {
      setStakeAmount(amount.toString())
    }
  }

  const setLockDurationPreset = (months: number) => {
    setLockMonths(months)
  }

  const calculateUnlockDate = (months: number) => {
    const date = new Date()
    date.setMonth(date.getMonth() + months)
    return date
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const estimatedStakeRewards = stakeAmount ? calculateEstimatedRewards(Number.parseFloat(stakeAmount)) : null
  const estimatedLockRewards = lockAmount ? calculateEstimatedRewards(Number.parseFloat(lockAmount), lockMonths) : null

  const roleDescriptions = {
    encryption: {
      title: "Encryption Node",
      bond: "50,000 VEIL",
      apr: "15-22%",
      description: "Secure TEE-based order encryption and decryption",
      sla: "99.9% uptime",
    },
    oracle: {
      title: "Oracle Attestor",
      bond: "25,000 VEIL",
      apr: "12-18%",
      description: "Sign outcome results after dispute window",
      sla: "100% accuracy",
    },
    keeper: {
      title: "Keeper Operator",
      bond: "15,000 VEIL",
      apr: "10-16%",
      description: "Balance one-sided windows within VaR limits",
      sla: "98% fill rate",
    },
  }

  const handleCommitVote = (proposalId: number) => {
    if (!voteChoice[proposalId]) return
    const randomHash = `0x${Math.random().toString(16).slice(2, 10)}...`
    setCommitHash({ ...commitHash, [proposalId]: randomHash })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  const handleSwapDirection = () => {
    // Swap the amounts
    const tempAmount = swapFromAmount
    setSwapFromAmount(swapToAmount)
    setSwapToAmount(tempAmount)

    // Reverse the pair
    const [token1, token2] = getPairTokens(selectedPair)
    const reversedPair = `${token2}/${token1}` as SwapPair
    setSelectedPair(reversedPair)
  }

  return (
    <div className="min-h-screen" style={{ background: "#000000" }}>
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-4 left-1/2 z-50 rounded-lg px-4 py-3 backdrop-blur-xl shadow-lg"
            style={{
              background: toast.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
              border: `1px solid ${toast.type === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
            }}
          >
            <div className="flex items-center gap-2">
              {toast.type === "success" ? (
                <CheckCircle className="w-4 h-4" style={{ color: "rgba(16, 185, 129, 0.9)" }} />
              ) : (
                <X className="w-4 h-4" style={{ color: "rgba(239, 68, 68, 0.9)" }} />
              )}
              <span className="text-sm" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                {toast.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Logo, Title, KPIs, and Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 backdrop-blur-xl border-b"
        style={{
          background: "rgba(0, 0, 0, 0.8)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left: Title */}
          <motion.h1
            className="text-2xl font-bold cursor-default tracking-wide"
            style={{
              color: "rgba(255, 255, 255, 0.25)",
              textShadow: `
                0 0 10px rgba(16, 185, 129, 0.3),
                0 0 20px rgba(16, 185, 129, 0.2),
                0 0 30px rgba(16, 185, 129, 0.1)
              `,
              WebkitTextStroke: "1px rgba(255, 255, 255, 0.1)",
              filter: "blur(0.5px)",
            }}
            whileHover={{
              color: "rgba(255, 255, 255, 0.5)",
              textShadow: `
                0 0 20px rgba(16, 185, 129, 0.8),
                0 0 40px rgba(16, 185, 129, 0.6),
                0 0 60px rgba(16, 185, 129, 0.4)
              `,
              filter: "blur(0.3px) brightness(1.5)",
            }}
          >
            VEILfi
          </motion.h1>

          {/* Center: Clickable Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <motion.div className="scale-90 cursor-pointer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <TriangleLogo />
            </motion.div>
          </Link>

          {/* Right: KPIs and Activity Feed */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6">
              {[
                {
                  label: "POL TVL",
                  value: `$${(animatedPolTvl / 1000000).toFixed(2)}M`,
                  tooltip: "Protocol-Owned Liquidity Total Value Locked",
                  section: "pol-section",
                },
                {
                  label: "Weekly Buyback",
                  value: `${(animatedBuyback / 1000).toFixed(0)}K VEIL`,
                  tooltip: "VEIL purchased this week via buyback-and-make",
                  section: "pol-section",
                },
                {
                  label: "MSRB Depth",
                  value: `$${(animatedMsrb / 1000000).toFixed(2)}M`,
                  tooltip: "Market Stability Reserve Bank total capital",
                  section: "msrb-section",
                },
                {
                  label: "7d Fees",
                  value: `$${(animatedFees / 1000).toFixed(0)}K`,
                  tooltip: "Protocol fees collected in the last 7 days",
                  section: "pol-section",
                },
                {
                  label: "SLA",
                  value: `${kpis.sla}%`,
                  tooltip: "Service Level Agreement: % of windows cleared on time",
                  section: "system-status",
                },
              ].map((kpi, i) => (
                <motion.button
                  key={i}
                  onClick={() => scrollToSection(kpi.section)}
                  className="flex items-center gap-2 cursor-pointer group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div>
                    <div
                      className="text-xs mb-0.5 flex items-center gap-1"
                      style={{ color: "rgba(255, 255, 255, 0.5)" }}
                    >
                      {kpi.label}
                      <InfoTooltip content={kpi.tooltip} />
                    </div>
                    <div
                      className="font-mono text-sm font-bold group-hover:text-shadow-glow transition-all"
                      style={{ color: "rgba(16, 185, 129, 0.9)" }}
                    >
                      {kpi.value}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="relative">
              <motion.button
                onClick={() => {
                  setShowActivityFeed(!showActivityFeed)
                  setHasNewActivity(false)
                }}
                className="relative p-2 rounded-lg backdrop-blur-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
                whileHover={{
                  background: "rgba(16, 185, 129, 0.1)",
                  borderColor: "rgba(16, 185, 129, 0.3)",
                  scale: 1.05,
                }}
              >
                <Bell className="w-4 h-4" style={{ color: "rgba(255, 255, 255, 0.7)" }} />
                {hasNewActivity && (
                  <motion.div
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{ background: "rgba(16, 185, 129, 0.9)" }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                )}
              </motion.button>

              <AnimatePresence>
                {showActivityFeed && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-xl backdrop-blur-xl shadow-2xl overflow-hidden"
                    style={{
                      background: "rgba(0, 0, 0, 0.95)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                    }}
                  >
                    <div className="p-3 border-b" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                      <h3 className="text-sm font-semibold" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                        Recent Activity
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {recentActivity.map((activity, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-3 border-b hover:bg-white/5 transition-colors"
                          style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className="px-2 py-0.5 rounded text-xs font-medium"
                                  style={{
                                    background:
                                      activity.type === "stake"
                                        ? "rgba(16, 185, 129, 0.15)"
                                        : activity.type === "claim"
                                          ? "rgba(59, 130, 246, 0.15)"
                                          : activity.type === "swap"
                                            ? "rgba(168, 85, 247, 0.15)"
                                            : activity.type === "lock"
                                              ? "rgba(251, 191, 36, 0.15)"
                                              : "rgba(239, 68, 68, 0.15)",
                                    color:
                                      activity.type === "stake"
                                        ? "rgba(16, 185, 129, 0.9)"
                                        : activity.type === "claim"
                                          ? "rgba(59, 130, 246, 0.9)"
                                          : activity.type === "swap"
                                            ? "rgba(168, 85, 247, 0.9)"
                                            : activity.type === "lock"
                                              ? "rgba(251, 191, 36, 0.9)"
                                              : "rgba(239, 68, 68, 0.9)",
                                  }}
                                >
                                  {activity.type.toUpperCase()}
                                </span>
                                <span className="text-xs" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                                  {activity.timestamp}
                                </span>
                              </div>
                              <div className="text-sm" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                                {activity.type === "stake" &&
                                  `Staked ${activity.amount.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} VEIL`}
                                {activity.type === "claim" && `Claimed ${activity.amount} VEIL from ${activity.source}`}
                                {activity.type === "swap" &&
                                  `Swapped ${activity.amount} ${activity.from} → ${activity.to}`}
                                {activity.type === "lock" &&
                                  `Locked ${activity.amount.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} VEIL for ${activity.duration}`}
                                {activity.type === "vote" && `Voted on "${activity.proposal}"`}
                              </div>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(activity.txHash)
                                  showToast("Transaction hash copied", "success")
                                }}
                                className="flex items-center gap-1 text-xs hover:text-emerald-400 transition-colors"
                                style={{ color: "rgba(255, 255, 255, 0.5)" }}
                              >
                                <span className="font-mono">{activity.txHash}</span>
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Contextual CTA Bar */}
        <div
          className="px-6 py-2 border-t"
          style={{ borderColor: "rgba(255, 255, 255, 0.1)", background: "rgba(16, 185, 129, 0.03)" }}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              {!walletConnected && "Connect your wallet to start earning"}
              {walletConnected &&
                claimableRewards > 0 &&
                `You have ${claimableRewards.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} VEIL ready to claim`}
              {walletConnected &&
                claimableRewards === 0 &&
                stakedBalance === 0 &&
                "Start staking or locking VEIL to earn rewards"}
              {walletConnected &&
                claimableRewards === 0 &&
                stakedBalance > 0 &&
                "Your positions are active and earning rewards"}
            </div>
            <div className="flex items-center gap-2">
              {!walletConnected && (
                <motion.button
                  onClick={() => setWalletConnected(true)}
                  className="rounded-lg px-6 py-2 text-sm font-semibold backdrop-blur-xl"
                  style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "rgba(255, 255, 255, 0.95)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    background: "rgba(16, 185, 129, 0.25)",
                    boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
                  }}
                >
                  Connect Wallet
                </motion.button>
              )}
              {walletConnected && claimableRewards > 0 && (
                <motion.button
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="rounded-lg px-6 py-2 text-sm font-semibold backdrop-blur-xl"
                  style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "rgba(255, 255, 255, 0.95)",
                    opacity: isClaiming ? 0.6 : 1,
                  }}
                  whileHover={{
                    scale: isClaiming ? 1 : 1.05,
                    background: "rgba(16, 185, 129, 0.25)",
                    boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
                  }}
                >
                  {isClaiming ? "Claiming..." : "Claim All Rewards"}
                </motion.button>
              )}
              {walletConnected && claimableRewards === 0 && stakedBalance === 0 && (
                <>
                  <motion.button
                    onClick={() => setActiveStakeLockTab("stake")}
                    className="rounded-lg px-4 py-2 text-sm font-medium backdrop-blur-xl"
                    style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Stake VEIL
                  </motion.button>
                  <motion.button
                    onClick={() => setActiveStakeLockTab("lock")}
                    className="rounded-lg px-4 py-2 text-sm font-medium backdrop-blur-xl"
                    style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Lock for veVEIL
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dopamine-generating balance hero display */}
      <div className="px-6 pt-4">
        <BalanceHero
          balance={tokenBalances.wVEIL + stakedBalance + lockedBalance}
          usdValue={(tokenBalances.wVEIL + stakedBalance + lockedBalance) * 0.42}
          change24h={8.5}
          stakedBalance={stakedBalance}
          lockedBalance={lockedBalance}
          lockMonths={lockMonths}
          rewardGain={lastRewardGain}
        />
      </div>

      <div className="h-[calc(100vh-180px)] overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
        <div className="grid grid-cols-3 gap-4">
          {/* Column 1: ACT (Stake/Lock/Swap) */}
          <div className="col-span-1 space-y-4">
            <motion.div
              className="rounded-xl p-4 backdrop-blur-xl"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
              whileHover={{
                borderColor: "rgba(16, 185, 129, 0.3)",
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.1)",
              }}
            >
              {/* Shared Balance Header */}
              <div className="mb-4 pb-3 border-b" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    VEIL Balance
                  </div>
                  <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                    Staked:{" "}
                    {stakedBalance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} |
                    Locked:{" "}
                    {lockedBalance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                  </div>
                </div>
                <div className="font-mono text-xl font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                  {tokenBalances.wVEIL.toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                  })}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-4 rounded-lg p-1" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                <button
                  onClick={() => setActiveStakeLockTab("stake")}
                  className="flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    background: activeStakeLockTab === "stake" ? "rgba(16, 185, 129, 0.15)" : "transparent",
                    color: activeStakeLockTab === "stake" ? "rgba(16, 185, 129, 0.9)" : "rgba(255, 255, 255, 0.6)",
                    border: `1px solid ${activeStakeLockTab === "stake" ? "rgba(16, 185, 129, 0.3)" : "transparent"}`,
                  }}
                >
                  Stake
                </button>
                <button
                  onClick={() => setActiveStakeLockTab("lock")}
                  className="flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    background: activeStakeLockTab === "lock" ? "rgba(16, 185, 129, 0.15)" : "transparent",
                    color: activeStakeLockTab === "lock" ? "rgba(16, 185, 129, 0.9)" : "rgba(255, 255, 255, 0.6)",
                    border: `1px solid ${activeStakeLockTab === "lock" ? "rgba(16, 185, 129, 0.3)" : "transparent"}`,
                  }}
                >
                  Lock
                </button>
              </div>

              {/* Stake Tab Content */}
              {activeStakeLockTab === "stake" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  <div className="mb-3 flex items-center gap-2">
                    <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                      Base APR: 12.5%
                    </p>
                    <InfoTooltip content="Annual Percentage Rate from staking rewards. Actual APR may vary based on total staked amount and protocol performance. Rewards update every epoch (24 hours)." />
                  </div>

                  <div className="mb-2">
                    <input
                      type="text"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.00"
                      disabled={isStaking}
                      className="w-full rounded-lg bg-transparent px-3 py-2 text-sm font-mono outline-none"
                      style={{
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
                    />
                  </div>

                  <div className="flex gap-1 mb-3">
                    {[25, 50, 75, 100].map((percent) => (
                      <button
                        key={percent}
                        onClick={() => setAmountPreset(percent, false)}
                        disabled={isStaking}
                        className="flex-1 rounded px-2 py-1 text-xs font-medium"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>

                  {estimatedStakeRewards && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg p-2 mb-3"
                      style={{
                        background: "rgba(16, 185, 129, 0.05)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                      }}
                    >
                      <div className="text-xs mb-1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        Estimated Rewards
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div style={{ color: "rgba(255, 255, 255, 0.4)" }}>Daily</div>
                          <div className="font-mono font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                            {estimatedStakeRewards.daily.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: "rgba(255, 255, 255, 0.4)" }}>Weekly</div>
                          <div className="font-mono font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                            {estimatedStakeRewards.weekly.toFixed(0)}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: "rgba(255, 255, 255, 0.4)" }}>Yearly</div>
                          <div className="font-mono font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                            {estimatedStakeRewards.yearly.toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    onClick={handleStake}
                    disabled={isStaking}
                    className="w-full rounded-lg px-4 py-2 text-sm font-medium backdrop-blur-xl"
                    style={{
                      background: "rgba(16, 185, 129, 0.08)",
                      border: "1px solid rgba(16, 185, 129, 0.15)",
                      color: "rgba(255, 255, 255, 0.9)",
                      opacity: isStaking ? 0.6 : 1,
                    }}
                    whileHover={{
                      scale: isStaking ? 1 : 1.02,
                      background: "rgba(16, 185, 129, 0.15)",
                      borderColor: "rgba(16, 185, 129, 0.3)",
                      boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    {isStaking ? "Staking..." : "Stake"}
                  </motion.button>

                  {stakedBalance > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 pt-3 border-t"
                      style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                    >
                      <div className="text-xs mb-2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Your Staked Position
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-mono text-lg font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                            {stakedBalance.toLocaleString(undefined, {
                              minimumFractionDigits: 4,
                              maximumFractionDigits: 4,
                            })}
                          </div>
                          <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                            ≈ $
                            {(stakedBalance * 0.42).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            USD
                          </div>
                        </div>
                        <motion.button
                          className="rounded px-3 py-1 text-xs font-medium"
                          style={{
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "rgba(239, 68, 68, 0.9)",
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          Unstake
                        </motion.button>
                      </div>
                      <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        No cooldown period • Unstake anytime
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Lock Tab Content */}
              {activeStakeLockTab === "lock" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  <div className="mb-2">
                    <input
                      type="text"
                      value={lockAmount}
                      onChange={(e) => setLockAmount(e.target.value)}
                      placeholder="0.00"
                      disabled={isLocking}
                      className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm font-mono outline-none"
                      style={{
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
                    />
                  </div>

                  <div className="flex gap-1 mb-3">
                    {[25, 50, 75, 100].map((percent) => (
                      <button
                        key={percent}
                        onClick={() => setAmountPreset(percent, true)}
                        disabled={isLocking}
                        className="flex-1 rounded px-2 py-1 text-xs font-medium"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>

                  <div className="mb-2">
                    <div className="text-xs mb-1" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Lock Duration: {lockMonths} months
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[3, 6, 12, 24, 48].map((months) => (
                        <button
                          key={months}
                          onClick={() => setLockDurationPreset(months)}
                          disabled={isLocking}
                          className="flex-1 rounded px-2 py-1 text-xs font-medium"
                          style={{
                            background:
                              lockMonths === months ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)",
                            border: `1px solid ${lockMonths === months ? "rgba(16, 185, 129, 0.3)" : "rgba(255, 255, 255, 0.1)"}`,
                            color: lockMonths === months ? "rgba(16, 185, 129, 0.9)" : "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {months}mo
                        </button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="48"
                      value={lockMonths}
                      onChange={(e) => setLockMonths(Number(e.target.value))}
                      disabled={isLocking}
                      className="w-full"
                      style={{ accentColor: "rgba(16, 185, 129, 0.8)" }}
                    />
                  </div>

                  <div
                    className="mb-3 rounded-lg border p-2"
                    style={{ background: "rgba(16, 185, 129, 0.05)", borderColor: "rgba(16, 185, 129, 0.2)" }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                          vePower
                        </div>
                        <InfoTooltip content="Vote-escrowed power: Your governance voting weight. Longer locks = more power. Max 100% at 48 months. Non-transferable." />
                      </div>
                      <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        Unlocks: {formatDate(calculateUnlockDate(lockMonths))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-xl font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                        {vePower}%
                      </div>
                      <div className="flex-1">
                        <div
                          className="h-2 rounded-full overflow-hidden"
                          style={{ background: "rgba(255, 255, 255, 0.1)" }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${vePower}%` }}
                            style={{ background: "rgba(16, 185, 129, 0.8)" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {estimatedLockRewards && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg p-2 mb-3"
                      style={{
                        background: "rgba(16, 185, 129, 0.05)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                          Estimated Rewards (with lock bonus)
                        </div>
                        <div className="text-xs font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                          APR: {(12.5 + (lockMonths / 48) * 8).toFixed(1)}%
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div style={{ color: "rgba(255, 255, 255, 0.4)" }}>Daily</div>
                          <div className="font-mono font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                            {estimatedLockRewards.daily.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: "rgba(255, 255, 255, 0.4)" }}>Weekly</div>
                          <div className="font-mono font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                            {estimatedLockRewards.weekly.toFixed(0)}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: "rgba(255, 255, 255, 0.4)" }}>Yearly</div>
                          <div className="font-mono font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                            {estimatedLockRewards.yearly.toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    onClick={handleLock}
                    disabled={isLocking}
                    className="w-full rounded-lg border px-4 py-2 text-sm font-medium"
                    style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      borderColor: "rgba(16, 185, 129, 0.3)",
                      color: "rgba(255, 255, 255, 0.9)",
                      opacity: isLocking ? 0.6 : 1,
                    }}
                    whileHover={{ scale: isLocking ? 1 : 1.02 }}
                  >
                    {isLocking ? "Locking..." : "Lock"}
                  </motion.button>

                  {lockedBalance > 0 && lockEndDate && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 pt-3 border-t"
                      style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                    >
                      <div className="text-xs mb-2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Your Locked Position
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-mono text-lg font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                            {lockedBalance.toLocaleString()}
                          </div>
                          <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                            ≈ $
                            {(lockedBalance * 0.42).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            USD
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                            Unlocks
                          </div>
                          <div className="text-xs font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                            {formatDate(lockEndDate)}
                          </div>
                        </div>
                      </div>
                      <div
                        className="rounded p-2 text-xs"
                        style={{ background: "rgba(251, 191, 36, 0.1)", border: "1px solid rgba(251, 191, 36, 0.3)" }}
                      >
                        <div className="font-medium mb-1" style={{ color: "rgba(251, 191, 36, 0.9)" }}>
                          Early Withdrawal Penalty
                        </div>
                        <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                          Unlocking before {formatDate(lockEndDate)} incurs a 50% penalty. Penalty decreases linearly
                          over time.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Swap Card */}
            <motion.div
              className="rounded-xl p-4 backdrop-blur-xl"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
              whileHover={{
                borderColor: "rgba(16, 185, 129, 0.3)",
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.1)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <h3
                    className="text-sm font-bold"
                    style={{
                      color: "rgba(255, 255, 255, 0.25)",
                      textShadow: "0 0 10px rgba(16, 185, 129, 0.15)",
                    }}
                  >
                    Swap
                  </h3>
                  <InfoTooltip content="Trade tokens using protocol-owned liquidity. Swaps are executed against POL pools with minimal slippage." />
                </div>
                <motion.button
                  onClick={() => setShowSlippage(!showSlippage)}
                  className="p-1 rounded-lg"
                  style={{
                    background: showSlippage ? "rgba(16, 185, 129, 0.1)" : "transparent",
                    border: `1px solid ${showSlippage ? "rgba(16, 185, 129, 0.3)" : "rgba(255, 255, 255, 0.1)"}`,
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Settings className="h-3.5 w-3.5" style={{ color: "rgba(255, 255, 255, 0.6)" }} />
                </motion.button>
              </div>

              <div className="relative mb-3">
                <select
                  value={selectedPair}
                  onChange={(e) => {
                    setSelectedPair(e.target.value as SwapPair)
                    setSwapFromAmount("")
                    setSwapToAmount("")
                  }}
                  disabled={isSwapping}
                  className="w-full rounded-lg bg-transparent px-3 py-2.5 text-sm font-semibold outline-none appearance-none cursor-pointer"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "rgba(255, 255, 255, 0.95)",
                    background: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <option value="wVEIL/USDC" style={{ background: "#0A0A0A" }}>
                    wVEIL → USDC
                  </option>
                  <option value="USDC/wVEIL" style={{ background: "#0A0A0A" }}>
                    USDC → wVEIL
                  </option>
                  <option value="wVEIL/wAVAX" style={{ background: "#0A0A0A" }}>
                    wVEIL → wAVAX
                  </option>
                  <option value="wAVAX/wVEIL" style={{ background: "#0A0A0A" }}>
                    wAVAX → wVEIL
                  </option>
                  <option value="wAVAX/USDC" style={{ background: "#0A0A0A" }}>
                    wAVAX → USDC
                  </option>
                  <option value="USDC/wAVAX" style={{ background: "#0A0A0A" }}>
                    USDC → wAVAX
                  </option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                  style={{ color: "rgba(255, 255, 255, 0.5)" }}
                />
              </div>

              {/* Liquidity & Volume Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div
                  className="rounded-lg p-2"
                  style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
                >
                  <div className="text-xs mb-0.5" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    Liquidity
                  </div>
                  <div className="font-mono text-xs font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                    ${(getPairData(selectedPair).liquidity / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div
                  className="rounded-lg p-2"
                  style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
                >
                  <div className="text-xs mb-0.5" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    24h Volume
                  </div>
                  <div className="font-mono text-xs font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                    ${(getPairData(selectedPair).volume24h / 1000).toFixed(0)}K
                  </div>
                </div>
                <div
                  className="rounded-lg p-2"
                  style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
                >
                  <div className="text-xs mb-0.5" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    24h Change
                  </div>
                  <div
                    className="font-mono text-xs font-bold"
                    style={{
                      color:
                        getPairData(selectedPair).priceChange24h > 0
                          ? "rgba(16, 185, 129, 0.9)"
                          : "rgba(239, 68, 68, 0.9)",
                    }}
                  >
                    {getPairData(selectedPair).priceChange24h > 0 ? "+" : ""}
                    {getPairData(selectedPair).priceChange24h.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Mini Price Chart */}
              <div
                className="rounded-lg p-3 mb-4"
                style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
              >
                <div className="h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getPairData(selectedPair).priceHistory}>
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="rgba(16, 185, 129, 0.8)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Slippage Settings */}
              <AnimatePresence>
                {showSlippage && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-3 overflow-hidden"
                  >
                    <div
                      className="rounded-lg p-2"
                      style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
                    >
                      <div className="flex items-center gap-1 mb-2">
                        <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                          Slippage Tolerance: {slippage}%
                        </div>
                        <InfoTooltip content="Maximum price movement you'll accept. Higher slippage = more likely to execute but worse price. Lower = better price but may fail." />
                      </div>
                      <div className="flex gap-1">
                        {[0.1, 0.5, 1.0].map((value) => (
                          <button
                            key={value}
                            onClick={() => setSlippage(value)}
                            className="flex-1 rounded px-2 py-1 text-xs"
                            style={{
                              background: slippage === value ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)",
                              border: `1px solid ${slippage === value ? "rgba(16, 185, 129, 0.3)" : "rgba(255, 255, 255, 0.1)"}`,
                              color: slippage === value ? "rgba(16, 185, 129, 0.9)" : "rgba(255, 255, 255, 0.6)",
                            }}
                          >
                            {value}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className="rounded-lg p-3 mb-2"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: `1.5px solid ${tokenColors[getPairTokens(selectedPair)[0]]}40`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    From
                  </span>
                  <span className="text-xs font-mono" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                    Balance:{" "}
                    {tokenBalances[getPairTokens(selectedPair)[0]].toLocaleString(undefined, {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={swapFromAmount}
                    onChange={(e) => handleSwapAmountChange(e.target.value, true)}
                    placeholder="0.00"
                    disabled={isSwapping}
                    className="flex-1 bg-transparent text-xl font-mono font-bold outline-none"
                    style={{ color: "rgba(255, 255, 255, 0.95)" }}
                  />
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${tokenColors[getPairTokens(selectedPair)[0]]}60`,
                    }}
                  >
                    {tokenIcons[getPairTokens(selectedPair)[0]]}
                    <span className="text-sm font-bold" style={{ color: tokenColors[getPairTokens(selectedPair)[0]] }}>
                      {getPairTokens(selectedPair)[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Swap Direction Icon */}
              <div className="flex justify-center -my-1 relative z-10">
                <motion.button
                  onClick={handleSwapDirection}
                  disabled={isSwapping}
                  className="rounded-full p-2 cursor-pointer"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                  }}
                  whileHover={{ rotate: 180, scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowDownUp className="h-4 w-4" style={{ color: "rgba(16, 185, 129, 0.9)" }} />
                </motion.button>
              </div>

              <div
                className="rounded-lg p-3 mb-3"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: `1.5px solid ${tokenColors[getPairTokens(selectedPair)[1]]}40`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    To
                  </span>
                  <span className="text-xs font-mono" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                    Balance:{" "}
                    {tokenBalances[getPairTokens(selectedPair)[1]].toLocaleString(undefined, {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={swapToAmount}
                    onChange={(e) => handleSwapAmountChange(e.target.value, false)}
                    placeholder="0.00"
                    disabled={isSwapping}
                    className="flex-1 bg-transparent text-xl font-mono font-bold outline-none"
                    style={{ color: "rgba(255, 255, 255, 0.95)" }}
                  />
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${tokenColors[getPairTokens(selectedPair)[1]]}60`,
                    }}
                  >
                    {tokenIcons[getPairTokens(selectedPair)[1]]}
                    <span className="text-sm font-bold" style={{ color: tokenColors[getPairTokens(selectedPair)[1]] }}>
                      {getPairTokens(selectedPair)[1]}
                    </span>
                  </div>
                </div>
              </div>

              {swapFromAmount && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 mb-3">
                  <div
                    className="rounded-lg p-2"
                    style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        Exchange Rate
                      </span>
                      <span className="font-mono text-xs font-medium" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                        1 {getPairTokens(selectedPair)[0]} = {getSwapPrice(selectedPair).toFixed(6)}{" "}
                        {getPairTokens(selectedPair)[1]}
                      </span>
                    </div>
                  </div>

                  {priceImpact > 0 && (
                    <div
                      className="rounded-lg p-2"
                      style={{
                        background:
                          priceImpact > 5
                            ? "rgba(239, 68, 68, 0.1)"
                            : priceImpact > 1
                              ? "rgba(251, 191, 36, 0.1)"
                              : "rgba(255, 255, 255, 0.03)",
                        border: `1px solid ${priceImpact > 5 ? "rgba(239, 68, 68, 0.3)" : priceImpact > 1 ? "rgba(251, 191, 36, 0.3)" : "rgba(255, 255, 255, 0.1)"}`,
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <span className="text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                            Price Impact
                          </span>
                          <InfoTooltip content="How much your trade will move the market price. Large impacts mean you'll get a worse rate." />
                        </div>
                        <span
                          className="font-mono text-xs font-bold"
                          style={{
                            color:
                              priceImpact > 5
                                ? "rgba(239, 68, 68, 0.9)"
                                : priceImpact > 1
                                  ? "rgba(251, 191, 36, 0.9)"
                                  : "rgba(16, 185, 129, 0.9)",
                          }}
                        >
                          {priceImpact.toFixed(2)}%
                        </span>
                      </div>
                      {priceImpact > 5 && (
                        <div className="mt-1 text-xs" style={{ color: "rgba(239, 68, 68, 0.8)" }}>
                          High price impact! Consider reducing swap amount.
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Swap Button */}
              <motion.button
                onClick={handleSwap}
                disabled={isSwapping || priceImpact > 10}
                className="w-full rounded-lg px-4 py-3 text-sm font-semibold backdrop-blur-xl"
                style={{
                  background: priceImpact > 10 ? "rgba(239, 68, 68, 0.12)" : "rgba(16, 185, 129, 0.12)",
                  border: `1px solid ${priceImpact > 10 ? "rgba(239, 68, 68, 0.25)" : "rgba(16, 185, 129, 0.25)"}`,
                  color: "rgba(255, 255, 255, 0.95)",
                  opacity: isSwapping || priceImpact > 10 ? 0.6 : 1,
                }}
                whileHover={{
                  scale: isSwapping || priceImpact > 10 ? 1 : 1.02,
                  background: priceImpact > 10 ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)",
                  borderColor: priceImpact > 10 ? "rgba(239, 68, 68, 0.4)" : "rgba(16, 185, 129, 0.4)",
                  boxShadow: priceImpact > 10 ? "0 0 20px rgba(239, 68, 68, 0.3)" : "0 0 20px rgba(16, 185, 129, 0.3)",
                }}
              >
                {isSwapping ? "Swapping..." : priceImpact > 10 ? "Price Impact Too High" : "Swap Tokens"}
              </motion.button>

              <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                <div className="text-xs font-medium mb-2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  Recent Swaps
                </div>
                <div className="space-y-2">
                  {[
                    { from: "1,250", fromToken: "wVEIL", to: "525", toToken: "USDC", time: "2m ago" },
                    { from: "850", fromToken: "wVEIL", to: "10.2", toToken: "wAVAX", time: "15m ago" },
                  ].map((swap, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs rounded-lg p-2"
                      style={{ background: "rgba(255, 255, 255, 0.03)" }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>{swap.time}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-medium" style={{ color: tokenColors[swap.fromToken] }}>
                            {swap.from}
                          </span>
                          <span className="text-xs" style={{ color: tokenColors[swap.fromToken] }}>
                            {swap.fromToken}
                          </span>
                        </div>
                        <ArrowDownUp className="h-3 w-3" style={{ color: "rgba(255, 255, 255, 0.3)" }} />
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-medium" style={{ color: tokenColors[swap.toToken] }}>
                            {swap.to}
                          </span>
                          <span className="text-xs" style={{ color: tokenColors[swap.toToken] }}>
                            {swap.toToken}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Risk Status */}
            <motion.div
              className="rounded-xl border p-4 backdrop-blur-xl"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="flex items-center gap-1 mb-3">
                <h3 className="text-sm font-bold" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                  System Status
                </h3>
                <InfoTooltip content="Real-time health of critical infrastructure nodes. All systems must be operational for trading." />
              </div>
              <div className="space-y-2">
                {[
                  {
                    label: "Encryption",
                    status: "green",
                    tooltip: "TEE-based order encryption nodes securing trade data",
                  },
                  {
                    label: "Oracle",
                    status: "green",
                    tooltip: "Attestors signing outcome results after dispute windows",
                  },
                  {
                    label: "Keeper",
                    status: "green",
                    tooltip: "Operators balancing one-sided windows within VaR limits",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <motion.div
                      className="h-2 w-2 rounded-full"
                      style={{ background: "rgba(16, 185, 129, 0.8)" }}
                      animate={{
                        boxShadow: [
                          "0 0 5px rgba(16, 185, 129, 0.5)",
                          "0 0 10px rgba(16, 185, 129, 0.7)",
                          "0 0 5px rgba(16, 185, 129, 0.5)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <span className="text-xs flex-1" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      {item.label}
                    </span>
                    <InfoTooltip content={item.tooltip} side="left" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Column 2: UNDERSTAND (POL, MSRB, Governance) */}
          <div className="col-span-1 space-y-4">
            {/* POL Section */}
            <div id="pol-section" className="rounded-xl border p-4 backdrop-blur-xl space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Chain-Owned Liquidity
                </h3>
                <InfoTooltip content="Protocol-owned liquidity ensures permanent market depth and stability" />
              </div>
              <div className="h-32 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={polTvlData}>
                    <defs>
                      <linearGradient id="polGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.3)" />
                        <stop offset="100%" stopColor="rgba(16, 185, 129, 0.0)" />
                      </linearGradient>
                    </defs>
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0, 0, 0, 0.9)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, "POL TVL"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="rgba(16, 185, 129, 0.8)"
                      strokeWidth={2}
                      fill="url(#polGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                Recent Buybacks
                <InfoTooltip content="Automated weekly purchases of VEIL using protocol revenue. Tokens are paired and added to POL forever." />
              </div>
              <div className="space-y-1 mt-2">
                {buybackLogs.slice(0, 2).map((log, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>{log.date}</span>
                    <span className="font-mono" style={{ color: "rgba(16, 185, 129, 0.8)" }}>
                      {(log.wveil / 1000).toFixed(0)}K @ ${log.vwap}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* MSRB Section */}
            <div id="msrb-section" className="rounded-xl border p-4 backdrop-blur-xl space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  MSRB Depth Bank
                </h3>
                <InfoTooltip content="Market Stability Reserve Bank provides capital to stabilize prices across market tiers" />
              </div>
              <div className="space-y-3">
                {msrbTiers.map((tier, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                          {tier.tier}
                        </span>
                        <InfoTooltip
                          content={`${tier.tier} markets: ${tier.activeMarkets} active markets with ${tier.spreadBps}bps spread. Next capital top-up in ${tier.nextTopup}.`}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono" style={{ color: "rgba(16, 185, 129, 0.8)" }}>
                          ${(tier.targetB / 1000).toFixed(0)}K
                        </span>
                        <span className="text-xs font-mono" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                          {tier.utilization}%
                        </span>
                      </div>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden relative"
                      style={{ background: "rgba(255, 255, 255, 0.1)" }}
                    >
                      <motion.div
                        className="h-full rounded-full relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${tier.utilization}%` }}
                        style={{
                          background:
                            tier.utilization > 80
                              ? "linear-gradient(90deg, rgba(251, 191, 36, 0.6) 0%, rgba(239, 68, 68, 0.6) 100%)"
                              : tier.utilization > 60
                                ? "linear-gradient(90deg, rgba(16, 185, 129, 0.6) 0%, rgba(251, 191, 36, 0.6) 100%)"
                                : "rgba(16, 185, 129, 0.6)",
                        }}
                      >
                        {/* Threshold markers */}
                        <div
                          className="absolute top-0 bottom-0 w-px"
                          style={{ left: "60%", background: "rgba(255, 255, 255, 0.3)" }}
                        />
                        <div
                          className="absolute top-0 bottom-0 w-px"
                          style={{ left: "80%", background: "rgba(255, 255, 255, 0.3)" }}
                        />
                      </motion.div>
                    </div>
                    <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                      <span>{tier.activeMarkets} markets</span>
                      <span>{tier.spreadBps}bps spread</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              className="rounded-xl border p-4 backdrop-blur-xl"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="flex items-center gap-1 mb-3">
                <h3 className="text-sm font-bold" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                  APR Trends
                </h3>
                <InfoTooltip content="Historical APR rates for staking and veVEIL. Rates adjust based on protocol performance and total staked amount." />
              </div>
              <div className="h-32 mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={aprHistoryData}>
                    <defs>
                      <linearGradient id="stakingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.3)" />
                        <stop offset="100%" stopColor="rgba(16, 185, 129, 0.0)" />
                      </linearGradient>
                      <linearGradient id="veveilGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0.0)" />
                      </linearGradient>
                    </defs>
                    <YAxis hide domain={[10, 22]} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0, 0, 0, 0.9)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number, name: string) => [
                        `${value.toFixed(1)}%`,
                        name === "staking" ? "Staking APR" : "veVEIL APR",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="staking"
                      stroke="rgba(16, 185, 129, 0.8)"
                      strokeWidth={2}
                      fill="url(#stakingGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="veveil"
                      stroke="rgba(59, 130, 246, 0.8)"
                      strokeWidth={2}
                      fill="url(#veveilGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-1 rounded" style={{ background: "rgba(16, 185, 129, 0.8)" }} />
                  <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>Staking</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-1 rounded" style={{ background: "rgba(59, 130, 246, 0.8)" }} />
                  <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>veVEIL</span>
                </div>
              </div>
            </motion.div>

            {/* Governance */}
            <motion.div
              className="rounded-xl border p-4 backdrop-blur-xl"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="flex items-center gap-1 mb-3">
                <h3 className="text-sm font-bold" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                  Active Proposals
                </h3>
                <InfoTooltip content="veVEIL holders vote on protocol parameters. Commit-reveal voting prevents manipulation. Quorum required to pass." />
              </div>
              <div className="space-y-3">
                {proposals.slice(0, 2).map((proposal) => (
                  <div
                    key={proposal.id}
                    className="rounded-lg border p-3"
                    style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-xs font-medium" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                        {proposal.title}
                      </div>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(16, 185, 129, 0.1)", color: "rgba(16, 185, 129, 0.9)" }}
                      >
                        {proposal.scope}
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden mb-2"
                      style={{ background: "rgba(255, 255, 255, 0.1)" }}
                    >
                      <div className="flex h-full">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(proposal.forVotes / proposal.quorum) * 100}%` }}
                          style={{ background: "rgba(16, 185, 129, 0.8)" }}
                        />
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(proposal.againstVotes / proposal.quorum) * 100}%` }}
                          style={{ background: "rgba(239, 68, 68, 0.8)" }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Ends: {proposal.endTs}</span>
                      <span className="font-mono" style={{ color: "rgba(16, 185, 129, 0.7)" }}>
                        {((proposal.forVotes / proposal.quorum) * 100).toFixed(0)}% For
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Column 3: GET PAID (Rewards & Claims) */}
          <div className="col-span-1">
            <motion.div
              className="rounded-xl border p-4 backdrop-blur-xl h-full overflow-auto"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="flex items-center gap-1 mb-3">
                <h3 className="text-sm font-bold" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                  Rewards & Claims
                </h3>
                <InfoTooltip content="Earn rewards from staking, veVEIL governance, and LP provision. Rewards accrue continuously and can be claimed anytime." />
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-4 rounded-lg p-1" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                {(["staking", "veveil", "lp"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveRewardsTab(tab)}
                    className="flex-1 rounded-md px-2 py-1 text-xs font-medium transition-all"
                    style={{
                      background: activeRewardsTab === tab ? "rgba(16, 185, 129, 0.15)" : "transparent",
                      color: activeRewardsTab === tab ? "rgba(16, 185, 129, 0.9)" : "rgba(255, 255, 255, 0.6)",
                      borderColor: activeRewardsTab === tab ? "rgba(16, 185, 129, 0.3)" : "transparent",
                    }}
                  >
                    {tab === "staking" ? "Staking" : tab === "veveil" ? "veVEIL" : "LP"}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {/* Total Claimable */}
                <div
                  className="rounded-lg border p-3"
                  style={{ background: "rgba(16, 185, 129, 0.05)", borderColor: "rgba(16, 185, 129, 0.2)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        Total Claimable
                      </div>
                      <InfoTooltip content="Total rewards ready to claim across all sources. Claiming is gas-efficient and batched." />
                    </div>
                    <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                      Next update: {formatTimeRemaining(nextRewardUpdate)}
                    </div>
                  </div>
                  <div className="font-mono text-2xl font-bold mb-1" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                    {claimableRewards.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                  </div>
                  <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                    ≈ $
                    {(claimableRewards * 0.42).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    USD
                  </div>
                </div>

                {/* Claim All Button */}
                <motion.button
                  onClick={handleClaim}
                  disabled={isClaiming || claimableRewards === 0}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm font-semibold"
                  style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    borderColor: "rgba(16, 185, 129, 0.3)",
                    color: "rgba(255, 255, 255, 0.95)",
                    opacity: isClaiming || claimableRewards === 0 ? 0.6 : 1,
                  }}
                  whileHover={{
                    scale: isClaiming || claimableRewards === 0 ? 1 : 1.02,
                    boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  {isClaiming ? "Claiming..." : "Claim All Rewards"}
                </motion.button>

                {/* Individual Source Breakdown */}
                <div className="pt-3 border-t" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                  <div className="text-xs mb-2 font-medium" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    By Source
                  </div>
                  <div className="space-y-2">
                    {(["staking", "veveil", "lp"] as const).map((source) => (
                      <div
                        key={source}
                        className="rounded-lg p-2"
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs font-medium capitalize"
                              style={{ color: "rgba(255, 255, 255, 0.7)" }}
                            >
                              {source === "veveil" ? "veVEIL" : source === "lp" ? "LP" : "Staking"}
                            </span>
                            {pendingRewards[source] > 0 && (
                              <span
                                className="text-xs px-1.5 py-0.5 rounded"
                                style={{ background: "rgba(251, 191, 36, 0.15)", color: "rgba(251, 191, 36, 0.9)" }}
                              >
                                +{pendingRewards[source]} pending
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                              {rewardsBySource[source].toLocaleString(undefined, {
                                minimumFractionDigits: 4,
                                maximumFractionDigits: 4,
                              })}
                            </div>
                            <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                              ${(rewardsBySource[source] * 0.42).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleClaimSource(source)}
                          disabled={isClaiming || rewardsBySource[source] === 0}
                          className="w-full rounded px-2 py-1 text-xs font-medium mt-1"
                          style={{
                            background: "rgba(16, 185, 129, 0.08)",
                            border: "1px solid rgba(16, 185, 129, 0.2)",
                            color: "rgba(255, 255, 255, 0.8)",
                            opacity: isClaiming || rewardsBySource[source] === 0 ? 0.5 : 1,
                          }}
                          whileHover={{
                            scale: isClaiming || rewardsBySource[source] === 0 ? 1 : 1.02,
                            background: "rgba(16, 185, 129, 0.12)",
                          }}
                        >
                          {isClaiming ? "Claiming..." : "Claim"}
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reward History with Filters */}
                <div className="pt-3 border-t" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Claim History
                    </div>
                    <select
                      value={historyFilter}
                      onChange={(e) => setHistoryFilter(e.target.value as typeof historyFilter)}
                      className="text-xs rounded px-2 py-1 bg-transparent outline-none cursor-pointer"
                      style={{
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <option value="all" style={{ background: "#0A0A0A" }}>
                        All
                      </option>
                      <option value="staking" style={{ background: "#0A0A0A" }}>
                        Staking
                      </option>
                      <option value="veveil" style={{ background: "#0A0A0A" }}>
                        veVEIL
                      </option>
                      <option value="lp" style={{ background: "#0A0A0A" }}>
                        LP
                      </option>
                    </select>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-auto">
                    {rewardHistory
                      .filter((claim) => historyFilter === "all" || claim.source === historyFilter)
                      .map((claim, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs rounded-lg p-2"
                          style={{ background: "rgba(255, 255, 255, 0.03)" }}
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>{claim.date}</span>
                              <span
                                className="px-1.5 py-0.5 rounded text-xs capitalize"
                                style={{
                                  background: "rgba(16, 185, 129, 0.1)",
                                  color: "rgba(16, 185, 129, 0.8)",
                                }}
                              >
                                {claim.source === "veveil" ? "veVEIL" : claim.source === "lp" ? "LP" : claim.source}
                              </span>
                            </div>
                            <div className="font-mono text-xs" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                              {claim.tx}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm font-bold" style={{ color: "rgba(16, 185, 129, 0.8)" }}>
                              {claim.amount.toLocaleString(undefined, {
                                minimumFractionDigits: 4,
                                maximumFractionDigits: 4,
                              })}
                            </div>
                            <div style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                              $
                              {claim.usd.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* APR Breakdown */}
                <div className="pt-3 border-t" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      APR Breakdown
                    </div>
                    <InfoTooltip content="Your total Annual Percentage Rate from all sources. Base rate + bonuses from operator roles and veVEIL boosts." />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Base</span>
                        <InfoTooltip content="Standard staking rewards from protocol emissions" side="right" />
                      </div>
                      <span className="font-mono" style={{ color: "rgba(16, 185, 129, 0.8)" }}>
                        12.5%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Operator Bonus</span>
                        <InfoTooltip
                          content="Additional rewards for running infrastructure nodes (encryption, oracle, keeper)"
                          side="right"
                        />
                      </div>
                      <span className="font-mono" style={{ color: "rgba(16, 185, 129, 0.8)" }}>
                        +8.2%
                      </span>
                    </div>
                    <div
                      className="flex justify-between text-xs font-medium pt-1 border-t"
                      style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>Total APR</span>
                      <span className="font-mono" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                        20.7%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estimated Future Rewards */}
                <div className="pt-3 border-t" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Projected Earnings
                    </div>
                    <InfoTooltip content="Estimated future rewards based on your current stake and APR. Actual rewards may vary." />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { period: "7 days", amount: 1250 },
                      { period: "30 days", amount: 5350 },
                      { period: "1 year", amount: 65200 },
                    ].map((projection, i) => (
                      <div
                        key={i}
                        className="rounded-lg p-2 text-center"
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <div className="text-xs mb-1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                          {projection.period}
                        </div>
                        <div className="font-mono text-sm font-bold" style={{ color: "rgba(16, 185, 129, 0.9)" }}>
                          {projection.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 4,
                            maximumFractionDigits: 4,
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
