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

function handleResponse(responseData: ServerResponse): void {
  console.log(responseData);
  console.log("-------------------------------");
  var errorMsg = "";
  if (responseData.message) {
    errorMsg += responseData.message;
    if (responseData.reason) {
      errorMsg += ` - ${responseData.reason}`;
    }
  }

  if (responseData.fieldErrors) {
    var field_errors = responseData.fieldErrors;
    for (var item in field_errors) {
      errorMsg += `\n${item} - ${field_errors[item]}`;
    }
  }
  console.log(errorMsg);
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
      // handle error
      // console.log("-------------------------------");
      // console.log(err);
      // console.log("-------------------------------");
      // handleResponse(err as ServerResponse);
      // console.log("-------------------------------");
    });
}
// https://openapi.doordash.com/drive/v2/quotes
