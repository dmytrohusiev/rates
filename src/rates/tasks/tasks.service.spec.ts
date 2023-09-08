import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rates } from '../rates.entity';
import { DataSource } from 'typeorm';
import configuration from '../../config/configuration';
import { startOfHour } from 'date-fns';
import { setupConnection } from '../../../test/test-helper';
import { UnprocessableEntityException } from '@nestjs/common';

const rateEntry: Rates = {
  id: 'a47ecdc2-77d6-462f-9045-c440c5e4616f',
  date: startOfHour(new Date()),
  price: 100,
  symbol1: 'BTC',
  symbol2: 'USDT'
};

const chartResponseBtc = {
  tmsp: 1694181804,
  price: '25000'
};

const chartResponseUsdt = {
  tmsp: 1694181804,
  price: '1.002'
};

describe('TasksService', () => {
  let tasksService: TasksService;
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
      providers: [TasksService]
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    tasksService = testingModule.get<TasksService>(TasksService);
  });

  afterEach(async () => {
    dataSource.destroy();
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  describe('handleCron', () => {
    it('should save correct data to the DB', async () => {
      jest
        .spyOn(tasksService, 'fetchLatestPrice')
        .mockResolvedValue({ lprice: rateEntry.price + '', curr1: 'BTC', curr2: 'USDT' });

      await tasksService.handleCron();
      const repo = dataSource.getRepository(Rates);
      const rateFromDb = await repo.findOne({ where: { date: rateEntry.date } });
      expect(rateFromDb.date).toEqual(rateEntry.date);
      expect(rateFromDb.price).toEqual(rateEntry.price);
      expect(rateFromDb.symbol1).toEqual(rateEntry.symbol1);
      expect(rateFromDb.symbol2).toEqual(rateEntry.symbol2);
    });

    it('should discard entries with price === 0', async () => {
      jest.spyOn(tasksService, 'fetchLatestPrice').mockResolvedValue({ lprice: '0', curr1: 'BTC', curr2: 'USDT' });

      await expect(tasksService.handleCron()).rejects.toThrowError(UnprocessableEntityException);
    });

    it('should discard entries with wrong schema', async () => {
      jest.spyOn(tasksService, 'fetchLatestPrice').mockResolvedValue({ lprice: 'asd', curr1: '', curr2: '' });

      await expect(tasksService.handleCron()).rejects.toThrowError(UnprocessableEntityException);
    });

    it('should discard duplicate entries with the same date and currency pairs', async () => {
      jest
        .spyOn(tasksService, 'fetchLatestPrice')
        .mockResolvedValue({ lprice: rateEntry.price + '', curr1: 'BTC', curr2: 'USDT' });

      await tasksService.handleCron();
      await expect(tasksService.handleCron()).rejects.toThrowError(UnprocessableEntityException);
    });
  });

  describe('handleTimeout', () => {
    it('should save correct data to the DB', async () => {
      jest
        .spyOn(tasksService, 'fetchChart')
        .mockResolvedValueOnce([chartResponseBtc])
        .mockResolvedValueOnce([chartResponseUsdt]);

      await tasksService.handleTimeout();
      const repo = dataSource.getRepository(Rates);
      const date = startOfHour(new Date(chartResponseBtc.tmsp * 1000));
      const ratesFromDb = await repo.find({ where: { date } });

      expect(ratesFromDb).toHaveLength(3);

      const newEntry = await repo.findOne({ where: { date, symbol1: 'BTC', symbol2: 'USDT' } });
      expect(newEntry.price).toEqual(parseFloat(chartResponseBtc.price) / parseFloat(chartResponseUsdt.price));
    });

    it('should discard entries with price === 0 or wrong schema', async () => {
      jest
        .spyOn(tasksService, 'fetchChart')
        .mockResolvedValueOnce([{ tmsp: chartResponseBtc.tmsp, price: '0' }]) // first handleTimeout call
        .mockResolvedValueOnce([chartResponseUsdt]) // first handleTimeout call
        .mockResolvedValueOnce([chartResponseBtc]) // second handleTimeout call
        .mockResolvedValueOnce([chartResponseUsdt]); // second handleTimeout call

      await tasksService.handleTimeout();
      await tasksService.handleTimeout();

      const repo = dataSource.getRepository(Rates);
      const date = startOfHour(new Date(chartResponseBtc.tmsp * 1000));
      const ratesFromDb = await repo.find({ where: { date } });
      // one successful run creates 3 entries in the DB for BTC/USD, USDT/USD and BTC/USDT pairs.
      expect(ratesFromDb).toHaveLength(3);
    });
  });
});
