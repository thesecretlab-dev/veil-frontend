import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      // veil.markets -> /lab on Maestro (temporary, until sites consolidate)
      // For now this is handled via Vercel domain config
    ]
  },
}

export default nextConfig
