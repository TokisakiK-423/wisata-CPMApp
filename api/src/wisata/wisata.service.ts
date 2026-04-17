import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import type { Express } from 'express';

@Injectable()
export class WisataService {
  constructor(private prisma: PrismaService) {}

  //  CREATE
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
            url: `/uploads/${file.filename}`,
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

  //  GET ALL
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

  //  GET ONE
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

  //  UPDATE
  async update(id: number, data: any, file?: Express.Multer.File) {
    const wisata = await this.prisma.wisata.findUnique({
      where: { id },
      include: { galeri: true },
    });

    if (!wisata) {
      throw new BadRequestException(process.env.WISATA_FAILED);
    }

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
      // hapus file lama
      for (const g of wisata.galeri) {
        const filePath = path.join(process.cwd(), 'public', g.url);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      //  hapus data galeri
      await this.prisma.galeri.deleteMany({
        where: { wisataId: id },
      });

      //  simpan gambar baru
      await this.prisma.galeri.create({
        data: {
          wisataId: id,
          url: `/uploads/${file.filename}`,
        },
      });
    }

    return this.findOne(id);
  }

  //  DELETE
  async delete(id: number) {
    const count = await this.prisma.booking.count({
      where: { wisataId: id },
    });

    if (count > 0) {
      const message = process.env.DELETE_WISATA_ERROR?.replace(
        '{count}',
        count.toString(),
      );

      throw new BadRequestException(message);
    }

    const galeri = await this.prisma.galeri.findMany({
      where: { wisataId: id },
    });

    for (const g of galeri) {
      const filePath = path.join(process.cwd(), 'public', g.url);

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

  //  TOGGLE STATUS
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
