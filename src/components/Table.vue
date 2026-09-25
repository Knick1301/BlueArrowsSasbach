<script setup lang="ts">
import { computed } from 'vue'

interface TableBlok {
  _uid: string
  component: 'table'
  team: string
  logo?: { filename: string }
  points: number
  goalDifference: number
  gamesPlayed: number
  wins: number
  losses: number
  draws: number
  goals: string
}

const props = defineProps<{
  teams: TableBlok[]
}>()

const sortedTable = computed(() => {
  return [...props.teams].sort((a, b) => b.points - a.points)
})
</script>

<template>
  <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 h-auto flex flex-col">
    <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-2 h-6 bg-[#032650] rounded-full"></div>
        <h3 class="font-bold text-[#032650] uppercase tracking-widest text-sm">Ligatabelle</h3>
      </div>
      <span class="text-[13px] text-gray-500 font-bold uppercase tracking-tighter"
        >Saison 2026</span
      >
    </div>

    <div class="overflow-x-auto rounded-xl border border-gray-100 flex-grow">
      <table class="w-full text-sm text-left border-collapse">
        <thead
          class="bg-gray-50/80 text-[11px] text-gray-500 uppercase tracking-widest border-b border-gray-100"
        >
          <tr>
            <th class="px-2 sm:px-3 py-3 font-bold text-center w-10 sm:w-12">Pos.</th>
            <th class="px-2 sm:px-4 py-3 font-bold">Mannschaft</th>
            <th class="px-2 py-3 font-bold text-center">Sp</th>
            <th class="hidden sm:table-cell px-2 py-3 font-bold text-center">G</th>
            <th class="hidden sm:table-cell px-2 py-3 font-bold text-center">U</th>
            <th class="hidden sm:table-cell px-2 py-3 font-bold text-center">V</th>
            <th class="hidden sm:table-cell px-3 py-3 font-bold text-center">Tore</th>
            <th class="hidden min-[370px]:table-cell px-2 sm:px-3 py-3 font-bold text-center">
              Diff.
            </th>
            <th class="px-2 sm:px-4 py-3 font-bold text-center">Pkt</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr
            v-for="(row, index) in sortedTable"
            :key="row._uid"
            v-editable="row"
            class="group transition-all duration-200"
            :class="[
              row.team.toLowerCase().includes('blue arrows')
                ? 'bg-blue-50/50 hover:bg-blue-50'
                : 'hover:bg-gray-50',
            ]"
          >
            <td
              class="px-2 sm:px-3 py-4 text-center font-bold text-gray-500 group-hover:text-[#032650]"
            >
              {{ index + 1 }}.
            </td>

            <td class="w-full max-w-0 sm:w-auto sm:max-w-none px-2 sm:px-4 py-4">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
                  <img
                    loading="lazy"
                    decoding="async"
                    v-if="row.logo?.filename"
                    :src="row.logo.filename"
                    class="max-w-full max-h-full object-contain"
                    alt="Logo"
                  />
                  <div
                    v-else
                    class="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
                  >
                    <i class="fa-solid fa-shield text-[10px] text-gray-300"></i>
                  </div>
                </div>
                <span
                  class="text-[#032650] min-w-0 text-xs sm:text-sm leading-tight break-words hyphens-auto sm:whitespace-nowrap sm:truncate sm:max-w-[120px] lg:max-w-full"
                  :class="{ 'font-black': row.team.toLowerCase().includes('blue arrows') }"
                >
                  {{ row.team }}
                </span>
              </div>
            </td>

            <td class="px-2 py-4 text-center text-gray-500 font-medium">{{ row.gamesPlayed }}</td>
            <td class="hidden sm:table-cell px-2 py-4 text-center text-gray-500">{{ row.wins }}</td>
            <td class="hidden sm:table-cell px-2 py-4 text-center text-gray-500">
              {{ row.draws }}
            </td>
            <td class="hidden sm:table-cell px-2 py-4 text-center text-gray-500">
              {{ row.losses }}
            </td>
            <td class="hidden sm:table-cell px-3 py-4 text-center text-gray-500 font-mono text-xs">
              {{ row.goals }}
            </td>

            <td
              class="hidden min-[370px]:table-cell px-2 sm:px-3 py-4 text-center font-bold"
              :class="[
                row.goalDifference > 0
                  ? 'text-emerald-700'
                  : row.goalDifference < 0
                    ? 'text-rose-600'
                    : 'text-gray-500',
              ]"
            >
              {{ row.goalDifference > 0 ? '+' : '' }}{{ row.goalDifference }}
            </td>

            <td class="px-2 sm:px-4 py-4 text-center">
              <div
                class="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 group-hover:bg-[#032650] group-hover:text-white transition-colors font-black text-[#032650]"
              >
                {{ row.points }}
              </div>
            </td>
          </tr>

          <tr v-if="!sortedTable.length">
            <td colspan="9" class="px-4 py-12 text-center text-gray-500 italic text-xs">
              <div class="flex flex-col items-center gap-2">
                <i class="fa-solid fa-list-ol text-2xl text-gray-200"></i>
                Keine Daten vorhanden.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
