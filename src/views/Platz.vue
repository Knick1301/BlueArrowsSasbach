<script setup lang="ts">
import { useStoryblokApi } from '@storyblok/vue'
import { RouterLink } from 'vue-router'
import { STORYBLOK_VERSION } from '@/storyblok'
import DecoratedCard from '@/components/DecoratedCard.vue'
import { ladeTermine } from '@/composables/useTermine'
import { getUrl, type StoryblokLink } from '@/utils/methods'

interface TeamCardBlok {
  _uid: string
  component: string
  title: string
  link?: StoryblokLink
}

const TERMINE_ANZAHL = 3

const storyblokApi = useStoryblokApi()

const ladeTeamKarten = async (): Promise<TeamCardBlok[]> => {
  try {
    const { data } = await storyblokApi.get('cdn/stories/home', { version: STORYBLOK_VERSION })
    const body = (data.story.content.body as TeamCardBlok[] | undefined) ?? []
    return body.filter((blok) => blok.component === 'TeamCard')
  } catch (e) {
    console.error('Storyblok-Story "home" konnte nicht geladen werden.', e)
    return []
  }
}

const [teamKarten, termine] = await Promise.all([ladeTeamKarten(), ladeTermine()])
const naechsteTermine = termine.slice(0, TERMINE_ANZAHL)

const wegweiser = [
  {
    titel: 'Laufschule',
    text: 'Für Kinder ab 3 Jahren – einmal Schnuppern ist kostenfrei.',
    to: { name: 'laufschule' },
  },
  {
    titel: 'Trainingszeiten',
    text: 'Wann unsere Teams trainieren.',
    to: { name: 'training' },
  },
]
</script>

<template>
  <div class="mb-15">
    <div class="w-full py-8 md:py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">
        Willkommen in der Blue Arrows Arena
      </h1>
    </div>

    <div class="max-w-[1400px] w-[95%] mx-auto mt-10 md:mt-15 px-4 flex flex-col gap-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <RouterLink v-for="eintrag in wegweiser" :key="eintrag.titel" :to="eintrag.to"
          class="group flex items-center justify-between gap-4 bg-[#032650] text-white rounded-xl shadow-md px-6 py-5 hover:-translate-y-1 hover:shadow-lg transition-all">
          <span>
            <span class="block text-xl font-black uppercase tracking-wide">{{ eintrag.titel }}</span>
            <span class="block text-blue-200 font-medium mt-1">{{ eintrag.text }}</span>
          </span>
          <span aria-hidden="true"
            class="text-2xl font-bold transition-transform group-hover:translate-x-1">&rarr;</span>
        </RouterLink>
      </div>

      <DecoratedCard v-if="teamKarten.length">
        <h2
          class="text-[#032650] text-2xl md:text-3xl font-black uppercase tracking-wide mb-4 border-b-[3px] border-[#032650] inline-block pb-1">
          Teams
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
          <RouterLink v-for="team in teamKarten" :key="team._uid" :to="getUrl(team.link)"
            class="group flex items-center justify-between gap-4 py-3 border-b-2 border-gray-200 text-[#032650] font-bold text-lg hover:text-blue-700 transition-colors">
            {{ team.title }}
            <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">&rarr;</span>
          </RouterLink>
        </div>
      </DecoratedCard>

      <DecoratedCard>
        <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
          <h2
            class="text-[#032650] text-2xl md:text-3xl font-black uppercase tracking-wide border-b-[3px] border-[#032650] inline-block pb-1">
            Nächste Termine
          </h2>
          <RouterLink :to="{ name: 'termine' }"
            class="hidden sm:inline-flex items-center gap-1.5 text-[#032650] font-bold hover:underline">
            Alle Termine <span aria-hidden="true">&rarr;</span>
          </RouterLink>
        </div>

        <div v-if="naechsteTermine.length" class="flex flex-col gap-3">
          <component :is="termin.to ? RouterLink : 'div'" v-for="termin in naechsteTermine" :key="termin.id"
            :to="termin.to" :class="[
              'flex items-center gap-3 sm:gap-4 bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4',
              termin.to ? 'group hover:-translate-y-1 hover:shadow-md transition-all' : '',
            ]">
            <div class="shrink-0 w-14 py-2 rounded-lg bg-[#032650] text-white text-center leading-none">
              <span class="block text-2xl font-black">{{ termin.tag }}</span>
              <span class="block text-xs font-bold uppercase tracking-wide mt-1">
                {{ termin.monat }}
              </span>
            </div>
            <div class="min-w-0 flex-1 flex flex-col gap-1">
              <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span
                  class="inline-block bg-blue-50 text-[#032650] text-[11px] sm:text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full w-fit">
                  {{ termin.kategorie }}
                </span>
                <span v-if="termin.countdown"
                  class="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-[#B8860B]">
                  {{ termin.countdown }}
                </span>
              </div>
              <p class="text-sm sm:text-base font-black text-[#032650] uppercase tracking-wide break-words">
                {{ termin.titel }}
              </p>
              <p class="text-sm font-medium text-gray-600">{{ termin.beschreibung }}</p>
            </div>
            <img v-if="termin.logo" :src="termin.logo" alt="" loading="lazy"
              class="hidden sm:block shrink-0 w-14 h-14 object-contain" />
          </component>
        </div>
        <p v-else class="text-gray-600 font-medium">
          Aktuell stehen keine Termine fest. Schaut bald wieder vorbei!
        </p>

        <RouterLink :to="{ name: 'termine' }"
          class="sm:hidden mt-6 block text-center border-2 border-[#032650] text-[#032650] font-bold px-6 py-2.5 rounded-full hover:bg-[#032650] hover:text-white transition-colors">
          Alle Termine
        </RouterLink>
      </DecoratedCard>

      <RouterLink to="/"
        class="self-center inline-flex items-center gap-1.5 bg-[#032650] text-white font-bold px-8 py-3 rounded-full hover:bg-blue-900 transition-colors">
        Zur Startseite <span aria-hidden="true">&rarr;</span>
      </RouterLink>
    </div>
  </div>
</template>
