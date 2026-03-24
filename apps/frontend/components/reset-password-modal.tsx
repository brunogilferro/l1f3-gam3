'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { KeyRound, X, Mail, CheckCircle2, AlertCircle } from 'lucide-react'
import { useRequestPasswordReset } from '@/hooks/useAuth'

type Props = {
  open: boolean
  onClose: () => void
}

export function ResetPasswordModal({ open, onClose }: Props) {
  const [email, setEmail] = useState('')
  const { mutate, isSuccess, isError, reset } = useRequestPasswordReset()

  const handleSubmit = () => {
    if (!email.trim()) return
    mutate(email.trim())
  }

  const handleClose = () => {
    onClose()
    setEmail('')
    reset()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-[440px] rounded-2xl border border-border-primary bg-bg-surface p-6 shadow-lg"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-accent-primary" />
                <h3 className="text-base text-text-primary">Solicitar Reset de Senha</h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1 text-text-secondary transition-colors hover:text-text-primary"
                aria-label="Fechar modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!isSuccess && !isError && (
              <>
                <p className="mb-4 text-xs text-text-secondary">
                  Informe o email vinculado à sua conta. Uma solicitação será enviada ao
                  administrador do sistema para resetar sua senha.
                </p>
                <div className="mb-5 flex flex-col gap-1.5">
                  <label className="text-xs tracking-wide text-text-secondary">
                    EMAIL DA CONTA
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      className="w-full rounded-lg border border-border-primary bg-bg-primary py-3 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none transition-colors focus:border-accent-primary"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 rounded-lg border border-border-primary px-4 py-2.5 text-xs tracking-wide text-text-secondary transition-colors hover:bg-white/2"
                  >
                    CANCELAR
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="flex-1 rounded-lg px-4 py-2.5 text-xs tracking-wide text-bg-primary"
                    style={{
                      background: 'linear-gradient(173deg, var(--accent-primary) 0%, color-mix(in srgb, var(--accent-primary) 80%, black) 100%)',
                    }}
                  >
                    SOLICITAR RESET
                  </motion.button>
                </div>
              </>
            )}

            {isSuccess && (
              <div className="py-4 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <p className="mb-2 text-sm text-text-primary">Solicitação enviada!</p>
                <p className="mb-5 text-xs text-text-secondary">
                  O administrador receberá sua solicitação e irá gerar uma nova senha para você.
                  Aguarde o contato.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="w-full rounded-lg py-2.5 text-xs tracking-wide text-bg-primary"
                  style={{
                    background: 'linear-gradient(173deg, var(--accent-primary) 0%, color-mix(in srgb, var(--accent-primary) 80%, black) 100%)',
                  }}
                >
                  FECHAR
                </motion.button>
              </div>
            )}

            {isError && (
              <div className="py-4 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <p className="mb-2 text-sm text-text-primary">Email não encontrado</p>
                <p className="mb-5 text-xs text-text-secondary">
                  Nenhuma conta cadastrada com o email informado. Verifique e tente novamente.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="flex-1 rounded-lg border border-border-primary px-4 py-2.5 text-xs tracking-wide text-text-secondary transition-colors hover:bg-white/2"
                  >
                    TENTAR NOVAMENTE
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 rounded-lg border border-border-primary px-4 py-2.5 text-xs tracking-wide text-text-secondary transition-colors hover:bg-white/2"
                  >
                    FECHAR
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
