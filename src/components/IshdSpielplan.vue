<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { IshdGame } from '@/types/ishd'
import {
  formatGameDate,
  gameDate,
  isHomeGame,
  isPlayed,
  logoUrl,
  outcome,
  resultSuffix,
  resultText,
  statusText,
} from '@/utils/ishd'

const props = defineProps<{
  games: IshdGame[]
  loading?: boolean
  error?: string | null
}>()

const VISIBLE = 5

const tab = ref<'next' | 'prev'>('next')
const showAll = ref(false)

const now = new Date()

const upcoming = computed(() =>
  props.games
    .filter((game) => !isPlayed(game) && (gameDate(game) >= now || game.has_been_cancelled))
    .sort((a, b) => gameDate(a).getTime() - gameDate(b).getTime()),
)

const past = computed(() =>
  props.games
    .filter((game) => !upcoming.value.includes(game))
    .sort((a, b) => gameDate(b).getTime() - gameDate(a).getTime()),
)

watch(
  () => props.games,
  () => {
    tab.value = upcoming.value.length || !past.value.length ? 'next' : 'prev'
    showAll.value = false
  },
  { immediate: true },
)

const list = computed(() => (tab.value === 'next' ? upcoming.value : past.value))
const displayed = computed(() => (showAll.value ? list.value : list.value.slice(0, VISIBLE)))

const switchTab = (next: 'next' | 'prev') => {
  tab.value = next
  showAll.value = false
}

const resultClass = (game: IshdGame) => {
  const result = outcome(game)
  if (result === 'win') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (result === 'loss') return 'bg-rose-50 text-rose-600 border-rose-200'
  if (result === 'tie') return 'bg-gray-100 text-gray-600 border-gray-200'
  return 'text-[#032650] border-transparent'
}

const emptyText = computed(() =>
  tab.value === 'next' ? 'Keine anstehenden Spiele.' : 'Noch keine Spiele gespielt.',
)
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
          v-for="option in [
            { key: 'prev', label: 'Ergebnisse' },
            { key: 'next', label: 'Nächste' },
          ] as const"
          :key="option.key"
          type="button"
          @click="switchTab(option.key)"
          :class="
            tab === option.key
              ? 'bg-white shadow-sm text-[#032650] font-bold border border-gray-200'
              : 'text-gray-600 font-medium hover:text-gray-700'
          "
          class="px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer"
        >
          {{ option.label }}
        </button>
      </span>
    </div>

    <div class="overflow-x-auto rounded-xl border border-gray-100 flex-grow">
      <table class="w-full text-sm text-left border-collapse">
        <thead
          class="bg-gray-50/80 text-[11px] text-gray-600 uppercase tracking-widest border-b border-gray-100"
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
          <tr v-if="loading && !games.length">
            <td colspan="3" class="px-4 py-12 text-center text-gray-400 text-xs">
              Spielplan wird geladen …
            </td>
          </tr>

          <tr v-else-if="error && !games.length">
            <td colspan="3" class="px-4 py-12 text-center text-gray-600 italic text-xs">
              {{ error }}
            </td>
          </tr>

          <template v-else>
            <tr
              v-for="game in displayed"
              :key="game.id"
              class="border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50/50"
              :class="{ 'opacity-60': game.has_been_cancelled }"
            >
              <td class="pl-3 pr-1.5 sm:px-4 py-3.5 whitespace-nowrap text-[#032650] align-top">
                <div class="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
                  <span class="font-medium">
                    {{
                      gameDate(game).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                      })
                    }}
                  </span>
                  <span
                    v-if="isHomeGame(game)"
                    class="bg-[#032650] text-white text-[11px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm"
                  >
                    Heim
                  </span>
                </div>
                <div
                  class="text-[11px] font-bold text-gray-600 mt-0.5"
                  :title="formatGameDate(game)"
                >
                  {{
                    gameDate(game).toLocaleTimeString('de-DE', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  }}
                  UHR
                </div>
              </td>

              <td class="pl-1.5 pr-3 sm:px-4 py-3.5">
                <div class="sm:hidden">
                  <div class="flex items-center gap-2">
                    <div class="min-w-0 flex-1 flex flex-col gap-1.5">
                      <div
                        v-for="(team, index) in [game.home_team, game.away_team]"
                        :key="index"
                        class="flex items-center gap-1.5"
                      >
                        <img
                          width="128"
                          height="128"
                          v-if="logoUrl(team)"
                          loading="lazy"
                          decoding="async"
                          :src="logoUrl(team)"
                          :alt="team.full_name"
                          class="w-5 h-5 object-contain shrink-0"
                        />
                        <div v-else class="w-5 h-5 shrink-0"></div>
                        <span
                          class="font-bold text-xs text-[#032650] leading-tight hyphens-auto [overflow-wrap:anywhere]"
                          >{{ team.full_name }}</span
                        >
                      </div>
                    </div>
                    <span
                      class="shrink-0 whitespace-nowrap text-base font-black px-2 py-0.5 rounded-md border"
                      :class="resultClass(game)"
                    >
                      {{ statusText(game) || resultText(game) }}
                    </span>
                  </div>
                  <span
                    class="block pl-[26px] mt-1.5 text-[11px] font-bold text-gray-600 uppercase tracking-widest"
                  >
                    @ {{ game.venue }}
                    <template v-if="resultSuffix(game)"> · {{ resultSuffix(game) }}</template>
                  </span>
                </div>

                <div
                  class="hidden sm:grid grid-cols-[2.5rem_1fr_auto_1fr_2.5rem] items-center gap-x-3"
                >
                  <img
                    width="128"
                    height="128"
                    v-if="logoUrl(game.home_team)"
                    loading="lazy"
                    decoding="async"
                    :src="logoUrl(game.home_team)"
                    :alt="game.home_team.full_name"
                    class="w-10 h-10 object-contain"
                  />
                  <div v-else class="w-10 h-10"></div>
                  <span class="font-bold text-[#032650] leading-tight text-right">
                    {{ game.home_team.full_name }}
                  </span>
                  <span class="text-gray-600 text-xs font-bold leading-none">vs.</span>
                  <span class="font-bold text-[#032650] leading-tight text-left">
                    {{ game.away_team.full_name }}
                  </span>
                  <img
                    width="128"
                    height="128"
                    v-if="logoUrl(game.away_team)"
                    loading="lazy"
                    decoding="async"
                    :src="logoUrl(game.away_team)"
                    :alt="game.away_team.full_name"
                    class="w-10 h-10 object-contain"
                  />
                  <div v-else class="w-10 h-10"></div>
                  <div class="col-start-2 col-span-3 flex flex-col items-center text-center mt-1">
                    <span class="text-[11px] font-bold text-gray-600 uppercase tracking-widest">
                      @ {{ game.venue }}
                    </span>
                    <a
                      v-if="game.has_live_stream && game.live_stream_url && !isPlayed(game)"
                      :href="game.live_stream_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="mt-1 text-[11px] font-bold uppercase tracking-widest text-rose-600 hover:underline"
                    >
                      ● Livestream
                    </a>
                  </div>
                </div>
              </td>

              <td class="hidden sm:table-cell px-1.5 sm:px-4 py-3.5 text-center align-middle">
                <span
                  class="inline-block font-black whitespace-nowrap text-base px-2.5 py-1 rounded-md border"
                  :class="resultClass(game)"
                >
                  {{ statusText(game) || resultText(game) }}
                </span>
                <span
                  v-if="resultSuffix(game)"
                  class="block text-[11px] font-bold text-gray-600 uppercase tracking-widest mt-1"
                >
                  {{ resultSuffix(game) }}
                </span>
              </td>
            </tr>

            <tr v-if="!displayed.length">
              <td colspan="3" class="px-4 py-12 text-center text-gray-600 italic text-xs">
                {{ emptyText }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div
      v-if="list.length > VISIBLE"
      class="border-t border-gray-100 pt-4 flex justify-center mt-2"
    >
      <button
        type="button"
        @click="showAll = !showAll"
        class="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors border cursor-pointer"
        :class="
          showAll
            ? 'text-gray-600 hover:text-gray-700 border-gray-200 bg-white'
            : 'text-[#032650] bg-gray-50 hover:bg-gray-100 border-gray-200'
        "
      >
        {{ showAll ? 'Weniger anzeigen' : 'Alle anzeigen' }}
      </button>
    </div>
  </div>
</template>
