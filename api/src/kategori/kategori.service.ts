import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import { PrismaService } from 'src/prisma.service';
import { metadata } from 'reflect-metadata/no-conflict';

@Injectable()
export class KategoriService {
  // buat construktor untuk prisma
  constructor(private readonly prisma: PrismaService) {}

  //buat fungsi tambah data
  async create(createKategoriDto: CreateKategoriDto) {
    // normalisasi nama (ini inti nya)
    const nama_filter = createKategoriDto.nama
      .trim()
      .replace(/\s+/g, '') // hapus semua spasi
      .toLowerCase();

    // cek apakah sudah ada berdasarkan nama_filter
    const exist = await this.prisma.kategori.findFirst({
      where: {
        nama_filter: nama_filter,
      },
    });

    if (exist) {
      throw new ConflictException({
        success: false,
        message: 'gagal ini tot, tu namanya jangan sama lagi njir',
        metadata: {
          status: HttpStatus.CONFLICT,
        },
      });
    }

    // simpan ke database
    const data = await this.prisma.kategori.create({
      data: {
        nama: createKategoriDto.nama.trim(),
        nama_filter: nama_filter,
      },
    });

    return {
      success: true,
      message: 'Data berhasil disimpan Kampang',
      metadata: {
        status: HttpStatus.CREATED,
      },
      data,
    };
  }

  async findAll() {
    // return `This action returns all kategori kntl`;
    //pariabel untk tampil data kategori
    const data = await this.prisma.kategori.findMany();

    //jika data kategori tdk ditemukan
    if (data.length === 0) {
      // throw new HttpException(
      //   {
      //     success: false,
      //     message: 'data tdk ditemukan anjg',
      //     metadata: {
      //       status: HttpStatus.NOT_FOUND,
      //       total_data: data.length,
      //     },
      //   },
      //   HttpStatus.NOT_FOUND,
      // );
      throw new NotFoundException({
        success: false,
        message: 'data tdk ditemukan anjg !',
        metadata: {
          status: HttpStatus.NOT_FOUND,
          total_data: data.length,
        },
      });
    }
    //jika data kategori ditemukan
    return {
      success: true,
      message: 'Berhasil Kntl Ya Ini !',
      metadata: {
        status: HttpStatus.OK,
        total_data: data.length,
      },
      data: data,
    };
  }

  // buat fungsi untk detail data
  async findOne(id: number) {
    // return `This action returns a #${id} kategori`;

    // tampil data kategori sesuai id
    const data = await this.prisma.kategori.findUnique({
      where: { id: id },
    });

    // jika data kategori ditemukan
    if (!data) {
      throw new NotFoundException({
        success: false,
        message: '',
        metadata: {
          status: HttpStatus.NOT_FOUND,
        },
      });
    }
    // jika data kategori ditemukan
    return {
      success: true,
      message: '',
      metadata: {
        status: HttpStatus.OK,
      },
      data: data,
    };
  }

  update(id: number, updateKategoriDto: UpdateKategoriDto) {
    return `This action updates a #${id} kategori`;
  }

  // fungsi hapus data
  async remove(id: number) {
    // return `This action removes a #${id} kategori`;

    // tampil data kategori sesuai id
    const data = await this.prisma.kategori.findUnique({
      where: { id: id },
    });

    // jika data kategori ditemukan
    if (!data) {
      throw new NotFoundException({
        success: false,
        message: '',
        metadata: {
          status: HttpStatus.NOT_FOUND,
        },
      });
    }
    // jika data kategori ditemukan
    // hps data kategori berdasarkan ID
    await this.prisma.kategori.delete({
      where: { id: id },
    });

    return {
      success: true,
      message: 'Data kategori berhasil dihapus, ya tot !',
      metadata: {
        status: HttpStatus.OK,
      },
    };
  }
}
