<script setup lang="ts">
import { computed, ref } from 'vue'

interface StoryblokAsset {
  filename: string
  alt?: string
}

interface GameBlok {
  _uid: string
  component: 'games'
  date: string
  hometeam: string
  awayteam: string
  homeLogo?: StoryblokAsset
  awayLogo?: StoryblokAsset
  result?: string
  venue?: string
  home?: boolean
}

const showAllGames = ref(false)

const hasMoreGames = computed(() => {
  const games = activeGamesTab.value === 'next' ? upcomingGames.value : pastGames.value
  return games.length > 5
})

const displayedGames = computed(() => {
  const games = activeGamesTab.value === 'next' ? upcomingGames.value : pastGames.value
  return showAllGames.value ? games : games.slice(0, 5)
})

const switchTab = (tab: 'next' | 'prev') => {
  activeGamesTab.value = tab
  showAllGames.value = false
}

const props = defineProps<{
  games: GameBlok[]
}>()

const formatDate = (dateStr: string) => {
  const normalized = dateStr.replace(' ', 'T')
  return new Date(normalized).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
  })
}

const formatTime = (dateStr: string) => {
  const normalized = dateStr.replace(' ', 'T')
  return new Date(normalized).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const activeGamesTab = ref<'next' | 'prev'>('next')

const upcomingGames = computed(() => {
  const now = new Date()
  return props.games
    .filter((g) => new Date(g.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

const pastGames = computed(() => {
  const now = new Date()
  return props.games
    .filter((g) => new Date(g.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const buttonText = computed(() => {
  if (activeGamesTab.value === 'next') {
    return showAllGames.value ? 'Weniger anzeigen' : 'Kompletten Spielplan anzeigen'
  } else {
    return showAllGames.value ? 'Weniger anzeigen' : 'Alle vorherigen Spiele anzeigen'
  }
})
</script>

<template>
  <div class="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
    <div
      class="flex flex-wrap items-center justify-between gap-y-3 mb-6 border-b border-gray-100 pb-4"
    >
      <div class="flex items-center gap-3">
        <div class="w-2 h-6 bg-[#032650] rounded-full"></div>
        <h3 class="font-bold text-[#032650] uppercase tracking-widest text-sm">Spielplan</h3>
      </div>

      <span class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          @click="switchTab('prev')"
          :class="
            activeGamesTab === 'prev'
              ? 'bg-white shadow-sm text-[#032650] font-bold border border-gray-200'
              : 'text-gray-500 font-medium hover:text-gray-700'
          "
          class="px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer"
        >
          Vorherige
        </button>
        <button
          @click="activeGamesTab = 'next'"
          :class="
            activeGamesTab === 'next'
              ? 'bg-white shadow-sm text-[#032650] font-bold border border-gray-200'
              : 'text-gray-500 font-medium hover:text-gray-700'
          "
          class="px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer"
        >
          Nächste
        </button>
      </span>
    </div>

    <div class="overflow-x-auto rounded-xl border border-gray-100 flex-grow">
      <table class="w-full text-sm text-left border-collapse">
        <thead
          class="bg-gray-50/80 text-[11px] text-gray-500 uppercase tracking-widest border-b border-gray-100"
        >
          <tr>
            <th class="pl-3 pr-1.5 sm:px-4 py-3 font-bold">Datum</th>
            <th class="pl-1.5 pr-3 sm:px-4 py-3 font-bold text-left sm:text-center">
              <span class="flex items-center justify-between sm:block">
                <span class="pl-[26px] sm:pl-0">Partie</span>
                <span class="sm:hidden">Erg.</span>
              </span>
            </th>
            <th class="hidden sm:table-cell px-1.5 sm:px-4 py-3 font-bold text-center">Erg.</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr
            v-for="game in displayedGames"
            :key="game._uid"
            v-editable="game"
            class="border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50/50"
          >
            <td class="pl-3 pr-1.5 sm:px-4 py-3.5 whitespace-nowrap text-[#032650] align-top">
              <div class="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
                <span class="font-medium">{{ formatDate(game.date) }}</span>

                <span
                  v-if="game.home"
                  class="bg-[#032650] text-white text-[11px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm"
                >
                  Heim
                </span>
              </div>

              <div class="text-[11px] font-bold text-gray-500 mt-0.5">
                {{ formatTime(game.date) }} UHR
              </div>
            </td>

            <td class="pl-1.5 pr-3 sm:px-4 py-3.5">
              <div class="sm:hidden">
                <div class="flex items-center gap-2">
                  <div class="min-w-0 flex-1 flex flex-col gap-1.5">
                    <div class="flex items-center gap-1.5">
                      <img
                        v-if="game.homeLogo?.filename"
                        loading="lazy"
                        decoding="async"
                        :src="game.homeLogo.filename"
                        :alt="game.hometeam"
                        class="w-5 h-5 object-contain rounded-full shrink-0"
                      />
                      <div v-else class="w-5 h-5 shrink-0"></div>
                      <span
                        class="font-bold text-xs text-[#032650] leading-tight hyphens-auto [overflow-wrap:anywhere]"
                        >{{ game.hometeam }}</span
                      >
                    </div>
                    <span class="pl-[26px] font-bold text-xs text-gray-500 leading-tight">vs.</span>
                    <div class="flex items-center gap-1.5">
                      <img
                        v-if="game.awayLogo?.filename"
                        loading="lazy"
                        decoding="async"
                        :src="game.awayLogo.filename"
                        :alt="game.awayteam"
                        class="w-5 h-5 object-contain rounded-full shrink-0"
                      />
                      <div v-else class="w-5 h-5 shrink-0"></div>
                      <span
                        class="font-bold text-xs text-[#032650] leading-tight hyphens-auto [overflow-wrap:anywhere]"
                        >{{ game.awayteam }}</span
                      >
                    </div>
                  </div>
                  <span class="shrink-0 whitespace-nowrap text-base font-black text-[#032650]">
                    {{ game.result || '-:-' }}
                  </span>
                </div>
                <span
                  v-if="game.venue"
                  class="block pl-[26px] mt-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest"
                >
                  @ {{ game.venue }}
                </span>
              </div>

              <div class="hidden sm:flex justify-center">
                <div class="flex items-center gap-6">
                  <img
                    loading="lazy"
                    decoding="async"
                    v-if="game.homeLogo?.filename"
                    :src="game.homeLogo.filename"
                    :alt="game.hometeam"
                    class="w-10 h-10 object-contain rounded-full flex-shrink-0"
                  />
                  <div v-else class="w-10 h-10 rounded-full flex-shrink-0"></div>

                  <div class="flex flex-col items-center text-center">
                    <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-x-2">
                      <span class="font-bold text-[#032650] leading-tight text-right">{{
                        game.hometeam
                      }}</span>
                      <span class="text-gray-500 text-xs font-bold leading-none">vs.</span>
                      <span class="font-bold text-[#032650] leading-tight text-left">{{
                        game.awayteam
                      }}</span>
                    </div>
                    <span
                      v-if="game.venue"
                      class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1"
                    >
                      @ {{ game.venue }}
                    </span>
                  </div>

                  <img
                    loading="lazy"
                    decoding="async"
                    v-if="game.awayLogo?.filename"
                    :src="game.awayLogo.filename"
                    :alt="game.awayteam"
                    class="w-10 h-10 object-contain rounded-full flex-shrink-0"
                  />
                  <div v-else class="w-10 h-10 rounded-full flex-shrink-0"></div>
                </div>
              </div>
            </td>

            <td
              class="hidden sm:table-cell px-1.5 sm:px-4 py-3.5 text-center font-black text-[#032650] whitespace-nowrap align-middle text-base"
            >
              {{ game.result || '-:-' }}
            </td>
          </tr>

          <tr v-if="!displayedGames.length">
            <td colspan="3" class="px-4 py-12 text-center text-gray-500 italic text-xs">
              <div class="flex flex-col items-center gap-2">
                <i class="fa-regular fa-calendar-xmark text-2xl text-gray-200"></i>
                Keine Spiele in dieser Kategorie eingetragen.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="hasMoreGames" class="border-t border-gray-100 pt-4 flex justify-center mt-2">
      <button
        @click="showAllGames = !showAllGames"
        class="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors border"
        :class="
          showAllGames
            ? 'text-gray-500 hover:text-gray-700 border-gray-200 bg-white'
            : 'text-[#032650] bg-gray-50 hover:bg-gray-100 border-gray-200'
        "
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>
