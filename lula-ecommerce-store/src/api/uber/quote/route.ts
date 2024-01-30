import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import axios from "axios";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    const quoteData = {

    }
    const headers = {
        
    }
    axios.post(`https://api.uber.com/v1/customers/${process.env.UBER_CUSTOMER_ID}/delivery_quotes`, quoteData, headers)
        .then(res => {
            console.log(res)
        }).catch(error => {
            console.log(error)
        })
}