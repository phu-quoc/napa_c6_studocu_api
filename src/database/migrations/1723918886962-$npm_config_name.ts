import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1723918886962 implements MigrationInterface {
    name = ' $npmConfigName1723918886962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_code_expire_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_code_expire_at"`);
    }

}
