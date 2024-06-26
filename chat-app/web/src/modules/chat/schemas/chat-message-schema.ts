import { z } from 'zod'

export const chatMessageSchema = z.object({
  mensagem: z.string({ required_error: 'A mensagem é obrigatória!' }),
})

export type ChatMessageFormData = z.infer<typeof chatMessageSchema>
