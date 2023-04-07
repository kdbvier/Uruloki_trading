export type Position = {
  type: "Buy" | "Sell";
  priceUsd: number;
  amountBlur: number;
  executionValue: number;
};

export type TokenPositions = {
  id: string;
  totalBuyValue: number;
  totalSellValue: number;
  positions: Array<Position>;
};
