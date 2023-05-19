import { Strategy } from "@/types";
import { httpRequest } from "./http";

const API_URL = process.env.NODE_ENV === 'production' ? 'https://live-site-url': 'http://localhost:3000';
export default class Strategies {
  static getStrategiesData = async (): Promise<Array<Strategy>> => {
    console.log("dlfkjdlfkjadlfjaldfkjalkfj");
    // return await httpRequest.get("/strategies");
    return await httpRequest.get(`${API_URL}/api/strategies`);
  };
  static getStrategyData = async (id: string): Promise<Strategy> => {
    return await httpRequest.get(`/strategies/${id}`);
  };
}
