<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  position: string
  nummer: number | string
  bild?: string
  blok: any
}>()

const nameParts = computed(() => {
  const parts = props.name.trim().split(/\s+/)
  const vorname = parts[0] ?? ''
  const nachname = parts.slice(1).join(' ') || vorname
  return { vorname, nachname }
})
</script>

<template>
  <div v-editable="blok" class="@container relative rounded-xl overflow-hidden bg-[#032650] shadow-sm aspect-[3/4]">
    <img v-if="bild" :src="bild" alt="Spielerbild" class="absolute inset-0 w-full h-full object-cover object-top" />

    <div v-else class="absolute inset-0 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-16 h-16 text-blue-200/30">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    </div>

    <span
      class="absolute top-3 left-3 @[175px]:top-4 @[175px]:left-4 text-white font-jersey font-black leading-none text-4xl @[175px]:text-5xl tracking-wide"
      style="text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
      {{ nummer }}
    </span>

    <div
      class="absolute inset-x-0 bottom-0 min-h-[68px] @[175px]:min-h-[120px] rounded-b-xl bg-gradient-to-t from-[#032650] via-[#032650]/45 to-transparent pointer-events-none">
    </div>

    <div
      class="absolute inset-x-0 bottom-0 h-[46px] @[130px]:h-[56px] @[160px]:h-[66px] @[200px]:h-[80px] @[240px]:h-[96px] rounded-b-xl backdrop-blur-[1px] pointer-events-none"
      style="mask-image: linear-gradient(to top, black 55%, transparent 100%); -webkit-mask-image: linear-gradient(to top, black 55%, transparent 100%);">
    </div>

    <div
      class="absolute inset-x-0 bottom-0 flex flex-col justify-end gap-0.5 min-h-[68px] @[175px]:min-h-[120px] px-2.5 @[175px]:px-4 pt-1.5 @[130px]:pt-2 @[160px]:pt-2.5 @[200px]:pt-3 @[240px]:pt-4 pb-2 @[130px]:pb-2.5 @[160px]:pb-3.5 @[200px]:pb-4.5 @[240px]:pb-5.5">
      <p class="text-white font-black uppercase tracking-wide leading-tight text-xs @[130px]:text-sm @[160px]:text-base @[200px]:text-xl @[240px]:text-2xl w-full min-w-0 break-words"
        style="text-shadow: 0 1px 8px rgba(0,0,0,0.85);">
        {{ nameParts.nachname }}
      </p>
      <p class="text-white font-semibold leading-tight text-[10px] @[130px]:text-xs @[160px]:text-sm @[200px]:text-base @[240px]:text-lg w-full min-w-0 break-words"
        style="text-shadow: 0 1px 8px rgba(0,0,0,0.85);">
        {{ nameParts.vorname }}
      </p>
    </div>
  </div>
</template>
