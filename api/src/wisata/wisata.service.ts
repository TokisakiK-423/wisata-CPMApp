import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Express } from 'express';

import { WisataHelper } from './wisata.helper';
import { generateUploadUrl } from '../common/utils/file.utils';
import { formatMessage } from '../common/utils/message.utils';

@Injectable()
export class WisataService {
  constructor(
    private prisma: PrismaService,
    private helper: WisataHelper,
  ) {}

  async create(data: any, file?: Express.Multer.File) {
    try {
      const wisata = await this.prisma.wisata.create({
        data: {
          nama: data.nama,
          lokasi: data.lokasi,
          deskripsi: data.deskripsi,
          alamat: data.alamat,
          jamBuka: data.jamBuka,
          hargaTiket: Number(data.hargaTiket),
          status: true,
        },
      });

      if (file) {
        await this.prisma.galeri.create({
          data: {
            url: generateUploadUrl(file.filename),
            wisataId: wisata.id,
          },
        });
      }

      const result = await this.findOne(wisata.id);

      return {
        message: process.env.POSWISATA_SUCCES,
        data: result,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(process.env.POSWISATA_FAILED);
    }
  }

  async findAll() {
    return this.prisma.wisata.findMany({
      include: {
        galeri: true,
        reviews: true,
        _count: {
          select: { bookings: true },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.wisata.findUnique({
      where: { id },
      include: {
        galeri: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { bookings: true },
        },
      },
    });
  }

  async update(id: number, data: any, file?: Express.Multer.File) {
    const wisata = await this.helper.findWisataOrFail(id);

    await this.prisma.wisata.update({
      where: { id },
      data: {
        nama: data.nama,
        lokasi: data.lokasi,
        deskripsi: data.deskripsi,
        alamat: data.alamat,
        jamBuka: data.jamBuka,
        hargaTiket: Number(data.hargaTiket),
      },
    });

    if (file) {
      await this.helper.deleteGaleri(id);

      await this.prisma.galeri.create({
        data: {
          wisataId: id,
          url: generateUploadUrl(file.filename),
        },
      });
    }

    return this.findOne(id);
  }

  async delete(id: number) {
    const count = await this.prisma.booking.count({
      where: { wisataId: id },
    });

    if (count > 0) {
      throw new BadRequestException(
        formatMessage(process.env.DELETE_WISATA_ERROR, { count }),
      );
    }

    await this.helper.deleteGaleri(id);

    return this.prisma.wisata.delete({
      where: { id },
    });
  }

  async toggleStatus(id: number) {
    const wisata = await this.prisma.wisata.findUnique({
      where: { id },
    });

    if (!wisata) {
      throw new BadRequestException(process.env.WISATA_FAILED);
    }

    await this.prisma.wisata.update({
      where: { id },
      data: {
        status: !wisata.status,
      },
    });

    return this.findOne(id);
  }
}
