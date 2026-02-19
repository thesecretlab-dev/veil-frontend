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
    default: "VEIL - Privacy-First Prediction Markets",
    template: "%s | VEIL",
  },
  description:
    "Trade on future events with complete privacy. VEIL combines zero-knowledge proofs with prediction markets for anonymous, trustless trading.",
  keywords: [
    "prediction markets",
    "privacy",
    "zero-knowledge",
    "blockchain",
    "anonymous trading",
    "decentralized",
    "crypto",
    "web3",
  ],
  authors: [{ name: "VEIL Protocol" }],
  creator: "VEIL Protocol",
  publisher: "VEIL Protocol",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://veil.markets",
    title: "VEIL - Privacy-First Prediction Markets",
    description:
      "Trade on future events with complete privacy. VEIL combines zero-knowledge proofs with prediction markets for anonymous, trustless trading.",
    siteName: "VEIL",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VEIL - Privacy-First Prediction Markets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VEIL - Privacy-First Prediction Markets",
    description: "Trade on future events with complete privacy. Zero-knowledge proofs meet prediction markets.",
    images: ["/og-image.jpg"],
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
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.jpg", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.jpg", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.jpg", sizes: "180x180", type: "image/png" }],
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
              description: "Privacy-First Prediction Markets",
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
