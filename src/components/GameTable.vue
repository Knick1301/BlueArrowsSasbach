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

const isHomeGame = (hometeam: string) => {
  return hometeam.toLowerCase().includes('blue arrows')
}

const buttonText = computed(() => {
  if (activeGamesTab.value === 'next') {
    return showAllGames.value ? 'Weniger anzeigen' : 'Kompletten Spielplan anzeigen'
  } else {
    return showAllGames.value ? 'Weniger anzeigen' : 'Alle vorherigen Spiele anzeigen'
  }
})
</script>

<template>
  <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
    <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-2 h-6 bg-[#032650] rounded-full"></div>
        <h3 class="font-bold text-[#032650] uppercase tracking-widest text-sm">Spielplan</h3>
      </div>

      <span class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button @click="switchTab('prev')" :class="activeGamesTab === 'prev'
          ? 'bg-white shadow-sm text-[#032650] font-bold border border-gray-200'
          : 'text-gray-500 font-medium hover:text-gray-700'
          " class="px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer">
          Vorherige
        </button>
        <button @click="activeGamesTab = 'next'" :class="activeGamesTab === 'next'
          ? 'bg-white shadow-sm text-[#032650] font-bold border border-gray-200'
          : 'text-gray-500 font-medium hover:text-gray-700'
          " class="px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer">
          Nächste
        </button>
      </span>
    </div>

    <div class="overflow-x-auto rounded-xl border border-gray-100 flex-grow">
      <table class="w-full text-sm text-left border-collapse">
        <thead class="bg-gray-50/80 text-[11px] text-gray-500 uppercase tracking-widest border-b border-gray-100">
          <tr>
            <th class="px-4 py-3 font-bold">Datum</th>
            <th class="px-4 py-3 font-bold text-center"> Partie
            </th>
            <th class="px-4 py-3 font-bold text-center">Erg.</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="game in displayedGames" :key="game._uid" v-editable="game"
            class="border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50/50">
            <td class="px-4 py-3.5 whitespace-nowrap text-[#032650] align-top">
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ formatDate(game.date) }}</span>

                <span v-if="isHomeGame(game.hometeam)"
                  class="bg-[#032650] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                  Heim
                </span>
              </div>

              <div class="text-[11px] font-bold text-gray-500 mt-0.5">
                {{ formatTime(game.date) }} UHR
              </div>
            </td>

            <td class="px-4 py-3.5">
              <div class="flex justify-center">
                <div class="flex items-center gap-6">
                  <img v-if="game.homeLogo?.filename" :src="game.homeLogo.filename" :alt="game.hometeam"
                    class="w-10 h-10 object-contain rounded-full flex-shrink-0" />
                  <div v-else class="w-10 h-10 rounded-full flex-shrink-0"></div>

                  <div class="flex flex-col items-center text-center">
                    <div class="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5">
                      <span class="font-bold text-[#032650] leading-tight">{{ game.hometeam }}</span>
                      <span class="text-gray-500 text-xs font-bold leading-none">–</span>
                      <span class="font-bold text-[#032650] leading-tight">{{ game.awayteam }}</span>
                    </div>
                    <span v-if="game.venue" class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                      @ {{ game.venue }}
                    </span>
                  </div>

                  <img v-if="game.awayLogo?.filename" :src="game.awayLogo.filename" :alt="game.awayteam"
                    class="w-10 h-10 object-contain rounded-full flex-shrink-0" />
                  <div v-else class="w-10 h-10 rounded-full flex-shrink-0"></div>
                </div>
              </div>
            </td>

            <td class="px-4 py-3.5 text-center font-black text-[#032650] whitespace-nowrap align-top text-base">
              {{ game.result || '-:-' }}
            </td>
          </tr>

          <tr v-if="!displayedGames.length">
            <td colspan="3" class="px-4 py-12 text-center text-gray-400 italic text-xs">
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
      <button @click="showAllGames = !showAllGames"
        class="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors border" :class="showAllGames
          ? 'text-gray-500 hover:text-gray-700 border-gray-200 bg-white'
          : 'text-[#032650] bg-gray-50 hover:bg-gray-100 border-gray-200'
          ">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>