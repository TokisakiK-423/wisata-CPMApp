import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('booking')
export class BookingController {
  constructor(private service: BookingService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() body, @Req() req) {
    return this.service.create(body, req.user);
  }

  @UseGuards(JwtGuard)
  @Get('my')
  findMy(@Req() req) {
    return this.service.findMy(req.user);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.service.update(+id, body.status);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
