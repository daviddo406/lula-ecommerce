import { Order } from "@medusajs/medusa"
import { Heading, Text } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"

type ContactInfoProps = {
  order: Order
}

const ContactInfo = ({ order }: ContactInfoProps) => {
  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        Contact Info
      </Heading>
      <div className="flex items-start gap-x-8">
        <div className="flex flex-col w-1/3">
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            Name
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address.first_name}{" "}
            {order.shipping_address.last_name}
          </Text>
        </div>

        <div className="flex flex-col w-1/3">
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            Phone Number
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address.phone}
          </Text>
        </div>

        <div className="flex flex-col w-1/3">
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            Email Address
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.email}
          </Text>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default ContactInfo