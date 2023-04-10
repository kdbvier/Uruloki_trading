import { ChartBound } from "@/types/chart-bound.type";

export interface TokenBoundData {
  id: string;
  token: string;
  code: string;
  bound: ChartBound;
  pairs: Array<
    ChartBound & {
      name: string;
      code: string;
    }
  >;
}

export const newOrderData: Array<TokenBoundData> = [
  {
    id: "1",
    token: "Ethereum",
    code: "ETH",
    bound: {
      buy: true,
      values: {
        value: 5347.94,
        min: 3214,
        max: 9873.43,
      },
    },
    pairs: [
      {
        code: "BTC",
        name: "Bitcoin",
        values: {
          value: 8234.94,
          min: 1243,
          max: 9873.43,
        },
      },
    ],
  },
  {
    id: "2",
    token: "Bitcoin",
    code: "BTC",
    bound: {
      buy: true,
      values: {
        value: 5347.94,
        min: 3214,
        max: 9873.43,
      },
    },
    pairs: [
      {
        code: "ETH",
        name: "Ethereum",
        values: {
          value: 8234.94,
          min: 1243,
          max: 9873.43,
        },
      },
      {
        code: "SOL",
        name: "Solana",
        values: {
          value: 8234.94,
          min: 1243,
          max: 9873.43,
        },
      },
    ],
  },
];
