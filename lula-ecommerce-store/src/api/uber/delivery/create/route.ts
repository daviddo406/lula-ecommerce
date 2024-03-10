import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import axios from "axios";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const url = `https://api.uber.com/v1/customers/${process.env.UBER_CUSTOMER_ID}/deliveries`;
  const headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  };
  axios
    .post(url, req.body, headers)
    .then((deliveryRes) => {
      console.log(deliveryRes.data);
      res.json(deliveryRes.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
