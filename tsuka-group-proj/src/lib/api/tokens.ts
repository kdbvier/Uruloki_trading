import { TokenPairInfo, Tokens } from "@/types";
import { httpRequest } from "./http";
import { FilterSearchItemType } from "@/components/ui/content-header/filters.search";

export default class HomePageTokens {
  static getTokens = async (): Promise<Tokens> => {
    return await httpRequest.get("/tokens");
  };
  static searchTokens = async (
    name: string
  ): Promise<FilterSearchItemType[]> => {
    return await httpRequest.get("/search/token", {
      params: {
        name,
      },
    });
  };
  static getTokenPairInfo = async (
    pair_address: string
  ): Promise<TokenPairInfo> => {
    return await httpRequest.get(`/tokens/token-pair`, {
      params: {
        pair_address,
      },
    });
  };
}
