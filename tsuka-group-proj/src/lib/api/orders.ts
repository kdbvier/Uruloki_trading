import {  Order, PatchOrder, PostOrder } from "@/types";
import { UserOrder } from "@/types/token-order.type";
import { httpRequest } from "./http";



export default class Orders {
  static getOrders = async (): Promise<Order> => {
    return await httpRequest.get('/orders');
  };

  static getOrdersbyUserId = async (
    userId: string
  ): Promise<UserOrder[]> => {
    return await httpRequest.get(`/orders/user/${userId}`);
  };

  static getOrdersbyTokenPair = async (
    tokenpair: string
  ): Promise<Order> => {
    return await httpRequest.get(`/orders/tokenpair/${tokenpair}`);
  };

  static createOrder = async (data: PostOrder): Promise<Order> => {
    return await httpRequest.post("/orders", data);
  };

  static editOrder = async (orderId:string,data: PatchOrder): Promise<Order> => {
    return await httpRequest.post(`/orders/${orderId}`, data);
  };

  static deleteOrder = async (
    orderId: string
  ): Promise<Order> => {
    return await httpRequest.delete(`/orders/${orderId}`);
  };
}
