import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1693919811007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS"symbol" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(10) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "description" character varying(100), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3bb4dc32218eb1501b1582ab36c" UNIQUE ("name"), CONSTRAINT "PK_d1373cd631624b100a81a545dee" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS"rate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "price" integer NOT NULL, "symbol1Id" uuid, "symbol2Id" uuid, CONSTRAINT "REL_fa2c245144d1c9f0ccb329fecd" UNIQUE ("symbol1Id"), CONSTRAINT "REL_c47fe228f183e0435eee0bfb51" UNIQUE ("symbol2Id"), CONSTRAINT "PK_2618d0d38af322d152ccc328f33" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "rate" ADD CONSTRAINT "FK_fa2c245144d1c9f0ccb329fecd5" FOREIGN KEY ("symbol1Id") REFERENCES "symbol"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "rate" ADD CONSTRAINT "FK_c47fe228f183e0435eee0bfb516" FOREIGN KEY ("symbol2Id") REFERENCES "symbol"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`
    );

    await queryRunner.query(`INSERT INTO symbol (name) VALUES ('USD'), ('USDT'), ('BTC');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM symbol`);
    await queryRunner.query(`ALTER TABLE "rate" DROP CONSTRAINT "FK_c47fe228f183e0435eee0bfb516"`);
    await queryRunner.query(`ALTER TABLE "rate" DROP CONSTRAINT "FK_fa2c245144d1c9f0ccb329fecd5"`);
    await queryRunner.query(`DROP TABLE "rate"`);
    await queryRunner.query(`DROP TABLE "symbol"`);
  }
}
