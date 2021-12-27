import Router from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies } from 'nookies'

import { api } from "../services/api";

type User = {
  email: string;
  permission: string[];
  roles: string[];
}

type SignInCredentials = {
  email: string;
  password: string
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User,
  isAuthenticated: boolean
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>(null)
  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'dashgo.token': token } = parseCookies()

    if (token) {
      api.get('/me',).then(response => {
        const { email, permission, roles } = response.data
        setUser({ email, permission, roles })
      })
    }
  }, [])

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password
      })

      const { token, refreshToken, permission, roles } = response.data

      setCookie(undefined, 'dashgo.token', token, {
        maxAge: 60 * 60 * 24 * 30, //30 days
        path: '/'
      })
      setCookie(undefined, 'dashgo.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, //30 days
        path: '/'
      })

      setUser({
        email,
        permission,
        roles
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      Router.push('/dashboard')
    } catch (error) {
      console.log(error)
    }


  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}