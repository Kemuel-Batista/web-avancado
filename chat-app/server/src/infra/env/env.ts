import { z } from 'zod'

export const envSchema = z.object({
  POSTGRES_DATABASE_URL: z.string().url(),
  MONGO_DATABASE_URL: z.string().url(),
  JWT_KEY: z.string(),
  SOCKETIO_SERVER_PORT: z.coerce.number(),
  SOCKETIO_SERVER_PATH: z.string(),
  PORT: z.coerce.number().optional().default(2112),
})

export type Env = z.infer<typeof envSchema>
