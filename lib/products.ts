export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  delay: string
  features: string[]
}

export const INSIGHTS_PRODUCTS: Product[] = [
  {
    id: "insights-standard",
    name: "Standard",
    description: "Free tier with 10-15 minute delayed data",
    priceInCents: 0,
    delay: "10-15m",
    features: ["50k calls/month", "Aggregated data", "Email support"],
  },
  {
    id: "insights-enterprise",
    name: "Enterprise",
    description: "Premium tier with 1-5 minute delayed data",
    priceInCents: 49900, // $499/mo
    delay: "1-5m",
    features: ["500k calls/month", "Priority support", "Custom integrations"],
  },
  {
    id: "insights-research",
    name: "Research",
    description: "Historical data and research reports",
    priceInCents: 9900, // $99/mo
    delay: "Monthly",
    features: ["Historical data", "CSV exports", "Research reports"],
  },
]
