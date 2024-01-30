import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    res.json({
      message: "Hello world",
      testing: req.headers
    });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    switch (req.body.type) {
        case "create":
            createDelivery(req, res);
            break;
        case "update":
            updateDelivery(req, res);
            break;
        case "cancel":
            cancelDelivery(req, res);
            break;
        default:
            break;
    }
}

const createDelivery =  function(req: MedusaRequest, res: MedusaResponse): MedusaResponse {
    return res
}

const updateDelivery =  function(req: MedusaRequest, res: MedusaResponse): MedusaResponse {
    return res
}

const cancelDelivery =  function(req: MedusaRequest, res: MedusaResponse): MedusaResponse {
    return res
}