import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(dto, user) {
    const wisata = await this.prisma.wisata.findUnique({
      where: { id: dto.wisataId },
    });

    if (!wisata) {
      throw new BadRequestException(process.env.IDWISATA_FAILED);
    }

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
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new BadRequestException(process.env.UPBOOKING_FAILED);
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new BadRequestException(process.env.IDWISATA_FAILED);
    }

    // simpan hasil delete
    const deleted = await this.prisma.booking.delete({
      where: { id },
    });

    return {
      message: process.env.DELBOOKING_SUCCES,
      data: deleted,
    };
  }
}
