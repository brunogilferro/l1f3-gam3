'use client';

import { Calendar, Coins, FolderKanban, Target } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accentClass: string;
}

function StatCard({ icon, label, value, accentClass }: StatCardProps) {
  return (
    <div className="bg-bg-surface border border-border-primary rounded-xl p-4 flex items-center gap-4">
      <div>{icon}</div>
      <div>
        <p className="text-[11px] text-text-secondary tracking-[2px]">
          {label}
        </p>
        <p className={`text-[22px] font-medium ${accentClass}`}>{value}</p>
      </div>
    </div>
  );
}

interface StatsGridProps {
  activeProjectsCount: number;
  activeTablesCount: number;
  upcomingHandsCount: number;
  activeBetsCount: number;
}

export function StatsGrid({
  activeProjectsCount,
  activeTablesCount,
  upcomingHandsCount,
  activeBetsCount,
}: StatsGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8"
    >
      <StatCard
        icon={<FolderKanban className="w-5 h-5 text-accent-primary" />}
        label="PROJETOS ATIVOS"
        value={String(activeProjectsCount)}
        accentClass="text-accent-primary"
      />
      <StatCard
        icon={<Target className="w-5 h-5 text-accent-secondary" />}
        label="MESAS ATIVAS"
        value={String(activeTablesCount)}
        accentClass="text-accent-secondary"
      />
      <StatCard
        icon={<Calendar className="w-5 h-5 text-accent-primary" />}
        label="MÃOS AGENDADAS"
        value={String(upcomingHandsCount)}
        accentClass="text-accent-primary"
      />
      <StatCard
        icon={<Coins className="w-5 h-5 text-accent-secondary" />}
        label="APOSTAS ATIVAS"
        value={String(activeBetsCount)}
        accentClass="text-accent-secondary"
      />
    </motion.div>
  );
}
