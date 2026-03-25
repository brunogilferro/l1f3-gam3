// Row types for Projetos and Projetos_Mesas raw queries

export type Projects = {
  project_id: number
  name: string
  description: string | null
  status: string
  game_type: string
  deadline: string | null
  total_planned_hands: number | null
  current_cycle: number | null
  cycle_frequency: string | null
  leader_id: number
  sector_id: number | null
  created_at: string
  is_project_leader: boolean
  table_count: number
}

export type Project = Projects & {
  updated_at: string
  has_access: boolean
}

export type ProjectTables = {
  table_id: number
  name: string
  description: string | null
  objective: string | null
  status: string
  type: string
  meeting_link: string | null
  leader_id: number
  dealer_id: number
  parent_table_id: number | null
  participant_count: number
  is_project_leader: boolean
  is_table_leader: boolean
  is_dealer: boolean
  is_participant: boolean
  created_at: string
}
