import { ApiResponse, Token } from '@/types';
import { httpRequest } from './http';

export default class Tokens {
    static getTokens = async (): Promise<ApiResponse<Token>> =>  { 
        return await httpRequest.get('/tokens');
    };
}