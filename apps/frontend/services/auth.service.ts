import type { LoginPayload, LoginResponse } from '@/types/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'

export async function login(data: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: data.email, password: data.password }),
  })

  const json = await res.json()

  if (!res.ok) {
    throw json.errors?.[0]?.message ?? 'Email ou senha incorretos.'
  }

  return json.data
}

export async function requestPasswordReset(email: string): Promise<void> {
  // TODO: implement when backend route exists
  console.warn('requestPasswordReset not implemented', email)
}
