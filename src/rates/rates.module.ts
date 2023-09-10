import { Module } from '@nestjs/common';
import { RateResolver } from './current-rate.resolver';
import { Rates } from './rates.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatesService } from './rates.service';

@Module({ imports: [TypeOrmModule.forFeature([Rates])], providers: [RateResolver, RatesService] })
export class RatesModule {}
