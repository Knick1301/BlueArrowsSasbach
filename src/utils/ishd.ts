import type { IshdGame, IshdTeam } from '@/types/ishd'

export const ISHD_BASE = 'https://ishd.de'
export const OUR_CLUB_ID = 116

export const isOurTeam = (team: IshdTeam) => team.club.id === OUR_CLUB_ID

export const isHomeGame = (game: IshdGame) => isOurTeam(game.home_team)

export const opponent = (game: IshdGame) => (isHomeGame(game) ? game.away_team : game.home_team)

export const logoUrl = (team: IshdTeam) => {
  const href = team.club._links.logo?.href
  return href ? ISHD_BASE + href : undefined
}

export const gameDate = (game: IshdGame) => new Date(game.date_time)

export const isPlayed = (game: IshdGame) => game.has_result && !game.has_been_cancelled

export const isUpcoming = (game: IshdGame, now = new Date()) =>
  !game.has_result && !game.has_been_cancelled && gameDate(game) >= now

export type GameOutcome = 'win' | 'loss' | 'tie' | null

export const outcome = (game: IshdGame): GameOutcome => {
  if (!isPlayed(game)) return null
  if (game.is_tie) return 'tie'
  const home = isHomeGame(game)
  if ((home && game.is_home_win) || (!home && game.is_away_win)) return 'win'
  return 'loss'
}

export const resultText = (game: IshdGame) =>
  isPlayed(game) && game.home_goals !== null && game.away_goals !== null
    ? `${game.home_goals}:${game.away_goals}`
    : '-:-'

export const resultSuffix = (game: IshdGame) => {
  if (game.is_forfeit) return 'Wertung'
  if (game.is_after_penalty_shoot_out) return 'n. P.'
  if (game.is_after_overtime) return 'n. V.'
  return ''
}

export const statusText = (game: IshdGame) => {
  if (game.has_been_cancelled) return 'Abgesagt'
  if (game.has_been_aborted) return 'Abgebrochen'
  return ''
}

export interface TeamStory {
  name: string
  full_slug: string
  content?: Record<string, unknown>
}

export const ishdTeamsFromStories = (stories: TeamStory[]) =>
  stories.flatMap((story) => {
    const ishdTeam = story.content?.ishd_team
    if (!story.full_slug.startsWith('teams/') || typeof ishdTeam !== 'string' || !ishdTeam.trim()) {
      return []
    }
    return [{ ishdTeam: ishdTeam.trim(), label: story.name, teamPath: `/${story.full_slug}` }]
  })

export const formatGameDate = (game: IshdGame) => {
  const date = gameDate(game)
  const weekday = date.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '')
  const day = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const time = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  return `${weekday}, ${day} · ${time} Uhr`
}
