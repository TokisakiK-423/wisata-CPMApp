import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { WisataService } from './wisata.service';

@Controller('wisata')
export class WisataController {
  constructor(private service: WisataService) {}

  @Post()
  create(@Body() body) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
