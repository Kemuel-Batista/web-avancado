import { useMutation } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'

import { CreateUserFormData } from '../schemas/create-validation-schema'

export const CreateUserService = () => {
  return useMutation<Response, unknown, CreateUserFormData>({
    mutationFn: async (data) => {
      const response = await api.post('/users', data)

      return response.data
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })
    },
  })
}
