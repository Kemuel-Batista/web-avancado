import { z } from 'zod'

export const changeNameSchema = z.object({
  name: z.string(),
})

export type ChangeNameFormData = z.infer<typeof changeNameSchema>
