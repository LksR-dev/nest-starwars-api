import { Test, TestingModule } from '@nestjs/testing';
import { SwapiService } from './swapi.service';
import { HttpModule } from '@nestjs/axios';

describe('SwapiService', () => {
  let service: SwapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule.register({})],
      providers: [SwapiService],
    }).compile();

    service = module.get<SwapiService>(SwapiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return films', async () => {
    const result = await service.getFilms();
    expect(result).toHaveProperty('results');
  });
});
