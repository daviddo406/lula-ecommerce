import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import axios from "axios";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    const url = `https://api.uber.com/v1/customers/${process.env.UBER_CUSTOMER_ID}/delivery_quotes`;
    const quoteReqData = {
        "pickup_address": "{\"street_address\":[\"100 Maiden Ln\"],\"city\":\"New York\",\"state\":\"NY\",\"zip_code\":\"10023\",\"country\":\"US\"}",
        "dropoff_address": "{\"street_address\":[\"30 Lincoln Center Plaza\"],\"city\":\"New York\",\"state\":\"NY\",\"zip_code\":\"10023\",\"country\":\"US\"}",
    };
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.headers.authorization
        }
    };
    axios.post(url, quoteReqData, headers)
        .then(quoteResData => {
            console.log(quoteResData.data);
            res.json(quoteResData.data);
        }).catch(error => {
            console.log(error)
        })
}