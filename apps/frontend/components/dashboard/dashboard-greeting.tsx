'use client';

import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/auth-context';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

interface DashboardGreetingProps {
  upcomingHandsCount: number;
  activeTablesCount: number;
}

export function DashboardGreeting({
  upcomingHandsCount,
  activeTablesCount,
}: DashboardGreetingProps) {
  const { user } = useAuth();
  const [showCreateProject, setShowCreateProject] = useState(false);

  const firstName = user?.shortName ?? user?.fullName?.split(' ')[0] ?? '';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            {/* suppressHydrationWarning: greeting uses Date.now(), user from cookie — both differ on SSR vs client */}
            <h1
              className="text-[24px] text-text-primary tracking-[0.6px]"
              suppressHydrationWarning
            >
              {getGreeting()},{' '}
              <span className="text-accent-primary" suppressHydrationWarning>
                {firstName}
              </span>
            </h1>
            <p className="text-sm text-text-secondary mt-1" suppressHydrationWarning>
              Você tem{' '}
              <span className="text-accent-primary">
                {upcomingHandsCount}{' '}
                {upcomingHandsCount === 1 ? 'mão agendada' : 'mãos agendadas'}
              </span>{' '}
              e participa de{' '}
              <span className="text-accent-secondary">
                {activeTablesCount}{' '}
                {activeTablesCount === 1 ? 'mesa ativa' : 'mesas ativas'}
              </span>
              .
            </p>
          </div>

          <motion.button
            whileHover={{ opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateProject(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12px] text-bg-secondary tracking-[0.6px] cursor-pointer transition-all"
            style={{
              backgroundImage: 'linear-gradient(169deg, #c4a030 0%, #a08020 100%)',
            }}
          >
            <Plus className="w-4 h-4" />
            SOLICITAR PROJETO
          </motion.button>
        </div>
      </motion.div>

      {/* TODO: replace with real CreateProjectModal when project API is ready */}
      {showCreateProject && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowCreateProject(false)}
        >
          <div
            className="bg-bg-surface border border-border-primary rounded-xl p-6 w-[480px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base text-text-primary mb-2">Solicitar Projeto</h2>
            <p className="text-sm text-text-secondary mb-4">
              Em breve disponível.
            </p>
            <button
              onClick={() => setShowCreateProject(false)}
              className="px-4 py-2 rounded-lg border border-border-primary text-xs text-text-secondary hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
