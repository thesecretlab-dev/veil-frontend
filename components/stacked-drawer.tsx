"use client"

import { useCallback, useEffect, useId, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { VEIL_NAV, type VeilNavNode } from "@/lib/veil-sitemap"
import { IndexList, IndexRow } from "@/components/gooey-nav"

const NetworkVisualization = dynamic(
  () => import("@/components/network-visualization").then((m) => m.NetworkVisualization),
  { ssr: false },
)

const SPINE = 48
const PANEL = 420

export function VeilStackedNav() {
  const pathname = usePathname() || "/"
  const hideOverlay =
    pathname === "/app" || pathname.startsWith("/app/market") || pathname.startsWith("/explorer")
  const [open, setOpen] = useState(false)
  const [stack, setStack] = useState<VeilNavNode[]>([VEIL_NAV])
  const [armClose, setArmClose] = useState(false)
  const titleId = useId()

  const close = useCallback(() => {
    setOpen(false)
    setArmClose(false)
    setStack([VEIL_NAV])
    document.body.style.overflow = ""
  }, [])

  const openIndex = useCallback(() => {
    setOpen(true)
    setArmClose(false)
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setArmClose(true))
    })
  }, [])

  useEffect(() => {
    close()
  }, [pathname, close])

  useEffect(() => {
    const onShow = () => close()
    window.addEventListener("pageshow", onShow)
    return () => {
      window.removeEventListener("pageshow", onShow)
      document.body.style.overflow = ""
    }
  }, [close])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return
      if (e.key === "Escape") {
        if (stack.length > 1) setStack((s) => s.slice(0, -1))
        else close()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open, stack.length, close])

  const push = useCallback((node: VeilNavNode) => {
    if (node.children?.length || node.body?.length || node.quote || node.visual) {
      setStack((s) => [...s, node])
      setOpen(true)
    }
  }, [])

  const popTo = useCallback((index: number) => {
    setStack((s) => s.slice(0, index + 1))
  }, [])

  const depth = open ? stack.length : 0
  const spines = Math.max(0, depth - 1) * SPINE
  const top = stack[stack.length - 1] ?? VEIL_NAV

  if (hideOverlay) return null

  return (
    <>
      {open && (
        <button
          id="veil-index-scrim"
          type="button"
          aria-label="Close index"
          className="fixed left-0 right-0 bottom-0 z-[70]"
          onClick={() => {
            if (!armClose) return
            close()
          }}
          style={{
            top: 108,
            background: "rgba(4,6,5,0.62)",
            border: 0,
            animation: "none",
            pointerEvents: armClose ? "auto" : "none",
          }}
        />
      )}

      <aside
        id="veil-index"
        className="fixed top-0 right-0 bottom-0 z-[100] flex overflow-hidden"
        aria-label="Site index"
        style={{
          width: open ? `min(${PANEL + spines}px, calc(100vw - 16px))` : SPINE,
          transition: "width 280ms cubic-bezier(0.22, 1, 0.36, 1)",
          background: "#080908",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          boxShadow: open ? "-24px 0 80px rgba(0,0,0,0.5)" : "none",
          color: "rgba(255,255,255,0.88)",
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          isolation: "isolate",
          contain: "layout paint",
          animation: "none",
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {!open && (
          <div className="h-full flex flex-col items-center justify-between py-6" style={{ width: SPINE }}>
            <button
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation()
                openIndex()
              }}
              onClick={(e) => {
                e.stopPropagation()
                if (!open) openIndex()
              }}
              className="flex-1 w-full flex items-center justify-center group bg-transparent border-0"
              aria-label="Open index"
            >
              <span
                className="select-none"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  fontSize: "11px",
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  color: "#6ee7b7",
                  textShadow: "0 0 8px rgba(110,231,183,0.95), 0 0 22px rgba(52,211,153,0.7)",
                }}
              >
                Index
              </span>
            </button>
            <a
              href="https://thesecretlab.app"
              target="_blank"
              rel="noopener noreferrer"
              className="tsl-rgb pb-2"
              aria-label="THE SECRET LAB"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                fontSize: "8px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              TSL
            </a>
          </div>
        )}

        {open &&
          stack.map((node, index) => {
            if (index === depth - 1) return null
            return (
              <button
                key={`spine-${node.id}-${index}`}
                type="button"
                onClick={() => popTo(index)}
                className="absolute top-0 bottom-0 flex items-center justify-center bg-transparent"
                style={{
                  left: index * SPINE,
                  width: SPINE,
                  zIndex: 10 + index,
                  background: "#070807",
                  border: 0,
                  borderLeft: "1px solid rgba(255,255,255,0.05)",
                }}
                aria-label={`Back to ${node.label}`}
              >
                <span
                  className="select-none"
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    fontSize: "10px",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.31)",
                  }}
                >
                  {node.label}
                </span>
              </button>
            )
          })}

        {open && (
          <div
            className="absolute top-0 bottom-0 flex flex-col"
            style={{
              left: spines,
              width: `min(${PANEL}px, calc(100vw - 16px - ${spines}px))`,
              zIndex: 20,
              background: "#0a0c0b",
              borderLeft: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              className="flex items-center justify-between px-6 pt-7 pb-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                {depth > 1 && (
                  <button
                    type="button"
                    onClick={() => popTo(depth - 2)}
                    className="text-sm bg-transparent border-0"
                    style={{ color: "rgba(255,255,255,0.34)" }}
                    aria-label="Back"
                  >
                    ←
                  </button>
                )}
                <h2
                  id={titleId}
                  className="truncate"
                  style={{
                    fontFamily: "var(--font-instrument-serif)",
                    fontSize: "26px",
                    color: "rgba(255,255,255,0.92)",
                    lineHeight: 1,
                  }}
                >
                  {top.label}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="text-[10px] tracking-[0.2em] uppercase bg-transparent border-0"
                style={{ color: "rgba(255,255,255,0.31)" }}
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {(top.body?.length || top.quote) && (
                <div className="px-1 mb-6 space-y-4">
                  {top.quote && (
                    <blockquote
                      className="pl-4"
                      style={{
                        borderLeft: "1px solid rgba(16,185,129,0.3)",
                        fontFamily: "var(--font-instrument-serif)",
                        fontSize: "1.15rem",
                        lineHeight: 1.5,
                        color: "rgba(16,185,129,0.73)",
                        fontStyle: "italic",
                      }}
                    >
                      {top.quote}
                    </blockquote>
                  )}
                  {top.body?.map((p) => (
                    <p
                      key={p.slice(0, 48)}
                      style={{
                        fontFamily: "var(--font-figtree)",
                        fontSize: "0.95rem",
                        lineHeight: 1.75,
                        fontWeight: 300,
                        color: "rgba(255,255,255,0.45)",
                      }}
                    >
                      {p}
                    </p>
                  ))}
                  {top.href && (
                    <Link
                      href={top.href}
                      className="inline-flex items-center gap-1.5 text-sm tracking-wide mt-2"
                      style={{ color: "rgba(16,185,129,0.73)" }}
                      onClick={close}
                    >
                      Open →
                    </Link>
                  )}
                </div>
              )}
              {top.visual === "network" && (
                <div className="mb-5">
                  <NetworkVisualization compact />
                </div>
              )}

              <IndexList key={top.id}>
                {(top.children || []).map((item) => {
                  const drills = Boolean(item.children?.length || item.body?.length || item.quote || item.visual)
                  const inner = (
                    <>
                      <span className="flex flex-col min-w-0">
                        <span className="text-[16px]" style={{ color: "rgba(255,255,255,0.94)" }}>
                          {item.label}
                        </span>
                        {item.hint && (
                          <span className="mt-0.5 text-[11px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.31)", fontWeight: 300 }}>
                            {item.hint}
                          </span>
                        )}
                      </span>
                      <span style={{ color: "rgba(16,185,129,0.56)" }}>{drills ? "→" : "↗"}</span>
                    </>
                  )
                  const cls = "group relative z-[1] flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3.5 text-left bg-transparent border-0"
                  return (
                    <IndexRow key={item.id}>
                      {drills ? (
                        <button type="button" className={cls} onClick={() => push(item)}>
                          {inner}
                        </button>
                      ) : (
                        <Link
                          href={item.href || "/"}
                          className={cls}
                          onClick={close}
                          {...(item.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {inner}
                        </Link>
                      )}
                    </IndexRow>
                  )
                })}
              </IndexList>
            </div>

            <div className="px-6 py-4 flex items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <a href="https://thesecretlab.app" target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-[0.16em] uppercase" style={{ color: "rgba(255,255,255,0.31)" }}>
                Built by THE SECRET LAB
              </a>
              <a href="https://github.com/thesecretlab-dev" target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-[0.14em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>
                GitHub
              </a>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

export function VeilMenuButton(_props?: { className?: string }) {
  return null
}

export function StackedDrawer(_props: { open?: boolean; onClose?: () => void }) {
  return <VeilStackedNav />
}
