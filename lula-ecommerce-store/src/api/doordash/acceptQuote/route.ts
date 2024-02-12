import {
  DeliveryResponse,
  DoorDashClient,
  DoorDashResponse,
} from "@doordash/sdk";
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { json } from "body-parser";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const client = new DoorDashClient({
    developer_id: String(process.env.DEVELOPER_ID),
    key_id: String(process.env.KEY_ID),
    signing_secret: String(process.env.SIGNING_SECRET),
  });

  console.log(req.body);

  client
    .deliveryQuoteAccept(req.body)
    .then((response: DoorDashResponse<DeliveryResponse>) => {
      // do something
      console.log("Accept Quote");
    })
    .catch((err: any) => {
      // handle error
      console.log(err);
    });
}
// https://openapi.doordash.com/drive/v2/quotes
