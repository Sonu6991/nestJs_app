import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class OnlyIDParamDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly id: Types.ObjectId;
}
