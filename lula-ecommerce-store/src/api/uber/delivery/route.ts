import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import axios from "axios";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const url = `https://api.uber.com/v1/customers/${process.env.UBER_CUSTOMER_ID}/deliveries/${req.body.deliveryId}`;
  const headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  };

  axios.get(url, headers)
    .then(response => {
      console.log(response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
    })
}