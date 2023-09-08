import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { Rates } from '../rates.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SaveOptions } from 'typeorm';
import { startOfHour } from 'date-fns';
import { CurrentPriceDto } from './dto/current-price.dto';
import { validateOrReject, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ChartDto } from './dto/chart.dto';

interface ChartResponse {
  tmsp: number;
  price: string;
}

const TIMEOUT_NAME = 'fetch-historical';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Rates)
    private ratesRepository: Repository<Rates>,
    private configService: ConfigService
  ) {}

  //   @Cron(CronExpression.EVERY_30_SECONDS)
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.debug('rates cron has been called');

    const { lprice, curr1, curr2 } = await this.fetchLatestPrice();

    const dto = plainToClass(CurrentPriceDto, { curr1, curr2, lprice }, { enableImplicitConversion: true });

    try {
      await validateOrReject(dto);
    } catch (err) {
      throw new UnprocessableEntityException();
    }

    const price = parseFloat(lprice);

    // Regarding the API docs if there is no deals for the last hour it will return price = 0
    if (!price) {
      throw new UnprocessableEntityException('No such deals in the last 1 hour');
    }

    // our free cryptocurrency API has a 1 hour refresh interval so we can only save once per hour
    const date = startOfHour(new Date());
    await this.saveRateEntity({ date, symbol1: curr1, symbol2: curr2, price });
  }

  @Timeout(TIMEOUT_NAME, 5000)
  async handleTimeout() {
    this.logger.debug('Called once after 5 seconds to provide historical deals');

    // The API we use has no direct BTC/USDT historical deals, so we need to fetch 2 pairs BTC/USD and USDT/USD
    const [btc, usdt] = await Promise.all([this.fetchChart('BTC', 'USD'), this.fetchChart('USDT', 'USD')]);

    // We then need to aggregate the data into hourly values ​​and calculate the BTC/USDT price to stick to the current price concept.
    // In realworld application I would prefer to save all the data I can get from the external API without compacting it to the 1 hour average
    const payload = await this.prepareChartData(btc, usdt);

    if (!payload.size) {
      return;
    }

    try {
      await Promise.all(
        Array.from(payload.entries()).map(([date, { btc, usdt, pairPrice }]) => {
          return Promise.all([
            this.saveRateEntity({
              date: new Date(date),
              symbol1: 'BTC',
              symbol2: 'USDT',
              price: pairPrice,
              saveOptions: { transaction: false }
            }),
            this.saveRateEntity({
              date: new Date(date),
              symbol1: 'BTC',
              symbol2: 'USD',
              price: btc,
              saveOptions: { transaction: false }
            }),
            this.saveRateEntity({
              date: new Date(date),
              symbol1: 'USDT',
              symbol2: 'USD',
              price: usdt,
              saveOptions: { transaction: false }
            })
          ]);
        })
      );
    } catch (err) {
      this.logger.error(err);
    }
  }

  async fetchLatestPrice() {
    return await (await fetch(`${this.configService.get('cryptoApi.lastPrice')}/BTC/USDT`, { method: 'GET' })).json();
  }

  async saveRateEntity({
    date,
    symbol1,
    symbol2,
    price,
    saveOptions
  }: {
    date: Date;
    symbol1: string;
    symbol2: string;
    price: number;
    saveOptions?: SaveOptions;
  }) {
    const existingRecordForCurrencyPair = await this.ratesRepository.findOne({
      where: { date, symbol1, symbol2 }
    });
    if (existingRecordForCurrencyPair) {
      throw new UnprocessableEntityException(`Entry with timestamp :${date.toISOString()}: already exists`);
    }

    const rateEntry = this.ratesRepository.create({ symbol1, symbol2, price, date });

    await this.ratesRepository.save(rateEntry, saveOptions);
  }

  async prepareChartData(btc: ChartResponse[], usdt: ChartResponse[]) {
    const btcMap = btc.reduce(reducerFn, new Map<number, number[]>());
    const usdtMap = usdt.reduce(reducerFn, new Map<number, number[]>());

    const keys = new Set([...btcMap.keys(), ...usdtMap.keys()]);
    return Array.from(keys).reduce((acc, key) => {
      const btc = btcMap.get(key);
      const usdt = usdtMap.get(key);

      if (!btc || !usdt) {
        return acc;
      }

      // Since we don't have an access to the deals in full we will calculate plain average price instead of the weighted one.
      const btcAvgPrice = parseFloat((btc.reduce((a, b) => a + b) / btc.length).toFixed(3));
      const usdtAvgPrice = parseFloat((usdt.reduce((a, b) => a + b) / usdt.length).toFixed(3));
      acc.set(key, { btc: btcAvgPrice, usdt: usdtAvgPrice, pairPrice: btcAvgPrice / usdtAvgPrice });

      return acc;
    }, new Map<number, { btc: number; usdt: number; pairPrice: number }>());
  }

  async fetchChart(currency1: string, currency2: string): Promise<ChartResponse[]> {
    return (
      await fetch(`${this.configService.get('cryptoApi.chart')}/${currency1}/${currency2}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({ lastHours: 48, maxRespArrSize: 100 })
      })
    ).json();
  }
}

function reducerFn(acc: Map<number, number[]>, { tmsp, price }: ChartResponse): Map<number, number[]> {
  const errors = validateSync(plainToClass(ChartDto, { tmsp, price }, { enableImplicitConversion: true }));

  if (errors.length) {
    return acc;
  }

  const date = startOfHour(new Date(tmsp * 1000)).getTime();
  const prices = acc.get(date) || [];
  prices.push(parseFloat(price));
  acc.set(date, prices);
  return acc;
}
