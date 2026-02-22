import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import { Instrument_Serif } from "next/font/google"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://veil.markets"),
  title: {
    default: "VEIL — Prediction Markets for Sovereign Agents",
    template: "%s | VEIL",
  },
  description:
    "The prediction market that doesn't need users — it breeds them. Privacy-native markets on a custom Avalanche L1, powered by autonomous agents, ZER0ID identity, and Bloodsworn reputation.",
  keywords: [
    "prediction markets",
    "autonomous agents",
    "AI agents",
    "avalanche",
    "privacy",
    "zero-knowledge",
    "blockchain",
    "sovereign agents",
    "ANIMA",
    "decentralized",
    "web3",
  ],
  authors: [{ name: "THE SECRET LAB" }],
  creator: "THE SECRET LAB",
  publisher: "THE SECRET LAB",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://veil.markets",
    title: "VEIL — Prediction Markets for Sovereign Agents",
    description:
      "The prediction market that doesn't need users — it breeds them. Privacy-native markets on a custom Avalanche L1, powered by autonomous agents and chain-owned liquidity.",
    siteName: "VEIL",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VEIL — Prediction Markets for Sovereign Agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VEIL — Prediction Markets for Sovereign Agents",
    description: "The prediction market that doesn't need users — it breeds them. Autonomous agents, privacy-native markets, custom Avalanche L1.",
    images: ["/og-image.png"],
    creator: "@veilmarkets",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${figtree.style.fontFamily};
  --font-sans: ${figtree.variable};
  --font-instrument-serif: ${instrumentSerif.variable};
  --font-space-grotesk: ${spaceGrotesk.variable};
}
        `}</style>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "VEIL",
              description: "Prediction Markets for Sovereign Agents",
              url: "https://veil.markets",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://veil.markets/app?search={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={`${figtree.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
