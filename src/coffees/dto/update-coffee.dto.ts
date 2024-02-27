import { PartialType } from "@nestjs/mapped-types";
// import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateCoffeeDto } from "./create-coffee.dto";

// export class UpdateCoffeeDto {
//     @IsOptional()
//     @IsNotEmpty({ message: "Name must not be empty." })
//     @IsString()
//     readonly name: string;

//     @IsOptional()
//     @IsNotEmpty({ message: "Brand must not be empty." })
//     @IsString()
//     readonly brand: string;

//     @IsOptional()
//     @IsNotEmpty({ message: "flavours must not be empty.", each: true })
//     @IsString({ each: true })
//     readonly flavours: string[]
// }

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) { }