import type  { ApiResponse, User } from "@/types";
import {  PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";


const prisma = new PrismaClient();


export default async function UsersHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User>>
) {
  const { method, query } = req;
  const {userid}=query
  switch (method) {
      case "DELETE":
      try {
        const userExist = await prisma.users.findFirst({
          where: {
            user_id: Number(userid),
          },
        });
        if (!userExist) {
          res
            .status(404)
            .json({
              payload: undefined,
              message: `User id ${userid} not found!`,
            });
          break;
        }
        const user = await prisma.users.delete({
          where: {
            user_id: Number(userid),
          },
        });
        res
          .status(200)
          .json({
            payload: undefined,
            message: `Successfully deleted user id ${userid}`,
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
      res.setHeader("Allow", "DELETE");
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
