<script setup lang="ts">
import { useStoryblokApi } from '@storyblok/vue'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { STORYBLOK_VERSION } from '@/storyblok'
import DecoratedCard from '@/components/DecoratedCard.vue'
import KontaktBlock from '@/components/KontaktBlock.vue'
import NaechstesSpiel from '@/components/NaechstesSpiel.vue'
import { useIshdGamesForTeams } from '@/composables/useIshd'
import { useDaniel } from '@/utils/kontakt'
import {
  gameDate,
  ishdTeamsFromStories,
  isHomeGame,
  isUpcoming,
  type TeamStory,
} from '@/utils/ishd'
import { TRAINING_TEAM_LABELS } from '@/utils/games'

interface ZeitBlok {
  _uid: string
  component: string
  day: string
  from: string
  to: string
  team?: string
  group?: string
}

const TAGE: Record<string, string> = {
  monday: 'Mo',
  tuesday: 'Di',
  wednesday: 'Mi',
  thursday: 'Do',
  friday: 'Fr',
  saturday: 'Sa',
  sunday: 'So',
}
const TAG_REIHENFOLGE = Object.keys(TAGE)
const LAUFSCHUL_GRUPPEN: Record<string, string> = {
  'Gruppe 1': 'Anfänger',
  'Gruppe 2': 'Fortgeschrittene',
}

const storyblokApi = useStoryblokApi()

const ladeStory = async (slug: string) => {
  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, { version: STORYBLOK_VERSION })
    return data.story.content as Record<string, unknown>
  } catch (e) {
    console.error(`Storyblok-Story "${slug}" konnte nicht geladen werden.`, e)
    return null
  }
}

const ladeTeams = async () => {
  try {
    const { data } = await storyblokApi.get('cdn/stories', {
      version: STORYBLOK_VERSION,
      starts_with: 'teams/',
      per_page: 100,
    })
    return data.stories as TeamStory[]
  } catch (e) {
    console.error('Storyblok-Teams konnten nicht geladen werden.', e)
    return []
  }
}

const [laufschule, training, teamStories, daniel] = await Promise.all([
  ladeStory('skating/laufschule'),
  ladeStory('teams/trainings'),
  ladeTeams(),
  useDaniel(),
])

const bloks = (content: Record<string, unknown> | null, component: string) =>
  ((content?.trainings as ZeitBlok[] | undefined) ?? [])
    .filter((blok) => blok.component === component)
    .sort((a, b) => TAG_REIHENFOLGE.indexOf(a.day) - TAG_REIHENFOLGE.indexOf(b.day))

const gruppieren = (liste: ZeitBlok[], name: (blok: ZeitBlok) => string) => {
  const gruppen = new Map<string, ZeitBlok[]>()
  for (const blok of liste) {
    const key = name(blok)
    gruppen.set(key, [...(gruppen.get(key) ?? []), blok])
  }
  return [...gruppen.entries()].map(([titel, zeiten]) => ({ titel, zeiten }))
}

const laufschulZeiten = gruppieren(
  bloks(laufschule, 'laufschulTraining').sort((a, b) =>
    (a.group ?? '').localeCompare(b.group ?? ''),
  ),
  (blok) => LAUFSCHUL_GRUPPEN[blok.group ?? ''] ?? blok.group ?? '',
)
const TEAM_REIHENFOLGE = Object.keys(TRAINING_TEAM_LABELS)
const teamRang = (team = '') =>
  TEAM_REIHENFOLGE.includes(team) ? TEAM_REIHENFOLGE.indexOf(team) : TEAM_REIHENFOLGE.length
const teamSeiten = new Set(teamStories.map((story) => story.full_slug))
const trainingsZeiten = gruppieren(
  bloks(training, 'training').sort((a, b) => teamRang(a.team) - teamRang(b.team)),
  (blok) => blok.team ?? '',
).map(({ titel: team, zeiten }) => ({
  titel: TRAINING_TEAM_LABELS[team] ?? team,
  zeiten,
  link: teamSeiten.has(`teams/${team}`) ? `/teams/${team}` : undefined,
}))
const laufschuleVoll = Boolean(laufschule?.fullyBooked)

const { games } = useIshdGamesForTeams(ishdTeamsFromStories(teamStories))
const naechstesHeimspiel = computed(
  () =>
    games.value
      .filter(({ game }) => isHomeGame(game) && isUpcoming(game))
      .sort((a, b) => gameDate(a.game).getTime() - gameDate(b.game).getTime())[0] ?? null,
)

const zeitText = (blok: ZeitBlok) => `${TAGE[blok.day] ?? blok.day} ${blok.from}–${blok.to}`
</script>

<template>
  <div class="mb-15">
    <div class="w-full py-8 md:py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">Mach mit!</h1>
      <p class="text-sm text-blue-200 mt-3 font-medium uppercase tracking-wide">
        Willkommen in der Blue Arrows Arena
      </p>
    </div>

    <div
      class="max-w-[1400px] w-[95%] mx-auto mt-10 md:mt-15 px-4 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start"
    >
      <DecoratedCard class="lg:col-span-3">
        <h2
          class="text-[#032650] text-2xl md:text-3xl font-black mt-0 uppercase tracking-wide mb-4 border-b-[3px] border-[#032650] inline-block pb-1 w-fit"
        >
          Inline-Skating Laufschule
        </h2>

        <p class="mb-6 text-lg font-medium text-gray-700 leading-relaxed">
          Lust auf Inline-Skaten? In unserer Laufschule lernen Kinder ab 3 Jahren die ersten
          Grundschritte bis hin zum sicheren Skaten – ganz ohne Vorkenntnisse.
        </p>

        <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-2">
          Trainingszeiten Laufschule
        </h3>
        <div class="mb-6">
          <div
            v-for="gruppe in laufschulZeiten"
            :key="gruppe.titel"
            class="flex justify-between gap-6 py-3 border-b-2 border-gray-200"
          >
            <span class="text-[#032650] font-bold">{{ gruppe.titel }}</span>
            <span class="text-gray-600 font-medium text-right">
              <span v-for="zeit in gruppe.zeiten" :key="zeit._uid" class="block">
                {{ zeitText(zeit) }} Uhr
              </span>
            </span>
          </div>
        </div>

        <div
          class="mb-6 rounded-lg px-4 py-3 text-center font-black"
          :class="laufschuleVoll ? 'bg-amber-50 text-amber-800' : 'bg-[#032650] text-white'"
        >
          {{
            laufschuleVoll
              ? 'Aktuell voll belegt – Warteliste möglich'
              : 'Einmal Schnuppern ist kostenfrei!'
          }}
        </div>

        <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-2">
          Fragen? Einfach melden!
        </h3>
        <p class="text-gray-600 font-medium mb-5">
          Wir helfen dir gerne beim Einstieg – egal ob Laufschule, Training oder Mitgliedschaft.
        </p>
        <KontaktBlock :person="daniel" />

        <router-link
          :to="{ name: 'laufschule' }"
          class="mt-8 block bg-[#032650] text-white text-center font-bold px-6 py-3 rounded-full hover:bg-blue-900 transition-colors"
        >
          Mehr zur Laufschule
        </router-link>
      </DecoratedCard>

      <div class="lg:col-span-2 flex flex-col gap-10 lg:sticky lg:top-32">
        <DecoratedCard>
          <h2
            class="text-[#032650] text-2xl font-black mt-0 uppercase tracking-wide mb-4 border-b-[3px] border-[#032650] inline-block pb-1 w-fit"
          >
            Trainingszeiten
          </h2>
          <div v-if="trainingsZeiten.length">
            <component
              :is="gruppe.link ? RouterLink : 'div'"
              v-for="gruppe in trainingsZeiten"
              :key="gruppe.titel"
              :to="gruppe.link"
              class="group flex justify-between gap-6 py-3 border-b-2 border-gray-200"
            >
              <span class="text-[#032650] font-bold">
                {{ gruppe.titel }}
                <span
                  v-if="gruppe.link"
                  aria-hidden="true"
                  class="inline-block transition-transform group-hover:translate-x-1"
                  >&rarr;</span
                >
              </span>
              <span class="text-gray-600 font-medium text-right">
                <span v-for="zeit in gruppe.zeiten" :key="zeit._uid" class="block">
                  {{ zeitText(zeit) }}
                </span>
              </span>
            </component>
          </div>
          <p v-else class="text-gray-600 font-medium">
            Die Trainingszeiten werden gerade aktualisiert.
          </p>
        </DecoratedCard>

        <NaechstesSpiel v-if="naechstesHeimspiel" :game="naechstesHeimspiel.game" />

        <router-link
          :to="{ name: 'mitgliedschaft' }"
          class="group flex items-center justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-5 hover:-translate-y-1 hover:shadow-md transition-all"
        >
          <span>
            <span class="block text-[#032650] font-black uppercase tracking-wide"
              >Mitglied werden</span
            >
            <span class="block text-gray-600 text-sm font-medium"
              >Beiträge und Anmeldeformulare</span
            >
          </span>
          <span
            aria-hidden="true"
            class="text-[#032650] font-bold transition-transform group-hover:translate-x-1"
            >&rarr;</span
          >
        </router-link>
      </div>
    </div>
  </div>
</template>
