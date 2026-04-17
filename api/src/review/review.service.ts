import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, customerId: number) {
  // ambil data customer
  const customer = await this.prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    throw new Error('Customer tidak ditemukan');
  }

  if (data.rating < 1 || data.rating > 5) {
    throw new Error('Rating harus 1-5');
  }

  return this.prisma.review.create({
    data: {
      wisataId: data.wisataId,
      customerId: customerId,
      nama: customer.nama, // 🔥 AUTO dari database
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
