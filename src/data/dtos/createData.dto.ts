import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DataFormatEnum } from 'src/enums/data.enum';

export class CreateDataDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsString()
  @IsOptional()
  @IsEnum(DataFormatEnum)
  type?: DataFormatEnum;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
