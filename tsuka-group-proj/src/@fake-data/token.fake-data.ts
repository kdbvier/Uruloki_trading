import { Token } from "@/types/token.type";

export const tokenData: Token = {
  id: "1",
  token: "Ethereum",
  chain: {
    icon: "/tokens/eth-icon.svg",
    name: "Ethereum",
    code: "ETH",
    address: "0xD779BCA1E021aBF9C184d417c6339EAD850e10E6",
  },
  pair: {
    code: "BTC",
    icon: "/tokens/btc-icon.svg",
    address: "0xD779BCA1E021aBF9C184d417c6339EAD850e10E6",
  },
  price: {
    value: "4,095.98",
    operator: "+",
    variationValue: 0.76,
    variationValueDiference: 0.00523,
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
};

export const tokensData: Array<Token> = [
  {
    id: "1",
    token: "Ethereum",
    chain: {
      icon: "/tokens/eth-icon.svg",
      name: "Ethereum",
      code: "ETH",
      address: "0xD779BCA1E021aBF9C184d417c6339EAD850e10E6",
    },
    pair: {
      code: "BTC",
      icon: "/tokens/btc-icon.svg",
      address: "0xD779BCA1E021aBF9C184d417c6339EAD850e10E6",
    },
    price: {
      value: "4,095.98",
      operator: "+",
      variationValue: 0.76,
      variationValueDiference: 0.00523,
    },
    volume: {
      value: "32,987.54",
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
    pair: {
      code: "ETH",
      icon: "/tokens/eth-icon.svg",
      address: "0xD779BCA1E021aBF9C184d417c6339EAD850e10E6",
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
