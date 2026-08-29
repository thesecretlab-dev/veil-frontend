"use client"

import { useCallback, useRef, useState, type KeyboardEvent, type ReactNode } from "react"

const SPRING = "transform 420ms cubic-bezier(0.22, 1, 0.36, 1), height 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease"

/** One GPU highlight under the list — no per-row SVG filters. */
export function IndexList({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null)
  const [hl, setHl] = useState({ y: 0, h: 48, on: false })

  const follow = useCallback((el: EventTarget | null) => {
    const row = el instanceof HTMLElement ? el.closest("[data-index-row]") : null
    const root = box.current
    if (!row || !root) {
      setHl((s) => ({ ...s, on: false }))
      return
    }
    const a = row.getBoundingClientRect()
    const b = root.getBoundingClientRect()
    setHl({ y: a.top - b.top + root.scrollTop, h: a.height, on: true })
  }, [])

  return (
    <div
      ref={box}
      className="relative"
      onMouseMove={(e) => follow(e.target)}
      onMouseLeave={() => setHl((s) => ({ ...s, on: false }))}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 rounded-2xl will-change-transform"
        style={{
          transform: `translate3d(0, ${hl.y}px, 0)`,
          height: hl.h,
          opacity: hl.on ? 1 : 0,
          background: "rgba(16,185,129,0.1)",
          boxShadow: hl.on ? "inset 0 1px 0 rgba(255,255,255,0.06)" : "none",
          transition: SPRING,
        }}
      />
      {children}
    </div>
  )
}

export function IndexRow({ children }: { children: ReactNode }) {
  return <div data-index-row>{children}</div>
}

export function GooeyPills({
  items,
  value,
  onChange,
}: {
  items: string[]
  value: string
  onChange: (v: string) => void
}) {
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = items.indexOf(value)
    if (e.key === "ArrowRight" && i < items.length - 1) onChange(items[i + 1])
    if (e.key === "ArrowLeft" && i > 0) onChange(items[i - 1])
  }

  return (
    <div role="tablist" className="relative flex items-center" onKeyDown={onKey}>
      {items.map((item) => {
        const on = value === item
        return (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(item)}
            className="relative z-[1] whitespace-nowrap px-4 py-1.5 text-[13px]"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: on ? "rgba(16,185,129,0.95)" : "rgba(255,255,255,0.47)",
              transition: "color 280ms ease",
            }}
          >
            {on && (
              <span
                className="absolute inset-0 -z-[1] rounded-full"
                style={{
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.22)",
                }}
              />
            )}
            {item}
          </button>
        )
      })}
    </div>
  )
}
