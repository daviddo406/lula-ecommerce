import {
  DeliveryResponse,
  DoorDashClient,
  DoorDashResponse,
} from "@doordash/sdk";
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
  
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const client = new DoorDashClient({
      developer_id: String(process.env.DEVELOPER_ID),
      key_id: String(process.env.KEY_ID),
      signing_secret: String(process.env.SIGNING_SECRET),
  });

  client
    .getDelivery(req.body.deliveryId)
    .then((response: DoorDashResponse<DeliveryResponse>) => {
        console.log(response.data)
        res.json(response.data)
    })
    .catch(err => {
        console.log(err)
    })
}