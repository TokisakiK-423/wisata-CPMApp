import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateBookingDto) {
    return this.prisma.booking.create({ data });
  }

  findAll() {
    return this.prisma.booking.findMany({
      include: { wisata: true },
      orderBy: { id: 'desc' },
    });
  }

  async updateStatus(id: number, data: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking tidak ditemukan');
    return this.prisma.booking.update({ where: { id }, data });
  }

  async remove(id: number) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking tidak ditemukan');
    return this.prisma.booking.delete({ where: { id } });
  }
}
