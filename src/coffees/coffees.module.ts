import { Injectable, Module, Scope } from '@nestjs/common';
import { CoffeeController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffees.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../../src/events/entities/event.entity';
import { COFFEE_BRANDS } from './coffee.constants';
import { DataSource } from 'typeorm';

// mock class
export class MockService {}
// class providers
export class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

// factory provider
@Injectable()
export class CoffeBrandsFactory {
  create() {
    return ['buddy brew', 'nescafe'];
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeeController],
  providers: [
    CoffeesService,
    // // custom providers

    // { provide: 'mockSevice', useValue: new MockService() },  //value base provider
    // {
    //   provide: COFFEE_BRANDS,
    //   useValue: ['buddy brew', 'nescafe'],
    // }, //non class token  Providers

    // {
    //   provide: 'configSerivce', // class provider
    //   useClass:
    //     process.env.NODE_ENV === 'development'
    //       ? DevelopmentConfigService
    //       : ProductionConfigService,
    // },

    // {
    //   provide: COFFEE_BRANDS, // factory providers
    //   useFactory(...args) {
    //     return ['buddy brew', 'nescafe'];
    //   },
    // },

    // // factory provider
    // CoffeBrandsFactory,
    // {
    //   provide: COFFEE_BRANDS,
    //   useFactory: (coffeBrandsFactory: CoffeBrandsFactory) =>
    //     coffeBrandsFactory.create(),
    //   inject: [CoffeBrandsFactory],
    // },

    // // async provider
    // {
    //   provide: COFFEE_BRANDS,
    //   useFactory: async (/*dataSource: DataSource*/): Promise<string[]> => {
    //     // const coffee = await dataSource.query('SELECT * FROM coffee');
    //     // return coffee;
    //     const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe']);
    //     return coffeeBrands;
    //   },
    //   // inject: [DataSource],
    // },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
