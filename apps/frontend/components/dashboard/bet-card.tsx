'use client';

import type { ApprovedBet, DeliveryStatus } from '@/types/game';
import {
  CalendarClock,
  CheckCircle2,
  Pause,
  Play,
  Timer,
  Trophy,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtSec(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0)
    return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

function fmtMin(minutes: number): string {
  if (minutes <= 0) return '0m';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function parseDDMMYYYY(dateStr: string): Date | null {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
}

function getDaysRemaining(deadlineDate?: string): number | null {
  if (!deadlineDate) return null;
  const deadline = parseDDMMYYYY(deadlineDate);
  if (!deadline) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  return Math.ceil(
    (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}

function getUrgencyConfig(daysRemaining: number | null, isDelivered: boolean) {
  if (isDelivered)
    return {
      color: 'text-green-500',
      label: 'Entregue',
      borderColor: 'border-green-500/15',
      bgColor: 'bg-green-500/[0.08]',
    };
  if (daysRemaining === null)
    return {
      color: 'text-text-secondary',
      label: '',
      borderColor: '',
      bgColor: '',
    };
  if (daysRemaining <= 0)
    return {
      color: 'text-red-500',
      label: daysRemaining === 0 ? 'Hoje' : 'Atrasada',
      borderColor: 'border-red-500/15',
      bgColor: 'bg-red-500/[0.08]',
    };
  if (daysRemaining === 1)
    return {
      color: 'text-red-500',
      label: 'Amanhã',
      borderColor: 'border-red-500/12',
      bgColor: 'bg-red-500/[0.06]',
    };
  if (daysRemaining <= 3)
    return {
      color: 'text-yellow-500',
      label: `em ${daysRemaining} dias`,
      borderColor: 'border-yellow-500/12',
      bgColor: 'bg-yellow-500/[0.06]',
    };
  return {
    color: 'text-text-secondary',
    label: `em ${daysRemaining} dias`,
    borderColor: 'border-border-primary',
    bgColor: '',
  };
}

const STATUS_CONFIG: Record<
  DeliveryStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  aprovada: {
    label: 'Aprovada',
    color: 'text-accent-primary',
    bg: 'bg-accent-primary/10',
    border: 'border-accent-primary/20',
  },
  em_andamento: {
    label: 'Em andamento',
    color: 'text-accent-secondary',
    bg: 'bg-accent-secondary/10',
    border: 'border-accent-secondary/20',
  },
  pausada: {
    label: 'Pausada',
    color: 'text-text-secondary',
    bg: 'bg-text-secondary/10',
    border: 'border-text-secondary/20',
  },
  entregue: {
    label: 'Entregue',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
};

// ─── Featured card (bet with active timer) ────────────────────────────────────

function FeaturedBetCard({ bet }: { bet: ApprovedBet }) {
  const [liveElapsed, setLiveElapsed] = useState(bet.elapsedSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // TODO: connect to real timer state from API/context
  const isActive = bet.deliveryStatus === 'em_andamento';

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setLiveElapsed((prev) => prev + 1);
      }, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isActive]);

  const statusCfg = STATUS_CONFIG[bet.deliveryStatus];
  const progress = Math.min((liveElapsed / (bet.timeChips * 60)) * 100, 100);
  const committedMin = bet.timeChips;
  const investedMin = liveElapsed / 60;
  const remainingMin = Math.max(0, committedMin - investedMin);
  const daysRemaining = getDaysRemaining(bet.deadlineDate);
  const urgency = getUrgencyConfig(daysRemaining, false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-bg-surface/50 border border-accent-secondary/25 rounded-xl p-5 shadow-[0_0_24px_rgba(56,189,248,0.04)] mb-4"
    >
      <div className="flex items-start gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-accent-secondary shrink-0"
            />
            <p className="text-sm text-text-primary truncate">{bet.name}</p>
            <span
              className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] tracking-[0.5px] border ${statusCfg.color} ${statusCfg.bg} ${statusCfg.border}`}
            >
              {statusCfg.label}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-5 mb-3">
            {bet.tableName && (
              <span className="text-[11px] text-text-secondary">
                {bet.tableName}
              </span>
            )}
            {bet.deadlineDate && (
              <>
                <span className="text-[10px] text-border-secondary">·</span>
                <span
                  className={`text-[11px] flex items-center gap-1.5 ${urgency.color}`}
                >
                  <CalendarClock className="w-3 h-3" />
                  {bet.deadlineHandNumber &&
                    `Mão #${bet.deadlineHandNumber} · `}
                  {bet.deadlineDate}
                  {urgency.label && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full border ${urgency.borderColor} ${urgency.bgColor}`}
                    >
                      {urgency.label}
                    </span>
                  )}
                </span>
              </>
            )}
          </div>

          <div className="ml-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-accent-secondary flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5" />
                {fmtSec(liveElapsed)}
              </span>
              <div className="flex items-center gap-4 text-[10px]">
                <span className="text-text-secondary">
                  Apostado:{' '}
                  <span className="text-text-secondary">
                    {fmtMin(committedMin)}
                  </span>
                </span>
                <span className="text-text-secondary">
                  Falta:{' '}
                  <span className="text-accent-primary">
                    {fmtMin(remainingMin)}
                  </span>
                </span>
              </div>
            </div>
            <div className="h-[4px] rounded-full bg-border-primary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-secondary to-cyan-400"
                style={{ width: `${progress}%` }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 pt-0.5">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] tracking-[0.3px] cursor-pointer transition-all border bg-accent-secondary/10 border-accent-secondary/25 text-accent-secondary hover:bg-accent-secondary/[0.18]">
            <Pause className="w-3.5 h-3.5" /> Pausar
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] text-green-500 bg-green-500/[0.06] border border-green-500/15 hover:bg-green-500/[0.12] transition-colors cursor-pointer">
            <Trophy className="w-3.5 h-3.5" /> Concluir
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Compact card ─────────────────────────────────────────────────────────────

function CompactBetCard({
  bet,
  queuePosition,
}: {
  bet: ApprovedBet;
  queuePosition?: number;
}) {
  const statusCfg = STATUS_CONFIG[bet.deliveryStatus];
  const isDelivered = bet.deliveryStatus === 'entregue';
  const daysRemaining = getDaysRemaining(bet.deadlineDate);
  const urgency = getUrgencyConfig(daysRemaining, isDelivered);
  const progress = Math.min(
    (bet.elapsedSeconds / (bet.timeChips * 60)) * 100,
    100
  );
  const isNext = queuePosition === 1 && !isDelivered;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`bg-bg-surface rounded-xl border p-4 transition-colors ${
        isNext
          ? 'border-accent-primary/20'
          : 'border-border-primary hover:border-border-secondary'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isNext && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-primary/10 text-accent-primary border border-accent-primary/20 tracking-[0.5px]">
                PRÓXIMA
              </span>
            )}
            <p className="text-sm text-text-primary truncate">{bet.name}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {bet.tableName && (
              <span className="text-[11px] text-text-secondary">
                {bet.tableName}
              </span>
            )}
            {bet.deadlineDate && (
              <span
                className={`text-[11px] flex items-center gap-1 ${urgency.color}`}
              >
                <CalendarClock className="w-3 h-3" />
                {bet.deadlineDate}
                {urgency.label && (
                  <span
                    className={`text-[9px] px-1 py-0.5 rounded border ${urgency.borderColor} ${urgency.bgColor}`}
                  >
                    {urgency.label}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-2 py-0.5 rounded-full text-[9px] tracking-[0.5px] border ${statusCfg.color} ${statusCfg.bg} ${statusCfg.border}`}
          >
            {statusCfg.label}
          </span>
          {!isDelivered && (
            <button className="p-1.5 rounded-lg border border-border-primary text-text-secondary hover:text-accent-secondary hover:border-accent-secondary/30 transition-colors cursor-pointer">
              <Play className="w-3 h-3" />
            </button>
          )}
          {isDelivered && <CheckCircle2 className="w-4 h-4 text-green-500" />}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-text-secondary">
            {fmtMin(bet.elapsedSeconds / 60)} / {fmtMin(bet.timeChips)}
          </span>
          <span className="text-[10px] text-text-secondary">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-[3px] rounded-full bg-border-primary overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isDelivered ? 'bg-green-500' : 'bg-accent-primary'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

export function BetCard({
  bet,
  queuePosition,
  featured = false,
}: {
  bet: ApprovedBet;
  queuePosition?: number;
  featured?: boolean;
}) {
  if (featured) return <FeaturedBetCard bet={bet} />;
  return <CompactBetCard bet={bet} queuePosition={queuePosition} />;
}
