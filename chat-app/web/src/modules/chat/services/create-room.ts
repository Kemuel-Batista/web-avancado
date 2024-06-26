import { useMutation } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'

import { CreateRoomFormData } from '../schemas/create-room-schema'

export const CreateRoomService = () => {
  return useMutation<Response, unknown, CreateRoomFormData>({
    mutationFn: async (data) => {
      const response = await api.post('/rooms', data)

      return response.data
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['rooms'],
      })
    },
  })
}
