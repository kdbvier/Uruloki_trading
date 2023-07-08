import { CardType } from "@/types/card.type";

export const filterTokens = (walletBalances: Array<CardType>) => {
  return walletBalances.filter((ele, id) => {
    if(ele.shortName.indexOf('https') < 0 && (ele.shortName.indexOf('.c') < 0 && ele.name.indexOf('.c') < 0))
      return ele;
  })
}
