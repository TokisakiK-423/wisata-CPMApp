import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WisataService {
  constructor(private prisma: PrismaService) {}

  create(dto) {
    return this.prisma.wisata.create({ data: dto });
  }

  findAll() {
    return this.prisma.wisata.findMany({
      include: {
        galeri: true,
        reviews: true,
      },
    });
  }
  async findOne(id: number) {
  return this.prisma.wisata.findUnique({
    where: { id },
    include: {
      galeri: true,
      reviews: true,
    },
  });
}

  delete(id: number) {
    return this.prisma.wisata.delete({
      where: { id },
    });
  }
}
