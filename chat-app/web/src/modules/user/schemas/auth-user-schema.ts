import { z } from 'zod'

export const authUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
})

export type AuthUserFormData = z.infer<typeof authUserSchema>
