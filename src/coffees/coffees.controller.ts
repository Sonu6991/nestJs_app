import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeeController {
    constructor(private readonly coffeesService: CoffeesService) { }

    @Get()
    findAll(@Query() paginationquery: any) {
        const { limit, page } = paginationquery
        return this.coffeesService.findAll(limit, page)
    }
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.coffeesService.findOne(id)

    }
    @Post()
    @HttpCode(HttpStatus.CREATED)
    createOne(@Body() createCoffeeDto: CreateCoffeeDto) {
        console.log("createCoffeeDto", createCoffeeDto instanceof CreateCoffeeDto)
        this.coffeesService.create(createCoffeeDto)
        return createCoffeeDto
    }
    @Patch(':id')
    updateOne(@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
        this.coffeesService.update(id, updateCoffeeDto)
        return `Coffee #${id} updated`
    }
    @Delete(':id')
    @HttpCode(HttpStatus.CREATED)
    deleteOne(@Param('id') id: number,) {
        this.coffeesService.remove(id)
        return `Coffee #${id} deleted`
    }
}
