import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GaleriService } from './galeri.service';
import { CreateGaleriDto } from './dto/create-galeri.dto';

@ApiTags('galeri')
@Controller('galeri')
export class GaleriController {
  constructor(private readonly galeriService: GaleriService) {}

  @Post()
  create(@Body() dto: CreateGaleriDto) {
    return this.galeriService.create(dto);
  }

  @Get()
  findAll() {
    return this.galeriService.findAll();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.galeriService.remove(id);
  }
}
