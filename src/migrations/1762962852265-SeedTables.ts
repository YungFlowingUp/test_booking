import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedTables1762962852265 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        INSERT INTO events (name, total_seats)
        VALUES ('Концерт', 100), ('Спектакль', 50), ('Презентация', 3);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM events;');
    }

}
