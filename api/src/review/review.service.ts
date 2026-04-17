import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, customerId: number) {
    // ambil customer
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new Error('Customer tidak ditemukan');
    }

    // validasi rating
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating harus 1-5');
    }

    // cek sudah pernah review
    const existing = await this.prisma.review.findFirst({
      where: {
        wisataId: data.wisataId,
        customerId,
      },
    });

    if (existing) {
      throw new Error('Kamu sudah review wisata ini');
    }

    // create review
    return this.prisma.review.create({
      data: {
        wisataId: Number(data.wisataId),
        customerId: customerId,
        nama: customer.nama, // 🔥 auto dari DB
        rating: Number(data.rating),
        komentar: data.komentar || null,
      },
    });
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        wisata: {
          select: {
            nama: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
