"use client"

import type React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send } from "lucide-react"
import { useState, useEffect } from "react"
import { TriangleLogo } from "./triangle-logo"

interface MarketInquiryEvent extends CustomEvent {
  detail: {
    marketTitle: string
    marketCategory: string
  }
}

export function ViolaChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/viola" }),
  })

  useEffect(() => {
    const handleMarketInquiry = (event: Event) => {
      const { marketTitle, marketCategory } = (event as MarketInquiryEvent).detail
      setIsOpen(true)
      // Wait for chat to open, then send the message
      setTimeout(() => {
        sendMessage({
          text: `Tell me about the market: "${marketTitle}" in the ${marketCategory} category. Provide a summary and any recent news or updates.`,
        })
      }, 300)
    }

    window.addEventListener("viola:market-inquiry", handleMarketInquiry)
    return () => window.removeEventListener("viola:market-inquiry", handleMarketInquiry)
  }, [sendMessage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || status === "in_progress") return

    sendMessage({ text: inputValue })
    setInputValue("")
  }

  return (
    <>
      {/* Floating Chat Button - Improved design with proper triangle containment */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 overflow-hidden rounded-2xl border border-emerald-500/20 bg-black/40 px-5 py-3.5 shadow-lg shadow-emerald-500/10 backdrop-blur-xl transition-all hover:border-emerald-500/40 hover:bg-black/60 hover:shadow-emerald-500/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden">
          <div style={{ transform: "scale(0.33)", transformOrigin: "center" }}>
            <TriangleLogo />
          </div>
        </div>
        <span className="font-semibold text-white">Ask Viola</span>
      </motion.button>

      {/* Chat Window - iMessage Style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-3xl bg-[#1C1C1E] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-[#2C2C2E]/95 px-4 py-3 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 p-2 shadow-lg">
                  <div style={{ transform: "scale(0.4)", transformOrigin: "center" }}>
                    <TriangleLogo />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Viola</h3>
                  <p className="text-xs text-white/50">VEIL Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#000000] px-4 py-6">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-4 shadow-lg">
                    <div style={{ transform: "scale(0.6)", transformOrigin: "center" }}>
                      <TriangleLogo />
                    </div>
                  </div>
                  <h4 className="mb-2 text-lg font-semibold text-white">Hi! I'm Viola</h4>
                  <p className="text-sm leading-relaxed text-white/50">
                    Your VEIL AI assistant. Ask me anything about markets, staking, or how VEIL works!
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {messages.map((message, index) => {
                  const isUser = message.role === "user"
                  const showAvatar = !isUser && (index === 0 || messages[index - 1]?.role === "user")

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {!isUser && (
                        <div className={`h-7 w-7 flex-shrink-0 ${showAvatar ? "" : "invisible"}`}>
                          {showAvatar && (
                            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 p-1.5 shadow-md">
                              <div style={{ transform: "scale(0.3)", transformOrigin: "center" }}>
                                <TriangleLogo />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        className={`relative max-w-[75%] rounded-[20px] px-4 py-2.5 shadow-sm ${
                          isUser ? "bg-[#0A84FF] text-white" : "bg-[#3A3A3C] text-white"
                        }`}
                      >
                        {message.parts.map((part, partIndex) => {
                          if (part.type === "text") {
                            return (
                              <p key={partIndex} className="whitespace-pre-wrap text-[15px] leading-[20px]">
                                {part.text}
                              </p>
                            )
                          }
                          return null
                        })}
                      </div>
                    </motion.div>
                  )
                })}

                {status === "in_progress" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
                    <div className="h-7 w-7 flex-shrink-0">
                      <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 p-1.5 shadow-md">
                        <div style={{ transform: "scale(0.3)", transformOrigin: "center" }}>
                          <TriangleLogo />
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[20px] bg-[#3A3A3C] px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <motion.div
                          className="h-2 w-2 rounded-full bg-white/60"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                        />
                        <motion.div
                          className="h-2 w-2 rounded-full bg-white/60"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: 0.2,
                          }}
                        />
                        <motion.div
                          className="h-2 w-2 rounded-full bg-white/60"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: 0.4,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="border-t border-white/10 bg-[#1C1C1E] p-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="iMessage"
                  disabled={status === "in_progress"}
                  className="flex-1 rounded-full border border-white/20 bg-[#3A3A3C] px-4 py-2 text-[15px] text-white placeholder-white/30 transition-colors focus:border-[#0A84FF] focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || status === "in_progress"}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A84FF] text-white transition-all hover:bg-[#0A84FF]/90 disabled:opacity-40 disabled:hover:bg-[#0A84FF]"
                >
                  <Send className="h-4 w-4" fill="currentColor" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
