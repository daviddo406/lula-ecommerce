import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@Entity({ name: "dspDelivery" })
export class dspDelivery extends BaseEntity {
  @Column({ type: "varchar" })
  deliveryQuoteId: string | null;

  @Column({ type: "varchar" })
  dspOption: string | null;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "dspDelivery");
  }
}
