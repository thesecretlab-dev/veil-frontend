"use client"

import { useState, useEffect } from "react"
import { TriangleLogo } from "./triangle-logo"
import { createClient } from "@/lib/client"

declare global {
  interface Window {
    ethereum?: any
  }
}

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [showWhitelistModal, setShowWhitelistModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const checkIfWalletIsConnected = async () => {
    if (typeof window.ethereum === "undefined") {
      return
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts.length > 0) {
        setIsConnected(true)
        setAddress(formatAddress(accounts[0]))
      }
    } catch (err) {
      console.error("[v0] Error checking wallet connection:", err)
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      setError("Please install MetaMask or another Web3 wallet to connect.")
      setTimeout(() => setError(""), 5000)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("[v0] Requesting wallet connection...")
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setIsConnected(true)
        setAddress(formatAddress(accounts[0]))
        console.log("[v0] Wallet connected:", accounts[0])
      }
    } catch (err: any) {
      console.error("[v0] Error connecting wallet:", err)
      if (err.code === 4001) {
        setError("Connection rejected. Please try again.")
      } else {
        setError("Failed to connect wallet. Please try again.")
      }
      setTimeout(() => setError(""), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const signForWhitelist = async () => {
    if (typeof window.ethereum === "undefined") {
      setError("Wallet not found.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("[v0] Requesting signature for whitelist...")
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      const account = accounts[0]

      const message = `Sign this message to verify your wallet and get whitelisted for VEIL Airdrops.\n\nWallet: ${account}\nTimestamp: ${Date.now()}`

      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, account],
      })

      console.log("[v0] Signature received:", signature)

      console.log("[v0] Attempting to save to Supabase...")
      console.log("[v0] Wallet address:", account)
      console.log("[v0] Signature:", signature)

      const supabase = createClient()
      console.log("[v0] Supabase client created")

      const { data, error: dbError } = await supabase
        .from("whitelist_signups")
        .insert({
          wallet_address: account,
          signature: signature,
          message: message,
        })
        .select()

      console.log("[v0] Supabase response - data:", data)
      console.log("[v0] Supabase response - error:", dbError)

      if (dbError) {
        // If duplicate, that's okay - user already whitelisted
        if (dbError.code === "23505") {
          console.log("[v0] User already whitelisted (duplicate entry)")
          setShowWhitelistModal(false)
          alert("You're already whitelisted for VEIL Airdrops!")
          return
        }
        console.error("[v0] Supabase error:", dbError)
        throw dbError
      }

      console.log("[v0] Successfully saved to Supabase!")
      setShowWhitelistModal(false)
      alert("Successfully signed! You are now whitelisted for VEIL Airdrops.")
    } catch (err: any) {
      console.error("[v0] Error signing message:", err)
      if (err.code === 4001) {
        setError("Signature rejected.")
      } else {
        setError("Failed to sign message. Please try again.")
      }
      setTimeout(() => setError(""), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {!isConnected ? (
        <button
          onClick={connectWallet}
          disabled={isLoading}
          className="px-6 py-2 rounded-lg font-sans text-sm font-medium
            bg-white/5 backdrop-blur-md border border-white/10
            text-white/90 hover:text-white
            hover:bg-white/10 hover:border-emerald-500/30
            transition-all duration-300
            shadow-[0_0_20px_rgba(16,185,129,0.1)]
            hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]
            disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            textShadow: "0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(16,185,129,0.2)",
          }}
        >
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWhitelistModal(true)}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg font-sans text-xs font-medium
              bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20
              text-emerald-400/90 hover:text-emerald-300
              hover:bg-emerald-500/20 hover:border-emerald-500/40
              transition-all duration-300
              shadow-[0_0_15px_rgba(16,185,129,0.15)]
              hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]
              disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              textShadow: "0 0 10px rgba(16,185,129,0.3)",
            }}
          >
            Get Whitelisted
          </button>
          <div
            className="px-4 py-2 rounded-lg font-mono text-xs
            bg-white/5 backdrop-blur-md border border-white/10
            text-white/70"
            style={{
              textShadow: "0 0 10px rgba(255,255,255,0.2)",
            }}
          >
            {address}
          </div>
        </div>
      )}

      {showWhitelistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div
            className="max-w-md w-full p-8 rounded-2xl
            bg-slate-900/85 backdrop-blur-2xl border border-white/10
            shadow-[0_0_80px_rgba(16,185,129,0.15),inset_0_0_60px_rgba(255,255,255,0.02)]
            relative overflow-hidden"
          >
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <TriangleLogo size={40} />
            </div>

            {/* Title */}
            <h3
              className="text-2xl font-sans font-light text-center mb-2 text-white/95 tracking-wide"
              style={{
                textShadow: "0 0 30px rgba(255,255,255,0.4), 0 0 50px rgba(16,185,129,0.3), 0 2px 8px rgba(0,0,0,0.5)",
                filter: "blur(0.3px)",
              }}
            >
              Airdrop Whitelist
            </h3>

            {/* Subtitle */}
            <p
              className="text-center text-sm text-emerald-400/80 mb-6 font-sans font-light tracking-wide"
              style={{
                textShadow: "0 0 15px rgba(16,185,129,0.4)",
                filter: "blur(0.2px)",
              }}
            >
              Join the VEIL community
            </p>

            {/* Description */}
            <p
              className="text-sm text-white/60 mb-6 leading-relaxed text-center font-sans font-light"
              style={{
                textShadow: "0 0 10px rgba(255,255,255,0.2)",
                filter: "blur(0.2px)",
              }}
            >
              Sign a message to verify your wallet and secure your spot for future VEIL token airdrops. This is a
              gasless signature—no transaction fees required.
            </p>

            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-300/90 text-sm text-center">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={signForWhitelist}
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-xl font-sans text-sm font-light tracking-wide
                  bg-emerald-500/15 backdrop-blur-md border border-emerald-500/30
                  text-emerald-300/95 hover:text-emerald-200
                  hover:bg-emerald-500/25 hover:border-emerald-500/50
                  transition-all duration-300
                  shadow-[0_0_30px_rgba(16,185,129,0.2)]
                  hover:shadow-[0_0_50px_rgba(16,185,129,0.35)]
                  disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  textShadow: "0 0 20px rgba(16,185,129,0.5)",
                  filter: "blur(0.2px)",
                }}
              >
                {isLoading ? "Signing..." : "Sign & Verify"}
              </button>
              <button
                onClick={() => setShowWhitelistModal(false)}
                disabled={isLoading}
                className="px-6 py-3 rounded-xl font-sans text-sm font-light tracking-wide
                  bg-white/[0.03] backdrop-blur-md border border-white/10
                  text-white/60 hover:text-white/80
                  hover:bg-white/[0.05] hover:border-white/20
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  textShadow: "0 0 10px rgba(255,255,255,0.2)",
                  filter: "blur(0.2px)",
                }}
              >
                Cancel
              </button>
            </div>

            {/* Info text */}
            <p
              className="text-xs text-white/30 mt-5 text-center font-sans font-light"
              style={{
                textShadow: "0 0 8px rgba(255,255,255,0.15)",
                filter: "blur(0.15px)",
              }}
            >
              Your signature is secure and never leaves your wallet
            </p>
          </div>
        </div>
      )}
    </>
  )
}
