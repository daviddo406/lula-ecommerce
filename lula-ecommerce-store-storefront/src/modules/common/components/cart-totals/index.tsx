"use client"

import { InformationCircleSolid } from "@medusajs/icons"
import { Cart, Order } from "@medusajs/medusa"
import { Tooltip } from "@medusajs/ui"
import { formatAmount } from "@lib/util/prices"
import React, { useEffect } from "react"
import { get } from "lodash"
import axios from "axios"
import { useRouter, usePathname } from "next/navigation"

type CartTotalsProps = {
  data: Omit<Cart, "refundable_amount" | "refunded_total"> | Order
}

const CartTotals: React.FC<CartTotalsProps> = ({ data }) => {
  const {
    id,
    subtotal,
    discount_total,
    gift_card_total,
    tax_total,
    shipping_total,
    total,
    items,
  } = data
  const router = useRouter()
  const pathname = usePathname()

  const getAmount = (amount: number | null | undefined) => {
    return formatAmount({
      amount: amount || 0,
      region: data.region,
      includeTaxes: false,
    })
  }

  const getTipItem = () => {
    return items.find((item) => item.title === "Tip")
  }

  const getSubtotalWithoutTip = () => {
    const tipItem = items.find((item) => item.title === "Tip")
    if (!tipItem) {
      return subtotal
    }
    if (!subtotal) {
      return 0
    }
    return subtotal - tipItem?.unit_price
  }

  const getTip = () => {
    return getTipItem()?.unit_price
  }

  useEffect(() => {
    if (pathname === "/cart") {
      if (getTipItem() !== undefined) {
        let data = {tip: 0, cartId: id, tipItemId: get(getTipItem(), "id")}
        axios.post("http://localhost:9000/cart/tip", data, {headers: {"Content-Type": "application/json"}})
        .then((response) => {
          router.refresh()
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  }, [])

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle">
        <div className="flex items-center justify-between">
          <span className="flex gap-x-1 items-center">
            Subtotal
            <Tooltip content="Cart total excluding delivery fee, taxes, and tip.">
              <InformationCircleSolid color="var(--fg-muted)" />
            </Tooltip>
          </span>
          <span>{getAmount(getSubtotalWithoutTip())}</span>
        </div>
        {!!discount_total && (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span className="text-ui-fg-interactive">
              - {getAmount(discount_total)}
            </span>
          </div>
        )}
        {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <span>Gift card</span>
            <span className="text-ui-fg-interactive">
              - {getAmount(gift_card_total)}
            </span>
          </div>
        )}
        {!!shipping_total && (
          <div className="flex items-center justify-between">
            <span>Delivery Fee</span>
            <span>{getAmount(shipping_total)}</span>
          </div>
        )}
        {!!getTip() && (
          <div className="flex items-center justify-between">
            <span>Delivery Tip</span>
            <span>{getAmount(getTip())}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="flex gap-x-1 items-center ">Taxes</span>
          <span>{getAmount(tax_total)}</span>
        </div>
      </div>
      <div className="h-px w-full border-b border-gray-200 my-4" />
      <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium ">
        <span>Total</span>
        <span className="txt-xlarge-plus">{getAmount(total)}</span>
      </div>
      <div className="h-px w-full border-b border-gray-200 mt-4" />
    </div>
  )
}

export default CartTotals
