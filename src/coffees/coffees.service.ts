import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffees.entity';

@Injectable()
export class CoffeesService {
    private coffees: Coffee[] = [{
        id: 1,
        name: "Shipwreck Roast",
        brand: "Buddy brew",
        flavours: ['chocolate', 'vanilla']
    }]


    findAll(limit: string, page: string) {
        return this.coffees
    }

    findOne(id: number) {
        const coffee = this.coffees.find((coffee) => coffee.id === id)
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        return coffee
    }

    create(CreateCoffeeDto: any) {
        let lastId = this.coffees[this.coffees.length - 1].id
        this.coffees.push({ id: lastId + 1, ...CreateCoffeeDto })
    }

    update(id: number, updateCoffeeDto: any) {
        let existingIndex = this.coffees.findIndex((coffee) => coffee.id === id)
        if (existingIndex <= -1) {
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        Object.keys(updateCoffeeDto).forEach((key: string) => {
            this.coffees[existingIndex][key] = updateCoffeeDto[key]
        });
        return this.coffees[existingIndex]
    }

    remove(id: number) {
        let existingIndex = this.coffees.findIndex((coffee) => coffee.id === id)
        if (existingIndex <= -1) {
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        this.coffees.splice(existingIndex, 1)

    }

}
