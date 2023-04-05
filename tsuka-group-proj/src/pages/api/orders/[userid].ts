import { ApiResponse, Orders } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function orderHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Orders>>
) {
  const { query, method } = req;
  const { userid } = query;
  switch (method) {
    case "GET":
      try {
        const orders = await prisma.orders.findMany({
          where: {
            user_id: Number(userid),
          },
        });
        console.log(orders);
        if (orders.length===0)
          res.status(404).json({
              payload: undefined,
              message: `Orders with User id ${userid} not found!`,
            });
        res.status(200).json({ payload: orders, message: `Successfully found orders` });
      } catch (err) {
        res.status(503).json({ payload: undefined, message: `Something went wrong! Please read the error message '${err}'` });
      }
      break;
    default:
      res.setHeader("Allow", "GET");
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
