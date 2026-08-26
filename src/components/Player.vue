<script setup lang="ts">
defineProps<{
  name: string
  position: string
  nummer: number | string
  bild?: string
  blok: any
}>()
</script>

<template>
  <div v-editable="blok"
    class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-4 flex flex-col items-center justify-center text-center h-full">
    <img v-if="bild" :src="bild" alt="Spielerbild" class="w-20 h-20 rounded-full object-cover mb-3" />

    <div v-else
      class="w-20 h-20 rounded-full mb-3 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-10 h-10">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    </div>

    <div class="text-[#032650] font-black text-xl mb-1">#{{ nummer }}</div>
    <div class="font-bold text-[#032650]">{{ name }}</div>
  </div>
</template>