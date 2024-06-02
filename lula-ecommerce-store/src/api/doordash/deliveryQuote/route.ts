import {
  DeliveryResponse,
  DoorDashClient,
  DoorDashResponse,
} from "@doordash/sdk";
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

interface ServerResponse {
  code: string;
  message: string;
  reason?: string;
  fieldErrors?: any[]; // Optional field_errors array
}

function handleResponse(responseData): string {
  var errorMsg = "";

  if (responseData.fieldErrors) {
    var field_errors = responseData.fieldErrors;
    field_errors.forEach((error) => {
      errorMsg += `${error.error}\n`;
    });
    return errorMsg;
  }

  if (responseData.message) {
    var message: string = responseData.message;
    if (message.includes("distance between addresses exceeded")) {
      message += " (Over 20 miles)";
    }
    return message;
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const client = new DoorDashClient({
    developer_id: String(process.env.DEVELOPER_ID),
    key_id: String(process.env.KEY_ID),
    signing_secret: String(process.env.SIGNING_SECRET),
  });

  client
    .deliveryQuote(req.body)
    .then((response: DoorDashResponse<DeliveryResponse>) => {
      res.json({
        status: response.status,
        // status: 400,
        fee: response.data.fee,
        quoteId: response.data.external_delivery_id,
      });
    })
    .catch((err: any) => {
      res.json({
        status: 400,
        errorMessage: handleResponse(err),
      });
    });
}
// https://openapi.doordash.com/drive/v2/quotes
