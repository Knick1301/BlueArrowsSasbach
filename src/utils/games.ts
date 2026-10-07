export interface StoryblokBlok {
  _uid: string
  component: string
  [key: string]: unknown
}

export const TEAM_ORDER = ['Herren', 'Junioren', 'Jugend', 'Schüler', 'Bambini']

export const sortTeams = (teams: string[]): string[] =>
  [...teams].sort((a, b) => {
    const indexA = TEAM_ORDER.indexOf(a)
    const indexB = TEAM_ORDER.indexOf(b)
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB)
  })

export const TRAINING_TEAM_LABELS: Record<string, string> = {
  bambini: 'Bambini (U10)',
  schueler: 'Schüler (U13)',
  jugend: 'Jugend (U16)',
  junioren: 'Junioren (U19)',
  herren: 'Herren',
  hobby: 'Hobby',
}
