import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { Event } from '../events/event.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) {}

  async reserveBooking(eventId: number, userId: string): Promise<Booking> {
    return await this.bookingRepository.manager.transaction(
      async (transactionalEntityManager) => {
        //* Проверка на существование события
        const event = await transactionalEntityManager.findOne(Event, {
          where: { id: eventId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!event) {
          throw new NotFoundException(`Событие с ID ${eventId} не найдено`);
        }

        //* Проверка: пользователь уже имеет бронь на это событие
        const existingBooking = await transactionalEntityManager.findOne(Booking, {
          where: {
            eventId: eventId,
            userId: userId,
          },
          lock: { mode: 'pessimistic_write' },
        });
        if (existingBooking) {
          throw new ConflictException(
            'Вы уже забронировали место на это событие',
          );
        }

        //* Проверка хватает ли мест на событии
        const bookedCount = await transactionalEntityManager.count(Booking, {
          where: { eventId: eventId },
        });
        if (bookedCount >= event.totalSeats) {
          throw new ConflictException('Все места уже заняты');
        }

        const booking = transactionalEntityManager.create(Booking, {
          eventId,
          userId,
          event
        });
        return await transactionalEntityManager.save(booking);
      }
    );
  }

  async getUserBookings(userId: string, page: number = 1, offset: number = 10): Promise<{bookings: Booking[], total: number}> {
    const bookings = await this.bookingRepository.find({
      where: { userId },
      relations: ['event'],
      skip: (page - 1) * offset,
      take: offset
    });

    const total = await this.bookingRepository.count({
      where: { userId }
    });

    return {bookings, total}
  }

  async getEventBookings(eventId: number, page: number = 1, offset: number = 10): Promise<{bookings: Booking[], total: number}> {
    const bookings = await this.bookingRepository.find({
      where: { eventId },
      skip: (page - 1) * offset,
      take: offset
    });

    const total = await this.bookingRepository.count({
      where: {eventId}
    });

    return {bookings, total}
  }

  async deleteBooking(eventId: number, userId: string): Promise<Booking> {
    return await this.bookingRepository.manager.transaction(
      async (transactionalEntityManger) => {
        const booking = await transactionalEntityManger.findOne(Booking, {
          where: {eventId, userId},
          lock: {mode: 'pessimistic_write'}
        })
        if (!booking) {
          throw new NotFoundException(`Бронь у пользолвателя ${userId} на событие с ID ${eventId} не найдена!`);
        }

        await transactionalEntityManger.delete(Booking, {
          eventId, userId
        })

        return booking
      }
    )
  }
}
