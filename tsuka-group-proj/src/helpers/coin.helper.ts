export const formatNumber = (x: number, suffix0 = false): string => {
  const isNegative = x < 0;
  const parts = Math.abs(x).toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if(suffix0){
    if (parts.length == 1) {
      parts.push("00");
    }
  }
  if(parts.length == 2){
    parts[1] = (parts[1]).length == 1 ? "" + parts[1] + "0" : parts[1];
  }
  const formatted = parts.join(".");
  return isNegative ? "-" + formatted : formatted;
};

export const formatCurrency = (x: number, suffix0=false): string => {
  return `$${formatNumber(x, suffix0)}`;
};

export const formatSignedPercent = (x: number, suffix0=false): string => {
  let sign = x >= 0 ? "+" : "";
  return `${sign}${formatNumber(x, suffix0)}%`;
};

export const formatFixed2 = (x: number): string => {
  return Number.parseFloat(x.toString()).toFixed(2);
};

export const formatCurrencyFixed2 = (x: number, suffix0=false): string => {
  return formatCurrency(Number.parseFloat(formatFixed2(x)), suffix0);
};
