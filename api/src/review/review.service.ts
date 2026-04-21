import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Express } from 'express';

import { ReviewHelper } from './review.helper';
import { generateUploadUrl } from '../common/utils/file.utils';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    private helper: ReviewHelper,
  ) {}

  async create(data: any, customerId: number, file?: Express.Multer.File) {
    const customer = await this.helper.findCustomerOrFail(customerId);

    return this.prisma.review.create({
      data: {
        wisataId: Number(data.wisataId),
        customerId: customerId,
        nama: customer.nama,
        rating: Number(data.rating),
        komentar: data.komentar,
        image: file ? generateUploadUrl(file.filename) : null,
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

  async delete(id: number, userId: number) {
    const review = await this.helper.findReviewOrFail(id);

    this.helper.validateOwner(review.customerId, userId);

    return this.prisma.review.delete({
      where: { id },
    });
  }
}
