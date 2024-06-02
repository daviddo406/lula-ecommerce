import {
  AbstractFulfillmentService,
  Cart,
  Fulfillment,
  LineItem,
  Order,
} from "@medusajs/medusa";
import { CreateReturnType } from "@medusajs/medusa/dist/types/fulfillment-provider";

class DspFulfillmentService extends AbstractFulfillmentService {
  static identifier = "dsp-fulfillment";
  // methods here...
  constructor(container, options) {
    super(container);
  }

  async getFulfillmentOptions(): Promise<any[]> {
    return [
      {
        id: "dsp-fulfillment",
      },
    ];
  }

  async validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    cart: Cart
  ): Promise<Record<string, unknown>> {
    return {
      quoteId: data.quoteId,
      price: data.price,
    };
  }

  async validateOption(data: Record<string, unknown>): Promise<boolean> {
    return data.id == "dsp-fulfillment";
  }

  async canCalculate(data: Record<string, unknown>): Promise<boolean> {
    return data.id === "dsp-fulfillment";
  }

  async calculatePrice(
    optionData: Record<string, unknown>,
    data: { quoteId: string; price: number },
    cart: Cart
  ): Promise<number> {
    return data.price;
  }

  async createFulfillment(
    data: Record<string, unknown>,
    items: LineItem[],
    order: Order,
    fulfillment: Fulfillment
  ) {
    // No data is being sent anywhere
    // No data to be stored in the fulfillment's data object
    return {};
  }

  async cancelFulfillment(fulfillment: Record<string, unknown>): Promise<any> {
    return {};
  }

  async createReturn(
    returnOrder: CreateReturnType
  ): Promise<Record<string, unknown>> {
    return {};
  }

  async getFulfillmentDocuments(data: Record<string, unknown>): Promise<any> {
    // assuming you contact a client to
    // retrieve the document
    return {};
  }

  async getReturnDocuments(data: Record<string, unknown>): Promise<any> {
    // assuming you contact a client to
    // retrieve the document
    return {};
  }

  async getShipmentDocuments(data: Record<string, unknown>): Promise<any> {
    // assuming you contact a client to
    // retrieve the document
    return {};
  }

  async retrieveDocuments(
    fulfillmentData: Record<string, unknown>,
    documentType: "invoice" | "label"
  ): Promise<any> {
    // assuming you contact a client to
    // retrieve the document
    return {};
  }
}

export default DspFulfillmentService;
