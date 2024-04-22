"use client"

import { Cart, PaymentSession } from "@medusajs/medusa"
import { Button } from "@medusajs/ui"
import { OnApproveActions, OnApproveData } from "@paypal/paypal-js"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { placeOrder } from "@modules/checkout/actions"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
import Spinner from "@modules/common/icons/spinner"
import { v4 as uuidv4 } from "uuid"
import { stringify } from "querystring"

type PaymentButtonProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ cart }) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    cart.shipping_methods.length < 1
      ? true
      : false

  const paymentSession = cart.payment_session as PaymentSession

  switch (paymentSession.provider_id) {
    case "stripe":
      return <StripePaymentButton notReady={notReady} cart={cart} />
    case "manual":
      return <ManualTestPaymentButton notReady={notReady} cart={cart} />
    case "paypal":
      return <PayPalPaymentButton notReady={notReady} cart={cart} />
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const createDoordashDelivery = async (
  quoteID: string,
  tip: number,
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
) => {
  console.log("MAKING Doordash CALL")
  // Accepting the delivery quote not working creating a new delivery instead
  // const acceptDordashQuote = await fetch(
  //   "http://localhost:9000/doordash/acceptQuote/",
  //   {
  //     method: "POST",
  //     body: JSON.stringify({
  //       external_delivery_id: quoteID,
  //     }),
  //   }
  // ).then((res) => {
  //   if (!res.ok) {
  //     throw new Error("Could not get delivery quote ID")
  //   }
  // })
  const external_delivery_id = uuidv4()
  const doorDashDelivery = await fetch(
    "http://localhost:9000/doordash/createDelivery/",
    {
      method: "POST",
      body: JSON.stringify({
        external_delivery_id: external_delivery_id,
        order_fulfillment_method: "standard",
        pickup_address: "3400 Chestnut Street, Philadelphia, PA, 19104",
        pickup_business_name: "My Store",
        dropoff_address: `${cart.shipping_address?.address_1}, ${cart.shipping_address?.city}, ${cart.shipping_address?.province}, ${cart.shipping_address?.postal_code}`,
        dropoff_phone_number: "+1" + cart.shipping_address?.phone,
        dropoff_contact_given_name: cart.customer.first_name,
        dropoff_contact_family_name: cart.customer.last_name,
        order_value: cart.subtotal,
        items: cart.items.filter(item => item.title !== "Tip").map((item) => {
          return {
            name: item.title,
            quantity: item.quantity,
            price: item.unit_price,
          }
        }),
        tip: tip,
      }),
    }
  ).then((res) => {
    if (!res.ok) {
      throw new Error("Could not get delivery ID")
    }
    return res.json()
  })
  .then((data) => {
    console.log("Doordash DATA - ", data)
    return data
  })
  await fetch("http://localhost:9000/delivery/updateDeliveryRecord", {
    method: "POST",
    body: JSON.stringify({
      deliveryId: doorDashDelivery.id,
    }),
  })
}

const createUberDelivery = async (
  quoteID: string,
  tip: number,
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
) => {
  console.log("MAKING UBER CALL")
  const uberDelivery = await fetch(
    "http://localhost:9000/uber/delivery/create",
    {
      method: "POST",
      body: JSON.stringify({
        pickup_name: "My Store",
        pickup_business_name: "My Store",
        pickup_address: "3400 Chestnut street, Philadelphia, PA 19104",
        pickup_phone_number: "4444444444",
        dropoff_name: `${cart.customer.first_name} ${cart.customer.last_name}`,
        dropoff_address: `{"street_address":["${cart.shipping_address?.address_1}"],"city":"${cart.shipping_address?.city}","state":"${cart.shipping_address?.province}","zip_code":"${cart.shipping_address?.postal_code}","country":"US"}`,
        dropoff_phone_number: cart.shipping_address?.phone,
        manifest_items: cart.items.filter(item => item.title !== "Tip").map((item) => {
          return {
            name: item.title,
            quantity: item.quantity,
            price: item.unit_price,
          }
        }),
        quote_id: quoteID,
        tip: tip,
        test_specifications: {
          robo_courier_specification: {
            mode: "auto",
          },
        }
      }),
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Could not get delivery quote ID")
      }
      return res.json()
    })
    .then((data) => {
      console.log("UBER DATA - ", data)
      return data
    })
  await fetch("http://localhost:9000/delivery/updateDeliveryRecord", {
    method: "POST",
    body: JSON.stringify({
      deliveryId: uberDelivery.id,
    }),
  })
}

const completeDelivery = async (
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
) => {
  const tipAmount = cart.items.find((item) => item.title === "Tip")?.unit_price
  const tip = tipAmount !== undefined ? tipAmount : 0
  const createDelivery = await fetch(
    "http://localhost:9000/delivery/deliveryQuoteId",
    {
      method: "GET",
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Could not get delivery quote ID")
      }
      return res.json()
    })
    .then((data) => {
      console.log(
        "TESTTT - ",
        data.result[0].dspOption,
        data.result[0].deliveryQuoteId
      )
      // if doordash
      if (data.result[0].dspOption == "doordash") {
        createDoordashDelivery(data.result[0].deliveryQuoteId, tip, cart)
      }
      // if uber
      if (data.result[0].dspOption === "uber") {
        console.log("UBER")
        createUberDelivery(data.result[0].deliveryQuoteId, tip, cart)
      }
    })
}

const StripePaymentButton = ({
  cart,
  notReady,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
  notReady: boolean
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .then(async () => {
        completeDelivery(cart)
      })
      .catch(() => {
        setErrorMessage("An error occurred, please try again.")
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_session as PaymentSession

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address.first_name +
              " " +
              cart.billing_address.last_name,
            address: {
              city: cart.billing_address.city ?? undefined,
              country: cart.billing_address.country_code ?? undefined,
              line1: cart.billing_address.address_1 ?? undefined,
              line2: cart.billing_address.address_2 ?? undefined,
              postal_code: cart.billing_address.postal_code ?? undefined,
              state: cart.billing_address.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
      >
        Place order
      </Button>
      <ErrorMessage error={errorMessage} />
    </>
  )
}

const PayPalPaymentButton = ({
  cart,
  notReady,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
  notReady: boolean
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .then(async () => {
        completeDelivery(cart)
      })
      .catch(() => {
        setErrorMessage("An error occurred, please try again.")
        setSubmitting(false)
      })
  }

  const session = cart.payment_session as PaymentSession

  const handlePayment = async (
    _data: OnApproveData,
    actions: OnApproveActions
  ) => {
    actions?.order
      ?.authorize()
      .then((authorization) => {
        if (authorization.status !== "COMPLETED") {
          setErrorMessage(`An error occurred, status: ${authorization.status}`)
          return
        }
        onPaymentCompleted()
      })
      .catch(() => {
        setErrorMessage(`An unknown error occurred, please try again.`)
        setSubmitting(false)
      })
  }

  const [{ isPending, isResolved }] = usePayPalScriptReducer()

  if (isPending) {
    return <Spinner />
  }

  if (isResolved) {
    return (
      <>
        <PayPalButtons
          style={{ layout: "horizontal" }}
          createOrder={async () => session.data.id as string}
          onApprove={handlePayment}
          disabled={notReady || submitting || isPending}
        />
        <ErrorMessage error={errorMessage} />
      </>
    )
  }
}

const ManualTestPaymentButton = ({
  notReady,
  cart,
}: {
  notReady: boolean
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .then(async () => {
        completeDelivery(cart)
      })
      .catch((err) => {
        setErrorMessage(err.toString())
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
      >
        Place order
      </Button>
      <ErrorMessage error={errorMessage} />
    </>
  )
}

export default PaymentButton
