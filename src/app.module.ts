import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import appConfig from './config/app.config';

@Module({
  imports: [
    CoffeesModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/src/migrations/*.js'],
        synchronize: true,
        
      }),
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // //env variables validation using Joi
        // DB_HOST: Joi.required(),
        // DB_USERNAME: Joi.required(),
        // DB_PASSWORD: Joi.required(),
        // DB_NAME: Joi.required(),
        // DB_PORT: Joi.number().default(4532),
      }),
      load: [appConfig], //custome config
      envFilePath: '.env',
    }),

    CoffeeRatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
