import { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { LineItem } from "@medusajs/medusa"

import { enrichLineItems, retrieveCart } from "@modules/cart/actions"
import Wrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Badge } from "@medusajs/ui"
import { XMark } from "@medusajs/icons"
import { useRef, useState } from "react"

export const metadata: Metadata = {
  title: "Checkout",
}

const fetchCart = async () => {
  const cart = await retrieveCart()

  if (cart?.items.length) {
    const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id)
    cart.items = enrichedItems as LineItem[]
  }

  return cart
}

export default async function Checkout() {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) {
    return notFound()
  }

  const cart = await fetchCart()

  if (!cart) {
    return notFound()
  }

  if (!cart?.items.length) {
    redirect("/cart")
  }

  // const [isNonInteractive, setIsNonInteractive] = useState(false)
  var isNonInteractive = false

  setTimeout(() => {
    // setIsNonInteractive(true)
    isNonInteractive = true
  }, 5000)

  return (
    <div
      className={`w-full grid grid-cols-1 gap-y-8 ${
        isNonInteractive ? "pointer-events-none opacity-50" : ""
      }`}
    >
      {isNonInteractive && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Badge color="red">
            {" "}
            <XMark color="red" />
            Checkout Session expires after 15 minutes. Please return to cart and
            try again.
          </Badge>
        </div>
      )}
      <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-40 py-12">
        <Wrapper cart={cart}>
          <CheckoutForm />
        </Wrapper>
        <CheckoutSummary />
      </div>
    </div>
  )
}
