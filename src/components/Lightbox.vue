<script setup lang="ts">
import { useLightbox } from '@/composables/useLightbox'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'

const { images, currentIndex, isOpen, close, next, prev } = useLightbox()

const currentImage = computed(() => images.value[currentIndex.value])
const hasMultiple = computed(() => images.value.length > 1)

const onKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowRight' && hasMultiple.value) next()
  if (e.key === 'ArrowLeft' && hasMultiple.value) prev()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

watch(isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[2000] bg-black/90 flex items-center justify-center px-4 py-14 md:py-10"
      @click.self="close"
    >
      <button
        @click="close"
        aria-label="Schließen"
        class="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      <button
        v-if="hasMultiple"
        @click.stop="prev"
        aria-label="Vorheriges Bild"
        class="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <img
        v-if="currentImage"
        :src="currentImage.src"
        :alt="currentImage.alt || ''"
        class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        @click.stop
      />

      <button
        v-if="hasMultiple"
        @click.stop="next"
        aria-label="Nächstes Bild"
        class="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div
        v-if="hasMultiple"
        class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-bold tabular-nums bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full"
      >
        {{ currentIndex + 1 }}/{{ images.length }}
      </div>
    </div>
  </Teleport>
</template>
