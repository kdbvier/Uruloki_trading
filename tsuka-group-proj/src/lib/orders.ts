import type { Order, OrdersBook, OrdersBookType } from "@/types";
import { OrderBookData } from "@/types/orderbook.type";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Server-side function to get all orders for the provided pair address
 * @param pair_address 
 * @param status 
 * @returns 
 */
export async function getOrdersByPair(pair_address: string, status?: string): Promise<Array<Order>> {
    console.log("Pair address")
    console.log(pair_address)
    const whereCondition: any = {pair_address};
    if (status) {
        whereCondition["status"] = status;
    }
    const orders = await prisma.orders.findMany({
        where: whereCondition,
    });
    return orders
}

/**
 * Client-Side
 * Used for generating the data for the order book component. The component needs a single price for each order, so this function converts the order to a single price
 * @param order 
 * @returns 
 */
function orderBookOrderToSinglePrice(order: Order): number {
    //If the order is a target price order (single), then the price is the single price. If it is a price range order, then the price is the from price if it is also a sell order
    if (order.price_type === "single") {
        return order.single_price ?? 0;
    } else if (order.order_type === "sell") {
        return order.from_price ?? 0;
    } else {
        return order.to_price ?? 0;
    }
}

/**
 * Client-Side
 * Converts an array of orders into a single OrderBookData object
 * @param all_orders 
 * @returns 
 */
export function ordersToOrderBook(all_orders: Order[]): OrderBookData {
    //Only look at orders which are active
    const orders = all_orders.filter(a => a.status == "Active")
    const orderBookData = new OrderBookData();

    for (const order of orders) {
        const price = orderBookOrderToSinglePrice(order);
        const size = (order.budget as number) * (price as number); //This is the number of tokens that the order is for
        orderBookData.updateVolumeAtPrice(price, size, order.order_type === "sell");
    }

    return orderBookData;
}