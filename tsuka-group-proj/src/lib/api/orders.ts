import { ApiResponse, Order, PatchOrder, PostOrder } from "@/types";
import { httpRequest } from "./http";



export default class Orders {
  static getOrders = async (): Promise<ApiResponse<Order>> => {
    return await httpRequest.get('/orders');
  };

  static getOrdersbyUserId = async (
    userId: string
  ): Promise<ApiResponse<Order>> => {
    return await httpRequest.get(`/orders/user/${userId}`);
  };

  static getOrdersbyTokenPair = async (
    tokenpair: string
  ): Promise<ApiResponse<Order>> => {
    return await httpRequest.get(`/orders/tokenpair/${tokenpair}`);
  };

  static createOrder = async (data: PostOrder): Promise<ApiResponse<Order>> => {
    return await httpRequest.post("/orders", data);
  };

  static editOrder = async (orderId:string,data: PatchOrder): Promise<ApiResponse<Order>> => {
    return await httpRequest.post(`/orders/${orderId}`, data);
  };

  static deleteOrder = async (
    orderId: string
  ): Promise<ApiResponse<Order>> => {
    return await httpRequest.delete(`/orders/${orderId}`);
  };
}
