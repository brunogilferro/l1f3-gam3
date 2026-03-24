'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'motion/react'
import { Shield, LogIn, Eye, EyeOff, Star, Sparkles } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useLogin } from '@/hooks/useAuth'
import { ResetPasswordModal } from '@/components/reset-password-modal'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)

  const { mutate: login, isPending, errorMessage } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg-primary font-body">
      {/* Background glows */}
      <div
        className="pointer-events-none absolute left-[10%] top-[20%] h-[473px] w-[473px] rounded-full opacity-70"
        style={{ background: 'radial-gradient(circle, rgba(196,160,48,0.06) 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute bottom-[10%] right-[10%] h-[388px] w-[388px] rounded-full opacity-65"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex w-[480px] flex-col items-center"
      >
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-4 h-16 w-16">
            <div
              className="absolute inset-0 rounded-full border-2 border-accent-primary shadow-[0px_0px_33px_rgba(196,160,48,0.37),0px_0px_67px_rgba(196,160,48,0.12)]"
              style={{ background: 'radial-gradient(circle, rgba(42,32,16,1) 0%, rgba(26,21,8,1) 100%)' }}
            />
            <Star className="absolute inset-0 z-10 m-auto h-7 w-7 fill-accent-primary text-accent-primary" />
          </div>
          <h1 className="font-heading text-[28px] tracking-[5.98px] text-text-primary">
            L1F3 <span className="text-accent-primary">GAME</span>
          </h1>
          <p className="mt-1 text-sm tracking-wide text-text-secondary">
            Gestão colaborativa gamificada
          </p>
        </div>

        {/* Card */}
        <div className="w-full rounded-2xl border border-border-primary bg-bg-surface p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-2">
            <Shield className="h-[18px] w-[18px] text-accent-primary" />
            <h2 className="text-base tracking-wide text-text-primary">ENTRAR NA MESA</h2>
          </div>

          {/* Form-level error (API) */}
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-wide text-text-secondary">EMAIL</label>
              <input
                {...register('email')}
                type="email"
                placeholder="seu@email.com"
                className="rounded-lg border border-border-primary bg-black/40 px-4 py-3 text-sm text-text-primary placeholder:text-text-primary/30 outline-none transition-colors focus:border-accent-primary aria-invalid:border-destructive"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-wide text-text-secondary">SENHA</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border-primary bg-black/40 px-4 py-3 pr-12 text-sm text-text-primary placeholder:text-text-primary/30 outline-none transition-colors focus:border-accent-primary aria-invalid:border-destructive"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-text-primary"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="h-4 w-4 rounded accent-accent-primary"
                />
                <span className="text-xs text-text-secondary">Lembrar de mim</span>
              </label>
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-xs text-accent-primary/70 transition-colors hover:text-accent-primary"
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isPending}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-3.5 text-sm tracking-wide text-bg-primary shadow-[0px_4px_20px_rgba(196,160,48,0.3)] transition-opacity disabled:opacity-70"
              style={{
                background: 'linear-gradient(173deg, var(--accent-primary) 0%, color-mix(in srgb, var(--accent-primary) 80%, black) 100%)',
              }}
            >
              <LogIn className="h-[18px] w-[18px]" />
              {isPending ? 'ENTRANDO...' : 'ENTRAR'}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-text-secondary" />
          <p className="text-xs tracking-wide text-text-secondary">L1F3 GAME</p>
          <Sparkles className="h-3 w-3 text-text-secondary" />
        </div>
      </motion.div>

      <ResetPasswordModal open={showResetModal} onClose={() => setShowResetModal(false)} />
    </div>
  )
}
