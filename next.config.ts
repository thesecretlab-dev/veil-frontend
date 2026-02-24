import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/explorer",
        destination: "https://explorer.thesecretlab.app",
        permanent: false,
      },
      {
        source: "/explorer/:path*",
        destination: "https://explorer.thesecretlab.app/:path*",
        permanent: false,
      },
    ]
  },
}

export default nextConfig
