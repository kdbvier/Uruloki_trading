import { ApiResponse, Notification } from '@/types';
import { httpRequest } from './http';

export default class Notifications {

    static getNotificationsbyUserId = async (userId:string): Promise<ApiResponse<Notification>> =>  { 
        return await httpRequest.get(`/notifications/${userId}`);
    };
}