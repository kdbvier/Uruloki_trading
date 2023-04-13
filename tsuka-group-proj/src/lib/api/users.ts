import { ApiResponse, PostUser, User } from "@/types";
import { httpRequest } from "./http";


export default class Users {

  static getUsers = async (): Promise<ApiResponse<User>> => {
    return await httpRequest.get("/users");
  };
  
  static getUserbyUserId = async (
    userId: string
  ): Promise<ApiResponse<User>> => {
    return await httpRequest.get(`/users/${userId}`);
  };

  static createUser = async (data:PostUser): Promise<ApiResponse<User>> => {
    return await httpRequest.post('/users', data);
  };

  static deleteUser = async (userId: string): Promise<ApiResponse<User>> => {
    return await httpRequest.delete(`/users/${userId}`);
  };
}
