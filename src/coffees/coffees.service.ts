import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Coffee, CoffeeSchema } from './entities/coffees.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Schema, Types } from 'mongoose';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { OnlyIDParamDTO } from 'src/common/dto/only-id-param.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name)
    private readonly coffeeModel: Model<Coffee>,
    @InjectModel(Event.name)
    private readonly EventModel: Model<Event>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  findAll(paginationquery: PaginationQueryDto) {
    console.log('paginationquery', paginationquery);
    const { limit, page } = paginationquery;
    return this.coffeeModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findOne(id: Types.ObjectId) {
    try {
      const coffee = await this.coffeeModel.findOne({ _id: id }).exec();
      if (!coffee) {
        throw new NotFoundException(`Coffee #${id} not found`);
      }
      return coffee;
    } catch (error) {
      console.log('error..........', error.message);
    }
  }

  create(CreateCoffeeDto: CreateCoffeeDto) {
    const coffee = new this.coffeeModel(CreateCoffeeDto);
    return coffee.save();
  }

  async update(id: Types.ObjectId, updateCoffeeDto: UpdateCoffeeDto) {
    let existingCoffee = await this.coffeeModel
      .findOneAndUpdate({ _id: id }, { $set: updateCoffeeDto }, { new: true })
      .exec();
    if (!existingCoffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return existingCoffee;
  }

  async remove(id: Types.ObjectId) {
    const coffee = await this.findOne(id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee.deleteOne();
  }

  async recommend(id: Types.ObjectId) {
    const coffee = await this.findOne(id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      coffee.recommendations++;
      const recommendedEvent = new this.EventModel({
        type: 'coffee',
        name: coffee.name,
        payload: { coffeId: coffee._id },
      });
      await recommendedEvent.save({ session });
      await coffee.save({ session });
      await session.commitTransaction();
      return "recommended!"
    } catch (error) {
      console.log('error', error);
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }
}
