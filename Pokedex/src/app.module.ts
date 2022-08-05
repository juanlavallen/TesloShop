import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [
    PokemonModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
