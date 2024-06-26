"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Cart, Customer } from "@medusajs/medusa"
import { CheckCircleSolid } from "@medusajs/icons"
import { Button, Heading, Tabs, Text, clx, useToggleState } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"

import BillingAddress from "../billing_address"
import ShippingAddress from "../shipping-address"
import {
  proceedToPayment,
  setAddresses,
  setShippingMethod,
} from "../../actions"
import { useFormState } from "react-dom"
import ErrorMessage from "../error-message"
import compareAddresses from "@lib/util/compare-addresses"

import { useState } from "react"
import { medusaClient } from "@lib/config"

const Addresses = ({
  cart,
  countryCode,
  customer,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null
  countryCode: string
  customer: Omit<Customer, "password_hash"> | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsSBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useFormState(setAddresses, null)

  const [deliveryOption, setDeliveryOption] = useState("Delivery")
  const handleDeliveryOptionChange = async (value: string) => {
    setDeliveryOption(value)
    toggleSameAsBilling()
    const shippingMethodId = await medusaClient.shippingOptions
      .list()
      .then(({ shipping_options }) => {
        return shipping_options[0]["id"]
      })
    await setShippingMethod(
      shippingMethodId !== undefined ? shippingMethodId : "None",
      0,
      value.toLowerCase()
    )
  }

  const handleSubmit = async () => {
    const shippingMethodId = await medusaClient.shippingOptions
      .list()
      .then(({ shipping_options }) => {
        return shipping_options[0]["id"]
      })
    await setShippingMethod(
      shippingMethodId !== undefined ? shippingMethodId : "None",
      0,
      "pickup"
    )
    proceedToPayment()
  }

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Delivery Info
          {!isOpen && <CheckCircleSolid />}
        </Heading>
        {!isOpen && cart?.shipping_address && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="flex content-center justify-center mb-3">
            <Tabs
              onValueChange={handleDeliveryOptionChange}
              defaultValue={deliveryOption}
            >
              <Tabs.List>
                <Tabs.Trigger
                  className={clx(
                    "border-ui-border-base bg-ui-bg-subtle border px-5",
                    {
                      "border-ui-border-interactive":
                        deliveryOption === "Delivery",
                      "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                        deliveryOption !== "Delivery",
                    }
                  )}
                  value="Delivery"
                >
                  Delivery
                </Tabs.Trigger>
                <Tabs.Trigger
                  className={clx(
                    "border-ui-border-base bg-ui-bg-subtle border px-5",
                    {
                      "border-ui-border-interactive":
                        deliveryOption === "Pickup",
                      "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                        deliveryOption !== "Pickup",
                    }
                  )}
                  value="Pickup"
                >
                  Pick Up
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs>
          </div>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              countryCode={countryCode}
              checked={sameAsSBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
              checkoutOption={deliveryOption}
            />

            {deliveryOption === "Pickup" && (
              <div>
                <Heading
                  level="h2"
                  className="text-3xl-regular gap-x-4 pb-6 pt-8"
                >
                  Billing address
                </Heading>

                <BillingAddress cart={cart} countryCode={countryCode} />
              </div>
            )}
            {deliveryOption === "Pickup" && (
              <Button onClick={handleSubmit} className="mt-6">
                Continue to payment
              </Button>
            )}
            <ErrorMessage error={message} />
          </div>
        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="flex items-start gap-x-8">
                <div className="flex items-start gap-x-1 w-full">
                  <div
                    className={clx("flex flex-col", {
                      "w-1/2":
                        cart.shipping_methods.length > 0 &&
                        cart.shipping_methods[0].data.quoteId === "pickup",
                      "w-1/3":
                        cart.shipping_methods.length > 0 &&
                        cart.shipping_methods[0].data.quoteId !== "pickup",
                    })}
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Contact
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.first_name}{" "}
                      {cart.shipping_address.last_name}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.phone}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.email}
                    </Text>
                  </div>
                  {cart.shipping_methods.length > 0 &&
                    cart.shipping_methods[0].data.quoteId !== "pickup" && (
                      <div className="flex flex-col w-1/3">
                        <Text className="txt-medium-plus text-ui-fg-base mb-1">
                          Delivery Address
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.shipping_address.address_1}{" "}
                          {cart.shipping_address.address_2}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.shipping_address.postal_code},{" "}
                          {cart.shipping_address.city}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.shipping_address.country_code?.toUpperCase()}
                        </Text>
                      </div>
                    )}

                  <div
                    className={clx("flex flex-col", {
                      "w-1/2":
                        cart.shipping_methods.length > 0 &&
                        cart.shipping_methods[0].data.quoteId === "pickup",
                      "w-1/3":
                        cart.shipping_methods.length > 0 &&
                        cart.shipping_methods[0].data.quoteId !== "pickup",
                    })}
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Billing Address
                    </Text>

                    {sameAsSBilling ? (
                      <Text className="txt-medium text-ui-fg-subtle">
                        Billing- and delivery address are the same.
                      </Text>
                    ) : (
                      <>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address.first_name}{" "}
                          {cart.billing_address.last_name}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address.address_1}{" "}
                          {cart.billing_address.address_2}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address.postal_code},{" "}
                          {cart.billing_address.city}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address.country_code?.toUpperCase()}
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Addresses
