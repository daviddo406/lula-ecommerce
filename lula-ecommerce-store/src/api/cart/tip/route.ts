import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const lineItemService = req.scope.resolve("lineItemService");
  if (req.body.tipItemId !== undefined) {
    await lineItemService.update(req.body.tipItemId, {
      unit_price: req.body.tip,
    });
    return res.json({
      message: "tip updated!",
    });
  }
  await lineItemService.create({
    cart_id: req.body.cartId,
    title: "Tip",
    has_shipping: false,
    allow_discounts: false,
    unit_price: req.body.tip,
    quantity: 1,
    includes_tax: false
  })
  res.json({
    message: "tip added!",
  });
}