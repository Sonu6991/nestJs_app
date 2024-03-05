import { Module } from '@nestjs/common';
import { CoffeeController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Coffee, CoffeeSchema } from './entities/coffees.entity';
import {
  Event,
  EventSchema,
} from 'src/events/entities/event.entity/event.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Coffee.name,
        schema: CoffeeSchema,
      },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [CoffeeController],
  providers: [CoffeesService],
  exports: [CoffeesService],
})
export class CoffeesModule {}
