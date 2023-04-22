export type Position = {
  type: "Buy" | "Sell";
  depth: number;
  priceUsdt: number;
  amountBlur: number;
  executionValue: number;
};

export type TokenPositions = {
  id: string;
  buy: {
    totalValue: number;
    positions: Array<Position>;
  };
  sell: {
    totalValue: number;
    positions: Array<Position>;
  };
};
