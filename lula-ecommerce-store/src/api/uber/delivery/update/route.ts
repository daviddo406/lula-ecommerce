import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import axios from "axios";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    const url = `https://api.uber.com/v1/customers/${process.env.UBER_CUSTOMER_ID}/deliveries/${req.body.deliveryId}`;
    const updateDeliveryReqData = {
        // data
    };
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.headers.authorization
        }
    };
    axios.post(url, updateDeliveryReqData, headers)
        .then(updateDeliveryRes => {
            console.log(updateDeliveryRes.data);
            res.json(updateDeliveryRes.data);
        }).catch(error => {
            console.log(error)
        })
}