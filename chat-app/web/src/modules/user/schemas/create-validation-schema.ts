import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(20),
  photo: z.string(),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
