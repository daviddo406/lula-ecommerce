"use client"
import { Cart } from "@medusajs/medusa"
import { Tabs, CurrencyInput, Label, clx, Tooltip } from "@medusajs/ui"
import { useEffect, useState } from "react"
import axios from "axios"
import { get } from "lodash"
import { useRouter } from "next/navigation";

const Tip = ({
    cart
}:{
    cart: Omit<Cart, "refundable_amount" | "refunded_total">
}) => {
  const [preTip, setPreTip] = useState<number>(0)
  const [noTip, setNoTip] = useState<boolean>(false)
  const router = useRouter()

  const handlePreTipValueChange = (value: string) => {
    if (value === "No Tip") {
      setPreTip(0)
      setNoTip(true)
    } else {
      setPreTip(parseInt(value))
    }
  }

  const getTipItem = () => {
    return cart.items.find((item) => item.title === "Tip")
  }

  const getSubtotalWithoutTip = () => {
    const tipItem = cart.items.find((item) => item.title === "Tip")
    if (!cart.subtotal) {
      return 0
    }
    if (tipItem !== null && tipItem !== undefined) {
      return cart.subtotal - tipItem?.unit_price
    }
    return cart.subtotal
  }

  useEffect(() => {
    if (preTip !== 0 || noTip) {
      let tip: number = 0
      tip = (getSubtotalWithoutTip() / 100) * (preTip / 100)
      let tipRounded = Math.round(tip * 100)
      let data = {tip: tipRounded, cartId: cart.id, tipItemId: get(getTipItem(), "id")}
      axios.post("http://localhost:9000/cart/tip", data, {headers: {"Content-Type": "application/json"}})
      .then((response) => {
        console.log("request successful")
        router.refresh()
      }).catch((error) => {
        console.log(error)
      })
    }
  }, [preTip, cart.subtotal])

    return (
      <div>
        <h2>
          Tip
        </h2>
        <Tooltip content="Tooltip content">Trigger</Tooltip>
        <Tabs className="my-3" onValueChange={handlePreTipValueChange} defaultValue="No Tip">
          <Tabs.List>
            <Tabs.Trigger 
              className={clx(
                "border-ui-border-base bg-ui-bg-subtle border text-small-regular h-10 rounded-rounded p-5 flex-1 ",
                {
                  "border-ui-border-interactive": preTip === 0,
                  "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                    preTip !== 0,
                })}
                value="No Tip"
              >
                No Tip
              </Tabs.Trigger>
              <Tabs.Trigger 
                className={clx(
                  "border-ui-border-base bg-ui-bg-subtle border text-small-regular h-10 rounded-rounded p-5 flex-1 ",
                  {
                    "border-ui-border-interactive": preTip === 10,
                    "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                      preTip !== 10,
                  })}
                value="10"
              >
                10%
              </Tabs.Trigger>
              <Tabs.Trigger 
                className={clx(
                  "border-ui-border-base bg-ui-bg-subtle border text-small-regular h-10 rounded-rounded p-5 flex-1 ",
                  {
                    "border-ui-border-interactive": preTip === 15,
                    "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                      preTip !== 15,
                  })}
                value="15"
              >
                15%
              </Tabs.Trigger>
              <Tabs.Trigger 
                className={clx(
                  "border-ui-border-base bg-ui-bg-subtle border text-small-regular h-10 rounded-rounded p-5 flex-1 ",
                  {
                    "border-ui-border-interactive": preTip === 20,
                    "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                      preTip !== 20,
                  })}
                value="20"
              >
                20%
              </Tabs.Trigger>
          </Tabs.List>
        </Tabs>
        {/* {displayCustomTip && 
          <CurrencyInput
            className="mt-4"
            placeholder="Enter Custom Tip" 
            symbol="$" 
            code="usd"
            defaultValue={0}
          /> */}
      </div>
    )
}

export default Tip