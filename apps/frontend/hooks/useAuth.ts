'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { login, requestPasswordReset } from '@/services/auth.service'
import { parseApiError } from '@/lib/parse-error'
import type { LoginPayload } from '@/types/auth'

export function useLogin() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (data: LoginPayload) => login(data),
    onSuccess: () => {
      router.push('/select-role')
    },
    onError: (error) => {
      setErrorMessage(parseApiError(error))
    },
  })

  return { ...mutation, errorMessage }
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => requestPasswordReset(email),
  })
}
