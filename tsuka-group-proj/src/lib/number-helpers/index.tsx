import { commafy } from "@/helpers/calc.helper";
import { formatNumberToHtmlTag } from "@/helpers/coin.helper";

export const convertLawPrice = (price: number) => {
    let priceEle;
    if (price >= 0.01) {
      priceEle = `$${commafy(price)}`;
    } else {
      priceEle = (
        <>
          {formatNumberToHtmlTag(price).integerPart}
          .0
          <sub>{formatNumberToHtmlTag(price).leadingZerosCount}</sub>
          {formatNumberToHtmlTag(price).remainingDecimal}
        </>
      );
    }
    return priceEle;
};

export const handleNumberFormat = (num: number): string => {
    let value = num.toString();
    const pattern = /^\d*\.?\d*$/;
    if (!pattern.test(value)) return "";
    let newValue = "";
    if (value.search("\\.") !== -1) {
      let [integerPart, decimalPart] = value.split(".");
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      newValue = `${integerPart}.${decimalPart ? decimalPart : ""}`;
    } else {
      newValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return newValue;
};

export const toNumber = (str: string): number => {
  const value = str.replace(/,/g, "");
  const num = Number(value);
  if (Number.isNaN(num)) {
    return -1;
  }
  return num;
};