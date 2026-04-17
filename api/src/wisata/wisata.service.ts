import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
        status: true,
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

    return wisata;
  }

 async findAll() {
  return this.prisma.wisata.findMany({
    include: {
      galeri: true,
      _count: {
        select: { bookings: true },
      },
    },
  });
}
  async findAllActive() {
  return this.prisma.wisata.findMany({
    where: { status: true },
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
        _count: { select: { bookings: true } },
      },
    });
  }

  async delete(id: number) {
    const bookingCount = await this.prisma.booking.count({
      where: { wisataId: id },
    });

    if (bookingCount > 0) {
      throw new Error(`Wisata tidak bisa dihapus karena masih ada ${bookingCount} booking`);
    }

    await this.prisma.galeri.deleteMany({
      where: { wisataId: id },
    });

    return this.prisma.wisata.delete({
      where: { id },
    });
  }

  async update(id: number, data: any, file?: Express.Multer.File) {
    const existing = await this.prisma.wisata.findUnique({
      where: { id },
      include: { galeri: true },
    });

    if (!existing) throw new Error('Data tidak ditemukan');

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

    // 🔥 replace gambar lama
    if (file) {
      await this.prisma.galeri.deleteMany({
        where: { wisataId: id },
      });

      await this.prisma.galeri.create({
        data: {
          wisataId: id,
          url: `/uploads/${file.filename}`,
        },
      });
    }

    return updated;
  }
}
