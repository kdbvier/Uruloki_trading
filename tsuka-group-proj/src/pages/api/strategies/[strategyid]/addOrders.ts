import type { ApiResponse, Strategy } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

const reqBodySchema = Joi.object({
  orders: Joi.array().required(),
});

const prisma = new PrismaClient();

export default async function strategyHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Strategy>>
) {
  const { query, method, body } = req;
  const { strategyid } = query;

  switch (method) {
    case "PATCH":
      try {
        const { value, error } = reqBodySchema.validate(body);
        if (error) {
          res.status(404).json({
            payload: undefined,
            message: `Validation Error: ${error.message}`,
          });
          break;
        }
        const strategyExist = await prisma.strategies.findFirst({
          where: {
            strategy_id: Number(strategyid),
          },
        });
        if (!strategyExist) {
          res.status(404).json({
            payload: undefined,
            message: `Strategy id ${strategyid} not found!`,
          });
          break;
        }
        const { orders } = value;
        const strategy = await prisma.strategies.update({
          where: {
            strategy_id: Number(strategyid),
          },
          data: {
            orders: orders?.join(","),
          },
        });
        res.status(200).json({
          payload: strategy,
          message: `Successfully deleted strategy id ${strategyid}`,
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
