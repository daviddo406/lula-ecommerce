import { Heading } from "@medusajs/ui"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import Tip from "@modules/checkout/components/tip"
import { retrieveCart } from "@modules/cart/actions"
import DiscountCode from "@modules/checkout/components/discount-code"
import { GiftCard } from "@medusajs/medusa"

const CheckoutSummary = async () => {
  const cart = await retrieveCart().then((cart) => cart)

  if (!cart) {
    return null
  }

  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
      <div className="w-full bg-white flex flex-col">
        <Divider className="my-6 small:hidden" />
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular items-baseline"
        >
          In your Cart
        </Heading>
        <Divider className="mt-6" />
        <ItemsPreviewTemplate
          region={cart?.region}
          items={cart?.items.filter((lineItem) => lineItem.title !== "Tip")}
        />
        <CartTotals data={cart} />
        {cart.shipping_methods.length > 0 &&
          cart.shipping_methods[0].data.quoteId !== "pickup" && (
            <div className="my-6">
              <Tip cart={cart} />
            </div>
          )}
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
