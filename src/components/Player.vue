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
  <div v-editable="blok" class="relative rounded-xl overflow-hidden bg-[#032650] shadow-sm aspect-[3/4]">
    <img v-if="bild" :src="bild" alt="Spielerbild" class="absolute inset-0 w-full h-full object-cover object-top" />

    <div v-else class="absolute inset-0 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
        stroke="currentColor" class="w-16 h-16 text-blue-200/30">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    </div>

    <span class="absolute top-2 left-2 text-white font-jersey font-black leading-none text-3xl sm:text-4xl"
      style="text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
      {{ nummer }}
    </span>

    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#032650] via-[#032650]/85 to-transparent px-2.5 pt-8 pb-2.5">
      <p class="text-white font-black uppercase tracking-wide leading-tight text-sm w-full min-w-0 break-words">
        {{ name }}
      </p>
    </div>
  </div>
</template>
