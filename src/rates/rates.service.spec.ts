import { setupConnection } from '../../test/test-helper';
import { RatesService } from './rates.service';
import { Rates } from './rates.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { startOfHour, subHours } from 'date-fns';
import { randomUUID } from 'crypto';

const findOnePayload: Rates = {
  id: 'a47ecdc2-77d6-462f-9045-c440c5e4616f',
  date: startOfHour(new Date()),
  price: 100,
  symbol1: 'BTC',
  symbol2: 'USDT'
};

const findAllPayload: Rates[] = [
  {
    id: randomUUID(),
    date: subHours(new Date(), 4),
    price: 100,
    symbol1: 'BTC',
    symbol2: 'USDT'
  },
  {
    id: randomUUID(),
    date: subHours(new Date(), 1),
    price: 100,
    symbol1: 'BTC',
    symbol2: 'USDT'
  },
  {
    id: randomUUID(),
    date: subHours(new Date(), 2),
    price: 100,
    symbol1: 'BTC',
    symbol2: 'USDT'
  },
  {
    id: randomUUID(),
    date: startOfHour(new Date()),
    price: 100,
    symbol1: 'BTC',
    symbol2: 'USDT'
  }
];

describe('RatesService', () => {
  let ratesService: RatesService;
  let dataSource: DataSource;
  let testingModule: TestingModule;

  beforeEach(async () => {
    dataSource = await setupConnection([Rates]);

    testingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ load: [configuration] }),
        TypeOrmModule.forRoot({
          name: 'default',
          synchronize: true
        }),
        TypeOrmModule.forFeature([Rates])
      ],
      providers: [RatesService]
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    ratesService = testingModule.get<RatesService>(RatesService);
  });

  afterEach(async () => {
    dataSource.destroy();
  });

  it('should be defined', () => {
    expect(ratesService).toBeDefined();
  });

  describe('findOne', () => {
    it('should return the latest entry from the DB', async () => {
      const repo = dataSource.getRepository(Rates);
      await createRateEntries(repo, [findOnePayload]);
      const fetchedRateEntry = await ratesService.findOne();

      expect(fetchedRateEntry.date).toEqual(findOnePayload.date);
      expect(fetchedRateEntry.price).toEqual(findOnePayload.price);
      expect(fetchedRateEntry.symbol1).toEqual(findOnePayload.symbol1);
      expect(fetchedRateEntry.symbol2).toEqual(findOnePayload.symbol2);
    });
  });

  describe('findAll', () => {
    it('should return entries from the DB for a given interval', async () => {
      const repo = dataSource.getRepository(Rates);
      await createRateEntries(repo, findAllPayload);
      const fetchedRateEntries = await ratesService.findAll(subHours(new Date(), 3), new Date());

      expect(fetchedRateEntries).toHaveLength(3);
    });
  });
});

async function createRateEntries(repo: Repository<Rates>, rateEntries: Rates[]) {
  const entries = rateEntries.map(entry => repo.create(entry));
  await Promise.all(entries.map(entry => repo.save(entry)));
}

