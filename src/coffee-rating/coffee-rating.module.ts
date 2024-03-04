import { Module } from '@nestjs/common';
import { CoffeeRatingService } from '../../src/coffee-rating/coffee-rating.service';
import { CoffeesModule } from '../../src/coffees/coffees.module';

@Module({
  imports: [CoffeesModule],
  providers: [CoffeeRatingService],
})
export class CoffeeRatingModule {}
