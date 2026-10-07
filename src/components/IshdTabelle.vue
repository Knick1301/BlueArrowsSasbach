<script setup lang="ts">
import type { IshdPlacement, IshdTable } from '@/types/ishd'
import { isOurTeam, logoUrl } from '@/utils/ishd'

defineProps<{
  tables: IshdTable[]
  season?: number
  loading?: boolean
  error?: string | null
}>()

const wins = (row: IshdPlacement) => row.total.wins + row.total.wins_in_penalty_shoot_out
const losses = (row: IshdPlacement) => row.total.losses + row.total.losses_in_penalty_shoot_out
const hasTies = (table: IshdTable) => table.placements.some((row) => row.total.ties > 0)
</script>

<template>
  <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 h-auto flex flex-col">
    <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-2 h-6 bg-[#032650] rounded-full"></div>
        <h3 class="font-bold text-[#032650] uppercase tracking-widest text-sm">Ligatabelle</h3>
      </div>
      <span v-if="season" class="text-[13px] text-gray-600 font-bold uppercase tracking-tighter">
        Saison {{ season }}
      </span>
    </div>

    <p v-if="loading && !tables.length" class="py-12 text-center text-gray-400 text-xs">
      Tabelle wird geladen …
    </p>
    <p v-else-if="error && !tables.length" class="py-12 text-center text-gray-600 italic text-xs">
      {{ error }}
    </p>
    <p v-else-if="!tables.length" class="py-12 text-center text-gray-600 italic text-xs">
      Keine Tabelle vorhanden.
    </p>

    <div v-for="table in tables" :key="table.league.code" class="mb-6 last:mb-0">
      <h4
        v-if="tables.length > 1 || table.league.name"
        class="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3"
      >
        {{ table.league.name }}
      </h4>

      <div class="overflow-x-auto rounded-xl border border-gray-100">
        <table class="w-full text-sm text-left border-collapse">
          <thead
            class="bg-gray-50/80 text-[11px] text-gray-600 uppercase tracking-widest border-b border-gray-100"
          >
            <tr>
              <th class="px-2 sm:px-3 py-3 font-bold text-center w-10 sm:w-12">Pl.</th>
              <th class="px-2 sm:px-4 py-3 font-bold">Mannschaft</th>
              <th class="px-2 py-3 font-bold text-center">Sp</th>
              <th class="hidden sm:table-cell px-2 py-3 font-bold text-center">S</th>
              <th
                v-if="hasTies(table)"
                class="hidden sm:table-cell px-2 py-3 font-bold text-center"
              >
                U
              </th>
              <th class="hidden sm:table-cell px-2 py-3 font-bold text-center">N</th>
              <th class="px-2 sm:px-3 py-3 font-bold text-center">Tore</th>
              <th class="hidden sm:table-cell px-2 sm:px-3 py-3 font-bold text-center">Diff.</th>
              <th class="px-2 sm:px-4 py-3 font-bold text-center">Pkt</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="(row, index) in table.placements"
              :key="row.team.team_id"
              class="group transition-all duration-200"
              :class="isOurTeam(row.team) ? 'bg-blue-50 hover:bg-blue-100/70' : 'hover:bg-gray-50'"
            >
              <td
                class="px-2 sm:px-3 py-4 text-center font-bold text-gray-600 group-hover:text-[#032650]"
              >
                {{ index + 1 }}.
              </td>

              <td class="w-full max-w-0 sm:w-auto sm:max-w-none px-2 sm:px-4 py-4">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
                    <img
                      width="128"
                      height="128"
                      v-if="logoUrl(row.team)"
                      loading="lazy"
                      decoding="async"
                      :src="logoUrl(row.team)"
                      class="max-w-full max-h-full object-contain"
                      alt=""
                    />
                  </div>
                  <span
                    class="text-[#032650] min-w-0 text-xs sm:text-sm leading-tight break-words hyphens-auto"
                    :class="{ 'font-black': isOurTeam(row.team) }"
                  >
                    {{ row.team.full_name }}
                  </span>
                </div>
              </td>

              <td class="px-2 py-4 text-center text-gray-600 font-medium">{{ row.total.games }}</td>
              <td class="hidden sm:table-cell px-2 py-4 text-center text-gray-600">
                {{ wins(row) }}
              </td>
              <td
                v-if="hasTies(table)"
                class="hidden sm:table-cell px-2 py-4 text-center text-gray-600"
              >
                {{ row.total.ties }}
              </td>
              <td class="hidden sm:table-cell px-2 py-4 text-center text-gray-600">
                {{ losses(row) }}
              </td>
              <td
                class="px-2 sm:px-3 py-4 text-center text-gray-600 font-mono text-xs whitespace-nowrap"
              >
                {{ row.total.goals_for }}:{{ row.total.goals_against }}
              </td>
              <td
                class="hidden sm:table-cell px-2 sm:px-3 py-4 text-center font-bold"
                :class="
                  row.total.goals_difference > 0
                    ? 'text-emerald-700'
                    : row.total.goals_difference < 0
                      ? 'text-rose-600'
                      : 'text-gray-600'
                "
              >
                {{ row.total.goals_difference > 0 ? '+' : '' }}{{ row.total.goals_difference }}
              </td>
              <td class="px-2 sm:px-4 py-4 text-center">
                <div
                  class="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-colors font-black"
                  :class="
                    isOurTeam(row.team)
                      ? 'bg-[#032650] text-white'
                      : 'bg-gray-100 text-[#032650] group-hover:bg-[#032650] group-hover:text-white'
                  "
                >
                  {{ row.total.points }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
