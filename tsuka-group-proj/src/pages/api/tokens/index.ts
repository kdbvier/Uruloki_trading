import type { ApiResponse, TokenCache } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function TokenCacheHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TokenCache>>
) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const tokens = await prisma.token_cache.findMany();
        res.status(200).json({ payload: tokens, message: `Successfully found Tokens` });
      } catch (err) {
        res.status(500).json({
            payload: undefined,
            message: `Something went wrong! Please read the error message '${err}'`,
          });
      }
      break;
    default:
      res.setHeader("Allow", "GET");
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
