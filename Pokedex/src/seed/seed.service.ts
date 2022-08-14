import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios, { AxiosInstance } from 'axios';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { IPokemon } from './interfaces/pokemon.interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly model: Model<Pokemon>,
  ) {}

  async executeSeed() {
    const { data } = await this.axios.get<IPokemon>(
      'https://pokeapi.co/api/v2/poemon?limit=650',
    );

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const number = +segments[segments.length - 2];

      const poemon = await this.model.create({ name, number });
    });

    return 'Seed Executed';
  }
}