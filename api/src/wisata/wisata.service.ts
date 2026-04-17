import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

    // simpan gambar ke galeri
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
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.wisata.findUnique({
      where: { id },
      include: {
        galeri: true,
      },
    });
  }

  async delete(id: number) {
    await this.prisma.galeri.deleteMany({
      where: { wisataId: id },
    });

    return this.prisma.wisata.delete({
      where: { id },
    });
  }
}
