'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { LoggedUser } from '@/types/auth'

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`
}

type AuthContextValue = {
  user: LoggedUser | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: LoggedUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoggedUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = getCookie('auth_token')
    const storedUser = getCookie('auth_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (token: string, user: LoggedUser) => {
    setCookie('auth_token', token)
    setCookie('auth_user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const logout = () => {
    deleteCookie('auth_token')
    deleteCookie('auth_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
