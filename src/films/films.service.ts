import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './films.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateFilmDto } from './dto/create-films.dto';
import { UpdateFilmDto } from './dto/update-films.dto';

@Injectable()
export class FilmsService {
  private readonly logger = new Logger(FilmsService.name);
  private readonly swapiUrl = 'https://swapi.dev/api/films/';

  constructor(
    @InjectRepository(Film) private filmRepository: Repository<Film>,
    private readonly httpService: HttpService,
  ) {}

  async create(createFilmDto: CreateFilmDto): Promise<Film> {
    const film = this.filmRepository.create(createFilmDto);
    return await this.filmRepository.save(film);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Film[]; total: number }> {
    const [films, total] = await this.filmRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data: films, total };
  }

  async findOne(id: number): Promise<Film> {
    const film = await this.filmRepository.findOne({ where: { id } });

    if (!film) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }

    return film;
  }

  async update(id: number, updateFilmDto: UpdateFilmDto): Promise<Film> {
    const film = await this.filmRepository.findOne({ where: { id } });

    if (!film) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }
    Object.assign(film, updateFilmDto);

    return this.filmRepository.save(film);
  }

  async remove(id: number): Promise<void> {
    const film = await this.filmRepository.findOne({ where: { id } });

    if (!film) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }

    await this.filmRepository.remove(film);
  }

  async syncFilmsWithSwapi(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.swapiUrl),
      );
      const films = response.data.results;

      for (const film of films) {
        const existingFilm = await this.filmRepository.findOne({
          where: { episode_id: film.episode_id },
        });

        if (!existingFilm) {
          const newFilm = this.filmRepository.create({
            title: film.title,
            episode_id: film.episode_id,
            description: film.opening_crawl,
            director: film.director,
            release_date: film.release_date,
          });
          await this.filmRepository.save(newFilm);
          this.logger.log(`Film saved: ${film.title}`);
        }
      }
    } catch (error) {
      this.logger.error('Error to sincronized with SW', error.message);
    }
  }
}
