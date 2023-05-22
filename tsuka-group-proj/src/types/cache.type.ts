export type Caches = {
  stale: boolean,
  data: {
    cached_data: string,
    data_key: Object
  }
}

export type CachedData = {
  cached_data: Object,
  data_key: string,
  ttl: number
}
