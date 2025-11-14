import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1762962805040 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE events (
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL,
                total_seats INT NOT NULL
            );
        `);

        await queryRunner.query(`
            CREATE TABLE bookings (
                id SERIAL PRIMARY KEY,
                event_id INT REFERENCES events(id) ON DELETE CASCADE,
                user_id VARCHAR NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE (event_id, user_id)
            );
        `);

        await queryRunner.query(`
            CREATE INDEX idx_booking_user_id ON bookings(user_id);
        `)

        await queryRunner.query(`
            CREATE INDEX idx_booking_event_id ON bookings(event_id);
        `)    
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE bookings;');
        await queryRunner.query('DROP TABLE events;');
        await queryRunner.query('DROP INDEX idx_booking_user_id');
        await queryRunner.query('DROP INDEX idx_booking_event_id');
  }

}
