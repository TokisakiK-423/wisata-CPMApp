import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, customerId: number, file?: Express.Multer.File) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new BadRequestException('Customer tidak ditemukan');
    }

    return this.prisma.review.create({
      data: {
        wisataId: Number(data.wisataId),
        customerId: customerId,
        nama: customer.nama,
        rating: Number(data.rating),
        komentar: data.komentar,

        // 🔥 INI BAGIAN PENTING
        image: file ? `/uploads/${file.filename}` : null,
      },
    });
  }

  findAll() {
    return this.prisma.review.findMany({
      include: {
        wisata: true,
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
