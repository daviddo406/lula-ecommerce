import React, { useState, useEffect, useMemo } from "react"
import { Address, Cart, Customer } from "@medusajs/medusa"
import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import AddressSelect from "../address-select"
import CountrySelect from "../country-select"
import { Button, Container } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import DSPSummary from "@modules/checkout/templates/checkout-form/DSPSummary"
import { v4 as uuidv4 } from "uuid"
import { setShippingMethod } from "@modules/checkout/actions"

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
  countryCode,
  checkoutOption,
}: {
  customer: Omit<Customer, "password_hash"> | null
  cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null
  checked: boolean
  onChange: () => void
  countryCode: string
  checkoutOption: string
}) => {
  const [formData, setFormData] = useState({
    "shipping_address.first_name": cart?.shipping_address?.first_name || "",
    "shipping_address.last_name": cart?.shipping_address?.last_name || "",
    "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
    "shipping_address.company": cart?.shipping_address?.company || "",
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
    "shipping_address.city": cart?.shipping_address?.city || "",
    "shipping_address.country_code":
      cart?.shipping_address?.country_code || countryCode || "",
    "shipping_address.province": cart?.shipping_address?.province || "",
    email: cart?.email || "",
    "shipping_address.phone": cart?.shipping_address?.phone || "",
  })

  const countriesInRegion = useMemo(
    () => cart?.region.countries.map((c) => c.iso_2),
    [cart?.region]
  )

  // check if customer has saved addresses that are in the current region
  const addressesInRegion = useMemo(
    () =>
      customer?.shipping_addresses.filter(
        (a) => a.country_code && countriesInRegion?.includes(a.country_code)
      ),
    [customer?.shipping_addresses, countriesInRegion]
  )

  useEffect(() => {
    setFormData({
      "shipping_address.first_name": cart?.shipping_address?.first_name || "",
      "shipping_address.last_name": cart?.shipping_address?.last_name || "",
      "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
      "shipping_address.company": cart?.shipping_address?.company || "",
      "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
      "shipping_address.city": cart?.shipping_address?.city || "",
      "shipping_address.country_code":
        cart?.shipping_address?.country_code || "",
      "shipping_address.province": cart?.shipping_address?.province || "",
      email: cart?.email || "",
      "shipping_address.phone": cart?.shipping_address?.phone || "",
    })
  }, [cart?.shipping_address, cart?.email])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const isValid = Object.entries(formData).every(([key, value]) => {
    // Check if the key is not "company" and if the value is not an empty string
    if (key !== "company") {
      return value !== ""
    }
    return true // Always return true for the "company" key
  })

  const [displayQuote, setDisplayQuote] = useState(false)
  const [deliveryQuote, setDeliveryQuote] = useState(0)
  const handleSubmit = () => {
    console.log("submitting for quote")
    setDisplayQuote(true)
    getDeliveryQuote()
  }

  // ----------- Layo Edits ---------------
  // Needs better error checking and code cleanUp
  const getDeliveryQuote = async () => {
    try {
      const doordashQuote = await fetch(
        "http://localhost:9000/doordash/deliveryQuote",
        {
          method: "POST",
          body: JSON.stringify({
            external_delivery_id: uuidv4(),
            // Get store info from admin?
            pickup_address: "3400 Chestnut street, Philadelphia, PA, 19104",
            pickup_phone_number: "+12156886986",
            dropoff_address: formData["shipping_address.address_1"],
            dropoff_phone_number: "+1" + formData["shipping_address.phone"],
          }),
        }
      )
      console.log("Doordash done")
      const doordashResponse = await doordashQuote.json()
      console.log("doordash - ", doordashResponse, doordashResponse.deliveryFee)

      // Layo - need to send actual delivery paramets to Uber request
      const UberQuote = await fetch("http://localhost:9000/uber/quote", {
        method: "POST",
        body: JSON.stringify({
          pickup_address: "3400 Chestnut street, Philadelphia, PA 19104",
          dropoff_address: `{"street_address":["${formData["shipping_address.address_1"]}"],"city":"${formData["shipping_address.city"]}","state":"${formData["shipping_address.province"]}","zip_code":"${formData["shipping_address.postal_code"]}","country":"US"}`,
        }),
      })

      console.log("Uber done")
      const uberResponse = await UberQuote.json()
      console.log("uber - ", uberResponse, uberResponse.fee)

      const deliveryFee: number = Math.min(
        doordashResponse.deliveryFee,
        uberResponse.fee
      )
      console.log("SETTING - ", deliveryFee)
      //Layo - need shipping method ID for below
      await setShippingMethod("so_01HPYFT907BXA0MC04AKKYRZ20", deliveryFee)

      return deliveryQuote
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {customer && (addressesInRegion?.length || 0) > 0 && (
        <Container className="mb-6 flex flex-col gap-y-4 p-5">
          <p className="text-small-regular">
            {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
          </p>
          <AddressSelect addresses={customer.shipping_addresses} cart={cart} />
        </Container>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          name="shipping_address.first_name"
          autoComplete="given-name"
          value={formData["shipping_address.first_name"]}
          onChange={handleChange}
          required
        />
        <Input
          label="Last name"
          name="shipping_address.last_name"
          autoComplete="family-name"
          value={formData["shipping_address.last_name"]}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          title="Enter a valid email address."
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Phone"
          name="shipping_address.phone"
          autoComplete="tel"
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
          required
        />
        {checkoutOption == "Delivery" && (
          <>
            <Input
              label="Address"
              name="shipping_address.address_1"
              autoComplete="address-line1"
              value={formData["shipping_address.address_1"]}
              onChange={handleChange}
              required
            />
            <Input
              label="Company"
              name="shipping_address.company"
              value={formData["shipping_address.company"]}
              onChange={handleChange}
              autoComplete="organization"
            />
            <Input
              label="Postal code"
              name="shipping_address.postal_code"
              autoComplete="postal-code"
              value={formData["shipping_address.postal_code"]}
              onChange={handleChange}
              required
            />
            <Input
              label="City"
              name="shipping_address.city"
              autoComplete="address-level2"
              value={formData["shipping_address.city"]}
              onChange={handleChange}
              required
            />
            <CountrySelect
              name="shipping_address.country_code"
              autoComplete="country"
              region={cart?.region}
              value={formData["shipping_address.country_code"]}
              onChange={handleChange}
              required
            />
            <Input
              label="State / Province"
              name="shipping_address.province"
              autoComplete="address-level1"
              value={formData["shipping_address.province"]}
              onChange={handleChange}
            />
          </>
        )}
      </div>
      {checkoutOption === "Delivery" && (
        <div className="my-8">
          <Checkbox
            label="Same as billing address"
            name="same_as_billing"
            checked={checked}
            onChange={onChange}
          />
        </div>
      )}
      <div>
        {isValid && checkoutOption === "Delivery" && (
          <Button size="large" className="mt-6" onClick={handleSubmit}>
            Continue to payment
          </Button>
        )}
      </div>
    </>
  )
}

export default ShippingAddress
