import axios from 'axios'
import { getCookie } from 'cookies-next'

import { env } from '@/env'

const token = getCookie('nextauth_token')

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

if (token) {
  api.defaults.headers.Authorization = `Bearer ${token}`
}
