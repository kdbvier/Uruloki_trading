import type  { ApiResponse, Order } from "@/types";
import {  PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

const reqBodySchema = Joi.object({
  pair_address: Joi.string().required(),
  status: Joi.string().required(),
  token_price: Joi.number().required(),
  single_price: Joi.number().optional(), //Price if target price order
  from_price: Joi.number().optional(), //Min price if price range
  to_price: Joi.number().optional(), //Max price if price range
  budget: Joi.number().required(), //Budget in usd
  order_type: Joi.string().valid("buy", "sell").required(),
  price_type: Joi.string().valid("range", "single").required(),
  user_id: Joi.number().required(),
})
  .max(10)
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
        const {value,error} = reqBodySchema.validate(body);
        if (error) {
          res
            .status(404)
            .json({
              payload: undefined,
              message: `Validation Error: ${error.message}`,
            });
          break;
        }
        const order = await prisma.orders.create({
          data: value,
        });
        res
          .status(200)
          .json({ payload: order, message: `Successfully created order` });
      } catch (err) {
        res
          .status(400)
          .json({
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
        res
          .status(400)
          .json({
            payload: undefined,
            message: `Something went wrong! Please read the error message '${err}'`,
          });
      }
      break;
    default:
      res.setHeader("Allow", ["POST","GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
