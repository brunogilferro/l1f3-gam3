import { createTuyauReactQueryClient } from '@tuyau/react-query'
import { tuyau } from './api'

export const q = createTuyauReactQueryClient({ client: tuyau })
