import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly model: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.model.create(createPokemonDto);
      return pokemon;
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.model
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ number: 1 })
      .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.model.findOne({ number: term });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.model.findById(term);
    } else {
      pokemon = await this.model.findOne({ name: term.trim() });
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or number "${term}" not found`,
      );
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async remove(id: string) {
    const result = await this.model.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Pokemon witg ID: "${id}" not found`);
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in DB ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't update Pokemon - Check Server logs`,
    );
  }
}
