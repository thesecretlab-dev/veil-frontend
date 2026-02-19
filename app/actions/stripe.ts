"use server"

import { stripe } from "@/lib/stripe"
import { INSIGHTS_PRODUCTS } from "@/lib/products"

export async function startInsightsCheckout(productId: string) {
  const product = INSIGHTS_PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  // Free tier doesn't need checkout
  if (product.priceInCents === 0) {
    throw new Error("Cannot checkout free tier")
  }

  // Create Checkout Session for subscription
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    mode: "subscription",
  })

  return session.client_secret
}
