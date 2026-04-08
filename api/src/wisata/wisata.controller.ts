import { 
  Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards 
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';  // ← IMPORT BENAR
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';  // ← IMPORT BARU
import { WisataService } from './wisata.service';

@Controller('wisata')
export class WisataController {
  constructor(private readonly wisataService: WisataService) {}

  @Get()
  findAll() {
    return this.wisataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wisataService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() dto: any) {
    return this.wisataService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.wisataService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.wisataService.remove(id);
  }
}
