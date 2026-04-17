import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GaleriService {
  constructor(private prisma: PrismaService) {}

  create(dto) {
    return this.prisma.galeri.create({ data: dto });
  }

  findByWisata(wisataId: number) {
    return this.prisma.galeri.findMany({
      where: { wisataId },
    });
  }

  delete(id: number) {
    return this.prisma.galeri.delete({
      where: { id },
    });
  }
}