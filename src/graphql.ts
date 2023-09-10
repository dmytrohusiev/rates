/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export abstract class IQuery {
  __typename?: 'IQuery';

  abstract currentRate(): Rate | Promise<Rate>;

  abstract rates(dateStart: Date, dateEnd: Date): Rate[] | Promise<Rate[]>;
}

export class Rate {
  __typename?: 'Rate';
  id: string;
  date: Date;
  price: number;
  symbol1: string;
  symbol2: string;
}

type Nullable<T> = T | null;
