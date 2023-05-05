import type { ApiResponse, Strategy } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

const reqBodySchema = Joi.object({
  name: Joi.string().optional(),
}).max(1);

const prisma = new PrismaClient();

export default async function strategyHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Strategy>>
) {
  const { query, method, body } = req;
  const { strategyid } = query;

  switch (method) {
    case "DELETE":
      try {
        const strategyExist = await prisma.strategies.findFirst({
          where: {
            strategy_id: Number(strategyid),
          },
        });
        if (!strategyExist) {
          res.status(404).json({
            payload: undefined,
            message: `setup id ${strategyid} not found!`,
          });
          break;
        }
        const deletedStrategy = await prisma.strategies.delete({
          where: {
            strategy_id: Number(strategyid),
          },
        });
        res.status(200).json({
          payload: deletedStrategy,
          message: `Successfully deleted setup id ${strategyid}`,
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
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
            message: `setup id ${strategyid} not found!`,
          });
          break;
        }
        const strategy = await prisma.strategies.update({
          where: {
            strategy_id: Number(strategyid),
          },
          data: value,
        });
        res.status(200).json({
          payload: strategy,
          message: `Successfully updated setup id ${strategyid}`,
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["DELETE", "PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
