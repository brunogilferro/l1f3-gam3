'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Target, ArrowRight, Calendar } from 'lucide-react';
import type { Project, Table, Hand } from '@/types/game';

type TableWithMeta = Table & {
  projectId: string;
  projectName: string;
  activeHands: Hand[];
};

interface ActiveTablesSectionProps {
  // TODO: receive from API once tables endpoint is ready
  tables?: TableWithMeta[];
}

const PHASE_LABELS: Record<string, string> = {
  aguardando: 'Aguardando',
  'check-in': 'Check-in',
  resumo: 'Resumo',
  discussao: 'Discussão',
  apresentacoes: 'Apresentações',
  decisao_lm: 'Decisão LM',
  confirmacao_presenca: 'Confirmação',
  novas_apostas: 'Novas Apostas',
  encerramento: 'Encerramento',
};

export function ActiveTablesSection({ tables = [] }: ActiveTablesSectionProps) {
  if (tables.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <Target className="w-4 h-4 text-accent-secondary" />
          <h2 className="text-[12px] text-accent-secondary tracking-[2px]">
            MINHAS MESAS
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 gap-2 border border-dashed border-border-primary rounded-xl">
          <Target className="w-8 h-8 text-border-primary" />
          <p className="text-sm text-text-secondary">Nenhuma mesa ativa</p>
          <p className="text-xs text-text-secondary opacity-50">
            Mesas em que você participa aparecerão aqui
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <Target className="w-4 h-4 text-accent-secondary" />
        <h2 className="text-[12px] text-accent-secondary tracking-[2px]">MINHAS MESAS</h2>
        <span className="w-5 h-5 rounded-full bg-accent-secondary/10 border border-accent-secondary/20 text-accent-secondary text-[10px] flex items-center justify-center">
          {tables.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tables.map((table) => {
          const activeHand = table.activeHands[0];
          const hasActiveHand = !!activeHand;

          return (
            <Link
              key={table.id}
              href={`/projetos/${table.projectId}/mesa/${table.id}`}
              className="group bg-bg-surface border border-border-primary hover:border-border-secondary rounded-xl p-4 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">{table.name}</p>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    {table.projectName}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-text-primary transition-colors shrink-0 mt-0.5" />
              </div>

              {hasActiveHand ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-accent-secondary/10 border border-accent-secondary/20">
                    <Calendar className="w-3 h-3 text-accent-secondary" />
                    <span className="text-[11px] text-accent-secondary">
                      Mão #{activeHand.number} · {PHASE_LABELS[activeHand.phase] ?? activeHand.phase}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-[11px] text-text-secondary">
                  Sem mão ativa no momento
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
