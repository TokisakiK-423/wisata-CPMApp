import { Injectable } from '@nestjs/common';
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
      include: { galeri: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.wisata.findUnique({
      where: { id },
      include: { galeri: true },
    });
  }

  async delete(id: number) {
    // 🔥 ambil semua gambar
    const galeri = await this.prisma.galeri.findMany({
      where: { wisataId: id },
    });

    // 🔥 hapus file fisik
    galeri.forEach((g) => {
      const filePath = path.join(process.cwd(), 'public', g.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // 🔥 hapus DB
    await this.prisma.galeri.deleteMany({
      where: { wisataId: id },
    });

    return this.prisma.wisata.delete({
      where: { id },
    });
  }

  async update(id: number, data: any, file?: Express.Multer.File) {
    const wisata = await this.prisma.wisata.findUnique({
      where: { id },
      include: { galeri: true },
    });

    if (!wisata) {
      throw new Error('Data tidak ditemukan');
    }

    // 🔥 update data utama
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

    // 🔥 kalau ada gambar baru → replace
    if (file) {
      // hapus file lama
      wisata.galeri.forEach((g) => {
        const filePath = path.join(process.cwd(), 'public', g.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      // hapus DB lama
      await this.prisma.galeri.deleteMany({
        where: { wisataId: id },
      });

      // simpan gambar baru
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
