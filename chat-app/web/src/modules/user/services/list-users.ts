import { PaginateParams, usePaginateQuery } from '@/hooks/use-paginate-query'

import { User } from '../types/user'

export interface ListUsersServiceResponse {
  users: User[]
}

export const ListUsersService = (params: PaginateParams) => {
  return usePaginateQuery<ListUsersServiceResponse>('users', '/users', params)
}
