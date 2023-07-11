import { Strategy } from "@/types";
import axios from "axios";

export default class Strategies {
  static getStrategiesData = async (
    walletAddress: string
  ): Promise<Array<Strategy>> => {
    try {
      let data = await axios.get("api/strategies", {
        params: {
          wallet_address: walletAddress,
        },
      });
      return data.data.payload;
    } catch(err) {
      return [];
    }
  };
  static getStrategyData = async (id: string): Promise<Strategy> => {
    return await axios.get(`api/strategies/${id}`);
  };
}
