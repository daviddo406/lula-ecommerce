import Input from "@modules/common/components/input"
import { ChangeEvent, useState } from "react"
import { Button, Text } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import DSPSummary from "./DSPSummary"
import Divider from "@modules/common/components/divider"

function BasicAddress() {
  const [formData, setFormData] = useState({
    "billing_address.first_name": "",
    "billing_address.last_name": "",
    "billing_address.address_1": "",
    "billing_address.postal_code": "",
    "billing_address.city": "",
    "billing_address.province": "",
    "billing_address.phone": "",
  })

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

  const areAllFieldsInitialized = () => {
    return Object.values(formData).every((value) => value !== "")
  }

  const [displayQuote, setDisplayQuote] = useState(false)
  const handleSubmit = () => {
    console.log("submitting for quote")
    setDisplayQuote(true)
  }
  const router = useRouter()
  const pathname = usePathname()

  //   const handleEdit = () => {
  //     router.push(pathname + "?step=checkoutOptions", { scroll: false })
  //   }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          name="billing_address.first_name"
          autoComplete="given-name"
          value={formData["billing_address.first_name"]}
          onChange={handleChange}
          required
        />
        <Input
          label="Last name"
          name="billing_address.last_name"
          autoComplete="family-name"
          value={formData["billing_address.last_name"]}
          onChange={handleChange}
          required
        />
        <Input
          label="Address"
          name="billing_address.address_1"
          autoComplete="address-line1"
          value={formData["billing_address.address_1"]}
          onChange={handleChange}
          required
        />
        <Input
          label="Postal code"
          name="billing_address.postal_code"
          autoComplete="postal-code"
          value={formData["billing_address.postal_code"]}
          onChange={handleChange}
          required
        />
        <Input
          label="City"
          name="billing_address.city"
          autoComplete="address-level2"
          value={formData["billing_address.city"]}
          onChange={handleChange}
          required
        />
        <Input
          label="State / Province"
          name="billing_address.province"
          autoComplete="address-level1"
          value={formData["billing_address.province"]}
          onChange={handleChange}
        />
        <Input
          label="Phone"
          name="billing_address.phone"
          autoComplete="tel"
          value={formData["billing_address.phone"]}
          onChange={handleChange}
        />
        <div>
          {areAllFieldsInitialized() && (
            <Button size="large" className="mt-6" onClick={handleSubmit}>
              View Delivery Quote
            </Button>
          )}
        </div>
        <div>
          {displayQuote && (
            <>
              <Divider className="mt-8" /> <DSPSummary />{" "}
            </>
          )}
          {/* <DSPSummary /> */}
        </div>
      </div>
    </>
  )
}

export default BasicAddress
