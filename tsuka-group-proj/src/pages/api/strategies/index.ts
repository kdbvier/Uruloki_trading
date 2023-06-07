import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import { getStrategy } from "./[strategyid]";
import { ApiResponse, Strategy, StrategyStatusEnum } from "@/types";
import {
  OrderStatusEnum,
  RangeOrder,
  SingleOrder,
} from "@/types/token-order.type";
import Strategies from "@/lib/api/strategies";

const reqBodySchema = Joi.object({
  name: Joi.string().required(),
  user_id: Joi.number().required(),
})
  .max(3)
  .min(2);

const prisma = new PrismaClient();

export default async function strategyHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Strategy>>
) {
  const { query, method, body } = req;
  switch (method) {
    case "POST":
      try {
        const { value, error } = reqBodySchema.validate(body);
        if (error) {
          res.status(404).json({
            payload: undefined,
            message: `Validation Error: ${error.message}`,
          });
          break;
        }
        const strategy = await prisma.strategies.create({
          data: value,
        });
        const { orders, orderTokens } = await getStrategy(
          strategy.strategy_id.toString()
        );
        console.log(strategy);
        res.status(200).json({
          payload: {
            id: strategy.strategy_id.toString(),
            title: strategy.name as string,
            status: strategy.status as StrategyStatusEnum,
            createdAt: Math.round(
              (strategy.createdAt?.getTime() ?? 0) / 1000
            ).toString() as string,
            orderTokens: orderTokens.map((orderToken) => ({
              network: "Ethereum",
              name1: orderToken.baseTokenLongName as string,
              code1: orderToken.baseTokenShortName as string,
              name2: orderToken.pairTokenLongName as string,
              code2: orderToken.pairTokenShortName as string,
              status: orderToken.status as OrderStatusEnum,
              orders: orders[orderToken.order_id] as Array<
                SingleOrder | RangeOrder
              >,
            })),
          },
          message: `Successfully created setup`,
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    case "GET":
      try {
        const { wallet_address } = query;
        const payload = await Strategies.getStrategiesData(wallet_address as string)
        res.status(200).json({
          payload,
          message: `Successfully found setups`,
        });
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
