import { PaginateParams, usePaginateQuery } from '@/hooks/use-paginate-query'

import { RoomDetails } from '../types/room-details'

export interface ListRoomsServiceResponse {
  rooms: RoomDetails[]
}

export const ListRoomsService = (params: PaginateParams) => {
  return usePaginateQuery<ListRoomsServiceResponse>(
    'rooms',
    '/rooms/participant',
    params,
  )
}
