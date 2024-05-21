import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { DspRepository } from "src/repositories/dspRepository";
import { EntityManager, Raw } from "typeorm";
import { dspDelivery } from "../../../models/dspDelivery";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  console.log("\n\nGETTINGGGGGG\n\n");
  const manager: EntityManager = req.scope.resolve("manager");
  const dspRepo = manager.getRepository(dspDelivery);
  console.log("\n\n", req.body, "\n\n");
  const result = await dspRepo.find({
    where: {
      cartId: String(req.query.cartId),
    },
  });
  console.log("GET RESULTTT - ", result);
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
  console.log(req.body, reqBody["quoteId"], reqBody.quoteId);
  const post = dspRepo.create();
  post.deliveryQuoteId = reqBody.quoteId;
  post.dspOption = reqBody.dspOption;
  post.cartId = reqBody.cartId;
  post.deliveryId = "";
  const result = await dspRepo.save(post);
  console.log("Saved post");
  return res.json();
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  //   const dspRepository: typeof DspDelivery = req.scope.resolve("dspDelivery");
  console.log("\n\n DELETING");
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
  console.log(post);
  console.log("DELETE - ", post);
  const result = await dspRepo.remove(post);
  return res.json();
};
