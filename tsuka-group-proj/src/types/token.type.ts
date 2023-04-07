export type Token = {
  id: string;
  token: string;
  chain: {
    icon: string;
    name: string;
    code: string;
    address?: string;
  };
  pair?: {
    address: string;
  };
  price: {
    value: string;
    operator: "+" | "-";
    variationValue: number;
    variationValueDiference?: number;
  };
  volume: {
    value: string;
    currencyLabel: string;
  };
  marketCap: {
    value: string;
    currencyLabel: string;
  };
  nOrders: {
    value: string;
    currencyLabel: string;
  };
  orderSplit: {
    buy: number;
    sell: number;
  };
};
