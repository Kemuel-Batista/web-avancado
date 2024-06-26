import { useQuery, UseQueryResult } from '@tanstack/react-query'

import { api } from '@/lib/axios'

export type PaginateParams = {
  pageIndex?: number
  allRecords?: boolean
}

export const usePaginateQuery = <T>(
  queryKey: string | unknown[],
  endpoint: string,
  params: PaginateParams,
): UseQueryResult<T> => {
  const { pageIndex = 0, allRecords = false } = params

  const result = useQuery<T>({
    queryKey: [queryKey, { pageIndex, allRecords }],
    queryFn: async () => {
      const response = await api.get(endpoint, {
        params: { page: pageIndex + 1, allRecords },
      })

      return response.data as T
    },
  })

  return result
}
