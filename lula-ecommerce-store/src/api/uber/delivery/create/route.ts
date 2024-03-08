import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import axios from "axios";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const url = `https://api.uber.com/v1/customers/${process.env.UBER_CUSTOMER_ID}/deliveries`;
  const deliveryReqData = {
    quote_id: req.body.quote_id,
    tip: req.body.tip,
    pickup_address:
      '{"street_address":["100 Maiden Ln"],"city":"New York","state":"NY","zip_code":"10023","country":"US"}',
    dropoff_address:
      '{"street_address":["30 Lincoln Center Plaza"],"city":"New York","state":"NY","zip_code":"10023","country":"US"}',
    pickup_name: "My Store",
    pickup_phone_number: "4444444444",
    dropoff_name: "Reese Ippient",
    dropoff_phone_number: "5555555555",
    manifest_items: [
      {
        name: "Cell phone box",
        quantity: 1,
        weight: 30,
        dimensions: {
          length: 40,
          height: 40,
          depth: 40,
        },
      },
    ],
    test_specifications: {
      robo_courier_specification: {
        mode: "auto",
      },
    },
  };
  const headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  };
  axios
    .post(url, deliveryReqData, headers)
    .then((deliveryRes) => {
      console.log(deliveryRes.data);
      res.json(deliveryRes.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
