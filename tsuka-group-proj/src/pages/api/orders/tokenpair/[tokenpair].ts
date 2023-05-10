import type { ApiResponse, Order } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function OrderByTokenPairHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Order>>
) {
  const { query, method } = req;
  const { tokenpair } = query;
  switch (method) {
    case "GET":
      try {
        const { status } = query;
        const whereCondition: any = {
          pair_address: String(tokenpair),
        };
        if (status) {
          whereCondition["status"] = status;
        }
        const orders = await prisma.orders.findMany({
          where: whereCondition,
        });
        res
          .status(200)
          .json({ payload: orders, message: `Successfully found orders` });
      } catch (err) {
        res
          .status(400)
          .json({
            payload: undefined,
            message: `Something went wrong! Please read the error message '${err}'`,
          });
      }
      break;
    default:
      res.setHeader("Allow", "GET");
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
