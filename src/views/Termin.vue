<script setup lang="ts">
import { useStoryblokApi } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { collectGames, sortTeams, type GameSourceStory, type GamesBlok } from '@/utils/games'
import { computed, ref, watch } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { resizeImage } from '@/utils/methods'
import DecoratedCard from '@/components/DecoratedCard.vue'

type RawDate = Record<string, string | undefined>

interface TerminEintrag {
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

const SCHRITT = 20
const KATEGORIE_REIHENFOLGE = ['Heimspiele', 'Inline Disco', 'Burgerista', 'Ferienprogramm']

const storyblokApi = useStoryblokApi()

const ladeDates = async (slug: string): Promise<RawDate[]> => {
  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, { version: STORYBLOK_VERSION })
    return (data.story.content.dates as RawDate[] | undefined) ?? []
  } catch (e) {
    console.error(`Storyblok-Story "${slug}" konnte nicht geladen werden.`, e)
    return []
  }
}

const ladeStories = async (): Promise<GameSourceStory[]> => {
  try {
    const { data } = await storyblokApi.get('cdn/stories', {
      version: STORYBLOK_VERSION,
      per_page: 100,
    })
    return data.stories as GameSourceStory[]
  } catch (e) {
    console.error('Storyblok-Stories konnten nicht geladen werden.', e)
    return []
  }
}

const [discoRaw, burgerRaw, ferienRaw, manuellRaw, stories] = await Promise.all([
  ladeDates('events/inlinedisco'),
  ladeDates('events/burgerista'),
  ladeDates('skating/schuleferien'),
  ladeDates('termine'),
  ladeStories(),
])

const parseDatum = (wert: string | undefined): Date | null => {
  if (!wert) return null
  const datum = new Date(wert.replace(' ', 'T'))
  return isNaN(datum.getTime()) ? null : datum
}

const feld = (raw: RawDate, ...keys: string[]) => keys.map((key) => raw[key]).find((wert) => wert)

const heute = new Date()
heute.setHours(0, 0, 0, 0)

const monatKurz = (datum: Date) =>
  datum.toLocaleDateString('de-DE', { month: 'short' }).replace('.', '')
const wochentag = (datum: Date) => datum.toLocaleDateString('de-DE', { weekday: 'long' })
const uhrzeitVon = (datum: Date) =>
  datum.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })

const monatLang = (datum: Date) => datum.toLocaleDateString('de-DE', { month: 'long' })

const countdownText = (start: Date): string | undefined => {
  const startTag = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const tage = Math.round((startTag.getTime() - heute.getTime()) / 86_400_000)
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
  if (!start || (ende ?? start) < heute) return null

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
  if (!start || !ende || ende < heute) return null

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

const heimspielTermin = (spiel: GamesBlok, index: number): TerminEintrag | null => {
  const start = parseDatum(spiel.date)
  if (!spiel.home || !start || start < heute) return null

  const heim = spiel.hometeam || spiel.homeTeam || ''
  const gast = spiel.awayteam || spiel.awayTeam || ''

  const beschreibung = [spiel.team, wochentag(start), `${uhrzeitVon(start)} Uhr`, spiel.venue ?? '']
    .filter(Boolean)
    .join(' · ')

  return {
    id: `spiel-${index}`,
    kategorie: 'Heimspiele',
    team: spiel.team,
    titel: heim && gast ? `${heim} vs. ${gast}` : 'Spiel',
    heim: heim && gast ? heim : undefined,
    gast: heim && gast ? gast : undefined,
    start,
    tag: start.getDate(),
    monat: monatKurz(start),
    beschreibung,
    countdown: countdownText(start),
    logo: resizeImage(spiel.awayLogo?.filename, 160) || undefined,
    to: `/${spiel.teamPath}`,
  }
}

const spielTermine = collectGames(stories)
  .map(heimspielTermin)
  .filter((termin): termin is TerminEintrag => termin !== null)

const alleTermine: TerminEintrag[] = [
  ...spielTermine,
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

const vorhandeneKategorien = new Set(alleTermine.map((termin) => termin.kategorie))
const kategorien = [
  ...KATEGORIE_REIHENFOLGE.filter((kategorie) => vorhandeneKategorien.has(kategorie)),
  ...[...vorhandeneKategorien].filter((kategorie) => !KATEGORIE_REIHENFOLGE.includes(kategorie)),
]
const teams = sortTeams([
  ...new Set(spielTermine.flatMap((termin) => (termin.team ? [termin.team] : []))),
])

const auswahl = ref('Alle')
const teamAuswahl = ref('Alle')
const sichtbar = ref(SCHRITT)

watch(auswahl, () => {
  teamAuswahl.value = 'Alle'
  sichtbar.value = SCHRITT
})
watch(teamAuswahl, () => {
  sichtbar.value = SCHRITT
})

const gefiltert = computed(() =>
  alleTermine.filter(
    (termin) =>
      (auswahl.value === 'Alle' || termin.kategorie === auswahl.value) &&
      (auswahl.value !== 'Heimspiele' ||
        teamAuswahl.value === 'Alle' ||
        termin.team === teamAuswahl.value),
  ),
)

const hero = computed(
  () => gefiltert.value.find((termin) => termin.start >= heute) ?? gefiltert.value[0],
)
const uebrige = computed(() => gefiltert.value.filter((termin) => termin !== hero.value))

const hatMehr = computed(() => uebrige.value.length > sichtbar.value)

const gruppen = computed(() => {
  const gruppiert = new Map<string, { label: string; eintraege: TerminEintrag[] }>()
  for (const termin of uebrige.value.slice(0, sichtbar.value)) {
    const key = `${termin.start.getFullYear()}-${termin.start.getMonth()}`
    if (!gruppiert.has(key)) {
      gruppiert.set(key, {
        label: termin.start.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }),
        eintraege: [],
      })
    }
    gruppiert.get(key)!.eintraege.push(termin)
  }
  return [...gruppiert.values()]
})

const chipKlasse = (aktiv: boolean) => [
  'px-4 py-1.5 text-base font-medium rounded-full transition-colors cursor-pointer',
  aktiv
    ? 'bg-[#032650] text-white shadow-sm'
    : 'border border-[#032650] text-[#032650] hover:bg-[#032650] hover:text-white',
]
</script>

<template>
  <div class="mb-15">
    <div class="w-full py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">Termine</h1>
    </div>

    <div class="max-w-4xl w-[95%] mx-auto mt-15 px-4">
      <div v-if="kategorien.length > 1" class="flex flex-col gap-3 mb-8">
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="option in ['Alle', ...kategorien]"
            :key="option"
            type="button"
            :aria-pressed="auswahl === option"
            @click="auswahl = option"
            :class="chipKlasse(auswahl === option)"
          >
            {{ option }}
          </button>
        </div>

        <div
          v-if="auswahl === 'Heimspiele' && teams.length > 1"
          class="flex flex-wrap justify-center gap-2"
        >
          <button
            v-for="option in ['Alle', ...teams]"
            :key="option"
            type="button"
            :aria-pressed="teamAuswahl === option"
            @click="teamAuswahl = option"
            :class="chipKlasse(teamAuswahl === option)"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <component
        :is="hero.to ? RouterLink : 'div'"
        v-if="hero"
        :to="hero.to"
        :class="[
          'group w-full rounded-xl overflow-hidden mb-10 flex flex-col md:flex-row shadow-md',
          hero.to ? 'transition-all hover:-translate-y-1 hover:shadow-lg' : '',
        ]"
      >
        <div
          class="md:w-2/5 shrink-0 bg-[#032650] text-white flex items-center justify-center gap-6 px-6 py-8"
        >
          <div class="text-center leading-none">
            <span class="block text-7xl font-black">{{ hero.tag }}</span>
            <span class="block text-xl font-black uppercase tracking-widest mt-2">
              {{ monatLang(hero.start) }}
            </span>
            <span class="block text-sm font-bold text-blue-200 uppercase tracking-wide mt-1">
              {{ wochentag(hero.start) }}
            </span>
          </div>
          <img
            v-if="hero.logo"
            :src="hero.logo"
            alt=""
            decoding="async"
            class="w-20 h-20 shrink-0 object-contain bg-white rounded-full p-2"
          />
        </div>

        <div class="md:w-3/5 p-8 lg:p-10 flex flex-col bg-[#004a87] text-white">
          <div class="flex items-center justify-between gap-3">
            <span class="text-gray-300 font-bold text-sm uppercase tracking-wider">
              {{ hero.kategorie }}
            </span>
            <span
              v-if="hero.countdown"
              class="bg-white text-[#032650] text-sm font-bold px-2.5 py-1 rounded-md tracking-wide shrink-0"
            >
              {{ hero.countdown }}
            </span>
          </div>

          <h2 v-if="hero.heim && hero.gast" class="mt-3 mb-3 break-words">
            <span class="block text-2xl lg:text-3xl font-black leading-tight">{{ hero.heim }}</span>
            <span class="block text-sm font-bold uppercase tracking-widest text-blue-200 my-1.5"
              >vs.</span
            >
            <span class="block text-2xl lg:text-3xl font-black leading-tight">{{ hero.gast }}</span>
          </h2>
          <h2 v-else class="text-2xl lg:text-3xl font-black leading-tight mt-3 mb-3 break-words">
            {{ hero.titel }}
          </h2>
          <p class="text-gray-200 font-medium mb-6">{{ hero.beschreibung }}</p>

          <span
            v-if="hero.to"
            class="inline-flex items-center gap-1.5 text-white font-bold mt-auto"
          >
            Mehr erfahren
            <span aria-hidden="true" class="transition-transform group-hover:translate-x-1"
              >&rarr;</span
            >
          </span>
        </div>
      </component>

      <DecoratedCard v-if="gruppen.length || !hero">
        <template v-if="gruppen.length">
          <div
            v-for="(gruppe, index) in gruppen"
            :key="gruppe.label"
            :class="index > 0 ? 'border-t-2 border-gray-200 mt-8 pt-8' : ''"
          >
            <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-4">
              {{ gruppe.label }}
            </h3>

            <div class="flex flex-col gap-3">
              <component
                :is="termin.to ? RouterLink : 'div'"
                v-for="termin in gruppe.eintraege"
                :key="termin.id"
                :to="termin.to"
                :class="[
                  'flex items-center gap-3 sm:gap-4 bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4',
                  termin.to ? 'group hover:-translate-y-1 hover:shadow-md transition-all' : '',
                ]"
              >
                <div
                  class="shrink-0 w-14 py-2 rounded-lg bg-[#032650] text-white text-center leading-none"
                >
                  <span class="block text-2xl font-black">{{ termin.tag }}</span>
                  <span class="block text-xs font-bold uppercase tracking-wide mt-1">
                    {{ termin.monat }}
                  </span>
                </div>

                <div class="min-w-0 flex-1 flex flex-col gap-1">
                  <div
                    v-if="termin.titel !== termin.kategorie || termin.countdown"
                    class="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1"
                  >
                    <span
                      v-if="termin.titel !== termin.kategorie"
                      class="inline-block bg-blue-50 text-[#032650] text-[11px] sm:text-xs font-bold uppercase tracking-wide px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full w-fit"
                    >
                      {{ termin.kategorie }}
                    </span>
                    <span
                      v-if="termin.countdown"
                      class="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-[#B8860B]"
                    >
                      {{ termin.countdown }}
                    </span>
                  </div>
                  <p
                    v-if="termin.heim && termin.gast"
                    class="text-sm sm:text-base font-black text-[#032650] uppercase tracking-wide break-words"
                  >
                    <span class="block sm:inline">{{ termin.heim }}</span
                    >{{ ' ' }}
                    <span class="block sm:inline text-xs sm:text-base text-gray-500">vs.</span
                    >{{ ' ' }}
                    <span class="block sm:inline">{{ termin.gast }}</span>
                  </p>
                  <p
                    v-else
                    class="text-sm sm:text-base font-black text-[#032650] uppercase tracking-wide break-words"
                  >
                    {{ termin.titel }}
                  </p>
                  <p class="text-sm font-medium text-gray-600">
                    {{ termin.beschreibung }}
                  </p>
                </div>

                <img
                  v-if="termin.logo"
                  :src="termin.logo"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  class="hidden sm:block shrink-0 sm:w-16 sm:h-16 object-contain"
                />

                <span
                  v-if="termin.to"
                  aria-hidden="true"
                  class="hidden sm:inline shrink-0 text-[#032650] font-bold transition-transform group-hover:translate-x-1"
                  >&rarr;</span
                >
              </component>
            </div>
          </div>

          <div v-if="hatMehr" class="text-center mt-8">
            <button
              type="button"
              @click="sichtbar += SCHRITT"
              class="bg-white border-2 border-[#032650] text-[#032650] px-8 py-3 rounded-full font-bold hover:bg-[#032650] hover:text-white transition-colors cursor-pointer shadow-sm"
            >
              Weitere Termine laden
            </button>
          </div>
        </template>

        <div
          v-else
          class="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4 py-12"
        >
          Aktuell stehen keine Termine fest. Schaut bald wieder vorbei!
        </div>
      </DecoratedCard>
    </div>
  </div>
</template>
