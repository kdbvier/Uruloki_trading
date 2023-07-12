import type { ApiResponse, Order } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

const reqBodySchema = Joi.object({
  pair_address: Joi.string().required(),
  status: Joi.string().optional().default("Active"),
  is_continuous: Joi.boolean().required().default(false),
  single_price: Joi.number().optional(),
  from_price: Joi.number().optional(),
  to_price: Joi.number().optional(),
  budget: Joi.number().required(),
  order_type: Joi.string().valid("buy", "sell").required(),
  price_type: Joi.string().valid("range", "single").required(),
  user_id: Joi.number().required(),
  creator_address: Joi.string().required(),
  baseTokenShortName: Joi.string().optional(),
  baseTokenLongName: Joi.string().optional(),
  pairTokenShortName: Joi.string().optional(),
  pairTokenLongName: Joi.string().optional(),
  order_strategy: Joi.any()
})
  .max(14)
  .min(7);

const prisma = new PrismaClient();

export default async function orderHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Order>>
) {
  const { method, body } = req;
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
        console.log("value::", value);
        const order = await prisma.orders.create({
          data: value,
        });
        console.log("sus", order);
        let order_update;
        if (value.order_strategy) {
          order_update = await prisma.orders.update({
            where: {
              order_id: order.order_id
            },
            data: {
              ...value,
              order_strategy: [{
                orderId: order.order_id,
                ...value.order_strategy
              }]
            },
          });
        }
        res
          .status(200)
          .json({ payload: order_update ? order : order_update, message: `Successfully created order` });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    case "GET":
      try {
        const orders = await prisma.orders.findMany({});
        res
          .status(200)
          .json({ payload: orders, message: `Successfully found orders` });
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
