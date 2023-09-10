import { Injectable } from '@nestjs/common';
import { Rates } from './rates.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RatesService {
  constructor(
    @InjectRepository(Rates)
    private ratesRepository: Repository<Rates>
  ) {}

  findAll(dateStart: Date, dateEnd: Date) {
    return this.ratesRepository.find({ where: { date: Between(dateStart, dateEnd) }, order: { date: -1 } });
  }

  findOne() {
    return this.ratesRepository.findOne({ order: { date: -1 }, where: { symbol1: 'BTC', symbol2: 'USDT' } });
  }
}

