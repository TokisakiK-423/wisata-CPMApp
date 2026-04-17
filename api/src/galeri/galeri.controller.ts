import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { GaleriService } from './galeri.service';

@Controller('galeri')
export class GaleriController {
  constructor(private service: GaleriService) {}

  @Post()
  create(@Body() body) {
    return this.service.create(body);
  }

  @Get(':wisataId')
  find(@Param('wisataId') id: string) {
    return this.service.findByWisata(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}