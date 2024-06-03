import { MigrationInterface, QueryRunner } from "typeorm";

export class DspDelivery1709564553057 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "dspDelivery" (
            "id" character varying NOT NULL,
            "deliveryQuoteId" character varying NOT NULL,
            "dspOption" character varying NOT NULL,
            "deliveryId" character varying NULL,
            "cartId" character varying NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        )`
    );
    await queryRunner.createPrimaryKey("dspDelivery", ["id"]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("dspDelivery", true);
  }
}
