"use client"

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center">
      <h1
        className="text-[12rem] font-bold tracking-[0.3em] font-[family-name:var(--font-space-grotesk)] uppercase"
        style={{
          color: "rgba(255, 255, 255, 0.15)",
          textShadow: `
            0 2px 4px rgba(255, 255, 255, 0.8),
            0 -2px 4px rgba(0, 0, 0, 0.5),
            inset 0 2px 4px rgba(255, 255, 255, 0.5),
            0 0 20px rgba(16, 185, 129, 0.6),
            0 0 40px rgba(16, 185, 129, 0.4),
            0 0 60px rgba(16, 185, 129, 0.3),
            0 0 80px rgba(5, 150, 105, 0.2)
          `,
          WebkitTextStroke: "1px rgba(16, 185, 129, 0.3)",
          filter: "blur(0.5px)",
        }}
      >
        VEIL
      </h1>
    </section>
  )
}
