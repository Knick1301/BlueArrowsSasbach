export interface StoryblokBlok {
  _uid: string
  component: string
  [key: string]: unknown
}

export interface GamesBlok {
  _uid: string
  component: string
  date: string
  hometeam?: string
  homeTeam?: string
  awayteam?: string
  awayTeam?: string
  homeLogo?: { filename: string }
  awayLogo?: { filename: string }
  venue?: string
  home?: boolean
  team: string
  teamPath: string
}

export interface GameSourceStory {
  name: string
  full_slug: string
  content?: Record<string, unknown>
}

export const TEAM_ORDER = ['Herren', 'Junioren', 'Jugend', 'Schüler', 'Bambini']

const GAME_COMPONENTS = new Set(['Games', 'NextGame', 'games', 'game'])

const isBlokArray = (value: unknown): value is StoryblokBlok[] =>
  Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null && 'component' in value[0]

const extractGames = (bloks: StoryblokBlok[] | undefined, teamName: string, teamPath: string): GamesBlok[] => {
  const games: GamesBlok[] = []
  if (!bloks) return games

  for (const blok of bloks) {
    if (GAME_COMPONENTS.has(blok.component)) {
      games.push({ ...blok, team: (blok.team as string) || teamName, teamPath } as GamesBlok)
    }
    for (const key in blok) {
      if (isBlokArray(blok[key])) {
        games.push(...extractGames(blok[key] as StoryblokBlok[], teamName, teamPath))
      }
    }
  }
  return games
}

export const collectGames = (stories: GameSourceStory[]): GamesBlok[] => {
  const games: GamesBlok[] = []

  for (const story of stories) {
    if (!story.content) continue

    for (const key in story.content) {
      const field = story.content[key]
      if (isBlokArray(field)) {
        games.push(...extractGames(field, story.name, story.full_slug))
      }
    }
  }
  return games
}

export const sortTeams = (teams: string[]): string[] =>
  [...teams].sort((a, b) => {
    const indexA = TEAM_ORDER.indexOf(a)
    const indexB = TEAM_ORDER.indexOf(b)
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB)
  })
