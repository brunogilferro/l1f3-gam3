export function parseApiError(error: unknown): string {
  if (error && typeof error === 'object' && 'errors' in error) {
    const apiError = error as { errors: { message: string }[] }
    return apiError.errors?.[0]?.message ?? 'Ocorreu um erro'
  }
  return 'Ocorreu um erro inesperado'
}
