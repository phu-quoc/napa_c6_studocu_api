import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1724006789671 implements MigrationInterface {
    name = ' $npmConfigName1724006789671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" ALTER COLUMN "view" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" ALTER COLUMN "view" DROP DEFAULT`);
    }

}
