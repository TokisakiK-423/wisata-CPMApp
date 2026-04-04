import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WisataService } from './wisata.service';
import { CreateWisataDto } from './dto/create-wisata.dto';
import { UpdateWisataDto } from './dto/update-wisata.dto';

@ApiTags('wisata')
@Controller('wisata')
export class WisataController {
  constructor(private readonly wisataService: WisataService) {}

  @Post()
  create(@Body() dto: CreateWisataDto) {
    return this.wisataService.create(dto);
  }

  @Get()
  findAll() {
    return this.wisataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wisataService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWisataDto,
  ) {
    return this.wisataService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.wisataService.remove(id);
  }
}
