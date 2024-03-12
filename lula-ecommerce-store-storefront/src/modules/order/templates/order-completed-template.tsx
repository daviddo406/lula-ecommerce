import { Order } from "@medusajs/medusa"
import { Heading } from "@medusajs/ui"
import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import { retrieveOrder } from "@lib/data"
import { notFound } from "next/navigation"
import DSPDeliveryDetails from "../components/dsp-delivery-details"
import PaymentDetails from "../components/payment-details"
import Divider from "@modules/common/components/divider"

type OrderCompletedTemplateProps = {
  order: Order
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const orderWithTip = await retrieveOrder(order.id)

  if (!orderWithTip) {
    return notFound()
  }

  return (
    <div className="py-6 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        <div className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10">
          <Heading
            level="h1"
            className="flex flex-col gap-y-3 text-ui-fg-base text-3xl mb-4"
          >
            <span>Thank you!</span>
            <span>Your order was placed successfully.</span>
          </Heading>
          <OrderDetails order={order} />
          <Divider />
          <DSPDeliveryDetails />
          <Heading level="h2" className="flex flex-row text-3xl-regular">
            Order Summary
          </Heading>
          <Items items={order.items} region={order.region} />
          <CartTotals data={orderWithTip} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
        </div>
      </div>
    </div>
  )
}
