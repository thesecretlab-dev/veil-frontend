export type CategoryType = "Politics" | "Sports" | "Crypto" | "Earnings" | "Tech" | "Culture" | "World" | "Economy"

export interface CategoryColors {
  primary: string
  light: string
  glow: string
  bg: string
  border: string
}

export function getCategoryColors(category: string): CategoryColors {
  const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()

  const colorMap: Record<string, CategoryColors> = {
    Politics: {
      primary: "rgb(59, 130, 246)", // Blue
      light: "rgba(59, 130, 246, 0.7)",
      glow: "rgba(59, 130, 246, 0.3)",
      bg: "rgba(59, 130, 246, 0.1)",
      border: "rgba(59, 130, 246, 0.3)",
    },
    Sports: {
      primary: "rgb(249, 115, 22)", // Orange
      light: "rgba(249, 115, 22, 0.7)",
      glow: "rgba(249, 115, 22, 0.3)",
      bg: "rgba(249, 115, 22, 0.1)",
      border: "rgba(249, 115, 22, 0.3)",
    },
    Crypto: {
      primary: "rgb(245, 158, 11)", // Bitcoin yellow/gold
      light: "rgba(245, 158, 11, 0.7)",
      glow: "rgba(245, 158, 11, 0.3)",
      bg: "rgba(245, 158, 11, 0.1)",
      border: "rgba(245, 158, 11, 0.3)",
    },
    Earnings: {
      primary: "rgb(16, 185, 129)", // Green (emerald)
      light: "rgba(16, 185, 129, 0.7)",
      glow: "rgba(16, 185, 129, 0.3)",
      bg: "rgba(16, 185, 129, 0.1)",
      border: "rgba(16, 185, 129, 0.3)",
    },
    Tech: {
      primary: "rgb(168, 85, 247)", // Purple
      light: "rgba(168, 85, 247, 0.7)",
      glow: "rgba(168, 85, 247, 0.3)",
      bg: "rgba(168, 85, 247, 0.1)",
      border: "rgba(168, 85, 247, 0.3)",
    },
    Culture: {
      primary: "rgb(6, 182, 212)", // Cyan
      light: "rgba(6, 182, 212, 0.7)",
      glow: "rgba(6, 182, 212, 0.3)",
      bg: "rgba(6, 182, 212, 0.1)",
      border: "rgba(6, 182, 212, 0.3)",
    },
    World: {
      primary: "rgb(239, 68, 68)", // Red
      light: "rgba(239, 68, 68, 0.7)",
      glow: "rgba(239, 68, 68, 0.3)",
      bg: "rgba(239, 68, 68, 0.1)",
      border: "rgba(239, 68, 68, 0.3)",
    },
    Economy: {
      primary: "rgb(255, 255, 255)", // White
      light: "rgba(255, 255, 255, 0.7)",
      glow: "rgba(255, 255, 255, 0.3)",
      bg: "rgba(255, 255, 255, 0.05)",
      border: "rgba(255, 255, 255, 0.2)",
    },
  }

  return (
    colorMap[normalizedCategory] || {
      primary: "rgb(16, 185, 129)", // Default to emerald
      light: "rgba(16, 185, 129, 0.7)",
      glow: "rgba(16, 185, 129, 0.3)",
      bg: "rgba(16, 185, 129, 0.1)",
      border: "rgba(16, 185, 129, 0.3)",
    }
  )
}
