import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BookingHelper } from './booking.helper';

@Module({
  controllers: [BookingController],
  providers: [BookingService, PrismaService, BookingHelper],
})
export class BookingModule {}
