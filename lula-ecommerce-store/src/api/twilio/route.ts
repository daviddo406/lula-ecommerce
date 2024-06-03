import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import twilio from "twilio";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  console.log(
    "\n\nSEEEEEE",
    process.env.TWILIO_SMS_TO_NUMBER,
    process.env.TWILIO_SMS_FROM_NUMBER
  );

  const body = JSON.parse(req.body);

  const twilioClient = twilio(
    process.env.TWILIO_SMS_ACCOUNT_SID,
    process.env.TWILIO_SMS_AUTH_TOKEN
  );

  twilioClient.messages.create({
    body: body.cancellationMessage,
    // to: body.userPhoneNumber,
    from: process.env.TWILIO_SMS_FROM_NUMBER,
    to: process.env.TWILIO_SMS_TO_NUMBER,
  });
}
