import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_API_BUCKET_URL: z.string().url(),
  NEXT_PUBLIC_API_BUCKET_NAME: z.string(),
  NEXT_PUBLIC_SOCKET_IO_URL: z.string().url(),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_BUCKET_URL: process.env.NEXT_PUBLIC_API_BUCKET_URL,
  NEXT_PUBLIC_API_BUCKET_NAME: process.env.NEXT_PUBLIC_API_BUCKET_NAME,
  NEXT_PUBLIC_SOCKET_IO_URL: process.env.NEXT_PUBLIC_SOCKET_IO_URL,
})
