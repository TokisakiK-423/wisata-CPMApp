import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  create(dto, user) {
    return this.prisma.booking.create({
      data: {
        wisataId: dto.wisataId,
        nama: dto.nama,
        noHp: dto.noHp,
        jumlahTiket: dto.jumlahTiket,
        customerId: user.id,
      },
    });
  }

 async findAll() {
  const data = await this.prisma.wisata.findMany({
    include: {
      galeri: true,
      _count: {
        select: { bookings: true },
      },
    },
  });

  return data;
}

  findMy(user) {
    return this.prisma.booking.findMany({
      where: { customerId: user.id },
      include: { wisata: true },
    });
  }

  update(id: number, status: string) {
    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  delete(id: number) {
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
