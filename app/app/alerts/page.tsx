"use client"

import { useState } from "react"
import { AppShaderBackground } from "@/components/app-shader-background"
import { Bell, Plus, Trash2 } from "lucide-react"

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
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      marketName: "Trump wins 2024",
      type: "price",
      condition: "above",
      value: "65%",
      active: true,
      created: "2025-01-15",
    },
    {
      id: "2",
      marketName: "Bitcoin > $100k",
      type: "price",
      condition: "below",
      value: "40%",
      active: true,
      created: "2025-01-14",
    },
    {
      id: "3",
      marketName: "Lakers win Finals",
      type: "resolution",
      condition: "resolves",
      value: "Any outcome",
      active: false,
      created: "2025-01-10",
    },
  ])

  const [showNewAlert, setShowNewAlert] = useState(false)
  const [newAlert, setNewAlert] = useState({
    marketName: "",
    type: "price" as AlertType,
    condition: "above",
    value: "",
  })

  const handleToggleAlert = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, active: !alert.active } : alert)))
  }

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
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
    setNewAlert({
      marketName: "",
      type: "price",
      condition: "above",
      value: "",
    })
  }

  return (
    <div className="min-h-screen relative">
      <AppShaderBackground />

      <div className="relative z-10 min-h-screen px-8 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Hero */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h1
                className="text-5xl font-light"
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  textShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
                }}
              >
                Alerts
              </h1>
              <button
                onClick={() => setShowNewAlert(!showNewAlert)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-all hover:scale-105"
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  color: "rgba(16, 185, 129, 0.9)",
                }}
              >
                <Plus className="h-4 w-4" />
                New Alert
              </button>
            </div>
            <p
              className="text-lg font-light"
              style={{
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              Get notified when markets hit your target prices or resolve.
            </p>
          </div>

          {/* New Alert Form */}
          {showNewAlert && (
            <div
              className="rounded-xl border backdrop-blur-xl p-6 mb-8"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                borderColor: "rgba(16, 185, 129, 0.2)",
              }}
            >
              <h3
                className="text-lg font-light mb-4"
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
                }}
              >
                Create New Alert
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-light mb-2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    Market
                  </label>
                  <input
                    type="text"
                    value={newAlert.marketName}
                    onChange={(e) => setNewAlert({ ...newAlert, marketName: e.target.value })}
                    placeholder="Enter market name"
                    className="w-full px-4 py-2 rounded-lg text-sm font-light"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-light mb-2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Type
                    </label>
                    <select
                      value={newAlert.type}
                      onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as AlertType })}
                      className="w-full px-4 py-2 rounded-lg text-sm font-light"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      <option value="price">Price</option>
                      <option value="resolution">Resolution</option>
                      <option value="volume">Volume</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-light mb-2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Condition
                    </label>
                    <select
                      value={newAlert.condition}
                      onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg text-sm font-light"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
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
                    <label className="block text-sm font-light mb-2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Value
                    </label>
                    <input
                      type="text"
                      value={newAlert.value}
                      onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
                      placeholder={newAlert.type === "price" ? "65%" : newAlert.type === "volume" ? "$1M" : "Any"}
                      className="w-full px-4 py-2 rounded-lg text-sm font-light"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowNewAlert(false)}
                    className="flex-1 py-2 rounded-lg text-sm font-light transition-all"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAlert}
                    className="flex-1 py-2 rounded-lg text-sm font-light transition-all hover:scale-105"
                    style={{
                      background: "rgba(16, 185, 129, 0.2)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      color: "rgba(16, 185, 129, 0.9)",
                    }}
                  >
                    Create Alert
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Alerts List */}
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div
                className="rounded-xl border backdrop-blur-xl p-12 text-center"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <Bell
                  className="mx-auto mb-4"
                  style={{
                    width: "48px",
                    height: "48px",
                    color: "rgba(255, 255, 255, 0.2)",
                  }}
                />
                <p className="text-lg font-light" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                  No alerts yet. Create one to get started.
                </p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-xl border backdrop-blur-xl p-6 flex items-center justify-between"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    borderColor: alert.active ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => handleToggleAlert(alert.id)}
                      className="w-12 h-12 rounded-lg flex items-center justify-center transition-all"
                      style={{
                        background: alert.active ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.05)",
                        border: `1px solid ${alert.active ? "rgba(16, 185, 129, 0.3)" : "rgba(255, 255, 255, 0.1)"}`,
                      }}
                    >
                      {alert.active ? (
                        <Bell className="w-5 h-5" style={{ color: "rgba(16, 185, 129, 0.9)" }} />
                      ) : (
                        <Bell className="w-5 h-5" style={{ color: "rgba(255, 255, 255, 0.3)" }} />
                      )}
                    </button>

                    <div className="flex-1">
                      <h3
                        className="text-lg font-light mb-1"
                        style={{
                          color: alert.active ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.5)",
                        }}
                      >
                        {alert.marketName}
                      </h3>
                      <div className="flex items-center gap-3 text-sm font-light">
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{
                            background:
                              alert.type === "price"
                                ? "rgba(16, 185, 129, 0.1)"
                                : alert.type === "resolution"
                                  ? "rgba(59, 130, 246, 0.1)"
                                  : "rgba(234, 179, 8, 0.1)",
                            border: `1px solid ${alert.type === "price" ? "rgba(16, 185, 129, 0.2)" : alert.type === "resolution" ? "rgba(59, 130, 246, 0.2)" : "rgba(234, 179, 8, 0.2)"}`,
                            color:
                              alert.type === "price"
                                ? "rgba(16, 185, 129, 0.9)"
                                : alert.type === "resolution"
                                  ? "rgba(59, 130, 246, 0.9)"
                                  : "rgba(234, 179, 8, 0.9)",
                          }}
                        >
                          {alert.type}
                        </span>
                        <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                          {alert.condition} {alert.value}
                        </span>
                        <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>•</span>
                        <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>Created {alert.created}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="p-2 rounded-lg transition-all hover:bg-red-500/10"
                    style={{ color: "rgba(239, 68, 68, 0.7)" }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Settings */}
          <div
            className="rounded-xl border backdrop-blur-xl p-6 mt-8"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              borderColor: "rgba(255, 255, 255, 0.08)",
            }}
          >
            <h3
              className="text-lg font-light mb-4"
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
              }}
            >
              Notification Settings
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-light" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    Email Notifications
                  </div>
                  <div className="text-xs font-light" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                    Receive alerts via email
                  </div>
                </div>
                <button
                  className="w-12 h-6 rounded-full transition-all"
                  style={{
                    background: "rgba(16, 185, 129, 0.3)",
                    border: "1px solid rgba(16, 185, 129, 0.4)",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full transition-all"
                    style={{
                      background: "rgba(16, 185, 129, 0.9)",
                      marginLeft: "auto",
                      marginRight: "2px",
                    }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-light" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    Push Notifications
                  </div>
                  <div className="text-xs font-light" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                    Receive browser push notifications
                  </div>
                </div>
                <button
                  className="w-12 h-6 rounded-full transition-all"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full transition-all"
                    style={{
                      background: "rgba(255, 255, 255, 0.5)",
                      marginLeft: "2px",
                    }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-light" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    Digest Mode
                  </div>
                  <div className="text-xs font-light" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                    Bundle alerts into daily summary
                  </div>
                </div>
                <button
                  className="w-12 h-6 rounded-full transition-all"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full transition-all"
                    style={{
                      background: "rgba(255, 255, 255, 0.5)",
                      marginLeft: "2px",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
