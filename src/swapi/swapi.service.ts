import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';

@Injectable()
export class SwapiService {
  private readonly swapiUrl = 'https://swapi.dev/api/';

  constructor(private readonly httpService: HttpService) {}

  // Generic method to fetch data from SWAPI
  private async fetchFromSwapi(endpoint: string) {
    try {
      const response = await axios.get(`${this.swapiUrl}${endpoint}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching data from SWAPI: ${error.message}`);
    }
  }

  // Specific methods to fetch data from SWAPI
  async getFilms() {
    return this.fetchFromSwapi('films/');
  }

  async getFilmById(id: number) {
    return this.fetchFromSwapi(`films/${id}`);
  }
}
