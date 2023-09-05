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

export class CurrencySymbol {
  __typename?: 'CurrencySymbol';
  id: string;
  name: string;
}

export class Rate {
  __typename?: 'Rate';
  id: string;
  date: Date;
  price: number;
  symbol1: CurrencySymbol;
  symbol2: CurrencySymbol;
}

type Nullable<T> = T | null;
