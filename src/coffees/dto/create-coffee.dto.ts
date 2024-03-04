import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateCoffeeDto {
  @ApiProperty({
    description: 'The name of coffee',
  })
  @IsDefined({ message: 'Name required.', each: true })
  @IsNotEmpty({ message: 'Name must not be empty.' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'The brand of coffee',
  })
  @IsDefined({ message: 'Brand required.', each: true })
  @IsNotEmpty({ message: 'Brand must not be empty.' })
  @IsString()
  readonly brand: string;

  @ApiProperty({
    description: 'The flavor of coffee',
    example: ['chocolate', 'vanilla'],
  })
  @IsDefined({ message: 'flavors required.', each: true })
  @IsNotEmpty({ message: 'flavors must not be empty.', each: true })
  @IsString({ each: true })
  readonly flavors: string[];
}
