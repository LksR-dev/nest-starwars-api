import { PartialType } from '@nestjs/swagger';
import { CreateFilmDto } from './create-films.dto';

export class UpdateFilmDto extends PartialType(CreateFilmDto) {}
