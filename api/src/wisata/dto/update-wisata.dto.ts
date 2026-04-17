import { PartialType } from '@nestjs/swagger';
import { CreateWisataDto } from './create-wisata.dto';

export class UpdateWisataDto extends PartialType(CreateWisataDto) {}