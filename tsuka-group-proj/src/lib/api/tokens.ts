import { Tokens } from "@/types";
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
}
