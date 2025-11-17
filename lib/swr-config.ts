import { SWRConfiguration } from "swr"

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 2000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  fetcher: (url: string) => fetch(url).then((res) => res.json())
}

// Cache times for different data types
export const CACHE_TIMES = {
  STATIC: 60 * 60 * 1000, // 1 hour
  DYNAMIC: 5 * 60 * 1000, // 5 minutes
  REALTIME: 30 * 1000 // 30 seconds
}
