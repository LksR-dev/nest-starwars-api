import { Controller, Get, Param } from '@nestjs/common';
import { SwapiService } from './swapi.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('swapi')
@Controller('swapi')
export class SwapiController {
  constructor(private readonly swapiService: SwapiService) {}

  @ApiResponse({ status: 200, description: 'Fetched all films from SWAPI' })
  @Get('films')
  async getFilms() {
    return await this.swapiService.getFilms();
  }

  @ApiResponse({
    status: 200,
    description: 'Fetched a specific film from SWAPI',
  })
  @Get('films/:id')
  async getFilmById(@Param('id') id: number) {
    return await this.swapiService.getFilmById(id);
  }
}
