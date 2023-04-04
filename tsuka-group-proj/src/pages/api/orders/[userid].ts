import { PrismaClient, orders } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function orderHandler(
  req: NextApiRequest,
  res: NextApiResponse<orders[]>
) {
  const { query, method } = req;
  const { userid } = query;
  switch (method) {
    case "GET":
      const orders = await prisma.orders.findMany({
        where:{
            user_id:Number(userid)
        }
      });
      res.status(200).json(orders);
      break;
    default:
      res.setHeader("Allow", "GET");
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
