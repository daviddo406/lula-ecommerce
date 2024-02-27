"use client"

import React, { useState } from 'react'
import { Cart } from "@medusajs/medusa"
import { Button, Container, Heading, Text, Tooltip, clx } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CheckCircleSolid } from "@medusajs/icons"


type TippingProps = {
    cart: Omit<Cart, "refundable_amount" | "refunded_total">
    //onSubmitTip: {tipAmount: number}; //=> void;
    onSubmitTip: number;
}

const Tipping: React.FC<TippingProps> = ({ cart, onSubmitTip }) => {
const [tipAmount, setTipAmount] = useState<number | string>('');
const [customTipVisible, setCustomTipVisible] = useState(false);

const handleTipOption = (percentage: number) => {
    console.log("in handle tip func pre if")
    if (cart.subtotal){
        const tip = (percentage / 100) * cart.subtotal;
        setTipAmount(tip);
        //onSubmitTip(tip);
        onSubmitTip = tip;
        console.log(onSubmitTip)
    }
}
const searchParams = useSearchParams()
const router = useRouter()
const pathname = usePathname()

const isOpen = searchParams.get("step") === "tip"

const handleEdit = () => {
    router.push(pathname + "?step=tip", { scroll: false })
  }

const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const customTip = e.target.value;
    setTipAmount(customTip);
    //onSubmitTip(parseFloat(customTip));
    onSubmitTip = parseFloat(customTip);
}
const [isLoading, setIsLoading] = useState(false)

const toggleCustomTip = () => {
    setCustomTipVisible(!customTipVisible);
}

const handleSubmit = () => {
    setIsLoading(true)
    router.push(pathname + "?step=payment", { scroll: false })
    setIsLoading(false)
  }



return (
    <div>
        <div className="flex flex-row items-center justify-between mb-6">
    <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
                "opacity-50 pointer-events-none select-none":
                  !isOpen 
              }
          )}
        >
          Tip
          {!isOpen && <CheckCircleSolid />}
        </Heading>
        <Text>
              <button
                onClick={handleEdit}
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              >
                Edit
              </button>
            </Text>
            </div>
    <Button
    onClick={() => handleTipOption(5)}
    className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover">
        5%
    </Button>
    <Button
    onClick={() => handleTipOption(10)}
    className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover">
        10%
    </Button>
    <Button
    onClick={() => handleTipOption(15)}
    className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover">
        15%
    </Button>
    <Button
    onClick={() => handleTipOption(20)}
    className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover">
        20%
    </Button>
    <Button 
    onClick={toggleCustomTip} 
    className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover">
        Other
    </Button>
    
    {customTipVisible && (
                <div>
                    <label htmlFor="customTip">
                        <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Custom Tip Amount:
                </Text>
                </label>
                    <input
                        type="number"
                        id="customTip"
                        value={tipAmount}
                        onChange={handleCustomTipChange}
                    />
                </div>
    )}

    <div>
    <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading} >
            Continue to payment
            
          </Button>
          
    </div>
    </div>
)
}
export default Tipping