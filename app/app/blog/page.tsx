import { LegalPageLayout } from "@/components/legal-page-layout"
import Link from "next/link"

export default function BlogPage() {
  const posts = [
    {
      title: "On Privacy-Native Prediction Markets: A Systems Engineer's Musing on VEIL",
      date: "April 1, 2024",
      author: "Relic",
      excerpt:
        "A comprehensive technical deep-dive into VEIL's architecture: sealed order flow, batch auctions, shielded ledgers, protocol-owned liquidity as a native mixer, and the engineering discipline required to ship privacy-first prediction markets at scale.",
      slug: "privacy-native-prediction-markets",
    },
    {
      title: "Introducing VEIL: Privacy-Native Prediction Markets",
      date: "March 15, 2024",
      author: "Relic",
      excerpt:
        "Today we're excited to announce VEIL, a new prediction market platform built on Avalanche with privacy at its core. Learn about our vision for censorship-resistant, anonymous trading on real-world events.",
      slug: "introducing-veil",
    },
    {
      title: "How Zero-Knowledge Proofs Enable Private Trading",
      date: "March 10, 2024",
      author: "Relic",
      excerpt:
        "Deep dive into the cryptographic techniques that power VEIL's privacy features and protect trader anonymity while maintaining market integrity and auditability.",
      slug: "zero-knowledge-proofs",
    },
    {
      title: "VEIL Token Airdrop: Whitelist Now Open",
      date: "March 5, 2024",
      author: "Relic",
      excerpt:
        "Early users can now whitelist their wallets for the upcoming VEIL token airdrop. Learn how to participate and what benefits token holders will receive.",
      slug: "token-airdrop",
    },
    {
      title: "Building on Avalanche: Why We Chose Subnets",
      date: "February 28, 2024",
      author: "Relic",
      excerpt:
        "Explore the technical reasons behind our choice of Avalanche subnets for VEIL's infrastructure, including scalability, privacy, and customization benefits.",
      slug: "avalanche-subnets",
    },
    {
      title: "Market Resolution: How VEIL Ensures Fair Outcomes",
      date: "February 20, 2024",
      author: "Relic",
      excerpt:
        "Understanding VEIL's decentralized oracle system and how we ensure accurate, tamper-proof market resolutions through validator consensus.",
      slug: "market-resolution",
    },
  ]

  return (
    <LegalPageLayout title="Blog">
      <div className="space-y-8">
        {posts.map((post, i) => (
          <article
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-emerald-500/30 hover:bg-white/[0.07]"
          >
            <h2
              className="mb-3 text-2xl font-semibold"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.7)",
                textShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
                filter: "blur(0.3px)",
              }}
            >
              {post.title}
            </h2>
            <p
              className="mb-2 text-sm"
              style={{
                color: "rgba(255, 255, 255, 0.4)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              {post.date} • By {post.author}
            </p>
            <p
              className="mb-4 leading-relaxed"
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "var(--font-space-grotesk)",
                filter: "blur(0.3px)",
              }}
            >
              {post.excerpt}
            </p>
            <Link
              href={`/app/blog/${post.slug}`}
              className="inline-block text-sm font-semibold transition-all hover:text-emerald-300"
              style={{
                color: "rgba(16, 185, 129, 0.8)",
                fontFamily: "var(--font-space-grotesk)",
                textShadow: "0 0 10px rgba(16, 185, 129, 0.3)",
                filter: "blur(0.3px)",
              }}
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </LegalPageLayout>
  )
}
