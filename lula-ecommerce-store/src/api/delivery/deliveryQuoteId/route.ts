import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { DspRepository } from "src/repositories/dspRepository";
import { EntityManager, Raw } from "typeorm";
import { dspDelivery } from "../../../models/dspDelivery";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const manager: EntityManager = req.scope.resolve("manager");
  const dspRepo = manager.getRepository(dspDelivery);
  const result = await dspRepo.find({
    where: {
      cartId: String(req.query.cartId),
    },
  });
  return res.json({
    result: result,
  });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  //   const dspRepository: typeof DspDelivery = req.scope.resolve("dspDelivery");
  const manager: EntityManager = req.scope.resolve("manager");
  const dspRepo = manager.getRepository(dspDelivery);

  //   //   add try catch for error handling
  const reqBody = JSON.parse(req.body);
  const post = dspRepo.create();
  post.deliveryQuoteId = reqBody.quoteId;
  post.dspOption = reqBody.dspOption;
  post.cartId = reqBody.cartId;
  post.deliveryId = "";
  const result = await dspRepo.save(post);
  return res.json();
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  //   const dspRepository: typeof DspDelivery = req.scope.resolve("dspDelivery");
  const manager: EntityManager = req.scope.resolve("manager");
  const dspRepo = manager.getRepository(dspDelivery);

  //   //   add try catch for error handling

  // const post = await dspRepo.findBy({
  //   created_at: Raw((alias) => `${alias} < NOW()`),
  // });
  const reqBody = JSON.parse(req.body);
  const post = await dspRepo.find({
    where: {
      cartId: reqBody.cartId,
    },
  });
  const result = await dspRepo.remove(post);
  return res.json();
};
