"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export function AppFooter() {
  const router = useRouter()

  const handleCategoryClick = (category: string) => {
    router.push(`/app?category=${category.toLowerCase()}`)
  }

  return (
    <footer className="relative z-10 mt-20 border-t border-white/5 backdrop-blur-xl bg-black/20">
      <div className="mx-auto max-w-7xl px-8 py-12">
        <div className="grid grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/app" className="flex items-center gap-3 mb-4 group cursor-pointer">
              <div className="relative">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-all duration-[1500ms] group-hover:scale-110"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))",
                  }}
                >
                  <defs>
                    <linearGradient id="footerTriangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(192, 192, 192, 0.4)" />
                      <stop offset="50%" stopColor="rgba(16, 185, 129, 0.4)" />
                      <stop offset="100%" stopColor="rgba(255, 255, 255, 0.2)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M24 40 L8 12 L40 12 Z"
                    fill="url(#footerTriangleGradient)"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xl font-light tracking-wider transition-all duration-[1500ms] group-hover:text-white"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.3)",
                    textShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
                  }}
                >
                  VEIL
                </span>
                <span
                  className="text-xl font-light tracking-wide"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.15)",
                  }}
                >
                  |
                </span>
                <span
                  className="text-xl font-light tracking-wide transition-all duration-[1500ms] group-hover:text-white"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.3)",
                    textShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
                  }}
                >
                  Markets
                </span>
              </div>
            </Link>
            <a
              href="https://x.com/veilmarkets"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 mb-3 text-xs transition-all duration-[1500ms] hover:text-emerald-400 group"
              style={{
                color: "rgba(255, 255, 255, 0.25)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 8px rgba(16, 185, 129, 0.12)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="transition-all duration-[1500ms] group-hover:scale-110"
                style={{
                  filter: "drop-shadow(0 0 4px rgba(16, 185, 129, 0.3))",
                }}
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @veilmarkets
            </a>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FDaDKFuNb2e1U80XVrXFIkUK2qSvaB.png"
              alt="Powered by Avalanche"
              className="h-7 opacity-30 transition-all duration-[1500ms] hover:opacity-60 hover:scale-[1.02]"
              style={{
                filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.15))",
              }}
            />
          </div>

          {/* Markets */}
          <div>
            <h3
              className="mb-4 text-sm font-semibold"
              style={{
                color: "rgba(255, 255, 255, 0.4)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
              }}
            >
              Markets
            </h3>
            <ul className="space-y-2">
              {["Politics", "Sports", "Crypto", "Tech", "Economy"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handleCategoryClick(item)}
                    className="text-xs transition-all hover:text-emerald-400 cursor-pointer"
                    style={{
                      color: "rgba(255, 255, 255, 0.25)",
                      fontFamily: "var(--font-space-grotesk)",
                    }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3
              className="mb-4 text-sm font-semibold"
              style={{
                color: "rgba(255, 255, 255, 0.4)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
              }}
            >
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/app/docs"
                  className="text-xs transition-all hover:text-emerald-400"
                  style={{
                    color: "rgba(255, 255, 255, 0.25)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/app/api-docs"
                  className="text-xs transition-all hover:text-emerald-400"
                  style={{
                    color: "rgba(255, 255, 255, 0.25)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  API
                </Link>
              </li>
              <li>
                <Link
                  href="/app/transparency"
                  className="text-xs transition-all hover:text-emerald-400"
                  style={{
                    color: "rgba(255, 255, 255, 0.25)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  Transparency
                </Link>
              </li>
              <li>
                <Link
                  href="/app/support"
                  className="text-xs transition-all hover:text-emerald-400"
                  style={{
                    color: "rgba(255, 255, 255, 0.25)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="/app/blog"
                  className="text-xs transition-all hover:text-emerald-400"
                  style={{
                    color: "rgba(255, 255, 255, 0.25)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              className="mb-4 text-sm font-semibold"
              style={{
                color: "rgba(255, 255, 255, 0.4)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
              }}
            >
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/app/terms"
                  className="text-xs transition-all hover:text-emerald-400"
                  style={{
                    color: "rgba(255, 255, 255, 0.25)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/app/privacy"
                  className="text-xs transition-all hover:text-emerald-400"
                  style={{
                    color: "rgba(255, 255, 255, 0.25)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/app/risk"
                  className="text-xs transition-all hover:text-emerald-400"
                  style={{
                    color: "rgba(255, 255, 255, 0.25)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  Risk Disclosure
                </Link>
              </li>
              <li>
                <Link
                  href="/app/compliance"
                  className="text-xs transition-all hover:text-emerald-400"
                  style={{
                    color: "rgba(255, 255, 255, 0.25)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
