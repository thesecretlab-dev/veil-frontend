"use client"

import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface InfoTooltipProps {
  content: string
  side?: "top" | "right" | "bottom" | "left"
}

export function InfoTooltip({ content, side = "top" }: InfoTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="inline-flex items-center justify-center rounded-full p-0.5 transition-colors hover:bg-white/10"
            onClick={(e) => e.preventDefault()}
          >
            <Info className="h-3.5 w-3.5" style={{ color: "rgba(255, 255, 255, 0.4)" }} />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className="max-w-xs text-xs backdrop-blur-xl"
          style={{
            background: "rgba(0, 0, 0, 0.95)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "rgba(255, 255, 255, 0.9)",
          }}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
