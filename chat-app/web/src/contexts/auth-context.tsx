'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { api } from '@/lib/axios'

type SignInCredentials = {
  email: string
  password: string
}

export type User = {
  id: string
  name: string
  lastName: string
  email: string
  photo: string
}

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>
  signOut: () => Promise<void>
  getMe: () => void
  user: User
  isAuthenticated: boolean
}

export const AuthContext = createContext({} as AuthContextData)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>({
    id: '',
    name: '',
    lastName: '',
    email: '',
    photo: '',
  })

  const isAuthenticated = user.id !== null

  const signOut = async () => {
    await api.post('/auth/sessions/logout')
    setUser({
      id: '',
      name: '',
      lastName: '',
      email: '',
      photo: '',
    })
  }

  const getMe = async () => {
    try {
      const me = await api.get('/me')
      const { id, name, lastName, email, photo } = me.data.user
      setUser({ id, name, lastName, email, photo })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getMe()
  }, [])

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    await api.post(`/auth/session`, {
      email,
      password,
    })
  }, [])

  const contextBag = useMemo(
    () => ({
      signIn,
      signOut,
      getMe,
      isAuthenticated,
      user,
    }),
    [signIn, signOut, getMe, isAuthenticated, user],
  )

  return (
    <AuthContext.Provider value={contextBag}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
