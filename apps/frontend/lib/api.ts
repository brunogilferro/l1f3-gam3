import { createTuyau } from '@tuyau/client'
import type { ApiDefinition } from 'backend/data'

export const api = createTuyau<ApiDefinition>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333',
})
