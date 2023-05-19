import { TokenPairInfo, Tokens } from "@/types";
import { httpRequest } from "./http";
import { FilterSearchItemType } from "@/components/ui/content-header/filters.search";

const API_URL = process.env.NODE_ENV === 'production' ? 'https://live-site-url': 'http://localhost:3000';

export default class HomePageTokens {
  static getTokens = async (): Promise<Tokens> => {
    // return await httpRequest.get("/tokens");
    return await httpRequest.get(`${API_URL}/api/tokens`);
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
  static getTokenVolume = async (
    baseTokenAddress: string
  ): Promise<{ tradeAmount: number }> => {
    return await httpRequest.get(`/tokens/token-volume`, {
      params: {
        baseTokenAddress,
      },
    });
  };
}
