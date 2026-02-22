"use client"

import { useEffect, useMemo, useState } from "react"
import { TriangleLogo } from "./triangle-logo"
import { createClient } from "@/lib/client"

declare global {
  interface Window {
    ethereum?: any
  }
}

type WalletOptionId = "veil" | "metamask" | "coinbase" | "walletconnect"

type WalletOption = {
  id: WalletOptionId
  name: string
  subtitle: string
  status: "ready" | "install" | "coming_soon"
  installUrl?: string
}

const METAMASK_INSTALL_URL = "https://metamask.io/download/"
const COINBASE_WALLET_INSTALL_URL = "https://www.coinbase.com/wallet/downloads"

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [connectedWalletName, setConnectedWalletName] = useState("Wallet")
  const [showWhitelistModal, setShowWhitelistModal] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const walletOptions = useMemo<WalletOption[]>(() => {
    const veilWalletUrl = process.env.NEXT_PUBLIC_VEIL_WALLET_URL || "https://veil.markets/wallet"
    return [
      {
        id: "veil",
        name: "VEIL Wallet",
        subtitle: "Privacy-first MetaMask fork for VEIL",
        status: "install",
        installUrl: veilWalletUrl,
      },
      {
        id: "metamask",
        name: "MetaMask",
        subtitle: "Battle-tested EVM wallet",
        status: "ready",
        installUrl: METAMASK_INSTALL_URL,
      },
      {
        id: "coinbase",
        name: "Coinbase Wallet",
        subtitle: "Use extension or mobile wallet browser",
        status: "ready",
        installUrl: COINBASE_WALLET_INSTALL_URL,
      },
      {
        id: "walletconnect",
        name: "WalletConnect",
        subtitle: "QR flow support rolling out next",
        status: "coming_soon",
      },
    ]
  }, [])

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const detectWalletName = (provider: any) => {
    if (!provider) return "Wallet"
    if (provider.isVeilWallet) return "VEIL Wallet"
    if (provider.isMetaMask) return "MetaMask"
    if (provider.isCoinbaseWallet) return "Coinbase Wallet"
    return "Browser Wallet"
  }

  const getInjectedProvider = (walletId: WalletOptionId | null = null) => {
    if (typeof window.ethereum === "undefined") {
      return null
    }

    const ethereum = window.ethereum
    const providers = Array.isArray(ethereum.providers) ? ethereum.providers : null

    if (!providers || providers.length === 0) {
      return ethereum
    }

    if (walletId === "veil") {
      return providers.find((provider: any) => provider.isVeilWallet) || null
    }
    if (walletId === "metamask") {
      return providers.find((provider: any) => provider.isMetaMask) || null
    }
    if (walletId === "coinbase") {
      return providers.find((provider: any) => provider.isCoinbaseWallet) || null
    }

    return providers[0]
  }

  const checkIfWalletIsConnected = async () => {
    const provider = getInjectedProvider()
    if (!provider) {
      return
    }

    try {
      const accounts = await provider.request({ method: "eth_accounts" })
      if (accounts.length > 0) {
        setIsConnected(true)
        setAddress(formatAddress(accounts[0]))
        setConnectedWalletName(detectWalletName(provider))
      }
    } catch (err) {
      console.error("[v0] Error checking wallet connection:", err)
    }
  }

  const connectWallet = async (wallet: WalletOption) => {
    if (wallet.status === "coming_soon") {
      setError(`${wallet.name} support is coming soon.`)
      setTimeout(() => setError(""), 5000)
      return
    }

    const provider = getInjectedProvider(wallet.id)
    if (!provider) {
      if (wallet.installUrl) {
        window.open(wallet.installUrl, "_blank", "noopener,noreferrer")
      }
      setError(`${wallet.name} was not detected. Install it and try again.`)
      setTimeout(() => setError(""), 5000)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setIsConnected(true)
        setAddress(formatAddress(accounts[0]))
        setConnectedWalletName(wallet.name)
        setShowWalletModal(false)
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
    const provider = getInjectedProvider()
    if (!provider) {
      setError("Wallet not found.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const accounts = await provider.request({ method: "eth_accounts" })
      const account = accounts[0]
      if (!account) {
        setError("Connect a wallet first.")
        setTimeout(() => setError(""), 5000)
        return
      }

      const message = `Sign this message to verify your wallet and get whitelisted for VEIL Airdrops.\n\nWallet: ${account}\nTimestamp: ${Date.now()}`

      const signature = await provider.request({
        method: "personal_sign",
        params: [message, account],
      })

      const supabase = createClient()
      const { error: dbError } = await supabase
        .from("whitelist_signups")
        .insert({
          wallet_address: account,
          signature,
          message,
        })
        .select()

      if (dbError) {
        if (dbError.code === "23505") {
          setShowWhitelistModal(false)
          alert("You're already whitelisted for VEIL Airdrops!")
          return
        }
        throw dbError
      }

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

  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {!isConnected ? (
        <button
          onClick={() => setShowWalletModal(true)}
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
          <span
            className="px-4 py-2 rounded-lg font-sans text-xs font-medium
              bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20
              text-emerald-400/90"
            style={{
              textShadow: "0 0 10px rgba(16,185,129,0.3)",
            }}
          >
            Preview Mode
          </span>
          <div
            className="px-4 py-2 rounded-lg font-mono text-xs
            bg-white/5 backdrop-blur-md border border-white/10
            text-white/70"
            style={{
              textShadow: "0 0 10px rgba(255,255,255,0.2)",
            }}
          >
            {connectedWalletName} | {address}
          </div>
        </div>
      )}

      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div
            className="max-w-lg w-full p-8 rounded-2xl
            bg-slate-900/90 backdrop-blur-2xl border border-white/10
            shadow-[0_0_80px_rgba(16,185,129,0.12),inset_0_0_60px_rgba(255,255,255,0.02)]
            relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="flex justify-center mb-6">
              <TriangleLogo size={36} />
            </div>

            <h3
              className="text-2xl font-sans font-light text-center mb-2 text-white/95 tracking-wide"
              style={{
                textShadow: "0 0 30px rgba(255,255,255,0.4), 0 0 50px rgba(16,185,129,0.25), 0 2px 8px rgba(0,0,0,0.5)",
                filter: "blur(0.3px)",
              }}
            >
              Connect Wallet
            </h3>

            <p
              className="text-center text-sm text-white/60 mb-6 font-sans font-light"
              style={{
                textShadow: "0 0 10px rgba(255,255,255,0.2)",
                filter: "blur(0.2px)",
              }}
            >
              Choose your wallet provider to access VEIL Markets
            </p>

            <div className="space-y-3 mb-5">
              {walletOptions.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => connectWallet(wallet)}
                  disabled={isLoading}
                  className="w-full px-4 py-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06]
                  transition-all duration-300 text-left flex items-center justify-between
                  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div>
                    <div className="text-sm text-white/90 font-medium">{wallet.name}</div>
                    <div className="text-xs text-white/50 mt-1">{wallet.subtitle}</div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-1 rounded-full border ${
                      wallet.status === "coming_soon"
                        ? "text-amber-300/90 border-amber-400/40 bg-amber-500/10"
                        : wallet.status === "install"
                          ? "text-cyan-300/90 border-cyan-400/40 bg-cyan-500/10"
                          : "text-emerald-300/90 border-emerald-400/40 bg-emerald-500/10"
                    }`}
                  >
                    {wallet.status === "coming_soon"
                      ? "Coming Soon"
                      : wallet.status === "install"
                        ? "Install"
                        : "Ready"}
                  </span>
                </button>
              ))}
            </div>

            <p
              className="text-xs text-white/35 text-center mb-5"
              style={{
                textShadow: "0 0 8px rgba(255,255,255,0.15)",
              }}
            >
              Wallet connectivity is preview-only while launch gates remain in progress.
            </p>

            <button
              onClick={() => setShowWalletModal(false)}
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-xl font-sans text-sm font-light tracking-wide
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
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="flex justify-center mb-6">
              <TriangleLogo size={40} />
            </div>

            <h3
              className="text-2xl font-sans font-light text-center mb-2 text-white/95 tracking-wide"
              style={{
                textShadow: "0 0 30px rgba(255,255,255,0.4), 0 0 50px rgba(16,185,129,0.3), 0 2px 8px rgba(0,0,0,0.5)",
                filter: "blur(0.3px)",
              }}
            >
              Airdrop Whitelist
            </h3>

            <p
              className="text-center text-sm text-emerald-400/80 mb-6 font-sans font-light tracking-wide"
              style={{
                textShadow: "0 0 15px rgba(16,185,129,0.4)",
                filter: "blur(0.2px)",
              }}
            >
              Join the VEIL community
            </p>

            <p
              className="text-sm text-white/60 mb-6 leading-relaxed text-center font-sans font-light"
              style={{
                textShadow: "0 0 10px rgba(255,255,255,0.2)",
                filter: "blur(0.2px)",
              }}
            >
              Sign a message to verify your wallet and secure your spot for future VEIL token airdrops. This is a
              gasless signature - no transaction fees required.
            </p>

            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-300/90 text-sm text-center">
                {error}
              </div>
            )}

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
