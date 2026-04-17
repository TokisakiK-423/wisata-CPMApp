import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
  return this.prisma.review.create({
    data: {
      wisataId: data.wisataId,
      customerId: data.customerId || null,
      nama: data.nama,
      rating: Number(data.rating),
      komentar: data.komentar,
    },
  });
}

  findAll() {
    return this.prisma.review.findMany({
      include: { wisata: true, customer: true },
    });
  }

  delete(id: number) {
    return this.prisma.review.delete({
      where: { id },
    });
  }
}
