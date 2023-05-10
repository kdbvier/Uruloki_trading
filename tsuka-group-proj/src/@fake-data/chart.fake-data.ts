import { ChartType } from "@/types/chart.type";

export const ChartData: ChartType = {
  total: 0,
  active: 42501,
  out: 10211,
};

ChartData.total = ChartData.active + ChartData.out;

export const getChartData = () => {
  return ChartData;
};
