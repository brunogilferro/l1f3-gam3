'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, ChevronDown, ChevronUp } from 'lucide-react';
import type { ApprovedBet, DeliveryStatus } from '@/types/game';
import { BetCard } from './bet-card';

type FilterTab = 'todas' | 'em_andamento' | 'aprovada' | 'pausada';

const FILTER_TABS: { key: FilterTab; label: string; accentClass?: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'em_andamento', label: 'Em andamento', accentClass: 'text-accent-secondary' },
  { key: 'aprovada', label: 'Aprovadas', accentClass: 'text-accent-primary' },
  { key: 'pausada', label: 'Pausadas', accentClass: 'text-text-secondary' },
];

interface BetsSectionProps {
  // TODO: receive from API once bets endpoint is ready
  bets?: ApprovedBet[];
}

function sortByStatus(bets: ApprovedBet[]): ApprovedBet[] {
  const order: Record<DeliveryStatus, number> = {
    em_andamento: 0,
    pausada: 1,
    aprovada: 2,
    entregue: 3,
  };
  return [...bets].sort((a, b) => order[a.deliveryStatus] - order[b.deliveryStatus]);
}

export function BetsSection({ bets = [] }: BetsSectionProps) {
  const [filter, setFilter] = useState<FilterTab>('todas');
  const [collapsed, setCollapsed] = useState(false);

  // Exclude delivered from main dashboard view
  const activeBets = sortByStatus(bets.filter((b) => b.deliveryStatus !== 'entregue'));
  const featuredBet = activeBets.find((b) => b.deliveryStatus === 'em_andamento');

  const filteredBets = sortByStatus(
    filter === 'todas'
      ? activeBets
      : activeBets.filter((b) => b.deliveryStatus === filter)
  );

  // Queue positions for non-featured bets (to show "next" badge)
  const queueMap = new Map<string, number>();
  activeBets.forEach((b, i) => queueMap.set(b.id, i + 1));

  const counts: Record<FilterTab, number> = {
    todas: activeBets.length,
    em_andamento: activeBets.filter((b) => b.deliveryStatus === 'em_andamento').length,
    aprovada: activeBets.filter((b) => b.deliveryStatus === 'aprovada').length,
    pausada: activeBets.filter((b) => b.deliveryStatus === 'pausada').length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Coins className="w-4 h-4 text-accent-primary" />
          <h2 className="text-[12px] text-accent-primary tracking-[2px]">
            MINHAS APOSTAS
          </h2>
          {activeBets.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-accent-primary text-bg-secondary text-[10px] flex items-center justify-center">
              {activeBets.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-1 text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
          aria-label={collapsed ? 'Expandir' : 'Recolher'}
        >
          {collapsed ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {activeBets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 border border-dashed border-border-primary rounded-xl">
                <Coins className="w-8 h-8 text-border-primary" />
                <p className="text-sm text-text-secondary">Nenhuma aposta ativa</p>
                <p className="text-xs text-text-secondary opacity-50">
                  Suas apostas aprovadas aparecerão aqui
                </p>
              </div>
            ) : (
              <>
                {/* Featured bet (active timer) */}
                {featuredBet && (
                  <BetCard
                    key={featuredBet.id}
                    bet={featuredBet}
                    queuePosition={queueMap.get(featuredBet.id)}
                    featured
                  />
                )}

                {/* Filter tabs */}
                <div className="flex items-center gap-1 mb-4 overflow-x-auto">
                  {FILTER_TABS.map(({ key, label, accentClass }) => {
                    const active = filter === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] tracking-[0.3px] whitespace-nowrap cursor-pointer transition-all border ${
                          active
                            ? `bg-bg-surface border-border-secondary ${accentClass ?? 'text-text-primary'}`
                            : 'border-transparent text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        {label}
                        {counts[key] > 0 && (
                          <span
                            className={`text-[10px] px-1.5 rounded-full ${
                              active ? 'bg-border-primary' : 'bg-bg-surface'
                            }`}
                          >
                            {counts[key]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Bet list */}
                <div className="flex flex-col gap-3">
                  {filteredBets
                    .filter((b) => b.id !== featuredBet?.id)
                    .map((bet) => (
                      <BetCard
                        key={bet.id}
                        bet={bet}
                        queuePosition={queueMap.get(bet.id)}
                      />
                    ))}
                  {filteredBets.filter((b) => b.id !== featuredBet?.id).length === 0 &&
                    filter !== 'todas' && (
                      <p className="text-sm text-text-secondary text-center py-6">
                        Nenhuma aposta nesta categoria
                      </p>
                    )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
