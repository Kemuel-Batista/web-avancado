import { z } from 'zod'

export const createRoomSchema = z.object({
  participantTwoId: z.string().uuid(),
})

export type CreateRoomFormData = z.infer<typeof createRoomSchema>
