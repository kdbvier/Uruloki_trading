import { Strategy } from "@/types";
import { httpRequest } from "./http";
import axios from "axios";

export default class Strategies {
  static getStrategiesData = async (
    walletAddress: string
  ): Promise<Array<Strategy>> => {
    return await axios.get("api/strategies", {
      params: {
        wallet_address: walletAddress,
      },
    });
  };
  static getStrategyData = async (id: string): Promise<Strategy> => {
    return await axios.get(`api/strategies/${id}`);
  };
}
