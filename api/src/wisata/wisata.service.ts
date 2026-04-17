import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import type { Express } from 'express';

@Injectable()
export class WisataService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, file?: Express.Multer.File) {
    const wisata = await this.prisma.wisata.create({
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
      await this.prisma.galeri.create({
        data: {
          url: `/uploads/${file.filename}`,
          wisataId: wisata.id,
        },
      });
    }

    return this.findOne(wisata.id); // 🔥 penting: biar include galeri
  }

  async findAll() {
  return this.prisma.wisata.findMany({
    include: {
      galeri: true,
      _count: {
        select: {
          bookings: true,
        },
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
    },
  });
}

  async update(id: number, data: any, file?: Express.Multer.File) {
    const wisata = await this.prisma.wisata.findUnique({
      where: { id },
      include: { galeri: true },
    });

    if (!wisata) {
      throw new BadRequestException('Data tidak ditemukan');
    }

    const updated = await this.prisma.wisata.update({
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
      // 🔥 hapus file lama
      for (const g of wisata.galeri) {
        const filePath = path.join(
          process.cwd(),
          'public',
          g.url.replace('/uploads/', 'uploads/')
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // 🔥 hapus galeri lama
      await this.prisma.galeri.deleteMany({
        where: { wisataId: id },
      });

      // 🔥 simpan baru
      await this.prisma.galeri.create({
        data: {
          wisataId: id,
          url: `/uploads/${file.filename}`,
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
        `Wisata tidak bisa dihapus karena masih ada ${count} booking`
      );
    }

    const galeri = await this.prisma.galeri.findMany({
      where: { wisataId: id },
    });

    for (const g of galeri) {
      const filePath = path.join(
        process.cwd(),
        'public',
        g.url.replace('/uploads/', 'uploads/')
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await this.prisma.galeri.deleteMany({
      where: { wisataId: id },
    });

    return this.prisma.wisata.delete({
      where: { id },
    });
  }
  async toggleStatus(id: number) {
  const wisata = await this.prisma.wisata.findUnique({
    where: { id },
  });

  if (!wisata) {
    throw new Error('Data tidak ditemukan');
  }

  return this.prisma.wisata.update({
    where: { id },
    data: {
      status: !wisata.status, // 🔥 dibalik true/false
    },
  });
}
}
