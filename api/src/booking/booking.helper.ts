import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingHelper {
  constructor(private prisma: PrismaService) {}

  async findWisataOrFail(id: number) {
    const wisata = await this.prisma.wisata.findUnique({
      where: { id },
    });

    if (!wisata) {
      throw new BadRequestException(process.env.IDWISATA_FAILED);
    }

    return wisata;
  }

  async findBookingOrFail(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new BadRequestException(process.env.UPBOOKING_FAILED);
    }

    return booking;
  }
}
