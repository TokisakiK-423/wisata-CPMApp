import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WisataService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const wisata = await this.prisma.wisata.create({ data });
    return wisata;
  }

  async findAll() {
    return this.prisma.wisata.findMany({
      include: { galeri: true, reviews: true, bookings: true },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const wisata = await this.prisma.wisata.findUnique({
      where: { id },
      include: { galeri: true, reviews: true, bookings: true },
    });

    if (!wisata) throw new NotFoundException('Wisata tidak ditemukan');
    return wisata;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.wisata.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.wisata.delete({
      where: { id },
    });
  }
}
