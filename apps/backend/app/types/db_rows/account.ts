// Row types for account context raw queries

export type AccountContext = {
  table_id: number
  table_name: string
  meeting_link: string | null
  project_id: number
  project_name: string
  is_project_leader: boolean
  is_table_leader: boolean
  is_dealer: boolean
  is_participant: boolean
}
