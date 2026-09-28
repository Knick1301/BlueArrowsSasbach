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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-3.5 h-3.5 text-gray-400"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 2.714A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                      />
                    </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-7 h-7 text-gray-300"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                Keine Daten vorhanden.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
