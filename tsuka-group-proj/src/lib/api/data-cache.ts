import { Caches, CachedData } from "@/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class DataCache {

  static get = async (data_key: string): Promise<Caches> => {
    let result = await prisma.cache.findFirst({ where: { data_key } })
    let deadline = result!.timestamp + result!.ttl
    let currentTime = Math.floor(Date.now() / 1000)
    if (deadline >= currentTime) {
      return {
        stale: false,
        data: {
          data_key: JSON.parse(result?.data_key as string),
          cached_data: result?.cached_data as string
        }
      }
    } else {
      return {
        stale: true,
        data: {
          data_key: '',
          cached_data: ''
        }
      }
    }
  };
  static set = async (data: CachedData): Promise<{ status: any }> => {

    let currentTime = Math.floor(Date.now() / 1000)
    let result = await prisma.cache.findFirst({ where: { data_key: data.data_key } })
    if (result) {
      await prisma.cache.updateMany({
        where: {
          data_key: result.data_key
        },
        data: {
          timestamp: currentTime,
          cached_data: JSON.stringify(data.cached_data),
          data_key: data.data_key,
          ttl: data.ttl
        }
      })
      return {
        status : "success updating"
      }
    } else {

      await prisma.cache.create({
        data: {
          timestamp: currentTime,
          cached_data: JSON.stringify(data.cached_data),
          data_key: data.data_key,
          ttl: data.ttl
        }
      })
      return {
        status : "success creating"
      }
    }
  }
}
