export interface IshdLink {
  href: string
}

export interface IshdClub {
  id: number
  name: string
  short_name: string
  _links: { self: IshdLink; logo?: IshdLink }
}

export interface IshdTeam {
  team_id: number
  full_name: string
  short_name: string
  club_name: string
  alternate_team_name: string
  number_int: number
  club: IshdClub
}

export interface IshdLeague {
  name: string
  code: string
  age_group: string
  season: { year: number }
  _links: { self: IshdLink }
}

export interface IshdGame {
  id: number
  date_time: string
  venue: string
  home_team: IshdTeam
  away_team: IshdTeam
  home_goals: number | null
  away_goals: number | null
  has_result: boolean
  is_pending: boolean
  is_home_win: boolean
  is_away_win: boolean
  is_tie: boolean
  is_after_overtime: boolean
  is_after_penalty_shoot_out: boolean
  is_forfeit: boolean
  has_been_cancelled: boolean
  has_been_aborted: boolean
  has_live_stream: boolean
  live_stream_url: string
  comments: string
  league: IshdLeague
}

export interface IshdStats {
  games: number
  wins: number
  wins_in_penalty_shoot_out: number
  ties: number
  losses_in_penalty_shoot_out: number
  losses: number
  goals_for: number
  goals_against: number
  goals_difference: number
  points: number
  points_percentage: number
}

export interface IshdPlacement {
  team_name: string
  team: IshdTeam
  total: IshdStats
  home: IshdStats
  away: IshdStats
  groups: string[]
  has_modification: boolean
}

export interface IshdSchedule {
  season: number
  team: string
  games: IshdGame[]
}

export interface IshdTable {
  league: { name: string; code: string }
  placements: IshdPlacement[]
  modifications: unknown[]
}

export interface IshdTables {
  season: number
  team: string
  tables: IshdTable[]
}
