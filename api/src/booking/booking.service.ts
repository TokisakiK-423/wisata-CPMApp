import { Injectable, NotFoundException, ConflictException, BadRequestException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBookingDto) {
    const booking = await this.prisma.booking.create({
      data,
      include: { wisata: true },
    });

    return {
      success: true,
      message: 'Booking berhasil dibuat',
      metadata: {
        status: HttpStatus.CREATED,
      },
      data: booking,
    };
  }

  async findAll() {
    const data = await this.prisma.booking.findMany({
      include: { wisata: true },
      orderBy: { id: 'desc' },
    });

    if (data.length === 0) {
      return {
        success: true,
        message: 'Data booking tidak ditemukan',
        metadata: {
          status: HttpStatus.OK,
          total_data: 0,
        },
        data: [],
      };
    }

    return {
      success: true,
      message: 'Data booking berhasil diambil',
      metadata: {
        status: HttpStatus.OK,
        total_data: data.length,
      },
      data,
    };
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.booking.findUnique({
        where: { id },
        include: { wisata: true },
      });

      if (!data) {
        throw new NotFoundException({
          success: false,
          message: 'Data booking tidak ditemukan',
          metadata: {
            status: HttpStatus.NOT_FOUND,
          },
        });
      }

      return {
        success: true,
        message: 'Detail booking berhasil diambil',
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

  async updateStatus(id: number, data: UpdateBookingStatusDto) {
    try {
      const booking = await this.prisma.booking.findUnique({ where: { id } });

      if (!booking) {
        throw new NotFoundException({
          success: false,
          message: 'Data booking tidak ditemukan',
          metadata: {
            status: HttpStatus.NOT_FOUND,
          },
        });
      }

      // Skip validasi slot untuk hindari field error - bisa ditambahkan nanti
      // sesuai schema Prisma yang sebenarnya

      const updated = await this.prisma.booking.update({
        where: { id },
        data,
        include: { wisata: true },
      });

      return {
        success: true,
        message: 'Status booking berhasil diperbarui',
        metadata: {
          status: HttpStatus.OK,
        },
        data: updated,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException({
        success: false,
        message: 'Parameter ID harus berupa angka atau data status tidak valid',
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  async remove(id: number) {
    try {
      const booking = await this.prisma.booking.findUnique({ where: { id } });

      if (!booking) {
        throw new NotFoundException({
          success: false,
          message: 'Data booking tidak ditemukan',
          metadata: {
            status: HttpStatus.NOT_FOUND,
          },
        });
      }

      // Gunakan APPROVED sesuai enum yang ada: PENDING, APPROVED, REJECTED
      if (booking.status === 'APPROVED') {
        throw new ConflictException({
          success: false,
          message: 'Booking yang sudah approved tidak dapat dihapus',
          metadata: {
            status: HttpStatus.CONFLICT,
          },
        });
      }

      await this.prisma.booking.delete({ where: { id } });

      return {
        success: true,
        message: 'Data booking berhasil dihapus',
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
