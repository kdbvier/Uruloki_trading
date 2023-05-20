import { Strategy } from "@/types";
import { httpRequest } from "./http";

export default class Strategies {
  static getStrategiesData = async (
    walletAddress: string
  ): Promise<Array<Strategy>> => {
    return await httpRequest.get("/strategies", {
      params: {
        wallet_address: walletAddress,
      },
    });
  };
  static getStrategyData = async (id: string): Promise<Strategy> => {
    return await httpRequest.get(`/strategies/${id}`);
  };
}
