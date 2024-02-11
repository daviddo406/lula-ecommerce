import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    console.log(req.body)
    res.sendStatus(200)
}