import { Args, Query, Resolver } from '@nestjs/graphql';
import { Repository } from 'typeorm';
import { Rates } from './rates.entity';
import { Rate } from '../graphql';
import { RatesService } from './rates.service';

@Resolver('Rate')
export class RateResolver {
  constructor(private rateService: RatesService) {}

  @Query('currentRate')
  async getCurrentRate(): Promise<Rate> {
    const res = await this.rateService.findOne();
    console.log(res);
    return res;
  }

  @Query('rates')
  async getRates(@Args() args: { dateStart: Date; dateEnd: Date }): Promise<Rate[]> {
    const res = await this.rateService.findAll(args.dateStart, args.dateEnd);
    console.log(res);
    return res;
  }
}

