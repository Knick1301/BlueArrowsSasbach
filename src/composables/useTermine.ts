import { useStoryblokApi } from '@storyblok/vue'
import type { RouteLocationRaw } from 'vue-router'
import { STORYBLOK_VERSION } from '@/storyblok'
import { loadGamesForTeams, type LabeledGame } from '@/composables/useIshd'
import { ishdTeamsFromStories, isHomeGame, isUpcoming, logoUrl, type TeamStory } from '@/utils/ishd'

type RawDate = Record<string, string | undefined>

export interface TerminEintrag {
  id: string
  kategorie: string
  team?: string
  titel: string
  heim?: string
  gast?: string
  start: Date
  tag: number
  monat: string
  beschreibung: string
  countdown?: string
  logo?: string
  to?: RouteLocationRaw
}

export const KATEGORIE_REIHENFOLGE = ['Heimspiele', 'Inline Disco', 'Burgerista', 'Ferienprogramm']

const ladeDates = async (
  storyblokApi: ReturnType<typeof useStoryblokApi>,
  slug: string,
): Promise<RawDate[]> => {
  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, { version: STORYBLOK_VERSION })
    return (data.story.content.dates as RawDate[] | undefined) ?? []
  } catch (e) {
    console.error(`Storyblok-Story "${slug}" konnte nicht geladen werden.`, e)
    return []
  }
}

const ladeStories = async (
  storyblokApi: ReturnType<typeof useStoryblokApi>,
): Promise<TeamStory[]> => {
  try {
    const { data } = await storyblokApi.get('cdn/stories', {
      version: STORYBLOK_VERSION,
      per_page: 100,
    })
    return data.stories as TeamStory[]
  } catch (e) {
    console.error('Storyblok-Stories konnten nicht geladen werden.', e)
    return []
  }
}

const parseDatum = (wert: string | undefined): Date | null => {
  if (!wert) return null
  const datum = new Date(wert.replace(' ', 'T'))
  return isNaN(datum.getTime()) ? null : datum
}

const feld = (raw: RawDate, ...keys: string[]) => keys.map((key) => raw[key]).find((wert) => wert)

const heuteFrueh = () => {
  const heute = new Date()
  heute.setHours(0, 0, 0, 0)
  return heute
}

const monatKurz = (datum: Date) =>
  datum.toLocaleDateString('de-DE', { month: 'short' }).replace('.', '')
export const wochentag = (datum: Date) => datum.toLocaleDateString('de-DE', { weekday: 'long' })
const uhrzeitVon = (datum: Date) =>
  datum.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })

export const monatLang = (datum: Date) => datum.toLocaleDateString('de-DE', { month: 'long' })

const countdownText = (start: Date): string | undefined => {
  const startTag = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const tage = Math.round((startTag.getTime() - heuteFrueh().getTime()) / 86_400_000)
  if (tage < 0) return 'Läuft gerade'
  if (tage === 0) return 'Heute'
  if (tage === 1) return 'Morgen'
  if (tage <= 60) return `In ${tage} Tagen`
  return undefined
}

const zeitraumText = (start: Date, ende: Date) =>
  `${start.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })} – ${ende.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}`

const eventTermin = (
  raw: RawDate,
  id: string,
  kategorie: string,
  fallbackTitel: string,
  to?: RouteLocationRaw,
): TerminEintrag | null => {
  const start = parseDatum(feld(raw, 'date', 'datum'))
  const ende = parseDatum(raw.date_end)
  if (!start || (ende ?? start) < heuteFrueh()) return null

  const mehrtaegig = ende !== null && ende.toDateString() !== start.toDateString()
  const uhrzeit = feld(raw, 'time', 'uhrzeit')
  const ort = feld(raw, 'location', 'standort')
  const beschreibung = [
    mehrtaegig ? zeitraumText(start, ende) : wochentag(start),
    uhrzeit ? `${uhrzeit} Uhr` : '',
    ort ?? '',
  ]
    .filter(Boolean)
    .join(' · ')

  return {
    id,
    kategorie,
    titel: feld(raw, 'title', 'titel') ?? fallbackTitel,
    start,
    tag: start.getDate(),
    monat: monatKurz(start),
    beschreibung,
    countdown: countdownText(start),
    to,
  }
}

const ferienTermin = (raw: RawDate, index: number): TerminEintrag | null => {
  const start = parseDatum(raw.ferienDatumStart)
  const ende = parseDatum(raw.ferienDatumEnde) ?? start
  if (!start || !ende || ende < heuteFrueh()) return null

  const zeitraum = zeitraumText(start, ende)

  return {
    id: `ferien-${index}`,
    kategorie: 'Ferienprogramm',
    titel: 'Ferienprogramm',
    start,
    tag: start.getDate(),
    monat: monatKurz(start),
    beschreibung: `${zeitraum} · ${uhrzeitVon(start)} bis ${uhrzeitVon(ende)} Uhr`,
    countdown: countdownText(start),
    to: { name: 'schuleFerien' },
  }
}

const heimspielTermin = ({ game, label, teamPath }: LabeledGame): TerminEintrag | null => {
  if (!isHomeGame(game) || !isUpcoming(game, heuteFrueh())) return null
  const start = new Date(game.date_time)

  const heim = game.home_team.full_name
  const gast = game.away_team.full_name

  return {
    id: `spiel-${game.id}`,
    kategorie: 'Heimspiele',
    team: label,
    titel: `${heim} vs. ${gast}`,
    heim,
    gast,
    start,
    tag: start.getDate(),
    monat: monatKurz(start),
    beschreibung: [label, wochentag(start), `${uhrzeitVon(start)} Uhr`, game.venue]
      .filter(Boolean)
      .join(' · '),
    countdown: countdownText(start),
    logo: logoUrl(game.away_team),
    to: teamPath,
  }
}

export const ladeTermine = async (): Promise<TerminEintrag[]> => {
  const storyblokApi = useStoryblokApi()
  const [discoRaw, burgerRaw, ferienRaw, manuellRaw, stories] = await Promise.all([
    ladeDates(storyblokApi, 'events/inlinedisco'),
    ladeDates(storyblokApi, 'events/burgerista'),
    ladeDates(storyblokApi, 'skating/schuleferien'),
    ladeDates(storyblokApi, 'termine'),
    ladeStories(storyblokApi),
  ])
  const { games: ishdSpiele } = await loadGamesForTeams(ishdTeamsFromStories(stories))

  return [
    ...ishdSpiele.map(heimspielTermin),
    ...discoRaw.map((raw, i) =>
      eventTermin(raw, `disco-${i}`, 'Inline Disco', 'Inline Disco', { name: 'inlinedisco' }),
    ),
    ...burgerRaw.map((raw, i) =>
      eventTermin(raw, `burger-${i}`, 'Burgerista', 'Burgerista', { name: 'burgerista' }),
    ),
    ...ferienRaw.map((raw, i) => ferienTermin(raw, i)),
    ...manuellRaw.map((raw, i) =>
      eventTermin(raw, `manuell-${i}`, feld(raw, 'category', 'kategorie') ?? 'Sonstiges', 'Termin'),
    ),
  ]
    .filter((termin): termin is TerminEintrag => termin !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
}
