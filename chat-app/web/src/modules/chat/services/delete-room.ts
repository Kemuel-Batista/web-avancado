import { useMutation } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'

export const DeleteRoomService = () => {
  return useMutation<Response, unknown, string>({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/rooms/${id}`)

      return response.data
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
  })
}
