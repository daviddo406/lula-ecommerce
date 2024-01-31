import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    res.json({
      message: "Hello world",
      testing: req.headers
    });
}