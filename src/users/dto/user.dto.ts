import {
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Minimum length is 5 characters' })
  @MaxLength(30, { message: 'Maximum length is 30 characters' })
  name: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dob: Date;

  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Minimum length is 5 characters' })
  @MaxLength(100, { message: 'Maximum length is 100 characters' })
  address: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Minimum length is 5 characters' })
  @MaxLength(100, { message: 'Maximum length is 100 characters' })
  description: string;
}
