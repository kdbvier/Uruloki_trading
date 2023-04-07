import { Token } from "@/types/token.type";

export const tokenData: Token = {
  id: "123",
  token: "ABC",
  chain: {
    icon: "https://example.com/chain-icon.png",
    name: "Example Chain",
    code: "EXC",
  },
  price: {
    value: "1.23",
    operator: "+",
    variationValue: 0.45,
  },
  volume: {
    value: "4.56",
    currencyLabel: "Billions",
  },
  marketCap: {
    value: "7.89",
    currencyLabel: "Billions",
  },
  nOrders: {
    value: "10",
    currencyLabel: "Billions",
  },
  orderSplit: {
    buy: 5,
    sell: 5,
  },
};

export const tokensData: Array<Token> = [
  {
    id: "1",
    token: "Ethereum",
    chain: {
      icon: "/tokens/eth-icon.svg",
      name: "Ethereum",
      code: "ETH",
    },
    price: {
      value: "4,095.98",
      operator: "+",
      variationValue: 0.76,
    },
    volume: {
      value: "32,987,497,674",
      currencyLabel: "Billions",
    },
    marketCap: {
      value: "476,892,747,054",
      currencyLabel: "Billions",
    },
    nOrders: {
      value: "103,912",
      currencyLabel: "Millions",
    },
    orderSplit: {
      buy: 3782,
      sell: 3154,
    },
  },
  {
    id: "2",
    token: "Bitcoin",
    chain: {
      icon: "/tokens/btc-icon.svg",
      name: "Bitcoin",
      code: "BTC",
    },
    price: {
      value: "59,521.23",
      operator: "-",
      variationValue: 1.27,
    },
    volume: {
      value: "59,113,042,114",
      currencyLabel: "Billions",
    },
    marketCap: {
      value: "1,114,666,008,295",
      currencyLabel: "Billions",
    },
    nOrders: {
      value: "28,371",
      currencyLabel: "Millions",
    },
    orderSplit: {
      buy: 4578,
      sell: 1432,
    },
  },
];
