import { api } from '@/lib/api'
import type { LoginPayload, LoginResponse } from '@/types/auth'

export async function login(data: LoginPayload): Promise<LoginResponse> {
  const response = await api.auth.login.$post({ json: data })
  return response.json().then((r: { data: LoginResponse }) => r.data)
}

export async function requestPasswordReset(email: string): Promise<void> {
  await api.auth['password-reset'].$post({ json: { email } })
}
