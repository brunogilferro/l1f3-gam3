export type LoginPayload = {
  email: string
  password: string
  rememberMe?: boolean
}

export type LoginResponse = {
  token: string
  user: {
    id: number
    name: string
    email: string
    role: string
  }
}
