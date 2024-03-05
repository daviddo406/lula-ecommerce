import { Button, Heading } from "@medusajs/ui"
import Link from "next/link"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import { CartWithCheckoutStep } from "types/global"
import { retrieveCart } from "../actions"

type SummaryProps = {
  cart: CartWithCheckoutStep
}

const Summary = async ({ cart }: SummaryProps) => {
  const cartWithTip = await retrieveCart().then((cartWithTip) => cartWithTip)

  if (!cartWithTip) {
    return null
  }
  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>
      <Divider />
      <CartTotals data={cartWithTip} />
      <Link href={"/checkout?step=" + cart.checkout_step}>
        <Button className="w-full h-10">Go to checkout</Button>
      </Link>
    </div>
  )
}

export default Summary
