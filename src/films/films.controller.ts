import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-films.dto';
import { UpdateFilmDto } from './dto/update-films.dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Film } from './films.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';

@ApiTags('Films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new film' })
  @ApiCreatedResponse({
    description: 'The film has been successfully created.',
    type: Film,
  })
  @ApiBody({ type: CreateFilmDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async create(@Body() createFilmDto: CreateFilmDto): Promise<Film> {
    return this.filmsService.create(createFilmDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all films with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOkResponse({
    description: 'Successfully retrieved list of films',
    type: Film,
    isArray: true,
  })
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<{ data: Film[]; total: number }> {
    return this.filmsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single film by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({
    description: 'Successfully retrieved the film',
    type: Film,
  })
  @ApiNotFoundResponse({ description: 'Film not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('regular')
  @ApiBearerAuth()
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Film> {
    return this.filmsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a film by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({
    description: 'Successfully updated the film',
    type: Film,
  })
  @ApiBody({ type: UpdateFilmDto })
  @ApiNotFoundResponse({ description: 'Film not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFilmDto: UpdateFilmDto,
  ): Promise<Film> {
    return this.filmsService.update(id, updateFilmDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a film by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiNoContentResponse({ description: 'Successfully deleted the film' })
  @ApiNotFoundResponse({ description: 'Film not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    this.filmsService.remove(id);
    return { message: 'Film deleted successfully' };
  }

  @Get('/sync-swapi')
  @ApiOperation({ summary: 'Sync with SWAPI' })
  @ApiOkResponse({
    description: 'Successfully sync',
  })
  @ApiNotFoundResponse({ description: 'Error synchronizing with SWAPI' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async syncSwapi(): Promise<void> {
    return this.filmsService.syncFilmsWithSwapi();
  }
}
