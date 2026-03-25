'use client';

import { useAuth } from '@/context/auth-context';
import { tuyau } from '@/lib/api';
import type { LoginPayload } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useLogin() {
  const router = useRouter();
  const auth = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: LoginPayload) =>
      tuyau.api.auth.store({
        body: { email: data.email, password: data.password },
      }),
    onSuccess: (res) => {
      auth.login(res.data.token, res.data.user);
      router.push('/');
    },
    onError: (error: unknown) => {
      const response = (
        error as { response?: { errors?: { message: string }[] } }
      )?.response;
      setErrorMessage(
        response?.errors?.[0]?.message ?? 'Email ou senha incorretos.'
      );
    },
  });

  return { ...mutation, errorMessage };
}

export function useLogout() {
  const auth = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: () => tuyau.api.auth.destroy({}),
    onSettled: () => {
      auth.logout();
      router.push('/login');
    },
  });
}

export function useRequestPasswordReset() {
  return useMutation<void, Error, string>({
    mutationFn: () => Promise.resolve(), // TODO: implement when backend route exists
  });
}
