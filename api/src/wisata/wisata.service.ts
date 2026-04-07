import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WisataService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    // Validasi duplikasi nama
    const existing = await this.prisma.wisata.findFirst({
      where: {
        nama: data.nama,
      },
    });

    if (existing) {
      throw new ConflictException({
        success: false,
        message: 'Nama wisata sudah digunakan',
        metadata: {
          status: HttpStatus.CONFLICT,
        },
      });
    }

    const wisata = await this.prisma.wisata.create({
      data,
      include: { galeri: true },
    });

    return {
      success: true,
      message: 'Data wisata berhasil ditambahkan',
      metadata: {
        status: HttpStatus.CREATED,
      },
      data: wisata,
    };
  }

  async findAll() {
    const data = await this.prisma.wisata.findMany({
      include: { galeri: true, reviews: true, bookings: true },
      orderBy: { id: 'desc' },
    });

    if (data.length === 0) {
      return {
        success: true,
        message: 'Data wisata tidak ditemukan',
        metadata: {
          status: HttpStatus.OK,
          total_data: 0,
        },
        data: [],
      };
    }

    return {
      success: true,
      message: 'Data wisata berhasil diambil',
      metadata: {
        status: HttpStatus.OK,
        total_data: data.length,
      },
      data,
    };
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.wisata.findUnique({
        where: { id },
        include: { galeri: true, reviews: true, bookings: true },
      });

      if (!data) {
        throw new NotFoundException({
          success: false,
          message: 'Data wisata tidak ditemukan',
          metadata: {
            status: HttpStatus.NOT_FOUND,
          },
        });
      }

      return {
        success: true,
        message: 'Detail wisata berhasil diambil',
        metadata: {
          status: HttpStatus.OK,
        },
        data,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new BadRequestException({
        success: false,
        message: 'Parameter ID harus berupa angka',
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  async update(id: number, data: any) {
    try {
      const existing = await this.prisma.wisata.findUnique({ where: { id } });

      if (!existing) {
        throw new NotFoundException({
          success: false,
          message: 'Data wisata tidak ditemukan',
          metadata: {
            status: HttpStatus.NOT_FOUND,
          },
        });
      }

      // Cek duplikasi nama jika diubah
      if (data.nama && data.nama !== existing.nama) {
        const duplicate = await this.prisma.wisata.findFirst({
          where: {
            nama: data.nama,
            NOT: { id },
          },
        });

        if (duplicate) {
          throw new ConflictException({
            success: false,
            message: 'Nama wisata sudah digunakan',
            metadata: {
              status: HttpStatus.CONFLICT,
            },
          });
        }
      }

      const updated = await this.prisma.wisata.update({
        where: { id },
        data,
        include: { galeri: true },
      });

      return {
        success: true,
        message: 'Data wisata berhasil diperbarui',
        metadata: {
          status: HttpStatus.OK,
        },
        data: updated,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }

      throw new BadRequestException({
        success: false,
        message: 'Parameter ID harus berupa angka',
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  async remove(id: number) {
    try {
      // Cek apakah ada booking active untuk wisata ini
      const activeBookings = await this.prisma.booking.count({
        where: {
          wisataId: id,
          status: 'APPROVED', // atau status lain yang active
        },
      });

      if (activeBookings > 0) {
        throw new ConflictException({
          success: false,
          message: 'Wisata tidak dapat dihapus karena ada booking active',
          metadata: {
            status: HttpStatus.CONFLICT,
          },
        });
      }

      const existing = await this.prisma.wisata.findUnique({ where: { id } });

      if (!existing) {
        throw new NotFoundException({
          success: false,
          message: 'Data wisata tidak ditemukan',
          metadata: {
            status: HttpStatus.NOT_FOUND,
          },
        });
      }

      await this.prisma.wisata.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Data wisata berhasil dihapus',
        metadata: {
          status: HttpStatus.OK,
        },
        data: { id },
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }

      throw new BadRequestException({
        success: false,
        message: 'Parameter ID harus berupa angka',
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }
}
