import Addresses from "@modules/checkout/components/addresses"
import Shipping from "@modules/checkout/components/shipping"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import {
  createPaymentSessions,
  getCustomer,
  listShippingMethods,
} from "@lib/data"
import { cookies } from "next/headers"
import { CartWithCheckoutStep } from "types/global"
import { getCheckoutStep } from "@lib/util/get-checkout-step"

import CheckoutOptions from "./CheckoutOptions"

export default async function CheckoutForm() {
  const cartId = cookies().get("_medusa_cart_id")?.value

  const region = cookies().get("_medusa_region")?.value
  const { countryCode } = region && JSON.parse(region)

  if (!cartId) {
    return null
  }

  // create payment sessions and get cart
  const cart = (await createPaymentSessions(cartId).then(
    (cart) => cart
  )) as CartWithCheckoutStep

  if (!cart) {
    return null
  }

  cart.checkout_step = cart && getCheckoutStep(cart)

  // get available shipping methods
  const availableShippingMethods = await listShippingMethods(
    cart.region_id
  ).then((methods) => methods?.filter((m) => !m.is_return))

  if (!availableShippingMethods) {
    return null
  }

  // get customer if logged in
  const customer = await getCustomer()

  return (
    <div>
      <div className="w-full grid grid-cols-1 gap-y-8">
        <div>
          <Addresses
            cart={cart}
            countryCode={countryCode}
            customer={customer}
          />
        </div>

        {/* <div>
          <Shipping
            cart={cart}
            availableShippingMethods={availableShippingMethods}
          />
        </div> */}
        {/* <div>
          <CheckoutOptions cart={cart} />
        </div> */}

        <div>
          <Payment cart={cart} />
        </div>

        <div>
          <Review cart={cart} />
        </div>
      </div>
    </div>
  )
}
