export interface ChartBound {
  buy?: boolean;
  values: {
    value: number;
    min: number;
    max: number;
  };
}
