import { ApiResponse, Order } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

const reqBodySchema = Joi.object({
  pair_address: Joi.string().optional(),
  status: Joi.string().optional(),
  token_price:Joi.number().optional(),
  single_price: Joi.number().optional(),
  from_price: Joi.number().optional(),
  to_price: Joi.number().optional(),
  budget: Joi.number().optional(),
  order_type: Joi.string().valid('buy','sell').optional(),
  price_type: Joi.string().valid('range','single').optional(),
}).length(1);

const prisma = new PrismaClient();

export default async function orderHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Order>>
) {
  const { query, method,body} = req;
  const { orderid } = query;
  switch (method) {
    case "PATCH":
      try {
        const validatedBody = reqBodySchema.validate(body);
        if(validatedBody.error){
          res.status(404).json({payload: undefined,message: `Validation Error: ${validatedBody.error.message}`});
          break;
        }
        const orderExist = await prisma.orders.findFirst({
          where: {
            order_id: Number(orderid),
          },
        });
        if (!orderExist) {
          res.status(404).json({payload: undefined,message: `Order id ${orderid} not found!`});
          break;
        }
        const order = await prisma.orders.update({
          where: {
            order_id: Number(orderid),
          },
          data:body
        });
        res.status(200).json({payload:order,message: `Successfully updated order id ${orderid}`});
      } catch (err) {
        res
          .status(400).json({payload: undefined,message: `Something went wrong! Please read the error message '${err}'`});
      }
      res.status(200).end(`Method  Not Allowed`);
      break;
    case "DELETE":
      try {
        const orderExist = await prisma.orders.findFirst({
          where: {
            order_id: Number(orderid),
          },
        });
        if (!orderExist) {
          res
            .status(404)
            .json({
              payload: undefined,
              message: `Order id ${orderid} not found!`,
            });
          break;
        }
        const orders = await prisma.orders.delete({
          where: {
            order_id: Number(orderid),
          },
        });
        res
          .status(200)
          .json({
            payload: undefined,
            message: `Successfully deleted order id ${orderid}`,
          });
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
      res.setHeader("Allow", ["DELETE", "PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
