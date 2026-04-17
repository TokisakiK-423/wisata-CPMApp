import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  create(dto, user) {
    return this.prisma.review.create({
      data: {
        wisataId: dto.wisataId,
        rating: dto.rating,
        komentar: dto.komentar,
        nama: dto.nama,
        customerId: user.id,
      },
    });
  }

  findAll() {
    return this.prisma.review.findMany({
      include: {
        wisata: true,
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  delete(id: number) {
    return this.prisma.review.delete({
      where: { id },
    });
  }
}
