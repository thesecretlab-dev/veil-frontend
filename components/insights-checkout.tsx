"use client"

import { useCallback } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { X } from "lucide-react"

import { startInsightsCheckout } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function InsightsCheckout({ productId, onClose }: { productId: string; onClose: () => void }) {
  const fetchClientSecret = useCallback(() => startInsightsCheckout(productId), [productId])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-5xl my-8 rounded-xl border backdrop-blur-xl overflow-hidden"
        style={{
          background: "rgba(10, 10, 10, 0.95)",
          borderColor: "rgba(255, 255, 255, 0.1)",
          minHeight: "600px",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2
            className="text-xl font-light"
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              textShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
            }}
          >
            Complete Your Subscription
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all hover:bg-white/5"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Checkout - Increased padding and added min-height for better spacing */}
        <div className="p-8" style={{ minHeight: "500px" }}>
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  )
}
