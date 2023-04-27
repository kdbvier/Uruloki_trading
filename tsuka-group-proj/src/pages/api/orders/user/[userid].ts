import type  { ApiResponse, Order } from "@/types";
import { UserOrder } from "@/types/token-order.type";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function OrderByUserHandler(
  req: NextApiRequest,
  // res: NextApiResponse<ApiResponse<Order>>
  res: NextApiResponse<ApiResponse<UserOrder>>
) {
  const { query, method } = req;
  const { userid } = query;
  switch (method) {
    case "GET":
      try {
        const user = await prisma.users.findFirst({
          where:{
            user_id: Number(userid)
          }
        })
        if (!user){
        res.status(404).json({payload: undefined, message: `User id ${userid} not found!` });
        break;
      }
        //////From Origin Start?///
        // const orders = await prisma.orders.findMany({
        //   where: {
        //     user_id: Number(userid),
        //   },
        // });
        //////From Origin End?///
        //// Mine Own function Start////
        const myUserId = 1; //This is temp
        const orders = await prisma.orders.findMany({
          where: {
            user_id: myUserId,
            token_cache: {
              isNot: undefined
            }
          },
          include: {
            token_cache: true
          }
        });

        const groupedOrders: { id: string, orders: any[] }[] = orders.reduce((result: { id: string, orders: any[] }[], order) => {
          const tokenCacheId = order.token_cache?.pair_address ?? '';
          // if(!tokenCacheId) {
          //   return result;
          // }
        
          // Check if there's already an element in the array with the same tokenCacheId
          const existingOrderGroup = result.find(group => group.id === tokenCacheId);

          const orderData = {
            id: order.order_id,
            budget: order.budget,
            order_type: order.order_type,
            price_type: order.price_type,
            price: order.price_type === 'single' ? order.single_price : undefined,
            prices: order.price_type === 'range' ? [order.from_price, order.to_price] : undefined
          };
        
          if (existingOrderGroup) {
            existingOrderGroup.orders.push(orderData);
          } else {
            result.push({
              id: tokenCacheId,
              orders: [orderData]
            });
          }
        
          return result;
        }, []);
        
        console.log("grouped Orders is like this");
        console.log(JSON.stringify (groupedOrders));
        //// Mine Own function End////
        res.status(200).json({ payload: groupedOrders, message: `Successfully found orders` });
      } catch (err) {
        res.status(400).json({ payload: undefined, message: `Something went wrong! Please read the error message '${err}'` });
      }
      break;
    default:
      res.setHeader("Allow", "GET");
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
