import {  Order, PatchOrder, PostOrder } from "@/types";
import { UserOrder } from "@/types/token-order.type";
import { httpRequest } from "./http";



export default class Orders {
  static getOrders = async (): Promise<Order> => {
    return await httpRequest.get('/orders');
  };
  static getOrderById = async (order_id: number):Promise<Order> => {
    return await httpRequest.get(`orders/${order_id}`);
  }

  static getOrdersbyUserId = async (
    userId: string
  ): Promise<UserOrder[]> => {
    return await httpRequest.get(`/orders/user/${userId}`);
  };

  static getOrdersbyUserIdandFilters = async (userId:number, status:string, search:string): Promise<UserOrder[]>=>{
    return await httpRequest.get(`orders/user/${userId}?status=${status}&search=${search}`);
  }

  static getOrdersbyTokenPair = async (
    tokenpair: string
  ): Promise<Order> => {
    return await httpRequest.get(`/orders/tokenpair/${tokenpair}`);
  };

  static createOrder = async (data: PostOrder): Promise<Order> => {
    return await httpRequest.post("/orders", data);
  };

  static editOrder = async (orderId:number,data: PatchOrder): Promise<Order> => {
    console.log("posting edit data :::");
    return await httpRequest.patch(`/orders/${orderId}`, data);
  };

  static deleteOrder = async (
    orderId: number
  ): Promise<Order> => {
    return await httpRequest.delete(`/orders/${orderId}`);
  };
}
