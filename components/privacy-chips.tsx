"use client"

import { Check } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PrivacyChipsProps {
  delayMinutes?: number
  crowdMet?: boolean
  fairPrice?: boolean
  size?: "sm" | "md"
}

export function PrivacyChips({ delayMinutes = 5, crowdMet = true, fairPrice = true, size = "sm" }: PrivacyChipsProps) {
  const chipClass =
    size === "sm"
      ? "px-2 py-0.5 text-[10px] uppercase tracking-wide"
      : "px-2.5 py-1 text-[11px] uppercase tracking-wide"

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Delay chip with tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`${chipClass} rounded-full font-light backdrop-blur-sm transition-all hover:scale-105 cursor-help`}
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                color: "rgba(16, 185, 129, 0.8)",
              }}
            >
              Delay {delayMinutes}m
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="bg-black/95 border border-emerald-500/20 text-emerald-100 backdrop-blur-xl"
          >
            <p className="text-xs">Prices delayed {delayMinutes} minutes to prevent front-running</p>
          </TooltipContent>
        </Tooltip>

        {/* Crowd chip with tooltip */}
        {crowdMet && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`${chipClass} rounded-full font-light backdrop-blur-sm transition-all hover:scale-105 flex items-center gap-1 cursor-help`}
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  color: "rgba(16, 185, 129, 0.8)",
                }}
              >
                Crowd <Check className="h-2.5 w-2.5" />
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-black/95 border border-emerald-500/20 text-emerald-100 backdrop-blur-xl"
            >
              <p className="text-xs">Minimum crowd threshold met for fair pricing</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Fair-Price chip with tooltip */}
        {fairPrice && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`${chipClass} rounded-full font-light backdrop-blur-sm transition-all hover:scale-105 cursor-help`}
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  color: "rgba(16, 185, 129, 0.8)",
                }}
              >
                Fair-Price
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-black/95 border border-emerald-500/20 text-emerald-100 backdrop-blur-xl"
            >
              <p className="text-xs">Single clearing price for all orders in the window</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
