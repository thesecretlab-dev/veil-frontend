"use client"

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts"

interface PortfolioChartProps {
  data: Array<{ date: string; value: number }>
}

export function PortfolioChart({ data }: PortfolioChartProps) {
  const minValue = Math.min(...data.map((d) => d.value))
  const maxValue = Math.max(...data.map((d) => d.value))
  const padding = (maxValue - minValue) * 0.1

  return (
    <div className="relative h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <YAxis domain={[minValue - padding, maxValue + padding]} hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke="rgba(16, 185, 129, 0.6)"
            strokeWidth={1.5}
            dot={false}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Minimal axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
        <span
          className="text-xs"
          style={{
            color: "rgba(255, 255, 255, 0.2)",
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          {data[0]?.date}
        </span>
        <span
          className="text-xs"
          style={{
            color: "rgba(255, 255, 255, 0.2)",
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          {data[data.length - 1]?.date}
        </span>
      </div>
    </div>
  )
}
