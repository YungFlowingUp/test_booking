import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../bookings/booking.entity';

@Entity('events') 
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'total_seats' })
  totalSeats: number;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];
}