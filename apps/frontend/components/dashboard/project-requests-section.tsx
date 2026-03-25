'use client';

import type { ProjectRequest } from '@/types/game';
import {
  Building2,
  Check,
  CheckCircle2,
  Clock,
  X,
  XCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

interface ProjectRequestsSectionProps {
  // TODO: receive from API once project requests endpoint is ready
  requests?: ProjectRequest[];
  onApprove?: (id: string, reason: string) => void;
  onReject?: (id: string, reason: string) => void;
}

interface DecisionModal {
  request: ProjectRequest;
  action: 'approve' | 'reject';
}

function timeAgoLabel(createdAt: string): string {
  const days = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / 86400000
  );
  if (days === 0) return 'hoje';
  if (days === 1) return 'há 1 dia';
  return `há ${days} dias`;
}

export function ProjectRequestsSection({
  requests = [],
  onApprove,
  onReject,
}: ProjectRequestsSectionProps) {
  const [decisionModal, setDecisionModal] = useState<DecisionModal | null>(
    null
  );
  const [reason, setReason] = useState('');

  if (requests.length === 0) return null;

  function handleConfirm() {
    if (!decisionModal) return;
    if (decisionModal.action === 'approve') {
      onApprove?.(decisionModal.request.id, reason);
    } else {
      onReject?.(decisionModal.request.id, reason);
    }
    setDecisionModal(null);
    setReason('');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <Building2 className="w-4 h-4 text-accent-primary" />
        <h2 className="text-[12px] text-accent-primary tracking-[2px]">
          SOLICITAÇÕES PENDENTES
        </h2>
        <span className="w-5 h-5 rounded-full bg-accent-primary text-bg-secondary text-[10px] flex items-center justify-center">
          {requests.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {requests.map((req) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 rounded-xl border border-accent-primary/15 p-4 hover:border-accent-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">{req.name}</p>
                {req.description && (
                  <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                    {req.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 text-[11px] text-text-secondary">
                  <Clock className="w-3 h-3" />
                  <span>Solicitado {timeAgoLabel(req.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setDecisionModal({ request: req, action: 'reject' });
                    setReason('');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-500 bg-red-500/[0.06] border border-red-500/15 hover:bg-red-500/[0.12] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Recusar
                </button>
                <button
                  onClick={() => {
                    setDecisionModal({ request: req, action: 'approve' });
                    setReason('');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-green-500 bg-green-500/[0.06] border border-green-500/15 hover:bg-green-500/[0.12] transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Aprovar
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Decision modal */}
      <AnimatePresence>
        {decisionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setDecisionModal(null);
                setReason('');
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-bg-surface border border-border-primary rounded-xl p-6 shadow-2xl w-[480px] mx-4"
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    decisionModal.action === 'approve'
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-red-500/10 border-red-500/20'
                  }`}
                >
                  {decisionModal.action === 'approve' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-[15px] text-text-primary">
                    {decisionModal.action === 'approve'
                      ? 'Aprovar projeto'
                      : 'Recusar projeto'}
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    {decisionModal.request.name}
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <label className="text-[11px] text-text-secondary tracking-[0.5px] block mb-1.5">
                  Motivo{' '}
                  {decisionModal.action === 'approve' ? '(opcional)' : ''}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    decisionModal.action === 'approve'
                      ? 'Ex: Projeto alinhado com as metas do setor.'
                      : 'Ex: O escopo precisa ser mais detalhado.'
                  }
                  rows={4}
                  autoFocus
                  className="w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-border-secondary outline-none focus:border-accent-primary/50 transition-colors resize-none"
                />
                <p className="text-[10px] text-text-secondary mt-1.5">
                  {decisionModal.action === 'approve'
                    ? 'O solicitante receberá uma notificação com sua mensagem.'
                    : 'O motivo será enviado ao solicitante.'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDecisionModal(null);
                    setReason('');
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border-primary text-xs text-text-secondary tracking-[0.5px] cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  CANCELAR
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={decisionModal.action === 'reject' && !reason.trim()}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs text-bg-secondary tracking-[0.5px] cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    decisionModal.action === 'approve'
                      ? 'bg-gradient-to-b from-green-500 to-green-600'
                      : 'bg-gradient-to-b from-red-500 to-red-600'
                  }`}
                >
                  {decisionModal.action === 'approve' ? (
                    <>
                      <Check className="w-4 h-4" /> CONFIRMAR APROVAÇÃO
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> CONFIRMAR RECUSA
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
