import { IsNumberString, IsNotEmpty, IsString } from 'class-validator';

export class CurrentPriceDto {
  @IsNumberString()
  lprice: string;

  @IsNotEmpty()
  @IsString()
  curr1: string;

  @IsNotEmpty()
  @IsString()
  curr2: string;
}
