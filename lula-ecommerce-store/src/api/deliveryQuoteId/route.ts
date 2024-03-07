import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { DspRepository } from "src/repositories/dspRepository";
import { EntityManager } from "typeorm";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const dspRepository: typeof DspRepository =
    req.scope.resolve("dspRepository");
  const manager: EntityManager = req.scope.resolve("manager");
  const dspRepo = manager.withRepository(dspRepository);

  return res.json({
    posts: await dspRepo.find(),
  });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const dspRepository: typeof DspRepository =
    req.scope.resolve("DspRepository");
  const manager: EntityManager = req.scope.resolve("manager");
  const dspRepo = manager.withRepository(dspRepository);

  //   add try catch for error handling
  const post = dspRepo.create();
  post.deliveryQuoteId = req.body.deliveryQuoteId;
  const result = await dspRepo.save(post);

  //   return res.status(200);

  //   return res.json({
  //     posts: await dspRepo.create(),
  //   });
};
