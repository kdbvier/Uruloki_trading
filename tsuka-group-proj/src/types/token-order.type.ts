export enum OrderTypeEnum {
  BUY = "buy",
  SELL = "sell",
}
export enum PriceTypeEnum {
  SINGLE = "single",
  RANGE = "range",
}

export interface Order {
  id: number;
  price_type: PriceTypeEnum;
  order_type: OrderTypeEnum;
}

export interface SingleOrder extends Order {
  price: number;
}

export interface RangeOrder extends Order {
  prices: Array<number>;
}

export interface TokenOrder {
  name1: string;
  code1: string;
  name2: string;
  code2: string;
  orders: Array<SingleOrder | RangeOrder>;
}
