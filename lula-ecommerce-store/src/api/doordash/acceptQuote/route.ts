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
    .deliveryQuoteAccept(req.body.external_delivery_id)
    .then((response: DoorDashResponse<DeliveryResponse>) => {
      // do something
    })
    .catch((err: any) => {
      // handle error
    });
}
// https://openapi.doordash.com/drive/v2/quotes
