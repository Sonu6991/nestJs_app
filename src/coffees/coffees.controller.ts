import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { OnlyIDParamDTO } from 'src/common/dto/only-id-param.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('coffees')
export class CoffeeController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  findAll(@Query() paginationquery: PaginationQueryDto) {
    return this.coffeesService.findAll(paginationquery);
  }
  @Get(':id')
  findOne(@Param() param: OnlyIDParamDTO) {
    return this.coffeesService.findOne(param.id);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOne(@Body() createCoffeeDto: CreateCoffeeDto) {
    console.log('createCoffeeDto', createCoffeeDto instanceof CreateCoffeeDto);
    this.coffeesService.create(createCoffeeDto);
    return createCoffeeDto;
  }
  @Patch(':id')
  updateOne(
    @Param() param: OnlyIDParamDTO,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeesService.update(param.id, updateCoffeeDto);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  deleteOne(@Param() param: OnlyIDParamDTO) {
    return this.coffeesService.remove(param.id);
  }

  @Post('recommend')
  @HttpCode(HttpStatus.CREATED)
  recommendations(@Body() body: OnlyIDParamDTO) {
    return this.coffeesService.recommend(body.id);
  }
}
