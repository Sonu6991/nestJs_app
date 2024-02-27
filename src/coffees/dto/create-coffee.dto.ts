import { IsArray, IsDefined, IsNotEmpty, IsString, isString } from "class-validator";

export class CreateCoffeeDto {
    @IsDefined({ message: "Name required.", each: true })
    @IsNotEmpty({ message: "Name must not be empty." })
    @IsString()
    readonly name: string;

    @IsDefined({ message: "Brand required.", each: true })
    @IsNotEmpty({ message: "Brand must not be empty." })
    @IsString()
    readonly brand: string;

    @IsDefined({ message: "flavours required.", each: true })
    @IsNotEmpty({ message: "flavours must not be empty.", each: true })
    @IsString({ each: true })
    readonly flavours: string[]

}
