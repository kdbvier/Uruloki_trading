import { TokenPairInfo, Tokens } from "@/types";

import { SearchPair } from "@/types";
import axios from "axios";
export default class HomePageTokens {
  static getTokens = async (): Promise<Tokens> => {
    return await axios.get(`/api/tokens`);
  };
  static searchTokens = async (name: string): Promise<SearchPair[]> => {
    return await axios.get(`/search/addresses?name=${name}`)
  };
  static getTokenPairInfo = async (
    pair_address: string
  ): Promise<TokenPairInfo> => {
    return await axios.get(`/api/tokens/token-pair?pair_address=${pair_address}`);
  };
  static getTokenVolume = async (
    baseTokenAddress: string
  ): Promise<{ tradeAmount: number }> => {
    return await axios.get(`/tokens/token-volume?baseTokenAddress=${baseTokenAddress}`);
  };
}
