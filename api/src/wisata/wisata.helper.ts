import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { deleteGaleriFiles } from '../common/utils/file.utils';

@Injectable()
export class WisataHelper {
  constructor(private prisma: PrismaService) {}

  async findWisataOrFail(id: number) {
    const wisata = await this.prisma.wisata.findUnique({
      where: { id },
      include: { galeri: true },
    });

    if (!wisata) {
      throw new BadRequestException(process.env.WISATA_FAILED);
    }

    return wisata;
  }

  async deleteGaleri(id: number) {
    const galeri = await this.prisma.galeri.findMany({
      where: { wisataId: id },
    });

    deleteGaleriFiles(galeri);

    await this.prisma.galeri.deleteMany({
      where: { wisataId: id },
    });
  }
}
