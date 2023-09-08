import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1693919811007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "price" double precision NOT NULL, "symbol1" character varying(10) NOT NULL, "symbol2" character varying(10) NOT NULL, CONSTRAINT "PK_2c804ed4019b80ce48eedba5cec" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "currency_symbol" ("id" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "description" character varying(100), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_877c20b12edb632d7189abc0375" PRIMARY KEY ("id"))`
    );

    await queryRunner.query(`INSERT INTO currency_symbol (id) VALUES ('USD'), ('USDT'), ('BTC');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "currency_symbol"`);
    await queryRunner.query(`DROP TABLE "rates"`);
  }
}

