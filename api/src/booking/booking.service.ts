import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingHelper } from './booking.helper';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private helper: BookingHelper,
  ) {}

  async create(dto, user) {
    await this.helper.findWisataOrFail(dto.wisataId);

    const booking = await this.prisma.booking.create({
      data: {
        wisataId: dto.wisataId,
        nama: dto.nama,
        noHp: dto.noHp,
        jumlahTiket: dto.jumlahTiket,
        customerId: user.id,
      },
    });

    return {
      message: process.env.BOOKING_SUCCES,
      data: booking,
    };
  }

  findAll() {
    return this.prisma.booking.findMany({
      include: { wisata: true, customer: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findMy(user) {
    return this.prisma.booking.findMany({
      where: { customerId: user.id },
      include: { wisata: true },
    });
  }

  async update(id: number, status: string) {
    await this.helper.findBookingOrFail(id);

    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: number) {
    await this.helper.findBookingOrFail(id);

    const deleted = await this.prisma.booking.delete({
      where: { id },
    });

    return {
      message: process.env.DELBOOKING_SUCCES,
      data: deleted,
    };
  }
}
