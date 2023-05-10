import { TokenType } from "@/types/tokens.type";

export const Tokens: Array<TokenType> = [
  {
    id: 0,
    name: "Bitcoin",
  },
  {
    id: 1,
    name: "Avalanche",
  },
  {
    id: 2,
    name: "Ethereum",
  },
  {
    id: 3,
    name: "Tether",
  },
  {
    id: 4,
    name: "BNB",
  },
  {
    id: 5,
    name: "XRP",
  },
  {
    id: 6,
    name: "Cardano",
  },
  {
    id: 7,
    name: "Dogecoin",
  },
  {
    id: 8,
    name: "Polygon",
  },
  {
    id: 9,
    name: "Ethereum",
  },
  {
    id: 10,
    name: "Polkadot",
  },
  {
    id: 11,
    name: "TRON",
  },
  {
    id: 12,
    name: "Binance USD",
  },
  {
    id: 13,
    name: "Litecoin",
  },
  {
    id: 14,
    name: "Shiba Inu",
  },
  {
    id: 15,
    name: "Chainlink",
  },
];

export const getToken = () => {
  return Tokens;
};
