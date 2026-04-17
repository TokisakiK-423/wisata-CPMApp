import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';

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
        status: true, // default aktif
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

  async findOne(id: number) {
    return this.prisma.wisata.findUnique({
      where: { id },
      include: {
        galeri: true,
        _count: {
          select: { bookings: true },
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
        status: data.status === 'false' ? false : true,
      },
    });

    // 🔥 replace gambar
    if (file) {
      wisata.galeri.forEach((g) => {
        const filePath = path.join(process.cwd(), 'public', g.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

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

  async delete(id: number) {
    const booking = await this.prisma.booking.findFirst({
      where: { wisataId: id },
    });

    if (booking) {
      throw new BadRequestException(
        'Wisata tidak bisa dihapus karena masih ada booking',
      );
    }

    const galeri = await this.prisma.galeri.findMany({
      where: { wisataId: id },
    });

    galeri.forEach((g) => {
      const filePath = path.join(process.cwd(), 'public', g.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

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

    return this.prisma.wisata.update({
      where: { id },
      data: {
        status: !wisata?.status,
      },
    });
  }
}
