import { Strategy } from "@/types";
import { httpRequest } from "./http";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://live-site-url"
    : "http://localhost:3000";
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
