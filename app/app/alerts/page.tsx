"use client"

import { VeilFooter, VeilHeader } from '@/components/brand'

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Bell, Plus, Trash2 } from "lucide-react"

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  )
}

type AlertType = "price" | "resolution" | "volume"

interface Alert {
  id: string
  marketName: string
  type: AlertType
  condition: string
  value: string
  active: boolean
  created: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("veil.local.alerts")
      if (raw) setAlerts(JSON.parse(raw) as Alert[])
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem("veil.local.alerts", JSON.stringify(alerts))
    } catch {
      /* ignore */
    }
  }, [alerts, hydrated])

  const [showNewAlert, setShowNewAlert] = useState(false)
  const [newAlert, setNewAlert] = useState({ marketName: "", type: "price" as AlertType, condition: "above", value: "" })

  const handleToggleAlert = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, active: !a.active } : a)))
  }

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id))
  }

  const handleCreateAlert = () => {
    if (!newAlert.marketName || !newAlert.value) return
    const alert: Alert = {
      id: Date.now().toString(),
      marketName: newAlert.marketName,
      type: newAlert.type,
      condition: newAlert.condition,
      value: newAlert.value,
      active: true,
      created: new Date().toISOString().split("T")[0],
    }
    setAlerts([alert, ...alerts])
    setShowNewAlert(false)
    setNewAlert({ marketName: "", type: "price", condition: "above", value: "" })
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.9)",
    fontFamily: "var(--font-space-grotesk)",
    fontSize: "0.9rem",
  }

  return (
    <div className="relative min-h-screen" style={{ background: "#060606" }}>
      <VeilHeader />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-8 pt-28 pb-32">
        {/* Hero */}
        <ScrollReveal>
          <div className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="mb-6 inline-block text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.67)" }}>
                  01 — Notifications
                </span>
                <h1 className="text-6xl leading-[1.05]" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)", letterSpacing: "-0.03em" }}>
                  Alerts
                </h1>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowNewAlert(!showNewAlert)}
                className="flex items-center gap-2 rounded-full px-6 py-3 text-xs tracking-[0.1em] uppercase transition-all"
                style={{
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  color: "rgba(16,185,129,0.9)",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                <Plus className="h-4 w-4" />
                New Alert
              </motion.button>
            </div>
            <p className="max-w-lg text-lg leading-relaxed" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)" }}>
              Browser-only on this node. Alerts persist in localStorage — there is no push rail yet.
            </p>
          </div>
        </ScrollReveal>

        {/* New Alert Form */}
        <AnimatePresence>
          {showNewAlert && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <ScrollReveal>
                <div className="mb-6">
                  <span className="mb-4 inline-block text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.67)" }}>
                    02 — Create
                  </span>
                </div>
                <div
                  className="mb-10 rounded-[20px] p-8"
                  style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(16,185,129,0.12)" }}
                >
                  <h3 className="mb-6 text-xl" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}>
                    Create New Alert
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-xs tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.39)" }}>
                        Market
                      </label>
                      <input
                        type="text"
                        value={newAlert.marketName}
                        onChange={(e) => setNewAlert({ ...newAlert, marketName: e.target.value })}
                        placeholder="Enter market name"
                        className="w-full rounded-[12px] px-5 py-3 outline-none transition-all focus:border-emerald-500/30"
                        style={inputStyle}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="mb-2 block text-xs tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.39)" }}>
                          Type
                        </label>
                        <select
                          value={newAlert.type}
                          onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as AlertType })}
                          className="w-full rounded-[12px] px-5 py-3 outline-none"
                          style={inputStyle}
                        >
                          <option value="price">Price</option>
                          <option value="resolution">Resolution</option>
                          <option value="volume">Volume</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-xs tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.39)" }}>
                          Condition
                        </label>
                        <select
                          value={newAlert.condition}
                          onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                          className="w-full rounded-[12px] px-5 py-3 outline-none"
                          style={inputStyle}
                        >
                          {newAlert.type === "price" && (
                            <>
                              <option value="above">Above</option>
                              <option value="below">Below</option>
                            </>
                          )}
                          {newAlert.type === "resolution" && <option value="resolves">Resolves</option>}
                          {newAlert.type === "volume" && (
                            <>
                              <option value="above">Above</option>
                              <option value="below">Below</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-xs tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.39)" }}>
                          Value
                        </label>
                        <input
                          type="text"
                          value={newAlert.value}
                          onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
                          placeholder={newAlert.type === "price" ? "65%" : newAlert.type === "volume" ? "$1M" : "Any"}
                          className="w-full rounded-[12px] px-5 py-3 outline-none transition-all focus:border-emerald-500/30"
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowNewAlert(false)}
                        className="flex-1 rounded-[12px] py-3 text-sm transition-all"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.56)", fontFamily: "var(--font-space-grotesk)" }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreateAlert}
                        className="flex-1 rounded-[12px] py-3 text-sm transition-all"
                        style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "rgba(16,185,129,0.9)", fontFamily: "var(--font-space-grotesk)" }}
                      >
                        Create Alert
                      </motion.button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alerts List */}
        <ScrollReveal delay={0.15}>
          <div className="mb-6">
            <span className="mb-4 inline-block text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.67)" }}>
              {showNewAlert ? "03" : "02"} — Active Alerts
            </span>
          </div>
          <div className="space-y-4">
            <AnimatePresence>
              {alerts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-[20px] p-16 text-center"
                  style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <Bell className="mx-auto mb-5" style={{ width: 48, height: 48, color: "rgba(255,255,255,0.12)" }} />
                  <p className="text-lg" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.39)" }}>
                    No alerts yet. Create one to get started.
                  </p>
                </motion.div>
              ) : (
                alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-between rounded-[20px] p-6"
                    style={{
                      background: "rgba(255,255,255,0.015)",
                      border: `1px solid ${alert.active ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)"}`,
                    }}
                  >
                    <div className="flex flex-1 items-center gap-5">
                      <button
                        onClick={() => handleToggleAlert(alert.id)}
                        className="flex h-12 w-12 items-center justify-center rounded-[12px] transition-all"
                        style={{
                          background: alert.active ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${alert.active ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)"}`,
                        }}
                      >
                        <Bell className="h-5 w-5" style={{ color: alert.active ? "rgba(16,185,129,0.95)" : "rgba(255,255,255,0.22)" }} />
                      </button>

                      <div className="flex-1">
                        <h3
                          className="mb-1 text-lg"
                          style={{
                            fontFamily: "var(--font-instrument-serif)",
                            color: alert.active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
                          }}
                        >
                          {alert.marketName}
                        </h3>
                        <div className="flex items-center gap-3 text-sm">
                          <span
                            className="rounded-full px-3 py-0.5 text-xs"
                            style={{
                              background: alert.type === "price" ? "rgba(16,185,129,0.08)" : alert.type === "resolution" ? "rgba(59,130,246,0.08)" : "rgba(234,179,8,0.08)",
                              border: `1px solid ${alert.type === "price" ? "rgba(16,185,129,0.15)" : alert.type === "resolution" ? "rgba(59,130,246,0.15)" : "rgba(234,179,8,0.15)"}`,
                              color: alert.type === "price" ? "rgba(16,185,129,0.95)" : alert.type === "resolution" ? "rgba(59,130,246,0.85)" : "rgba(234,179,8,0.85)",
                              fontFamily: "var(--font-space-grotesk)",
                            }}
                          >
                            {alert.type}
                          </span>
                          <span style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.34)" }}>
                            {alert.condition} {alert.value}
                          </span>
                          <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
                          <span style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.22)", fontSize: "0.85rem" }}>
                            {alert.created}
                          </span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="rounded-[10px] p-3 transition-all hover:bg-red-500/10"
                      style={{ color: "rgba(239,68,68,0.5)" }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>

        {/* Settings */}
        <ScrollReveal delay={0.25}>
          <div className="mb-6 mt-14">
            <span className="mb-4 inline-block text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.67)" }}>
              {showNewAlert ? "04" : "03"} — Settings
            </span>
          </div>
          <div
            className="rounded-[20px] p-8"
            style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            <h3 className="mb-8 text-xl" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}>
              Notification Settings
            </h3>

            <div className="space-y-6">
              {[
                { label: "Email Notifications", desc: "Receive alerts via email", on: true },
                { label: "Push Notifications", desc: "Receive browser push notifications", on: false },
                { label: "Digest Mode", desc: "Bundle alerts into daily summary", on: false },
              ].map((setting) => (
                <div key={setting.label} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.78)" }}>
                      {setting.label}
                    </div>
                    <div className="mt-0.5 text-xs" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.34)" }}>
                      {setting.desc}
                    </div>
                  </div>
                  <button
                    className="relative h-7 w-12 rounded-full transition-all"
                    style={{
                      background: setting.on ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${setting.on ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    <div
                      className="absolute top-[3px] h-5 w-5 rounded-full transition-all"
                      style={{
                        background: setting.on ? "rgba(16,185,129,0.9)" : "rgba(255,255,255,0.35)",
                        left: setting.on ? "calc(100% - 23px)" : "3px",
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      <VeilFooter />
    </div>
  )
}
