import { IsInt, Min, IsNumber } from 'class-validator';

export class ChartDto {
  @IsInt()
  @Min(0)
  tmsp: number;

  @IsNumber()
  @Min(0.001)
  price: number;
}
