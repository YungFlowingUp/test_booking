import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  BadRequestException,
  Query,
  Delete,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateDeleteBookingDto } from './dto/create_delete-booking.dto';
import { ResponseBookingDto } from './dto/response-booking.dto';
import { PaginationBookingDto } from './dto/pagination-booking.dto';

@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('reserve')
  @HttpCode(HttpStatus.CREATED)
  async reserve(
    @Body() reserveDto: CreateDeleteBookingDto,
  ): Promise<ResponseBookingDto> {
    const { eventId, userId } = reserveDto;
    const result = await this.bookingsService.reserveBooking(eventId, userId);

    return {
      success: true,
      data: result,
      message: 'Место зарезервировано успешно!',
    };
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async getUserBookings(
    @Param('userId') userId: string,
    @Query() paginationDto: PaginationBookingDto,
  ): Promise<ResponseBookingDto> {
    const { page, offset } = paginationDto;

    const { bookings, total } = await this.bookingsService.getUserBookings(
      userId,
      page,
      offset,
    );
    return {
      success: true,
      data: {
        page,
        offset,
        total,
        bookings,
      },
      message:
        bookings.length === 0
          ? 'У пользователя ещё нет броней!'
          : 'Брони пользователей получены успешно!',
    };
  }

  @Get('event/:eventId')
  @HttpCode(HttpStatus.OK)
  async getEventBookings(
    @Param('eventId') eventId: string,
    @Query() paginationDto: PaginationBookingDto,
  ): Promise<ResponseBookingDto> {
    const eventIdNum = parseInt(eventId);
    if (isNaN(eventIdNum)) {
      throw new BadRequestException('eventId должен быть числом');
    }

    const { page, offset } = paginationDto;

    const { bookings, total } = await this.bookingsService.getEventBookings(
      eventIdNum,
      page,
      offset,
    );
    return {
      success: true,
      data: {
        page,
        offset,
        total,
        bookings,
      },
      message:
        bookings.length === 0
          ? 'У этого события ещё нет броней'
          : 'Бронирования события получены успешно!',
    };
  }

  @Delete('/delete')
  @HttpCode(HttpStatus.OK)
  async deleteBooking(@Body() deleteBookingDto: CreateDeleteBookingDto) {
    const { eventId, userId } = deleteBookingDto;

    const deletedData = await this.bookingsService.deleteBooking(
      eventId,
      userId,
    );

    return {
      success: true,
      data: deletedData,
      message: 'Бронирование успешно удалено!',
    };
  }
}
