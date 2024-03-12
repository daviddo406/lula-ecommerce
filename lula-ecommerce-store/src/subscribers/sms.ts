import { 
    type SubscriberConfig, 
    type SubscriberArgs,
    OrderService,
  } from "@medusajs/medusa"
  
  export default async function handleOrderPlaced({ 
    data, eventName, container, pluginOptions, 
  }: SubscriberArgs<Record<string, string>>) {
    const twilioSmsService = container.resolve("twilioSmsService")
    const orderService: OrderService = container.resolve(
      "orderService"
    )
  
    const order = await orderService.retrieve(data.id, {
      relations: ["shipping_address"],
    })
  
    if (order.shipping_address.phone) {
      twilioSmsService.sendSms({
        to: '+18777804236',
        body: "We have received your order #" + data.id,
      })
    }
  }
  
  export const config: SubscriberConfig = {
    event: OrderService.Events.PLACED,
    context: {
      subscriberId: "order-placed-handler",
    },
  }