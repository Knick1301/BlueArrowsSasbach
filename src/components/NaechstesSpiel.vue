<script setup lang="ts">
import type { IshdGame } from '@/types/ishd'
import { formatGameDate, isHomeGame, logoUrl, opponent } from '@/utils/ishd'

defineProps<{ game: IshdGame | null }>()
</script>

<template>
  <div class="bg-[#032650] text-white rounded-xl shadow-sm p-5 flex flex-col gap-3">
    <div class="flex items-center justify-between gap-3">
      <span class="text-xs font-bold uppercase tracking-widest text-blue-200">Nächstes Spiel</span>
      <span
        v-if="game"
        class="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
        :class="isHomeGame(game) ? 'bg-white text-[#032650]' : 'bg-blue-900 text-blue-100'"
      >
        {{ isHomeGame(game) ? 'Heim' : 'Auswärts' }}
      </span>
    </div>

    <template v-if="game">
      <div class="flex items-center gap-3">
        <img
          v-if="logoUrl(opponent(game))"
          :src="logoUrl(opponent(game))"
          alt=""
          class="w-12 h-12 object-contain bg-white rounded-full p-1.5 shrink-0"
        />
        <div class="min-w-0">
          <span class="block text-xs font-bold text-blue-200 uppercase tracking-wide">
            {{ isHomeGame(game) ? 'gegen' : 'bei' }}
          </span>
          <span class="block text-lg font-black leading-tight break-words">
            {{ opponent(game).full_name }}
          </span>
        </div>
      </div>
      <p class="text-sm font-medium text-gray-200">{{ formatGameDate(game) }}</p>
      <p class="text-xs font-bold uppercase tracking-widest text-blue-200">@ {{ game.venue }}</p>
      <a
        v-if="game.has_live_stream && game.live_stream_url"
        :href="game.live_stream_url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 self-start bg-white text-[#032650] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors"
      >
        <span class="text-rose-600" aria-hidden="true">●</span> Livestream
      </a>
    </template>

    <p v-else class="text-sm font-medium text-gray-300">Aktuell ist kein Spiel angesetzt.</p>
  </div>
</template>
