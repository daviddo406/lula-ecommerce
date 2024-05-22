"use client"

import { Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { Button } from "@medusajs/ui"
import { isEqual } from "lodash"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { emitter } from "../../../../utils/emitter"

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

//type DeliveryOption = 'Pick Up' | 'Delivery';

interface Address {
  city: string;
  state: string;
}

export default function ProductActionsInner({
  product,
  region,
}: ProductActionsProps): JSX.Element {
  const [options, setOptions] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false);
  const [savedAddress, setSavedAddress] = useState<Address>({ city: '', state: '' });
  const [deliveryOption, setDeliveryOption] = useState('Pick Up');


  // This useEffect hook is used to initialize the component state from localStorage
  // when the component mounts. This is crucial for keeping state in sync across pages.
  useEffect(() => {
    const savedAddress = localStorage.getItem('savedAddress');
    const deliveryOption = localStorage.getItem('deliveryOption');
    // If there is a saved address in localStorage, parse it, set it to state,
    // and check restrictions based on this address and the current delivery option.
    if (savedAddress) {
        setSavedAddress(JSON.parse(savedAddress));
        checkRestrictions(deliveryOption, JSON.parse(savedAddress));
    }
    // If there is a saved delivery option, set it to state.
    if (deliveryOption) {
        setDeliveryOption(deliveryOption);
    }
}, []); // Empty dependency array ensures this runs only once when the component mounts.


  // Function to check if the product should be disabled for legal restriction
  const checkRestrictions = useCallback((option : string | null, address: Address) => {
    if (option === 'Delivery') {
      const disabled = product.variants.some(variant => {
        const restrictState = variant.metadata?.restrict_state as string;
        const restrictCities = variant.metadata?.restrict_city as string;

        const statesArray = restrictState ? restrictState.split(',').map(state => state.trim().toUpperCase()) : [];
        const citiesArray = restrictCities ? restrictCities.split(',').map(city => city.trim().toUpperCase()) : [];

        const stateMatches = statesArray.includes(address.state.toUpperCase());
        const cityMatches = citiesArray.includes(address.city.toUpperCase());

        return stateMatches || cityMatches;
      });
      setIsDisabled(disabled);
    } else {
      setIsDisabled(false);
    }
  }, [product.variants]);



  // Listen to delivery option changes
  useEffect(() => {
    const handleDeliveryChange = (option: string) => {
      setDeliveryOption(option);
      checkRestrictions(option, savedAddress);
    };

    emitter.on('deliveryOptionChange', handleDeliveryChange);
    return () => {
      emitter.off('deliveryOptionChange', handleDeliveryChange);
    };
  }, [checkRestrictions, savedAddress]);



  // Listen to address changes
  useEffect(() => {
    const handleAddressChange = (address: Address) => {
      setSavedAddress(address);
      checkRestrictions(deliveryOption, address);
    };

    emitter.on('savedAddressChange', handleAddressChange);
    return () => {
      emitter.off('savedAddressChange', handleAddressChange);
    };
  }, [checkRestrictions, deliveryOption]);





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
    if (!variant?.id) {
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
            : isDisabled
            ? "Legal Restriction"
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
