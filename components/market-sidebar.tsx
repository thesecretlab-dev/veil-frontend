"use client"

interface SidebarProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedTimeFilter?: string
  onTimeFilterChange?: (filter: string) => void
}

const timeFilters = [
  { name: "All", count: 144 },
  { name: "15 Min", count: 2 },
  { name: "Hourly", count: 4 },
  { name: "Daily", count: 4 },
  { name: "Weekly", count: 20 },
  { name: "Monthly", count: 15 },
  { name: "Pre-Market", count: 31 },
]

const cryptoCategories = [
  { name: "Bitcoin", count: 20, icon: "₿" },
  { name: "Ethereum", count: 12, icon: "Ξ" },
  { name: "Solana", count: 10, icon: "◎" },
  { name: "XRP", count: 8, icon: "✕" },
  { name: "Dogecoin", count: 3, icon: "Ð" },
  { name: "Microstrategy", count: 9, icon: "📊" },
]

export function MarketSidebar({
  selectedCategory,
  onCategoryChange,
  selectedTimeFilter = "All",
  onTimeFilterChange,
}: SidebarProps) {
  return (
    <div
      className="w-56 border-r backdrop-blur-xl overflow-y-auto"
      style={{ borderColor: "rgba(255, 255, 255, 0.05)", background: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="p-4 space-y-1">
        {/* Time Filters */}
        {timeFilters.map((filter) => (
          <button
            key={filter.name}
            onClick={() => onTimeFilterChange?.(filter.name)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm"
            style={{
              background: selectedTimeFilter === filter.name ? "rgba(16, 185, 129, 0.1)" : "transparent",
              borderColor: selectedTimeFilter === filter.name ? "rgba(16, 185, 129, 0.3)" : "transparent",
              color: selectedTimeFilter === filter.name ? "rgba(16, 185, 129, 0.95)" : "rgba(255, 255, 255, 0.5)",
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 300,
            }}
          >
            <span className="flex items-center gap-2">
              {filter.name === "All" && <span className="text-xs">▦</span>}
              {filter.name === "15 Min" && <span className="text-xs">⏱</span>}
              {filter.name === "Hourly" && <span className="text-xs">⏰</span>}
              {filter.name === "Daily" && <span className="text-xs">📅</span>}
              {filter.name === "Weekly" && <span className="text-xs">📊</span>}
              {filter.name === "Monthly" && <span className="text-xs">📈</span>}
              {filter.name === "Pre-Market" && <span className="text-xs">🎯</span>}
              {filter.name}
            </span>
            <span style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: "0.75rem" }}>{filter.count}</span>
          </button>
        ))}

        {/* Divider */}
        <div className="h-px my-4" style={{ background: "rgba(255, 255, 255, 0.05)" }} />

        {/* Crypto Categories */}
        {cryptoCategories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onCategoryChange(cat.name)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm"
            style={{
              background: selectedCategory === cat.name ? "rgba(16, 185, 129, 0.1)" : "transparent",
              borderColor: selectedCategory === cat.name ? "rgba(16, 185, 129, 0.3)" : "transparent",
              color: selectedCategory === cat.name ? "rgba(16, 185, 129, 0.95)" : "rgba(255, 255, 255, 0.5)",
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 300,
            }}
          >
            <span className="flex items-center gap-2">
              <span className="text-xs">{cat.icon}</span>
              {cat.name}
            </span>
            <span style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: "0.75rem" }}>{cat.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
