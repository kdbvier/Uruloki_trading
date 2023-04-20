import {
  OrderTypeEnum,
  PriceTypeEnum,
  RangeOrder,
  SingleOrder,
} from "@/types/token-order.type";

export interface UserOrder {
  id: string;
  orders: Array<SingleOrder | RangeOrder>;
}

export const userOrder: Array<UserOrder> = [
  {
    id: "1",
    orders: [
      {
        id: 1,
        order_type: OrderTypeEnum.BUY,
        price_type: PriceTypeEnum.RANGE,
        prices: [5347.94, 3214, 9873.43],
      },
      {
        id: 2,
        order_type: OrderTypeEnum.BUY,
        price_type: PriceTypeEnum.SINGLE,
        price: 3214,
      },
    ],
  },
  {
    id: "2",
    orders: [
      {
        id: 3,
        order_type: OrderTypeEnum.BUY,
        price_type: PriceTypeEnum.SINGLE,
        price: 3214,
      },
      {
        id: 4,
        order_type: OrderTypeEnum.BUY,
        price_type: PriceTypeEnum.RANGE,
        prices: [5347.94, 3214, 9873.43],
      },
    ],
  },
];
