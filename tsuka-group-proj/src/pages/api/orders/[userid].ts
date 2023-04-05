import { Orders } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function orderHandler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Orders>>
) {
  const { query, method } = req;
  const { userid } = query;
  switch (method) {
    case "GET":
      const orders = await prisma.orders.findMany({
        where: {
          user_id: Number(userid),
        },
      });
      const response = orders.map(
        (order) =>
          ({
            ...order,
            token_price: order.token_price?.toNumber(),
            single_price: order.single_price?.toNumber(),
            from_price: order.from_price?.toNumber(),
            to_price: order.to_price?.toNumber(),
            budget: order.budget?.toNumber(),
          } as Orders)
      );
      res.status(200).json(response);
      break;
    default:
      res.setHeader("Allow", "GET");
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
