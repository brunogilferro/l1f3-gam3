// Core game types — mirrored from the database schema
// TODO: replace mock types with API response types as routes are built

export type DeliveryStatus =
  | 'aprovada'
  | 'em_andamento'
  | 'pausada'
  | 'entregue';

export type HandPhase =
  | 'aguardando'
  | 'check-in'
  | 'resumo'
  | 'discussao'
  | 'apresentacoes'
  | 'decisao_lm'
  | 'confirmacao_presenca'
  | 'novas_apostas'
  | 'encerramento';

export type GameType = 'torneio' | 'cash_game';

export interface ApprovedBet {
  id: string;
  userId: string;
  name: string;
  description?: string;
  timeChips: number; // minutes committed
  deliveryStatus: DeliveryStatus;
  elapsedSeconds: number;
  tableName?: string;
  deadlineDate?: string; // dd/MM/yyyy
  deadlineHandNumber?: number;
  selectedSlots?: { day: number; startMinutes: number }[];
}

export interface Hand {
  id: string;
  number: number;
  date: string; // dd/MM/yyyy
  active: boolean;
  phase: HandPhase;
  participants: string[];
}

export interface Table {
  id: string;
  name: string;
  status: 'ativa' | 'inativa' | 'encerrada';
  leaderId: string;
  participants: string[];
  hands: Hand[];
}

export interface Project {
  id: string;
  name: string;
  status: 'ativo' | 'inativo' | 'encerrado';
  sectorId: string;
  leaderId: string;
  gameType: GameType;
  tables: Table[];
}

export interface ProjectRequest {
  id: string;
  name: string;
  description: string;
  requestedBy: string;
  sectorId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  gameType?: GameType;
  deadline?: string;
}

export interface Sector {
  id: string;
  name: string;
  color: string;
  leaderId?: string;
}
