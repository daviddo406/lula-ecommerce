"use client"
import { ChangeEvent, useState } from "react"
import BasicAddress from "./BasicTestAddress"
import { Button, Text } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { v4 as uuidv4 } from "uuid"
interface Props {
  deliveryQuote: string
}

function DSPSummary({ deliveryQuote }: Props) {
  const [deliveryOption, setDeliveryOption] = useState("")
  const [deliveryFee, setDeliveryFee] = useState(0.0)
  const onOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDeliveryOption(e.target.value)
  }

  const router = useRouter()
  const pathname = usePathname()

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  // const client = new DoorDashClient({
  //   developer_id: String(process.env.DEVELOPER_ID),
  //   key_id: String(process.env.KEY_ID),
  //   signing_secret: String(process.env.SIGNING_SECRET),
  // })

  // fetch("http://localhost:9000/doordash/deliveryQuote", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     external_delivery_id: uuidv4(),
  //     // cart pickup adress and phone number need to be passed in
  //     pickup_address: "3400 Chestnut street, Philadelphia, PA, 19104",
  //     pickup_phone_number: "+12156886986",
  //     dropoff_address: address,
  //     dropoff_phone_number: "+1" + phone,
  //   }),
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log(data)
  //     setDeliveryFee(data.deliveryFee / 100)
  //   })
  //   .catch((error) => console.error(error))

  // client
  //   .deliveryQuote({
  //     external_delivery_id: uuidv4(),
  //     pickup_address: "3400 Chestnut street, Philadelphia, PA, 19104",
  //     pickup_phone_number: "+12156886986",
  //     dropoff_address: "3828 Spring Garden street, Philadelphia, PA, 19104",
  //     dropoff_phone_number: "+12675742792",
  //   })
  //   .then((response: DoorDashResponse<DeliveryResponse>) => {
  //     // do something
  //     console.log("Delivery Fee - ", response.data.fee)
  //     setDeliveryFee(response.data.fee * 1000)
  //   })
  //   .catch((err: any) => {
  //     // handle error
  //     console.log(err)
  //   })

  return (
    <div>
      <h1>SUMMARY</h1>
      <h1>Delivery Fee - ${deliveryQuote}</h1>
      <Button size="large" className="mt-6" onClick={handleSubmit}>
        Proceed to Payment
      </Button>
    </div>
  )
}

export default DSPSummary
