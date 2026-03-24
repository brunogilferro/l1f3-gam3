'use client'

import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { logout } = useAuth()
  const router = useRouter()

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen bg-background text-foreground gap-4">
      <p className="text-text-secondary text-sm">Ready. Start building.</p>
      <button onClick={handleLogout} className="text-sm text-red-500 underline">
        Logout
      </button>
    </main>
  )
}
