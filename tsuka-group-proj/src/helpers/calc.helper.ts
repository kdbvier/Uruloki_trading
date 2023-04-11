export function calculatePercentIncrease(buy: number, sell: number): number {
  const percentIncrease = (buy / (sell + buy)) * 100;
  return Math.floor(percentIncrease);
}
