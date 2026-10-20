<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useLightbox } from '@/composables/useLightbox'

const module = import.meta.glob<string>('@/assets/goat/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})
const bilder = Object.keys(module)
  .sort()
  .map((pfad) => ({ src: module[pfad]!, alt: 'Boris #18 und Yannick #11' }))

const { open: openLightbox } = useLightbox()

let robots: HTMLMetaElement | null = null
onMounted(() => {
  robots = document.createElement('meta')
  robots.name = 'robots'
  robots.content = 'noindex'
  document.head.appendChild(robots)
})
onBeforeUnmount(() => robots?.remove())
</script>

<template>
  <div class="flex-grow bg-white px-4 py-12 md:py-16">
    <div class="text-center">
      <h1 class="text-5xl md:text-7xl font-black text-[#032650] uppercase tracking-wide">
        GOAT Duo ?!
      </h1>
      <p
        class="mt-4 flex items-center justify-center gap-4 md:gap-6 font-jersey text-5xl md:text-7xl text-[#032650] leading-none">
        <span>#18</span>
        <span class="text-4xl md:text-6xl">&amp;</span>
        <span>#11</span>
      </p>
      <p class="mt-4 text-5xl md:text-6xl animate-pulse" aria-hidden="true">💙</p>
    </div>

    <div class="max-w-6xl mx-auto mt-10 columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
      <button v-for="(bild, index) in bilder" :key="bild.src" type="button"
        class="block w-full mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-xl shadow-md cursor-pointer group"
        @click="openLightbox(bilder, index)">
        <img :src="bild.src" :alt="bild.alt" loading="lazy" decoding="async"
          class="w-full h-auto transition-transform duration-300 group-hover:scale-105"
          :class="index % 2 ? 'md:rotate-1' : 'md:-rotate-1'" />
      </button>
    </div>

    <div class="text-center mt-10">
      <router-link :to="{ name: 'teams', params: { teamName: 'herren' } }"
        class="text-sm font-bold text-gray-400 hover:text-[#032650] transition-colors">
        &larr; Zurück
      </router-link>
    </div>
  </div>
</template>
