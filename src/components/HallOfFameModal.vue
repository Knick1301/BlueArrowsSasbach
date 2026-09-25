<script setup lang="ts">
import { renderRichText, type StoryblokRichTextNode } from '@storyblok/vue'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { resizeImage } from '@/utils/methods.ts'

export interface HallOfFamer {
  _uid: string
  component: string
  name: string
  nummer?: string
  rolle?: string
  zeitraum?: string
  image?: { filename: string }

  wuerdigung?: string | StoryblokRichTextNode
}

const props = defineProps<{ person: HallOfFamer; hasMultiple: boolean }>()
const emit = defineEmits<{ close: []; next: []; prev: [] }>()

const wuerdigungHtml = computed(() =>
  typeof props.person.wuerdigung === 'object' ? renderRichText(props.person.wuerdigung) : '',
)
const wuerdigungText = computed(() =>
  typeof props.person.wuerdigung === 'string' ? props.person.wuerdigung.trim() : '',
)

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowRight' && props.hasMultiple) emit('next')
  if (e.key === 'ArrowLeft' && props.hasMultiple) emit('prev')
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
watch(
  () => props.person._uid,
  () => document.querySelector('.hof-modal-text')?.scrollTo({ top: 0 }),
)
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[2000] bg-black/80 flex items-center justify-center px-4 py-6 md:py-10"
      @click.self="emit('close')">
      <div
        class="relative w-full max-w-4xl max-h-full bg-[#032650] rounded-xl overflow-y-auto md:overflow-hidden flex flex-col md:flex-row shadow-2xl"
        role="dialog" aria-modal="true" :aria-label="person.name">
        <button @click="emit('close')" aria-label="Schließen"
          class="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="relative shrink-0 w-full md:w-2/5 aspect-[8/10]">
          <img v-if="person.image?.filename" :src="resizeImage(person.image.filename, 900)" :alt="person.name"
            class="absolute inset-0 w-full h-full object-cover object-center" />
          <div v-else class="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-24 h-24 text-blue-200/30">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <span v-if="person.nummer"
            class="absolute bottom-2 left-3 text-white font-jersey font-black leading-none text-7xl md:text-8xl"
            style="text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5)">
            {{ person.nummer }}
          </span>
        </div>

        <div class="relative flex-1 shrink-0 md:shrink md:min-h-0 md:min-w-0 flex flex-col">
          <div class="md:absolute md:inset-0 flex flex-col">
            <div class="hof-modal-text md:flex-1 md:min-h-0 md:overflow-y-auto px-6 pt-6 md:px-8 md:pt-8 pb-4">
              <p class="text-2xl md:text-3xl font-black text-white uppercase tracking-wide leading-tight pr-10">
                {{ person.name }}
              </p>
              <p v-if="person.rolle" class="mt-2 text-sm font-bold text-amber-300 uppercase tracking-wide">
                {{ person.rolle }}
              </p>
              <p v-if="person.zeitraum" class="mt-1 text-sm text-blue-200 font-bold">
                {{ person.zeitraum }}
              </p>

              <div class="w-12 border-t-[3px] border-[#B8860B] my-5"></div>

              <div v-if="wuerdigungHtml" class="prose prose-invert max-w-none text-blue-50 leading-relaxed"
                v-html="wuerdigungHtml"></div>
              <p v-else-if="wuerdigungText" class="text-blue-50 leading-relaxed whitespace-pre-line">
                {{ wuerdigungText }}
              </p>
              <p v-else class="text-blue-200/60 italic">Die Würdigung folgt in Kürze.</p>
            </div>

            <div v-if="hasMultiple"
              class="shrink-0 flex justify-between gap-3 px-6 md:px-8 py-4 border-t border-white/10">
              <button @click="emit('prev')"
                class="flex items-center gap-1 text-sm font-bold text-blue-200 hover:text-white transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                  stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Vorherige
              </button>
              <button @click="emit('next')"
                class="flex items-center gap-1 text-sm font-bold text-blue-200 hover:text-white transition-colors cursor-pointer">
                Nächste
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                  stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
