<script setup lang="ts">
import { computed } from 'vue'
import type { IshdGame } from '@/types/ishd'
import { formatGameDate, logoUrl, outcome, resultSuffix, resultText } from '@/utils/ishd'

const props = defineProps<{ game: IshdGame }>()

const badge = computed(() => {
  const result = outcome(props.game)
  if (result === 'win') return { text: 'Sieg', class: 'bg-emerald-100 text-emerald-700' }
  if (result === 'loss') return { text: 'Niederlage', class: 'bg-rose-100 text-rose-600' }
  if (result === 'tie') return { text: 'Unentschieden', class: 'bg-gray-100 text-gray-600' }
  return null
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col gap-3">
    <div class="flex items-center justify-between gap-3">
      <span class="text-xs font-bold uppercase tracking-widest text-gray-500">Letztes Ergebnis</span>
      <span
        v-if="badge"
        class="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
        :class="badge.class"
      >
        {{ badge.text }}
      </span>
    </div>

    <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
      <div
        v-for="(team, index) in [game.home_team, game.away_team]"
        :key="index"
        class="flex flex-col items-center gap-1 min-w-0"
        :class="index === 1 ? 'order-3' : ''"
      >
        <img
          v-if="logoUrl(team)"
          :src="logoUrl(team)"
          alt=""
          loading="lazy"
          class="w-10 h-10 object-contain"
        />
        <span class="text-xs font-bold text-[#032650] leading-tight break-words">
          {{ team.full_name }}
        </span>
      </div>
      <div class="flex flex-col items-center order-2">
        <span class="text-3xl font-black text-[#032650] whitespace-nowrap">
          {{ resultText(game) }}
        </span>
        <span
          v-if="resultSuffix(game)"
          class="text-[11px] font-bold uppercase tracking-widest text-gray-500"
        >
          {{ resultSuffix(game) }}
        </span>
      </div>
    </div>

    <p class="text-xs font-medium text-gray-500 text-center">{{ formatGameDate(game) }}</p>
  </div>
</template>
