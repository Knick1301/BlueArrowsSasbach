<script setup lang="ts">
defineProps<{
  date: string
  homeTeam: string
  awayTeam: string
  homeLogo?: string
  awayLogo?: string
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
    class="bg-white rounded-xl shadow-md h-full flex flex-col p-2 text-center transition-transform hover:scale-[1.01] border border-gray-50 overflow-hidden">
    <div class="shrink-0 relative flex items-start justify-center min-h-[1.75rem]">
      <span
        class="inline-block bg-[#eef4ff] text-[#032650] text-[0.8rem] lg:text-xs font-semibold px-2 py-0.5 rounded-full mb-1 border border-[#032650]/10">
        {{ team }}
      </span>

      <span
        v-if="homeTeam.toLowerCase().includes('sasbach') || homeTeam.toLowerCase().includes('blue arrows') || homeTeam.toLowerCase().includes('bas')"
        class="absolute top-0 right-0 inline-block bg-[#032650] text-white text-[0.8rem] xl:text-[0.7rem] font-bold px-2 py-0.5 rounded-full border border-emerald-600/25">
        Heim
      </span>
    </div>

    <div class="flex-grow flex items-center justify-center gap-1 min-h-0">
      <div class="flex-1 min-w-0 flex flex-col items-center justify-center">
        <img v-if="homeLogo" :src="homeLogo" class="w-10 h-10 lg:w-12 lg:h-12 object-contain" alt="Home Logo" />
        <div class="text-[0.85rem] lg:text-sm font-bold mt-1 line-clamp-2 leading-tight px-1">
          {{ homeTeam }}
        </div>
      </div>

      <div class="text-[0.8rem] lg:text-sm text-gray-400 font-bold shrink-0">vs</div>

      <div class="flex-1 min-w-0 flex flex-col items-center justify-center">
        <img v-if="awayLogo" :src="awayLogo" class="w-10 h-10 lg:w-12 lg:h-12 object-contain" alt="Away Logo" />
        <div class="text-[0.85rem] lg:text-sm font-bold mt-1 line-clamp-2 leading-tight px-1">
          {{ awayTeam }}
        </div>
      </div>
    </div>

    <div class="shrink-0 mt-1">
      <hr class="mb-2 border-gray-100" />
      <div class="text-[0.8rem] lg:text-[0.85rem] font-medium text-gray-800 whitespace-nowrap">
        {{ formatDate(date) }} | {{ formatTime(date) }} Uhr
      </div>
      <div v-if="venue" class="text-[0.8rem] lg:text-[0.8rem] text-gray-500 mt-0.5 truncate w-full font-medium px-1">
        {{ venue }}
      </div>
    </div>
  </div>
</template>