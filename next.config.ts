import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    rules: {
      "*.wgsl": {
        loaders: ["@vgpu/wgsl/loader-webpack"],
        as: "*.js",
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.wgsl$/,
      use: "@vgpu/wgsl/loader-webpack",
    })
    return config
  },
  // /explorer is a local VeilVM explorer. Do not send users to
  // explorer.thesecretlab.app (Cloudflare tunnel 1033) or explorer.veil.markets
  // (no DNS). Those hosts are not this chain.
}

export default nextConfig
