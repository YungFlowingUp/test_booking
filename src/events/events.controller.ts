import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { ResponseEventsDto } from './dto/response-events.dto';
import { CreateUpdateEventsDto } from './dto/create_update-events.dto';

@Controller('/api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllEvents(): Promise<ResponseEventsDto> {
    const allEvents = await this.eventsService.getAllEvents();
    return {
      success: true,
      data: allEvents,
      message:
        allEvents.length === 0
          ? 'Событий ещё нет'
          : 'Все события получены успешно',
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async craeteEvent(
    @Body() createEventDto: CreateUpdateEventsDto,
  ): Promise<ResponseEventsDto> {
    const { name, totalSeats } = createEventDto;

    const event = await this.eventsService.createEvent(name, totalSeats);
    return {
      success: true,
      data: event,
      message: 'Событие успешно создано!',
    };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteEvent(@Param('id') id: string): Promise<ResponseEventsDto> {
    const eventIdNum = parseInt(id);
    if (isNaN(eventIdNum)) {
      throw new BadRequestException('eventId должен быть числом');
    }

    const event = await this.eventsService.deleteEvent(eventIdNum);
    return {
      success: true,
      data: event,
      message: 'Событие успешно удалено!',
    };
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: CreateUpdateEventsDto,
  ): Promise<ResponseEventsDto> {
    const eventIdNum = parseInt(id);
    if (isNaN(eventIdNum)) {
      throw new BadRequestException('eventId должен быть числом');
    }

    const { name, totalSeats } = updateEventDto;
    const { prevEvent, updatedEvent } = await this.eventsService.updateEvent(
      eventIdNum,
      name,
      totalSeats,
    );

    return {
      success: true,
      data: {
        prevEvent,
        updatedEvent,
      },
      message: 'Событие успешно обновлено!',
    };
  }
}
