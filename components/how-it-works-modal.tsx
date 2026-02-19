"use client"

import { useState } from "react"
import { TriangleLogo } from "./triangle-logo"

interface HowItWorksModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  if (!isOpen) return null

  const steps = [
    {
      title: "1. Pick a Market",
      description:
        "Buy 'Yes' or 'No' shares depending on your prediction. Buying shares is like betting on the outcome. Odds shift in real time as other traders bet.",
      mockup: (
        <div className="relative w-full max-w-sm mx-auto mb-8">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transform rotate-2">
            <h3 className="text-white/90 font-light text-lg mb-4 tracking-wide">
              Will there be a US recession this year?
            </h3>
            <div className="flex items-center justify-between mb-6">
              <div className="text-white/50 text-sm font-light">Current odds</div>
              <div className="relative w-20 h-20">
                <svg className="transform -rotate-90 w-20 h-20">
                  <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#7fffda"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${32 * 2 * Math.PI * 0.5} ${32 * 2 * Math.PI}`}
                    className="drop-shadow-[0_0_8px_rgba(127,255,218,0.5)]"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-white font-light text-lg">
                  50%
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-[#7fffda]/20 hover:bg-[#7fffda]/30 border border-[#7fffda]/30 text-[#7fffda] font-light py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(127,255,218,0.15)]">
                Yes
              </button>
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-light py-3 rounded-lg transition-all">
                No
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2. Place a Bet",
      description:
        "Fund your account with crypto, credit/debit card, or bank transfer—then you're ready to bet. No bet limits and no fees.",
      mockup: (
        <div className="relative w-full max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transform -rotate-3 w-72">
              <div className="flex items-center justify-between mb-4">
                <button className="text-white/40 hover:text-white/60 text-2xl font-light">−</button>
                <div className="text-center">
                  <div className="text-4xl font-light text-white/90">$100</div>
                  <div className="text-sm text-white/40 font-light">
                    To Win <span className="text-[#7fffda] font-normal">$400</span>
                  </div>
                </div>
                <button className="text-white/40 hover:text-white/60 text-2xl font-light">+</button>
              </div>
              <button className="w-full bg-[#7fffda]/20 hover:bg-[#7fffda]/30 border border-[#7fffda]/30 text-[#7fffda] font-light py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(127,255,218,0.15)]">
                Buy Yes
              </button>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transform rotate-3 w-72">
              <div className="flex items-center justify-between mb-4">
                <button className="text-white/40 hover:text-white/60 text-2xl font-light">−</button>
                <div className="text-center">
                  <div className="text-4xl font-light text-white/90">100</div>
                  <div className="text-sm text-white/40 font-light">
                    Win <span className="text-[#7fffda] font-normal">$133</span>
                  </div>
                </div>
                <button className="text-white/40 hover:text-white/60 text-2xl font-light">+</button>
              </div>
              <button className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-light py-3 rounded-lg transition-all">
                Buy No
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "3. Profit",
      description:
        "Sell your 'Yes' or 'No' shares at any time, or wait until the market ends to redeem winning shares for $1 each. Create an account and place your first trade in minutes.",
      mockup: (
        <div className="relative w-full max-w-sm mx-auto mb-8">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-white/90 font-light text-lg mb-6 tracking-wide">
              Will there be a US recession this year?
            </h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/50 font-light">Odds</span>
                <span className="text-white/70 font-light">—</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50 font-light">Bet</span>
                <span className="text-white/70 font-light">—</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50 font-light">To Win</span>
                <span className="text-[#7fffda] font-normal text-2xl drop-shadow-[0_0_8px_rgba(127,255,218,0.5)]">
                  $250
                </span>
              </div>
            </div>
            <button className="w-full bg-[#7fffda]/20 hover:bg-[#7fffda]/30 border border-[#7fffda]/30 text-[#7fffda] font-light py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(127,255,218,0.15)]">
              Cash Out
            </button>
          </div>
        </div>
      ),
    },
  ]

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-950/95 backdrop-blur-md">
        {/* Confetti particles */}
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-sm animate-float"
            style={{
              background: i % 2 === 0 ? "#7fffda" : "#5ce1e6",
              opacity: 0.4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Modal content */}
      <div className="relative w-full max-w-3xl">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/40 hover:text-white/80 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex justify-center mb-8">
          <TriangleLogo className="w-12 h-12" />
        </div>

        {/* Content */}
        <div className="text-center">
          {/* Mockup */}
          {currentStepData.mockup}

          <h2 className="text-3xl font-light text-white/90 mb-4 tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            {currentStepData.title}
          </h2>

          <p className="text-white/60 text-lg font-light mb-8 max-w-xl mx-auto leading-relaxed">
            {currentStepData.description}
          </p>

          <div className="flex items-center justify-center gap-4">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-8 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-light transition-all backdrop-blur-sm"
              >
                Previous
              </button>
            )}
            <button
              onClick={() => {
                if (isLastStep) {
                  onClose()
                } else {
                  setCurrentStep(currentStep + 1)
                }
              }}
              className="px-12 py-3 rounded-lg bg-[#7fffda]/20 hover:bg-[#7fffda]/30 border border-[#7fffda]/30 text-[#7fffda] font-light transition-all shadow-[0_0_30px_rgba(127,255,218,0.2)]"
            >
              {isLastStep ? "Get Started" : "Next"}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "bg-[#7fffda] w-8 shadow-[0_0_10px_rgba(127,255,218,0.5)]"
                    : "bg-white/20 hover:bg-white/30 w-2"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  )
}
