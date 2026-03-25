import { createTuyau } from '@tuyau/core/client';
import { registry } from 'backend/registry';

export const tuyau = createTuyau({
  registry,
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333',
  hooks: {
    beforeRequest: [
      (request) => {
        const match =
          typeof document !== 'undefined'
            ? document.cookie.match(/(?:^| )auth_token=([^;]+)/)
            : null;
        const token = match ? decodeURIComponent(match[1]) : null;
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
  },
});
