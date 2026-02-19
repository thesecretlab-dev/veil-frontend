"use client"

import { useState, useEffect } from "react"
import { getMarketById } from "@/lib/market-data"
import { Copy, Check } from "lucide-react"

interface TradingPanelProps {
  marketId: string
}

type OrderState = "compose" | "confirm" | "sealed" | "result" | "no-fill"

export function TradingPanel({ marketId }: TradingPanelProps) {
  const [side, setSide] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState(100)
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no">("yes")
  const [orderState, setOrderState] = useState<OrderState>("compose")
  const [windowCountdown, setWindowCountdown] = useState(18)
  const [receiptId, setReceiptId] = useState("")
  const [fillPrice, setFillPrice] = useState(0)
  const [copied, setCopied] = useState(false)

  const market = getMarketById(Number.parseInt(marketId))

  // Window countdown timer
  useEffect(() => {
    if (orderState === "sealed" && windowCountdown > 0) {
      const timer = setInterval(() => {
        setWindowCountdown((prev) => {
          if (prev <= 1) {
            // Window closed, show result
            setOrderState("result")
            setFillPrice(0.57)
            setReceiptId(`0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [orderState, windowCountdown])

  if (!market) {
    return <div className="w-96 p-6 text-white/50">Market not found</div>
  }

  const price = selectedOutcome === "yes" ? market.yesPrice / 100 : market.noPrice / 100
  const toWin = amount / price

  const handleTrade = () => {
    if (orderState === "compose") {
      setOrderState("confirm")
    } else if (orderState === "confirm") {
      setOrderState("sealed")
      setWindowCountdown(18)
    }
  }

  const handleCopyReceipt = () => {
    navigator.clipboard.writeText(receiptId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setOrderState("compose")
    setWindowCountdown(18)
    setReceiptId("")
    setFillPrice(0)
  }

  return (
    <div className="w-96 border-l border-white/5 bg-black/20 backdrop-blur-xl overflow-y-auto">
      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="text-2xl">{market.image}</div>
            <div>
              <div className="text-white font-['Space_Grotesk'] font-medium text-sm">{market.title}</div>
              <div className="text-xs text-white/40 font-['Space_Grotesk']">{market.category}</div>
            </div>
          </div>
        </div>

        {/* Compose State */}
        {orderState === "compose" && (
          <>
            {/* Buy/Sell Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSide("buy")}
                className={`flex-1 py-2 rounded-lg font-['Space_Grotesk'] transition-all
                     ${
                       side === "buy"
                         ? "bg-emerald-500/20 border border-emerald-500/30 text-white"
                         : "bg-white/5 border border-white/10 text-white/50"
                     }`}
              >
                Buy
              </button>
              <button
                onClick={() => setSide("sell")}
                className={`flex-1 py-2 rounded-lg font-['Space_Grotesk'] transition-all
                     ${
                       side === "sell"
                         ? "bg-red-500/20 border border-red-500/30 text-white"
                         : "bg-white/5 border border-white/10 text-white/50"
                     }`}
              >
                Sell
              </button>
              <select
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 
                           text-white/70 text-sm font-['Space_Grotesk']"
              >
                <option>Market</option>
                <option>Limit</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedOutcome("yes")}
                className={`flex-1 py-3 rounded-lg font-['Space_Grotesk'] font-medium transition-all
                     ${
                       selectedOutcome === "yes"
                         ? "bg-emerald-500/20 border-2 border-emerald-500/50 text-white"
                         : "bg-white/5 border border-white/10 text-white/50"
                     }`}
              >
                Yes {market.yesPrice}¢
              </button>
              <button
                onClick={() => setSelectedOutcome("no")}
                className={`flex-1 py-3 rounded-lg font-['Space_Grotesk'] font-medium transition-all
                     ${
                       selectedOutcome === "no"
                         ? "bg-red-500/20 border-2 border-red-500/50 text-white"
                         : "bg-white/5 border border-white/10 text-white/50"
                     }`}
              >
                No {market.noPrice}¢
              </button>
            </div>

            {/* Amount */}
            <div>
              <div className="text-sm text-white/50 font-['Space_Grotesk'] mb-2">Amount</div>
              <div className="text-4xl text-white font-['Space_Grotesk'] font-bold mb-3">${amount}</div>
              <div className="flex gap-2">
                {[1, 20, 100].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(amount + val)}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 
                         hover:border-emerald-500/30 text-white/70 text-sm font-['Space_Grotesk']
                         transition-all"
                  >
                    +${val}
                  </button>
                ))}
                <button
                  onClick={() => setAmount(1000)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 
                       hover:border-emerald-500/30 text-white/70 text-sm font-['Space_Grotesk']
                       transition-all"
                >
                  Max
                </button>
              </div>
            </div>

            {/* To Win */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-emerald-400 font-['Space_Grotesk'] mb-1">
                To win
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <div className="text-3xl text-emerald-400 font-['Space_Grotesk'] font-bold">${toWin.toFixed(0)}</div>
              <div className="text-xs text-emerald-400/60 font-['Space_Grotesk'] mt-1">
                Avg. Price {(price * 100).toFixed(0)}¢
              </div>
            </div>

            {/* Trade Button */}
            <button
              onClick={handleTrade}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 
                         hover:from-emerald-400 hover:to-teal-400 transition-all
                         text-white font-['Space_Grotesk'] font-bold text-lg
                         shadow-lg shadow-emerald-500/20"
            >
              Trade
            </button>

            <div className="text-xs text-white/30 text-center font-['Space_Grotesk']">
              By trading, you agree to the Terms of Use
            </div>
          </>
        )}

        {/* Confirm State */}
        {orderState === "confirm" && (
          <>
            <div
              className="rounded-xl border backdrop-blur-xl p-6"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                borderColor: "rgba(16, 185, 129, 0.2)",
              }}
            >
              <h3
                className="text-lg font-light mb-4"
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
                }}
              >
                Confirm Order
              </h3>
              <div className="space-y-3 text-sm font-light">
                <div className="flex justify-between">
                  <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Side</span>
                  <span style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                    {side.toUpperCase()} {selectedOutcome.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Amount</span>
                  <span style={{ color: "rgba(255, 255, 255, 0.9)" }}>${amount}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Est. Price</span>
                  <span style={{ color: "rgba(255, 255, 255, 0.9)" }}>{(price * 100).toFixed(0)}¢</span>
                </div>
              </div>
              <div
                className="mt-4 p-3 rounded-lg text-xs font-light"
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  color: "rgba(16, 185, 129, 0.9)",
                }}
              >
                Window ends in 00:18. You'll get one clearing price when the window closes.
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setOrderState("compose")}
                className="flex-1 py-3 rounded-lg font-['Space_Grotesk'] transition-all"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleTrade}
                className="flex-1 py-3 rounded-lg font-['Space_Grotesk'] font-bold transition-all"
                style={{
                  background: "linear-gradient(90deg, rgba(16, 185, 129, 0.8), rgba(20, 184, 166, 0.8))",
                  color: "rgba(255, 255, 255, 0.95)",
                }}
              >
                Confirm
              </button>
            </div>
          </>
        )}

        {/* Sealed State */}
        {orderState === "sealed" && (
          <>
            <div
              className="rounded-xl border backdrop-blur-xl p-8 text-center"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                borderColor: "rgba(16, 185, 129, 0.2)",
              }}
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="8" fill="none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="rgba(16, 185, 129, 0.8)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(windowCountdown / 18) * 251.2} 251.2`}
                    style={{
                      transition: "stroke-dasharray 1s linear",
                      filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))",
                    }}
                  />
                </svg>
                <div
                  className="absolute inset-0 flex items-center justify-center text-3xl font-bold tabular-nums"
                  style={{
                    color: "rgba(16, 185, 129, 0.9)",
                    textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  00:{windowCountdown.toString().padStart(2, "0")}
                </div>
              </div>

              <h3
                className="text-xl font-light mb-2"
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
                }}
              >
                Order Sealed
              </h3>
              <p className="text-sm font-light" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                Your order is private until the window closes. Everyone gets the same price.
              </p>
            </div>
          </>
        )}

        {/* Result State */}
        {orderState === "result" && (
          <>
            <div
              className="rounded-xl border backdrop-blur-xl p-6"
              style={{
                background: "rgba(16, 185, 129, 0.05)",
                borderColor: "rgba(16, 185, 129, 0.3)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <Check className="w-6 h-6" style={{ color: "rgba(16, 185, 129, 0.9)" }} />
                </div>
                <div>
                  <h3
                    className="text-lg font-light"
                    style={{
                      color: "rgba(255, 255, 255, 0.9)",
                      textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
                    }}
                  >
                    Order Filled
                  </h3>
                  <p className="text-sm font-light" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    Filled at {fillPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <div
                className="p-4 rounded-lg mb-4"
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-light" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    Receipt ID
                  </span>
                  <button
                    onClick={handleCopyReceipt}
                    className="flex items-center gap-1 text-xs font-light transition-all hover:text-emerald-400"
                    style={{ color: "rgba(16, 185, 129, 0.7)" }}
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <code
                  className="text-sm font-mono"
                  style={{
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  {receiptId}
                </code>
              </div>

              <div className="space-y-2 text-sm font-light">
                <div className="flex justify-between">
                  <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Amount</span>
                  <span style={{ color: "rgba(255, 255, 255, 0.9)" }}>${amount}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Fill Price</span>
                  <span style={{ color: "rgba(16, 185, 129, 0.9)" }}>{(fillPrice * 100).toFixed(0)}¢</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Shares</span>
                  <span style={{ color: "rgba(255, 255, 255, 0.9)" }}>{(amount / fillPrice).toFixed(0)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-lg font-['Space_Grotesk'] font-bold transition-all"
              style={{
                background: "linear-gradient(90deg, rgba(16, 185, 129, 0.8), rgba(20, 184, 166, 0.8))",
                color: "rgba(255, 255, 255, 0.95)",
              }}
            >
              Place Another Order
            </button>
          </>
        )}
      </div>
    </div>
  )
}
