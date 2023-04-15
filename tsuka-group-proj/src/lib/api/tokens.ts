import {  Tokens } from '@/types';
import { httpRequest } from './http';

export default class HomePageTokens {
    static getTokens = async (): Promise<Tokens> =>  { 
        return await httpRequest.get('/tokens');
    };
}