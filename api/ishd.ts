// Übergangslösung für Vercel, bis public/api/ishd.php beim Webhoster läuft. Gleiche Parameter und Antwort.
const ISHD_BASE = 'https://ishd.de'
const CLUB_SLUG = 'blue-arrows-sasbach'
const PAGE_LIMIT = 30
const MAX_PAGES = 20
const TEAM_PATTERN = /^[1-9]-(herren|damen|junioren|jugend|schueler|bambini)$/
const LEAGUE_PATTERN = /^\/saison\/\d{4}\/ligen\/[a-z0-9-]+$/
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://localhost:5173',
  'https://blue-arrows-sasbach.vercel.app',
  'https://www.bluearrows.de',
  'https://bluearrows.de',
]

type Json = Record<string, unknown>

const corsHeaders = (request: Request): Record<string, string> => {
  const origin = request.headers.get('origin') ?? ''
  if (!ALLOWED_ORIGINS.includes(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    Vary: 'Origin',
  }
}

const json = (request: Request, status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control':
        status === 200 ? 'public, max-age=300, s-maxage=900, stale-while-revalidate=86400' : 'no-store',
      ...corsHeaders(request),
    },
  })

const fetchIshd = async (path: string): Promise<Json | null> => {
  try {
    const response = await fetch(ISHD_BASE + path, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'BlueArrowsSasbach-Website (+https://www.bluearrows.de)',
      },
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) return null
    return (await response.json()) as Json
  } catch {
    return null
  }
}

const fetchSchedule = async (team: string, season: number) => {
  const basePath = `/vereine/verein/${CLUB_SLUG}/${team}/spielplan/${season}.json`
  const games: Json[] = []
  let page = 1
  let pages = 1

  do {
    const data = await fetchIshd(`${basePath}?page=${page}&limit=${PAGE_LIMIT}`)
    if (!data) return null
    pages = Number(data.pages ?? 1)
    const embedded = data._embedded as { schedule?: Json[] } | undefined
    games.push(...(embedded?.schedule ?? []))
    page++
  } while (page <= pages && page <= MAX_PAGES)

  return { season, team, games }
}

const fetchTables = async (schedule: { season: number; team: string; games: Json[] }) => {
  const leagues = new Map<string, { name: string; code: string }>()
  for (const game of schedule.games) {
    const league = game.league as
      | { name?: string; code?: string; _links?: { self?: { href?: string } } }
      | undefined
    const href = league?._links?.self?.href ?? ''
    if (LEAGUE_PATTERN.test(href) && !leagues.has(href)) {
      leagues.set(href, { name: league?.name ?? '', code: league?.code ?? '' })
    }
  }

  const tables = []
  for (const [href, league] of leagues) {
    const data = await fetchIshd(`${href}/tabelle.json`)
    if (!data) return null
    tables.push({
      league,
      placements: Object.values((data.placements as Json | undefined) ?? {}),
      modifications: data.modifications ?? [],
    })
  }

  return { season: schedule.season, team: schedule.team, tables }
}

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) })
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const typ = params.get('typ') ?? ''
  const team = params.get('team') ?? ''
  const saisonParam = params.get('saison')

  if (typ !== 'spielplan' && typ !== 'tabelle') {
    return json(request, 400, { error: 'Ungültiger Parameter "typ" (erlaubt: spielplan, tabelle).' })
  }
  if (!TEAM_PATTERN.test(team)) {
    return json(request, 400, { error: 'Ungültiger Parameter "team" (z. B. 1-herren, 2-schueler).' })
  }

  const currentYear = new Date().getFullYear()
  let season = currentYear
  if (saisonParam !== null) {
    season = /^\d{4}$/.test(saisonParam) ? Number(saisonParam) : 0
    if (season < 2010 || season > currentYear + 1) {
      return json(request, 400, { error: 'Ungültiger Parameter "saison".' })
    }
  }

  const schedule = await fetchSchedule(team, season)
  if (!schedule) return json(request, 502, { error: 'ISHD ist gerade nicht erreichbar.' })
  if (typ === 'spielplan') return json(request, 200, schedule)

  const tables = await fetchTables(schedule)
  if (!tables) return json(request, 502, { error: 'ISHD ist gerade nicht erreichbar.' })
  return json(request, 200, tables)
}
