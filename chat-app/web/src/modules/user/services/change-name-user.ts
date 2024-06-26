import { useMutation } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'

import { ChangeNameFormData } from '../schemas/change-name-schema'

export const ChangeNameUserService = () => {
  return useMutation<Response, unknown, ChangeNameFormData>({
    mutationFn: async (data) => {
      const response = await api.patch('/users/change-name', data)

      return response.data
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })
    },
  })
}
