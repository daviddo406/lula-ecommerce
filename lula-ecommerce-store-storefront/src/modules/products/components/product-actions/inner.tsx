"use client"

import { Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { Button } from "@medusajs/ui"
import { isEqual } from "lodash"
import React, { useEffect, useMemo, useRef, useState } from "react"

import { useIntersection } from "@lib/hooks/use-in-view"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/option-select"
import { addToCart } from "@modules/cart/actions"

import MobileActions from "../mobile-actions"
import ProductPrice from "../product-price"

type ProductActionsProps = {
  product: PricedProduct
  region: Region
}

export type PriceType = {
  calculated_price: string
  original_price?: string
  price_type?: "sale" | "default"
  percentage_diff?: string
}



export default function ProductActionsInner({
  product,
  region,
}: ProductActionsProps): JSX.Element {
  const [options, setOptions] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false);
  const [savedAddress, setSavedAddress] = useState({ city: '', state: '' });
  //const [deliveryMode, setDeliveryMode] = useState('Pick Up');

  

  
  // Evaluate if the product should be disabled based on restrictions and saved address
  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      const savedAddressJSON = localStorage.getItem('savedAddress');
      //console.log(savedAddressJSON);
      if (savedAddressJSON) {
        setSavedAddress(JSON.parse(savedAddressJSON));
      }
      const deliveryMode = localStorage.getItem('deliveryOption');
     
      console.log(deliveryMode);
      if (deliveryMode === 'Delivery') {
        setIsDisabled(product.variants.some(variant => {
          const restrictState = variant.metadata?.restrict_state as string;
          const restrictCities = variant.metadata?.restrict_city as string;
          //const cityArray = restrictCities?.split(', ').map((city: string) => city.toUpperCase());

          const statesArray = restrictState ? restrictState.split(',').map(state => state.trim().toUpperCase()) : [];
          const citiesArray = restrictCities ? restrictCities.split(',').map(city => city.trim().toUpperCase()) : [];

          const stateMatches = statesArray.length > 0 && statesArray.includes(savedAddress.state.toUpperCase());
          const cityMatches = citiesArray.length > 0 && citiesArray.includes(savedAddress.city.toUpperCase());

          //console.log(restrictCities);
          //console.log(restrictState);
          //console.log(citiesArray);
          //console.log(statesArray);

          //console.log(savedAddress.state);
          //console.log(savedAddress.city.toUpperCase);

          //console.log(stateMatches+ " < If state matches");
          //console.log(cityMatches + " < If city matches");         

          return stateMatches || cityMatches;
        }));
      }
    }
  }, [product]);


  const variants = product.variants

  // initialize the option state
  useEffect(() => {
    const optionObj: Record<string, string> = {}

    for (const option of product.options || []) {
      Object.assign(optionObj, { [option.id]: undefined })
    }

    setOptions(optionObj)
  }, [product])

  // memoized record of the product's variants
  const variantRecord = useMemo(() => {
    const map: Record<string, Record<string, string>> = {}

    for (const variant of variants) {
      if (!variant.options || !variant.id) continue

      const temp: Record<string, string> = {}

      for (const option of variant.options) {
        temp[option.option_id] = option.value
      }

      map[variant.id] = temp
    }

    return map
  }, [variants])

  // memoized function to check if the current options are a valid variant
  const variant = useMemo(() => {
    let variantId: string | undefined = undefined

    for (const key of Object.keys(variantRecord)) {
      if (isEqual(variantRecord[key], options)) {
        variantId = key
      }
    }

    return variants.find((v) => v.id === variantId)
  }, [options, variantRecord, variants])

  // if product only has one variant, then select it
  useEffect(() => {
    if (variants.length === 1 && variants[0].id) {
      setOptions(variantRecord[variants[0].id])
    }
  }, [variants, variantRecord])

  // update the options when a variant is selected
  const updateOptions = (update: Record<string, string>) => {
    setOptions({ ...options, ...update })
  }

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    if (variant && !variant.inventory_quantity) {
      return false
    }

    if (variant && variant.allow_backorder === false) {
      return true
    }
  }, [variant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!variant?.id || isDisabled) {
      alert("This product cannot be added to the cart due to restrictions.");
      return;
    }

    setIsAdding(true);
    try {
      await addToCart({ variantId: variant.id, quantity: 1 });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  }

 
  //console.log(isDisabled + "< Is it Disabled?");

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {product.variants.length > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={updateOptions}
                      title={option.title}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={variant} region={region} />
        
        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !variant || isDisabled}
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
        >
          {!variant
            ? "Select variant"
            : !inStock
            ? "Out of stock"
            : "Add to cart"}
        </Button>
        <MobileActions
          product={product}
          variant={variant}
          region={region}
          options={options}
          updateOptions={updateOptions}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
        />
      </div>
    </>
  )
}
