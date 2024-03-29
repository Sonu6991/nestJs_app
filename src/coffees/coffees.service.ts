import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { DataSource, Repository } from 'typeorm';
import {
  CoffeBrandsFactory,
  ConfigService,
  MockService,
} from './coffees.module';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffees.entity';
import { Flavor } from './entities/flavor.entity';
import { COFFEE_BRANDS } from './coffee.constants';

@Injectable({scope:Scope.REQUEST})
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly dataSource: DataSource,
    // @Inject('mockSevice') mockSevice: MockService, //value base provider
    // @Inject(COFFEE_BRANDS) coffeeBrands: string[], //non class token  Providers
    // @Inject('configSerivce') configService:ConfigService  //class provider
    // @Inject(COFFEE_BRANDS) coffeBrandsFactory: CoffeBrandsFactory, //factory provider
  ) {
    // console.log('mockSevice', mockSevice);
    // console.log('coffeeBrands', coffeeBrands);
    // console.log('configService', configService);
    // console.log('coffeBrandsFactory', coffeBrandsFactory);

    console.log('CoffeesService initializd');
  }

  findAll(paginationquery: PaginationQueryDto) {
    const { limit, page } = paginationquery;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      ...(page && limit && { skip: (page - 1) * limit }),
      ...(limit && { take: limit }),
    });
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id },
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(CreateCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      CreateCoffeeDto.flavors.map((flavor) => this.preLoadFlavorByName(flavor)),
    );
    const coffee = this.coffeeRepository.create({
      ...CreateCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((flavor) =>
          this.preLoadFlavorByName(flavor),
        ),
      ));
    const coffee = await this.coffeeRepository.preload({
      id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.findOne(id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(id: number) {
    const coffee = await this.findOne(id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      coffee.recommendations++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };
      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
      await queryRunner.commitTransaction();
      return 'recommendation added!'
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preLoadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOneBy({ name });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
