import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import twilio from "twilio";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  console.log(
    "\n\nSEEEEEE",
    process.env.TWILIO_SMS_ACCOUNT_SID,
    process.env.TWILIO_SMS_AUTH_TOKEN,
    process.env.TWILIO_SMS_FROM_NUMBER
  );

  const body = JSON.parse(req.body);

  const twilioClient = twilio(
    process.env.TWILIO_SMS_ACCOUNT_SID,
    process.env.TWILIO_SMS_AUTH_TOKEN
  );

  twilioClient.messages.create({
    body: body.cancellationMessage,
    from: "+18667957084",
    to: "+18777804236",
  });
}
