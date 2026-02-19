export interface Market {
  id: number
  title: string
  category: string
  type: "binary" | "sports" | "categorical"
  yesPrice: number
  noPrice: number
  volume: string
  endDate: string
  image: string
  // Detailed view data
  details?: {
    description?: string
    // For sports markets
    sport?: {
      status: "LIVE" | "UPCOMING" | "FINAL"
      quarter?: string
      time?: string
      score?: { home: number; away: number }
      teams?: {
        home: { name: string; abbr: string; record?: string }
        away: { name: string; abbr: string; record?: string }
      }
      spreads?: { home: number; homePrice: number; away: number; awayPrice: number }
      totals?: { over: number; overPrice: number; under: number; underPrice: number }
    }
    // For binary markets
    outcomes?: {
      yes: { label: string; price: number }
      no: { label: string; price: number }
    }
    orderBook?: Array<{
      price: string
      shares: number
      total: string
      type: "sell" | "buy" | "ask" | "bid" | "spread"
    }>
  }
}

export const MARKETS: Market[] = [
  {
    id: 1,
    title: "Will Bitcoin reach $150k by end of 2025?",
    category: "Crypto",
    type: "binary",
    yesPrice: 67,
    noPrice: 33,
    volume: "$2.4m",
    endDate: "Dec 31, 2025",
    image: "🪙",
    details: {
      description:
        "This market resolves YES if Bitcoin (BTC) reaches or exceeds $150,000 USD at any point before December 31, 2025, 11:59 PM ET.",
      outcomes: {
        yes: { label: "Yes", price: 0.67 },
        no: { label: "No", price: 0.33 },
      },
      orderBook: [
        { price: "69¢", shares: 1250, total: "$862.50", type: "sell" },
        { price: "68¢", shares: 890, total: "$605.20", type: "sell" },
        { price: "67¢", shares: 15420, total: "$10,331.40", type: "ask" },
        { price: "66¢", shares: 0, total: "$0", type: "spread" },
        { price: "34¢", shares: 2100, total: "$714.00", type: "bid" },
        { price: "33¢", shares: 1850, total: "$610.50", type: "buy" },
        { price: "32¢", shares: 920, total: "$294.40", type: "buy" },
      ],
    },
  },
  {
    id: 2,
    title: "US Presidential Election 2024 Winner",
    category: "Politics",
    type: "binary",
    yesPrice: 52,
    noPrice: 48,
    volume: "$8.1m",
    endDate: "Nov 5, 2024",
    image: "🗳️",
    details: {
      description: "This market resolves based on who wins the 2024 US Presidential Election.",
      outcomes: {
        yes: { label: "Democrat", price: 0.52 },
        no: { label: "Republican", price: 0.48 },
      },
      orderBook: [
        { price: "54¢", shares: 8920, total: "$4,816.80", type: "sell" },
        { price: "53¢", shares: 12400, total: "$6,572.00", type: "sell" },
        { price: "52¢", shares: 45200, total: "$23,504.00", type: "ask" },
        { price: "51¢", shares: 0, total: "$0", type: "spread" },
        { price: "49¢", shares: 38100, total: "$18,669.00", type: "bid" },
        { price: "48¢", shares: 15600, total: "$7,488.00", type: "buy" },
        { price: "47¢", shares: 9200, total: "$4,324.00", type: "buy" },
      ],
    },
  },
  {
    id: 3,
    title: "Will AI achieve AGI by 2026?",
    category: "Tech",
    type: "binary",
    yesPrice: 23,
    noPrice: 77,
    volume: "$1.2m",
    endDate: "Dec 31, 2026",
    image: "🤖",
    details: {
      description:
        "This market resolves YES if a major AI lab announces achieving Artificial General Intelligence (AGI) by December 31, 2026.",
      outcomes: {
        yes: { label: "Yes", price: 0.23 },
        no: { label: "No", price: 0.77 },
      },
      orderBook: [
        { price: "25¢", shares: 2400, total: "$600.00", type: "sell" },
        { price: "24¢", shares: 1850, total: "$444.00", type: "sell" },
        { price: "23¢", shares: 8920, total: "$2,051.60", type: "ask" },
        { price: "22¢", shares: 0, total: "$0", type: "spread" },
        { price: "78¢", shares: 5200, total: "$4,056.00", type: "bid" },
        { price: "77¢", shares: 12400, total: "$9,548.00", type: "buy" },
        { price: "76¢", shares: 3100, total: "$2,356.00", type: "buy" },
      ],
    },
  },
  {
    id: 4,
    title: "Super Bowl LIX Winner: 49ers",
    category: "Sports",
    type: "sports",
    yesPrice: 41,
    noPrice: 59,
    volume: "$3.5m",
    endDate: "Feb 9, 2025",
    image: "🏈",
    details: {
      description: "Will the San Francisco 49ers win Super Bowl LIX?",
      sport: {
        status: "UPCOMING",
        teams: {
          home: { name: "49ers", abbr: "SF", record: "4-1" },
          away: { name: "TBD", abbr: "TBD", record: "" },
        },
      },
      outcomes: {
        yes: { label: "49ers Win", price: 0.41 },
        no: { label: "49ers Don't Win", price: 0.59 },
      },
      orderBook: [
        { price: "43¢", shares: 4200, total: "$1,806.00", type: "sell" },
        { price: "42¢", shares: 2890, total: "$1,213.80", type: "sell" },
        { price: "41¢", shares: 18500, total: "$7,585.00", type: "ask" },
        { price: "40¢", shares: 0, total: "$0", type: "spread" },
        { price: "60¢", shares: 12400, total: "$7,440.00", type: "bid" },
        { price: "59¢", shares: 8920, total: "$5,262.80", type: "buy" },
        { price: "58¢", shares: 5100, total: "$2,958.00", type: "buy" },
      ],
    },
  },
  {
    id: 5,
    title: "Ethereum to flip Bitcoin by market cap?",
    category: "Crypto",
    type: "binary",
    yesPrice: 15,
    noPrice: 85,
    volume: "$890k",
    endDate: "Dec 31, 2025",
    image: "⟠",
    details: {
      description:
        "This market resolves YES if Ethereum's market cap exceeds Bitcoin's market cap at any point before December 31, 2025.",
      outcomes: {
        yes: { label: "Yes", price: 0.15 },
        no: { label: "No", price: 0.85 },
      },
      orderBook: [
        { price: "17¢", shares: 1200, total: "$204.00", type: "sell" },
        { price: "16¢", shares: 890, total: "$142.40", type: "sell" },
        { price: "15¢", shares: 6420, total: "$963.00", type: "ask" },
        { price: "14¢", shares: 0, total: "$0", type: "spread" },
        { price: "86¢", shares: 3200, total: "$2,752.00", type: "bid" },
        { price: "85¢", shares: 8100, total: "$6,885.00", type: "buy" },
        { price: "84¢", shares: 2400, total: "$2,016.00", type: "buy" },
      ],
    },
  },
  {
    id: 6,
    title: "Will there be a recession in 2025?",
    category: "Economy",
    type: "binary",
    yesPrice: 38,
    noPrice: 62,
    volume: "$1.8m",
    endDate: "Dec 31, 2025",
    image: "📉",
    details: {
      description:
        "This market resolves YES if the NBER officially declares a recession occurring at any point during 2025.",
      outcomes: {
        yes: { label: "Yes", price: 0.38 },
        no: { label: "No", price: 0.62 },
      },
      orderBook: [
        { price: "40¢", shares: 5200, total: "$2,080.00", type: "sell" },
        { price: "39¢", shares: 3100, total: "$1,209.00", type: "sell" },
        { price: "38¢", shares: 22400, total: "$8,512.00", type: "ask" },
        { price: "37¢", shares: 0, total: "$0", type: "spread" },
        { price: "63¢", shares: 18200, total: "$11,466.00", type: "bid" },
        { price: "62¢", shares: 12800, total: "$7,936.00", type: "buy" },
        { price: "61¢", shares: 6400, total: "$3,904.00", type: "buy" },
      ],
    },
  },
  {
    id: 7,
    title: "SpaceX Mars landing by 2026?",
    category: "Tech",
    type: "binary",
    yesPrice: 12,
    noPrice: 88,
    volume: "$2.1m",
    endDate: "Dec 31, 2026",
    image: "🚀",
    details: {
      description: "This market resolves YES if SpaceX successfully lands a spacecraft on Mars by December 31, 2026.",
      outcomes: {
        yes: { label: "Yes", price: 0.12 },
        no: { label: "No", price: 0.88 },
      },
      orderBook: [
        { price: "14¢", shares: 1800, total: "$252.00", type: "sell" },
        { price: "13¢", shares: 1200, total: "$156.00", type: "sell" },
        { price: "12¢", shares: 9200, total: "$1,104.00", type: "ask" },
        { price: "11¢", shares: 0, total: "$0", type: "spread" },
        { price: "89¢", shares: 6400, total: "$5,696.00", type: "bid" },
        { price: "88¢", shares: 14200, total: "$12,496.00", type: "buy" },
        { price: "87¢", shares: 4800, total: "$4,176.00", type: "buy" },
      ],
    },
  },
  {
    id: 8,
    title: "Lakers win NBA Championship 2025",
    category: "Sports",
    type: "sports",
    yesPrice: 28,
    noPrice: 72,
    volume: "$1.4m",
    endDate: "Jun 30, 2025",
    image: "🏀",
    details: {
      description: "Will the Los Angeles Lakers win the 2024-2025 NBA Championship?",
      sport: {
        status: "UPCOMING",
        teams: {
          home: { name: "Lakers", abbr: "LAL", record: "3-2" },
          away: { name: "TBD", abbr: "TBD", record: "" },
        },
      },
      outcomes: {
        yes: { label: "Lakers Win", price: 0.28 },
        no: { label: "Lakers Don't Win", price: 0.72 },
      },
      orderBook: [
        { price: "30¢", shares: 3200, total: "$960.00", type: "sell" },
        { price: "29¢", shares: 2100, total: "$609.00", type: "sell" },
        { price: "28¢", shares: 12800, total: "$3,584.00", type: "ask" },
        { price: "27¢", shares: 0, total: "$0", type: "spread" },
        { price: "73¢", shares: 9200, total: "$6,716.00", type: "bid" },
        { price: "72¢", shares: 15400, total: "$11,088.00", type: "buy" },
        { price: "71¢", shares: 6800, total: "$4,828.00", type: "buy" },
      ],
    },
  },
  {
    id: 9,
    title: "Will Apple release AR glasses in 2025?",
    category: "Tech",
    type: "binary",
    yesPrice: 34,
    noPrice: 66,
    volume: "$1.6m",
    endDate: "Dec 31, 2025",
    image: "🥽",
  },
  {
    id: 10,
    title: "Trump wins Republican nomination 2024",
    category: "Politics",
    type: "binary",
    yesPrice: 89,
    noPrice: 11,
    volume: "$5.2m",
    endDate: "Jul 15, 2024",
    image: "🎯",
  },
  {
    id: 11,
    title: "Solana above $200 by end of Q2 2025?",
    category: "Crypto",
    type: "binary",
    yesPrice: 56,
    noPrice: 44,
    volume: "$980k",
    endDate: "Jun 30, 2025",
    image: "◎",
  },
  {
    id: 12,
    title: "Chiefs win Super Bowl LIX",
    category: "Sports",
    type: "sports",
    yesPrice: 38,
    noPrice: 62,
    volume: "$4.1m",
    endDate: "Feb 9, 2025",
    image: "🏈",
  },
  {
    id: 13,
    title: "Fed cuts rates 3+ times in 2025?",
    category: "Economy",
    type: "binary",
    yesPrice: 45,
    noPrice: 55,
    volume: "$2.3m",
    endDate: "Dec 31, 2025",
    image: "💵",
  },
  {
    id: 14,
    title: "Taylor Swift announces new album in 2025?",
    category: "Culture",
    type: "binary",
    yesPrice: 72,
    noPrice: 28,
    volume: "$890k",
    endDate: "Dec 31, 2025",
    image: "🎵",
  },
  {
    id: 15,
    title: "China invades Taiwan by 2026?",
    category: "World",
    type: "binary",
    yesPrice: 8,
    noPrice: 92,
    volume: "$3.4m",
    endDate: "Dec 31, 2026",
    image: "🌏",
  },
  {
    id: 16,
    title: "OpenAI GPT-5 released in 2025?",
    category: "Tech",
    type: "binary",
    yesPrice: 61,
    noPrice: 39,
    volume: "$2.8m",
    endDate: "Dec 31, 2025",
    image: "🧠",
  },
  {
    id: 17,
    title: "Biden approval rating above 50% by Nov 2024?",
    category: "Politics",
    type: "binary",
    yesPrice: 19,
    noPrice: 81,
    volume: "$1.5m",
    endDate: "Nov 1, 2024",
    image: "📊",
  },
  {
    id: 18,
    title: "XRP wins SEC lawsuit appeal?",
    category: "Crypto",
    type: "binary",
    yesPrice: 42,
    noPrice: 58,
    volume: "$1.1m",
    endDate: "Jun 30, 2025",
    image: "💎",
  },
  {
    id: 19,
    title: "Celtics repeat as NBA Champions 2025?",
    category: "Sports",
    type: "sports",
    yesPrice: 35,
    noPrice: 65,
    volume: "$1.9m",
    endDate: "Jun 30, 2025",
    image: "🏀",
  },
  {
    id: 20,
    title: "S&P 500 above 6000 by end of 2025?",
    category: "Economy",
    type: "binary",
    yesPrice: 58,
    noPrice: 42,
    volume: "$3.7m",
    endDate: "Dec 31, 2025",
    image: "📈",
  },
  {
    id: 21,
    title: "Barbie 2 announced in 2025?",
    category: "Culture",
    type: "binary",
    yesPrice: 67,
    noPrice: 33,
    volume: "$720k",
    endDate: "Dec 31, 2025",
    image: "💗",
  },
  {
    id: 22,
    title: "Russia-Ukraine war ends in 2025?",
    category: "World",
    type: "binary",
    yesPrice: 31,
    noPrice: 69,
    volume: "$4.2m",
    endDate: "Dec 31, 2025",
    image: "🕊️",
  },
  {
    id: 23,
    title: "Tesla Cybertruck sales exceed 100k in 2025?",
    category: "Tech",
    type: "binary",
    yesPrice: 48,
    noPrice: 52,
    volume: "$1.3m",
    endDate: "Dec 31, 2025",
    image: "🚗",
  },
  {
    id: 24,
    title: "RFK Jr. polls above 15% by Nov 2024?",
    category: "Politics",
    type: "binary",
    yesPrice: 12,
    noPrice: 88,
    volume: "$980k",
    endDate: "Nov 1, 2024",
    image: "🗳️",
  },
  {
    id: 25,
    title: "Dogecoin above $1 by end of 2025?",
    category: "Crypto",
    type: "binary",
    yesPrice: 29,
    noPrice: 71,
    volume: "$1.8m",
    endDate: "Dec 31, 2025",
    image: "🐕",
  },
  {
    id: 26,
    title: "Yankees win World Series 2025?",
    category: "Sports",
    type: "sports",
    yesPrice: 22,
    noPrice: 78,
    volume: "$2.1m",
    endDate: "Oct 31, 2025",
    image: "⚾",
  },
  {
    id: 27,
    title: "US unemployment above 5% by end of 2025?",
    category: "Economy",
    type: "binary",
    yesPrice: 33,
    noPrice: 67,
    volume: "$1.4m",
    endDate: "Dec 31, 2025",
    image: "💼",
  },
  {
    id: 28,
    title: "GTA 6 releases in 2025?",
    category: "Culture",
    type: "binary",
    yesPrice: 81,
    noPrice: 19,
    volume: "$2.6m",
    endDate: "Dec 31, 2025",
    image: "🎮",
  },
  {
    id: 29,
    title: "Israel-Palestine ceasefire by mid-2025?",
    category: "World",
    type: "binary",
    yesPrice: 44,
    noPrice: 56,
    volume: "$2.9m",
    endDate: "Jun 30, 2025",
    image: "🕊️",
  },
  {
    id: 30,
    title: "Neuralink human trials expand to 100+ patients?",
    category: "Tech",
    type: "binary",
    yesPrice: 53,
    noPrice: 47,
    volume: "$1.7m",
    endDate: "Dec 31, 2025",
    image: "🧬",
  },
]

export function getMarketById(id: number): Market | undefined {
  return MARKETS.find((m) => m.id === id)
}
