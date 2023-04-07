export type Compare = {
  inputToken: {
    icon: string;
    name: string;
    code: string;
  };
  outputToken: {
    icon: string;
    name: string;
    code: string;
  };
  network: string;
  value: number;
  diference: {
    value: number;
    operator: "+" | "-";
  };
};
