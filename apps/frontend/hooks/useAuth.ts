'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { login, requestPasswordReset } from '@/services/auth.service'
import { useAuth } from '@/context/auth-context'
import type { LoginPayload } from '@/types/auth'

export function useLogin() {
  const router = useRouter()
  const auth = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (data: LoginPayload) => login(data),
    onSuccess: (res) => {
      auth.login(res.token, res.user)
      router.push('/')
    },
    onError: (error: unknown) => {
      setErrorMessage(typeof error === 'string' ? error : 'Email ou senha incorretos.')
    },
  })

  return { ...mutation, errorMessage }
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => requestPasswordReset(email),
  })
}
