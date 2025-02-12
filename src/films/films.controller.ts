import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FilmsService } from './films.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/guards/roles.decorator';
import { CreateFilmDto } from './dto/create-films.dto';
import { UpdateFilmDto } from './dto/update-films.dto';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @ApiResponse({ status: 201, description: 'Película creada exitosamente' })
  @ApiResponse({
    status: 403,
    description: 'Only administrators can create films',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Post()
  async createFilm(@Body() createFilmDto: CreateFilmDto) {
    return this.filmsService.create(createFilmDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Fetched all films with pagination',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get()
  async getFilms(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.filmsService.findAll(page, limit);
  }

  @ApiResponse({
    status: 200,
    description: 'Fetched film by ID',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('regular')
  @Get(':id')
  async getFilmById(@Param('id') id: number) {
    return this.filmsService.findOne(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Film updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Only administrators can update films',
  })
  @ApiResponse({
    status: 404,
    description: 'Film with ID not found',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Put(':id')
  async updateFilm(
    @Param('id') id: number,
    @Body() updateFilmDto: UpdateFilmDto,
  ) {
    return this.filmsService.update(id, updateFilmDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Film deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Only administrators can delete films',
  })
  @ApiResponse({
    status: 404,
    description: 'Film with ID not found',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Delete(':id')
  async removeFilm(@Param('id') id: number) {
    return this.filmsService.remove(id);
  }

  @ApiResponse({
    status: 201,
    description: 'Fetched all films with pagination',
  })
  @ApiResponse({
    status: 403,
    description: 'Only administrators can sincronized swapi',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post('sync')
  async syncFilms() {
    await this.filmsService.syncFilmsWithSwapi();
    return { message: 'Films sincronized with SWAPI' };
  }
}
