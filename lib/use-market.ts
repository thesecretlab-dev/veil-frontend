"use client"

import { useEffect, useState, useRef } from "react"

import type { Market } from "@/lib/market-data"
import { fetchMarketById } from "@/lib/market-api-client"

type UseMarketState = {
  market: Market | null
  isLoading: boolean
}

const POLL_INTERVAL_MS = 10_000 // refresh prices every 10s

export function useMarket(marketId: string): UseMarketState {
  const [market, setMarket] = useState<Market | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    const load = async (isInitial: boolean) => {
      if (isInitial) setIsLoading(true)
      const nextMarket = await fetchMarketById(marketId)
      if (mountedRef.current) {
        setMarket(nextMarket)
        if (isInitial) setIsLoading(false)
      }
    }

    void load(true)

    const interval = setInterval(() => void load(false), POLL_INTERVAL_MS)

    return () => {
      mountedRef.current = false
      clearInterval(interval)
    }
  }, [marketId])

  return { market, isLoading }
}
