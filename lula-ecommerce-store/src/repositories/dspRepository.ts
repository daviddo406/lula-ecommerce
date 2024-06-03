import { dspDelivery } from "../models/dspDelivery";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const DspRepository = dataSource.getRepository(dspDelivery).extend({
  customMethod(): void {
    // TODO add custom implementation
    return;
  },
});

export default DspRepository;
