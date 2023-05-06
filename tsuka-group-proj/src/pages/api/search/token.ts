/** route example: api/search/token?name=usdt */

import type { ApiResponse } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { searchTokensByName } from "@/services/search-services";

export default async function orderHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  const { method, query } = req;
  switch (method) {
    case "GET":
      try {
        // const orders = await prisma.orders.findMany({});
        let name = query.name as string;
        const tokens = await searchTokensByName(name);
        res
          .status(200)
          .json({ payload: tokens, message: `Successfully found orders` });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
