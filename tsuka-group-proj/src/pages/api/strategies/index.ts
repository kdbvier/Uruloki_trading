import type { ApiResponse, Strategy } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

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
        const strategy = await prisma.strategies.create({
          data: value,
        });
        console.log(strategy);
        res.status(200).json({
          payload: strategy,
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
        const strategies = await prisma.strategies.findMany({});
        res.status(200).json({
          payload: strategies,
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
