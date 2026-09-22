<script setup lang="ts">
import { computed } from 'vue'
import { resizeImage } from '@/utils/methods.ts'
import { useLightbox } from '@/composables/useLightbox'

const props = defineProps<{
  name: string
  position: string
  nummer: number | string
  bild?: string
  blok: object
}>()

const nameParts = computed(() => {
  const parts = props.name.trim().split(/\s+/)
  const vorname = parts[0] ?? ''
  const nachname = parts.slice(1).join(' ') || vorname
  return { vorname, nachname }
})

const { open: openLightbox } = useLightbox()
</script>

<template>
  <div
    v-editable="blok"
    class="@container relative rounded-xl overflow-hidden bg-[#032650] shadow-sm aspect-[3/4]"
  >
    <img
      v-if="bild"
      loading="lazy"
      decoding="async"
      :src="resizeImage(bild, 600)"
      alt="Spielerbild"
      class="absolute inset-0 w-full h-full object-cover object-top cursor-pointer"
      @click="openLightbox({ src: resizeImage(bild, 1200), alt: name })"
    />

    <div v-else class="absolute inset-0 flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-16 h-16 text-blue-200/30"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    </div>

    <span
      class="absolute top-[6cqw] left-[6cqw] text-white font-jersey font-black leading-none text-[length:28cqw] tracking-wide"
      style="text-shadow: 0 1cqw 5cqw rgba(0, 0, 0, 0.5)"
    >
      {{ nummer }}
    </span>

    <div
      class="absolute inset-x-0 bottom-0 flex flex-col justify-end gap-[0.5cqw] px-[7cqw] pt-[8cqw] pb-[6cqw]"
    >
      <div
        class="absolute inset-0 rounded-b-xl bg-gradient-to-t from-[#032650] via-[#032650]/60 to-transparent pointer-events-none"
      ></div>

      <div
        class="absolute inset-0 rounded-b-xl pointer-events-none"
        style="
          backdrop-filter: blur(1.5cqw);
          -webkit-backdrop-filter: blur(1.5cqw);
          mask-image: linear-gradient(to top, black 40%, transparent 100%);
          -webkit-mask-image: linear-gradient(to top, black 40%, transparent 100%);
        "
      ></div>

      <p
        class="relative text-white font-black uppercase tracking-wide leading-tight text-[length:10cqw] w-full min-w-0 break-words"
        style="text-shadow: 0 0.5cqw 4cqw rgba(0, 0, 0, 0.85)"
      >
        {{ nameParts.nachname }}
      </p>
      <p
        class="relative text-white font-semibold leading-tight text-[length:7.5cqw] w-full min-w-0 break-words"
        style="text-shadow: 0 0.5cqw 4cqw rgba(0, 0, 0, 0.85)"
      >
        {{ nameParts.vorname }}
      </p>
    </div>
  </div>
</template>
