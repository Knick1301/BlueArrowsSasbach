<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resizeImage } from '@/utils/methods.ts'
import HallOfFameModal, { type HallOfFamer } from '@/components/HallOfFameModal.vue'

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
  story = await useStoryblok(`historie/hall-of-fame`, { version: STORYBLOK_VERSION })
} catch (e) {
  console.error('Storyblok-Story "historie/hall-of-fame" konnte nicht geladen werden.', e)
}

const personen = computed(
  () => (story?.value?.content.personen as HallOfFamer[] | undefined) ?? [],
)

// Teilbarer Link: /historie/hall-of-fame?legende=stephan-kistner
const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const route = useRoute()
const router = useRouter()

const activeIndex = computed(() =>
  personen.value.findIndex((p) => slugify(p.name) === route.query.legende),
)
const activePerson = computed(() => personen.value[activeIndex.value])

const openPerson = (index: number) => {
  const person = personen.value[index]
  if (person) router.replace({ query: { ...route.query, legende: slugify(person.name) } })
}
const closePerson = () => {
  const query = { ...route.query }
  delete query.legende
  router.replace({ query })
}
const step = (dir: 1 | -1) =>
  openPerson((activeIndex.value + dir + personen.value.length) % personen.value.length)
</script>

<template>
  <div class="mb-15">
    <div class="w-full py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">
        {{ story?.content.title || 'Hall of Fame' }}
      </h1>
    </div>

    <div class="max-w-6xl w-[95%] mx-auto mt-15 px-4">
      <div
        class="relative w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6 px-4 md:px-6 md:p-10 text-gray-800">
        <div
          class="absolute -top-2 -left-2 w-6 h-6 border-t-[3px] border-l-[3px] border-[#032650] rounded-tl-md pointer-events-none">
        </div>
        <div
          class="absolute -top-2 -right-2 w-6 h-6 border-t-[3px] border-r-[3px] border-[#032650] rounded-tr-md pointer-events-none">
        </div>
        <div
          class="absolute -bottom-2 -left-2 w-6 h-6 border-b-[3px] border-l-[3px] border-[#032650] rounded-bl-md pointer-events-none">
        </div>
        <div
          class="absolute -bottom-2 -right-2 w-6 h-6 border-b-[3px] border-r-[3px] border-[#032650] rounded-br-md pointer-events-none">
        </div>

        <h2 class="text-[#032650] text-2xl font-black mt-0 uppercase tracking-wide mb-4 text-center">
          <span class="inline-block border-b-[3px] border-[#032650] pb-1">Unsere Legenden</span>
        </h2>

        <p class="mb-10 text-lg 2xl:text-xl font-medium text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
          {{
            story?.content.intro ||
            `Menschen, die sich in besonderer Weise um die Blue Arrows Sasbach
          verdient gemacht haben – auf dem Feld, an der Bande und im Verein.`
          }}
        </p>

        <div v-if="personen.length" class="flex flex-wrap justify-center gap-10">
          <button
            v-for="(person, index) in personen"
            :key="person._uid"
            type="button"
            class="relative w-full max-w-70 sm:w-50 text-left cursor-pointer group"
            @click="openPerson(index)"
          >
            <div
              class="absolute -top-2 -left-2 w-5 h-5 border-t-[3px] border-l-[3px] border-[#B8860B] rounded-tl-md pointer-events-none z-10">
            </div>
            <div
              class="absolute -bottom-2 -right-2 w-5 h-5 border-b-[3px] border-r-[3px] border-[#B8860B] rounded-br-md pointer-events-none z-10">
            </div>

            <div
              class="h-full bg-[#032650] rounded-xl overflow-hidden flex flex-col group-hover:-translate-y-1 group-hover:shadow-md transition-all">
              <div class="relative w-full aspect-[8/10]">
                <img loading="lazy" decoding="async" v-if="person.image?.filename"
                  :src="resizeImage(person.image.filename, 500)" :alt="person.name"
                  class="absolute inset-0 w-full h-full object-cover object-center group-hover:opacity-90 transition-opacity" />
                <div v-else class="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-16 h-16 text-blue-200/30">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <span v-if="person.nummer"
                  class="absolute bottom-1 left-2 text-white font-jersey font-black leading-none text-6xl"
                  style="text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5)">
                  {{ person.nummer }}
                </span>
              </div>

              <div class="flex-1 bg-[#032650] flex flex-col px-3 py-3 gap-1">
                <p class="text-sm font-black text-white uppercase tracking-wide leading-tight">
                  {{ person.name }}
                </p>
                <p v-if="person.rolle" class="text-xs font-bold text-amber-300 uppercase tracking-wide leading-tight">
                  {{ person.rolle }}
                </p>
                <p v-if="person.zeitraum" class="text-xs text-blue-200 font-bold">
                  {{ person.zeitraum }}
                </p>
                <span
                  class="mt-auto pt-2 flex items-center gap-1 text-xs font-bold text-white/80 group-hover:text-white uppercase tracking-wide">
                  Mehr lesen
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                    stroke="currentColor" class="w-3 h-3 group-hover:translate-x-0.5 transition-transform">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </span>
              </div>
            </div>
          </button>
        </div>

        <div v-else
          class="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4 py-12">
          Hier entstehen die ersten Mitglieder der Hall of Fame
        </div>
      </div>
    </div>

    <HallOfFameModal v-if="activePerson" :person="activePerson" :has-multiple="personen.length > 1"
      @close="closePerson" @next="step(1)" @prev="step(-1)" />
  </div>
</template>
