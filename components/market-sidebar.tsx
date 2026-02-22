"use client"

interface SidebarProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedTimeFilter?: string
  onTimeFilterChange?: (filter: string) => void
}

const timeFilters = [
  { name: "All", count: 144, icon: "▦" },
  { name: "15 Min", count: 2, icon: "⏱" },
  { name: "Hourly", count: 4, icon: "⏰" },
  { name: "Daily", count: 4, icon: "📅" },
  { name: "Weekly", count: 20, icon: "📊" },
  { name: "Monthly", count: 15, icon: "📈" },
  { name: "Pre-Market", count: 31, icon: "🎯" },
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
      className="w-56 overflow-y-auto"
      style={{
        background: "rgba(6, 6, 6, 0.7)",
        borderRight: "1px solid rgba(255, 255, 255, 0.04)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="p-4 space-y-0.5">
        {timeFilters.map((filter) => {
          const isActive = selectedTimeFilter === filter.name
          return (
            <button
              key={filter.name}
              onClick={() => onTimeFilterChange?.(filter.name)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] transition-all duration-500"
              style={{
                borderRadius: "10px",
                background: isActive ? "rgba(16, 185, 129, 0.08)" : "transparent",
                color: isActive ? "rgba(16, 185, 129, 0.85)" : "rgba(255, 255, 255, 0.4)",
                fontFamily: "var(--font-space-grotesk)",
                fontWeight: 300,
              }}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-[11px]">{filter.icon}</span>
                {filter.name}
              </span>
              <span className="text-[11px]" style={{ color: "rgba(255, 255, 255, 0.15)" }}>{filter.count}</span>
            </button>
          )
        })}

        <div className="my-4 h-px" style={{ background: "rgba(255, 255, 255, 0.04)" }} />

        {cryptoCategories.map((cat) => {
          const isActive = selectedCategory === cat.name
          return (
            <button
              key={cat.name}
              onClick={() => onCategoryChange(cat.name)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] transition-all duration-500"
              style={{
                borderRadius: "10px",
                background: isActive ? "rgba(16, 185, 129, 0.08)" : "transparent",
                color: isActive ? "rgba(16, 185, 129, 0.85)" : "rgba(255, 255, 255, 0.4)",
                fontFamily: "var(--font-space-grotesk)",
                fontWeight: 300,
              }}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-[11px]">{cat.icon}</span>
                {cat.name}
              </span>
              <span className="text-[11px]" style={{ color: "rgba(255, 255, 255, 0.15)" }}>{cat.count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
