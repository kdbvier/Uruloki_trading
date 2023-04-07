import { Compare } from "@/types/compare.type";

export const compareTokenData: Array<Compare> = [
  {
    inputToken: {
      icon: "/tokens/btc-icon.svg",
      name: "Bitcoin",
      code: "BTC",
    },
    outputToken: {
      icon: "/tokens/eth-icon.svg",
      name: "Ethereum",
      code: "ETH",
    },
    network: "Seven Metrics Coin",
    value: 4095.98,
    diference: {
      operator: "+",
      value: 0.76,
    },
  },
  {
    inputToken: {
      icon: "/tokens/eth-icon.svg",
      name: "Ethereum",
      code: "ETH",
    },
    outputToken: {
      icon: "/tokens/btc-icon.svg",
      name: "Bitcoin",
      code: "BTC",
    },
    network: "Seven Metrics Coin",
    value: 4095.98,
    diference: {
      operator: "+",
      value: 0.76,
    },
  },
];
