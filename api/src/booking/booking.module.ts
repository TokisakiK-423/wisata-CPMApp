import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from '../prisma/prisma.service';
import { WisataService } from '../wisata/wisata.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService, PrismaService, WisataService],
})
export class BookingModule {}
