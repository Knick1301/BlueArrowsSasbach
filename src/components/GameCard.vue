<script setup lang="ts">
defineProps<{
  date: string
  homeTeam: string
  awayTeam: string
  homelogo?: string
  awaylogo?: string
  venue?: string
  team: string
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
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-md h-full flex flex-col p-2 text-center transition-transform hover:scale-[1.01] border border-gray-50 overflow-hidden"
  >
    <div class="shrink-0">
      <span
        class="inline-block bg-[#eef4ff] text-[#032650] text-[0.6rem] sm:text-xs font-semibold px-2 py-0.5 rounded-full mb-1 border border-[#032650]/10"
      >
        {{ team }}
      </span>
    </div>

    <div class="flex-grow flex items-center justify-center gap-1 min-h-0">
      <div class="flex-1 min-w-0 flex flex-col items-center justify-center">
        <img
          v-if="homelogo"
          :src="homelogo"
          class="w-7 h-7 sm:w-8 sm:h-8 object-contain"
          alt="Home Logo"
        />
        <div
          class="text-[0.65rem] sm:text-[0.75rem] md:text-sm font-bold mt-0.5 line-clamp-2 leading-tight px-1"
        >
          {{ homeTeam }}
        </div>
      </div>

      <div class="text-[0.8rem] text-gray-400 font-bold shrink-0">vs</div>

      <div class="flex-1 min-w-0 flex flex-col items-center justify-center">
        <img
          v-if="awaylogo"
          :src="awaylogo"
          class="w-7 h-7 sm:w-8 sm:h-8 object-contain"
          alt="Away Logo"
        />
        <div
          class="text-[0.65rem] sm:text-[0.75rem] md:text-sm font-bold mt-0.5 line-clamp-2 leading-tight px-1"
        >
          {{ awayTeam }}
        </div>
      </div>
    </div>

    <div class="shrink-0 mt-1">
      <hr class="mb-2 border-gray-100" />
      <div
        class="text-[0.65rem] sm:text-[0.75rem] md:text-xs font-medium text-gray-800 whitespace-nowrap"
      >
        {{ formatDate(date) }} | {{ formatTime(date) }} Uhr
      </div>
      <div
        v-if="venue"
        class="text-[0.6rem] sm:text-[0.7rem] text-gray-500 mt-0.5 truncate w-full px-1"
      >
        {{ venue }}
      </div>
    </div>
  </div>
</template>
