import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Booking } from 'src/bookings/booking.entity';

export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  async getAllEvents(): Promise<Event[]> {
    return await this.eventsRepository.find();
  }

  async createEvent(name: string, totalSeats: number): Promise<Event> {
    const event = this.eventsRepository.create({
      name,
      totalSeats,
    });

    return await this.eventsRepository.save(event);
  }

  async deleteEvent(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException(`Событие с ID ${id} не найдено!`);
    }

    await this.eventsRepository.delete(id);
    return event;
  }

  async updateEvent(
    id: number,
    name: string,
    totalSeats: number,
  ): Promise<{ prevEvent: Event; updatedEvent: Event }> {
    return await this.eventsRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const prevEvent = await transactionalEntityManager.findOne(Event, {
          where: { id },
          lock: { mode: 'pessimistic_write' },
        });
        if (!prevEvent) {
          throw new NotFoundException(`Событие с ID ${id} не найдено!`);
        }

        if (totalSeats < prevEvent.totalSeats) {
          const alreadyBookedSeats = await transactionalEntityManager.count(
            Booking,
            {
              where: { eventId: id },
            },
          );

          if (alreadyBookedSeats > totalSeats) {
            throw new ConflictException(
              `Мест уже ${alreadyBookedSeats} забронировано. Введите число больше или равное этому.`,
            );
          }
        }

        await transactionalEntityManager.update(
          Event,
          { id },
          { name, totalSeats },
        );
        const updatedEvent = await transactionalEntityManager.findOne(Event, {
          where: { id },
        });
        if (!updatedEvent) {
          throw new NotFoundException(`Событие с ID ${id} не найдено!`);
        }

        return { prevEvent, updatedEvent };
      },
    );
  }
}
