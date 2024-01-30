"use client"
import { ChangeEvent, useState } from "react"
import BasicAddress from "./BasicTestAddress"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Heading, clx } from "@medusajs/ui"
import { Cart } from "@medusajs/medusa"

type CheckoutOptionsProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

const CheckoutOptions: React.FC<CheckoutOptionsProps> = ({ cart }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isOpen = searchParams.get("step") === "checkoutOptions"

  const handleEdit = () => {
    router.push(pathname + "?step=checkoutOptions", { scroll: false })
  }
  const [deliveryOption, setDeliveryOption] = useState("")
  const onOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDeliveryOption(e.target.value)
  }

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Checkout Options - New Section
        </Heading>
      </div>
      <label>
        <input
          type="radio"
          name="deliveryOption"
          value="Pickup"
          checked={deliveryOption === "Pickup"}
          onChange={onOptionChange}
        />
        Pickup
      </label>
      &nbsp;&nbsp;&nbsp;
      <label>
        <input
          type="radio"
          name="deliveryOption"
          value="Delivery"
          checked={deliveryOption === "Delivery"}
          onChange={onOptionChange}
        />
        Delivery
      </label>
      {deliveryOption === "Pickup" ? (
        <p>Pickup at [Store Location]</p>
      ) : (
        deliveryOption === "Delivery" && <BasicAddress />
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default CheckoutOptions
