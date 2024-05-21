import React, { useState, useEffect, useMemo } from "react"
import { Address, Cart, Customer } from "@medusajs/medusa"
import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import AddressSelect from "../address-select"
import CountrySelect from "../country-select"
import { Badge, Button, Container, Heading, Tooltip } from "@medusajs/ui"
import { v4 as uuidv4 } from "uuid"
import { proceedToPayment, setShippingMethod } from "@modules/checkout/actions"
import { medusaClient } from "@lib/config"
import BillingAddress from "../billing_address"
import { XMark, InformationCircleSolid } from "@medusajs/icons"
// import { Toaster, toast } from "@medusajs/ui"

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
  const [viewBilling, setViewBilling] = useState(false)
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

  const isFormDataValid = (formData: { [x: string]: any }) => {
    // Loop through each field in the formData object
    for (const key in formData) {
      // Check if the field is shipping_address.company
      if (key === "shipping_address.company") {
        continue // Skip this field
      }
      // Check if the field is empty
      if (!formData[key]) {
        return false // Return false if any field is empty
      }
    }
    // Return true if all fields (except shipping_address.company) are not empty
    return true
  }

  const handleSubmit = () => {
    console.log("submitting for quote")
    getDeliveryQuote()
  }

  const handleBillingToggle = () => {
    setViewBilling(!viewBilling)
    onChange()
  }

  const [invalidAdress, setInvalidAddress] = useState(false)
  const [DspErrorMessage, setDspErrorMessage] = useState<string | null>(null)

  const clearAndSaveQuoteId = async (deliveryQuoteId, dspOption) => {
    clearDeliveryQuoteId().then(() => {
      saveDeliveryQuoteId(deliveryQuoteId, dspOption)
    })
  }
  const clearDeliveryQuoteId = async () => {
    await fetch("http://localhost:9000/delivery/deliveryQuoteId", {
      method: "DELETE",
      body: JSON.stringify({
        cartId: cart?.id,
      }),
    }).then((response) => {
      if (!response.ok) {
        // saveDeliveryQuoteId(deliveryQuoteId, dspOption)
      }
    })
    console.log("DELETED previous quote Id's")
  }

  const saveDeliveryQuoteId = async (
    deliveryQuoteId: string,
    dspOption: string
  ) => {
    await fetch("http://localhost:9000/delivery/deliveryQuoteId", {
      method: "POST",
      body: JSON.stringify({
        quoteId: deliveryQuoteId,
        dspOption: dspOption,
        cartId: cart?.id,
      }),
    })
    console.log("INSERTED delivery quote id ")
  }

  const handleShippingMethod = async (
    deliveryFee: number,
    deliveryQuoteId: string
  ) => {
    const shippingMethodId = await medusaClient.shippingOptions
      .list()
      .then(({ shipping_options }) => {
        return shipping_options[0]["id"]
      })
    // Need to send back quoteID also
    console.log("SHIPPING METHOD ID - ", shippingMethodId)
    await setShippingMethod(
      shippingMethodId !== undefined ? shippingMethodId : "None",
      deliveryFee,
      deliveryQuoteId
    )

    // redirect("/checkout?step=payment")
    proceedToPayment()
  }
  // const [errorMessage, setErrorMessage] = useState("")
  const handleDeliveryQuoteResponse = async (
    doordashResponse: any,
    uberResponse: any
  ) => {
    console.log("HANDLING REQUEST")
    if (doordashResponse.status !== 200 && uberResponse.status !== 200) {
      setDspErrorMessage(doordashResponse.errorMessage)
      setInvalidAddress(true)
      return false
    } else if (doordashResponse.status === 200 && uberResponse.status !== 200) {
      setInvalidAddress(false)
      var deliveryQuoteId = doordashResponse.quoteId
      var deliveryFee = doordashResponse.fee
      var dspOption = "doordash"
      await clearAndSaveQuoteId(deliveryQuoteId, dspOption)
      handleShippingMethod(deliveryFee, deliveryQuoteId)
    } else if (doordashResponse.status !== 200 && uberResponse.status === 200) {
      setInvalidAddress(false)
      var deliveryQuoteId = uberResponse.quoteId
      var deliveryFee = uberResponse.fee
      var dspOption = "uber"
      await clearAndSaveQuoteId(deliveryQuoteId, dspOption)
      handleShippingMethod(deliveryFee, deliveryQuoteId)
    } else {
      setInvalidAddress(false)
      var doordash = {
        deliveryFee: doordashResponse.fee,
        external_delivery_id: doordashResponse.quoteId,
      }

      // MAKE RIGHT
      var uber = {
        deliveryFee: uberResponse.fee,
        external_delivery_id: uberResponse.quoteId,
      }

      const deliveryFee: number = Math.min(
        doordash.deliveryFee,
        uber.deliveryFee
      )
      console.log("SETTING - ", deliveryFee)

      // You'll be able to access the delivery quote id using this -> cart?.shipping_methods[0].data.quoteId
      let deliveryQuoteId: string = ""
      let dspOption: string = ""
      if (deliveryFee === doordash.deliveryFee) {
        deliveryQuoteId = doordash.external_delivery_id
        dspOption = "doordash"
      } else {
        deliveryQuoteId = uber.external_delivery_id
        dspOption = "uber"
      }
      //save delivery id in db by making fetch call with body as id
      console.log("QUOTE ID - ", deliveryQuoteId)
      console.log("dspOption - ", dspOption)
      await clearAndSaveQuoteId(deliveryQuoteId, dspOption)
      handleShippingMethod(deliveryFee, deliveryQuoteId)
    }
  }

  // ----------- Layo Edits ---------------
  // Needs better error checking and code cleanUp
  const getDeliveryQuote = async () => {
    try {
      console.log(formData["shipping_address.address_1"])
      const doordashQuote = await fetch(
        "http://localhost:9000/doordash/deliveryQuote",
        {
          method: "POST",
          body: JSON.stringify({
            external_delivery_id: uuidv4(),
            // Get store info from admin?
            pickup_address: "3400 Chestnut Street, Philadelphia, PA, 19104",
            pickup_phone_number: "+12156886986",
            dropoff_address: `${formData["shipping_address.address_1"]}, ${formData["shipping_address.city"]}, ${formData["shipping_address.province"]}, ${formData["shipping_address.postal_code"]}`,
            dropoff_phone_number: "+1" + formData["shipping_address.phone"],
          }),
        }
      )

      const UberQuote = await fetch("http://localhost:9000/uber/quote", {
        method: "POST",
        body: JSON.stringify({
          pickup_address: "3400 Chestnut Street, Philadelphia, PA 19104",
          dropoff_address: `{"street_address":["${formData["shipping_address.address_1"]}"],"city":"${formData["shipping_address.city"]}","state":"${formData["shipping_address.province"]}","zip_code":"${formData["shipping_address.postal_code"]}","country":"US"}`,
        }),
      })

      console.log("Doordash done")
      const doordashResponse = await doordashQuote.json()
      // console.log("doordash - ", doordashResponse, doordashResponse.data.fee)

      // Layo - need to send actual delivery paramets to Uber request

      console.log("Uber done")
      const uberResponse = await UberQuote.json()
      // console.log("uber - ", uberResponse, uberResponse.data.fee)

      handleDeliveryQuoteResponse(doordashResponse, uberResponse)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {customer &&
        checkoutOption === "Delivery" &&
        (addressesInRegion?.length || 0) > 0 && (
          <Container className="mb-6 flex flex-col gap-y-4 p-5">
            <p className="text-small-regular">
              {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
            </p>
            <AddressSelect
              addresses={customer.shipping_addresses}
              cart={cart}
            />
          </Container>
        )}
      {!isFormDataValid(formData) && (
        <Tooltip content="All required fields must be filled to proceed">
          <InformationCircleSolid color="orange" />
        </Tooltip>
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
              required
            />
          </>
        )}
      </div>
      <div>
        {isFormDataValid(formData) &&
          checkoutOption === "Delivery" &&
          invalidAdress && (
            <>
              <Badge color="red">
                {" "}
                <XMark color="red" />
                {DspErrorMessage}
              </Badge>
            </>
          )}
      </div>
      {checkoutOption === "Delivery" && (
        <div className="my-8">
          <Checkbox
            label="Same as billing address"
            name="same_as_billing"
            checked={checked}
            onChange={handleBillingToggle}
          />
        </div>
      )}
      {viewBilling && (
        <div>
          <Heading level="h2" className="text-3xl-regular gap-x-4 pb-6 pt-8">
            Billing address
          </Heading>

          <BillingAddress cart={cart} countryCode={countryCode} />
        </div>
      )}
      <div>
        {isFormDataValid(formData) && checkoutOption === "Delivery" && (
          <Button size="large" className="mt-6" onClick={handleSubmit}>
            Continue to payment
          </Button>
        )}
      </div>
    </>
  )
}

export default ShippingAddress
