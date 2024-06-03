import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import axios from "axios";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const url = `https://api.uber.com/v1/customers/${process.env.UBER_CUSTOMER_ID}/deliveries/${req.body.deliveryId}`;
  const deleteDeliveryReqData = {
    // data
  };
  const headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  };
  axios
    .post(url, deleteDeliveryReqData, headers)
    .then((deleteDeliveryRes) => {
      res.json(deleteDeliveryRes.data);
    })
    .catch((error) => {});
}
