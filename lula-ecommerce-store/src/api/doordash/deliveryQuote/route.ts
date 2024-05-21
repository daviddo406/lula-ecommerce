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
  console.log(responseData);
  console.log("-------------------------------");
  var errorMsg = "";
  console.log("\n\n");
  console.log(responseData.fieldErrors);
  console.log("\n\n");

  if (responseData.fieldErrors) {
    var field_errors = responseData.fieldErrors;
    field_errors.forEach((error) => {
      errorMsg += `${error.error}\n`;
      // console.log(`Field: ${error.field}, Error: ${error.error}`);
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
      // // do something
      // if (response.status !== 200) {
      //   throw Error(response.message);
      // }
      console.log("Delivery Fee - ", response.data.fee);
      console.log("Delivery Status - ", response.status);
      res.json({
        status: response.status,
        // status: 400,
        fee: response.data.fee,
        quoteId: response.data.external_delivery_id,
      });
      // console.log(response);
      // res.json(response);
    })
    .catch((err: any) => {
      console.log("\n\n");
      console.log(err);
      console.log("\n\n");
      res.json({
        status: 400,
        errorMessage: handleResponse(err),
      });
    });
}
// https://openapi.doordash.com/drive/v2/quotes
