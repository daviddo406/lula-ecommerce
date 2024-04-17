import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import { dspDelivery } from "../../../models/dspDelivery";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const reqBody = JSON.parse(req.body);
  const manager: EntityManager = req.scope.resolve("manager");
  const dspRepo = manager.getRepository(dspDelivery);
  const dspDeliveryRecord = await dspRepo.find();
  const data = {
    deliveryId: reqBody.deliveryId,
  }
  Object.assign(dspDeliveryRecord[0], data)
  const updatedDspDeliveryRecord = await dspRepo.save(dspDeliveryRecord);
};