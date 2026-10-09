<script setup lang="ts">
import { resizeImage } from '@/utils/methods.ts'
import { useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed } from 'vue'
import KontaktBlock from '@/components/KontaktBlock.vue'
import { useDaniel } from '@/utils/kontakt'
import { useLightbox } from '@/composables/useLightbox'

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
  story = await useStoryblok(`events/burgerista`, { version: STORYBLOK_VERSION })
} catch (e) {
  console.error('Storyblok-Story "events/burgerista" konnte nicht geladen werden.', e)
}

const daniel = await useDaniel()

const { open: openLightbox } = useLightbox()

const aktuelleTermine = computed(() => {
  if (!story?.value?.content?.dates) return []
  const jetzt = new Date().getTime()

  return [...story.value.content.dates]
    .filter((termin: { datum: string }) => new Date(termin.datum).getTime() >= jetzt)
    .sort(
      (a: { datum: string }, b: { datum: string }) =>
        new Date(a.datum).getTime() - new Date(b.datum).getTime(),
    )
})
</script>

<template>
  <div class="mb-15">
    <div class="w-full py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">
        {{ story?.content.title || '#Blueburgerista' }}
      </h1>
    </div>

    <div
      class="max-w-[1400px] w-[95%] mx-auto mt-15 px-4 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start"
    >
      <div class="w-full lg:hidden">
        <img
          v-if="story?.content.bild?.filename"
          :src="resizeImage(story.content.bild.filename, 1000)"
          alt="Blueburgerista Burger"
          class="w-full h-[340px] sm:h-[420px] object-cover rounded-xl shadow-md border-2 border-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
          @click="openLightbox(story.content.bild.filename)"
        />

        <div
          v-else
          class="w-full h-[340px] sm:h-[420px] bg-gray-100 rounded-xl shadow-md border-2 border-gray-200 flex items-center justify-center text-gray-400 font-bold text-xl"
        >
          Hier kommt das Burger-Bild hin
        </div>
      </div>

      <div
        class="relative w-full lg:w-3/5 bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-10 text-gray-800 flex flex-col h-full"
      >
        <div
          class="absolute -top-2 -left-2 w-6 h-6 border-t-[3px] border-l-[3px] border-[#032650] rounded-tl-md pointer-events-none"
        ></div>
        <div
          class="absolute -top-2 -right-2 w-6 h-6 border-t-[3px] border-r-[3px] border-[#032650] rounded-tr-md pointer-events-none"
        ></div>
        <div
          class="absolute -bottom-2 -left-2 w-6 h-6 border-b-[3px] border-l-[3px] border-[#032650] rounded-bl-md pointer-events-none"
        ></div>
        <div
          class="absolute -bottom-2 -right-2 w-6 h-6 border-b-[3px] border-r-[3px] border-[#032650] rounded-br-md pointer-events-none"
        ></div>

        <h2
          class="text-[#032650] text-3xl font-black mt-0 uppercase tracking-wide mb-4 border-b-[3px] border-[#032650] inline-block pb-1 w-fit"
        >
          Unser Burger Catering
        </h2>

        <p class="mb-6 text-lg font-medium text-gray-700 leading-relaxed">
          <span class="font-bold text-[#032650]">#Blueburgerista</span> ist die eigens geschaffene
          Marke der Blue Arrows Sasbach, unter welcher wir euch während diversen Veranstaltungen mit
          feinsten Burgern verwöhnen möchten.
        </p>

        <p class="mb-8 text-lg font-medium text-gray-700 leading-relaxed">
          Egal ob bei unseren Heimspielen, auf lokalen Märkten oder für dein eigenes Event gemietet
          – wir bringen den Geschmack direkt zu euch!
        </p>

        <div class="mb-6 bg-[#032650] text-white rounded-xl shadow-sm p-5">
          <h3 class="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">
            Nächste Einsatztermine
          </h3>
          <div v-if="aktuelleTermine.length > 0">
            <div
              v-for="(termin, index) in aktuelleTermine"
              :key="index"
              class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-6 py-3 border-b border-white/15 last:border-b-0 last:pb-0"
            >
              <span class="text-white font-bold shrink-0 text-lg">
                {{
                  new Date(termin.datum).toLocaleDateString('de-DE', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                }}
              </span>
              <span class="text-blue-100 font-medium sm:text-right min-w-0 sm:flex-1">
                <span v-if="termin.uhrzeit" class="inline-flex items-center gap-1"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-4 h-4 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    /></svg
                  >{{ termin.uhrzeit }}</span
                >
                <span v-if="termin.uhrzeit && termin.standort"> · </span>
                <span v-if="termin.standort" class="inline-flex items-center gap-1"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-4 h-4 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    /></svg
                  >{{ termin.standort }}</span
                >
              </span>
            </div>
          </div>

          <p v-else class="text-blue-100 font-medium">
            Aktuell stehen keine neuen Termine fest. Schaut bald wieder vorbei!
          </p>
        </div>

        <div class="mt-auto">
          <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-2">Kontakt</h3>
          <p class="text-gray-600 font-medium mb-5">
            Interesse an einem Catering für dein Event? Einfach unverbindlich anfragen:
          </p>

          <KontaktBlock :person="daniel" />
        </div>
      </div>

      <div class="w-full lg:w-2/5 h-full sticky top-32 hidden lg:block">
        <img
          v-if="story?.content.bild?.filename"
          :src="resizeImage(story.content.bild.filename, 1000)"
          alt="Blueburgerista Burger"
          class="w-full h-[400px] lg:h-[600px] object-cover rounded-xl shadow-xl border-2 border-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
          @click="openLightbox(story.content.bild.filename)"
        />

        <div
          v-else
          class="w-full h-[400px] lg:h-[600px] bg-gray-100 rounded-xl shadow-xl border-2 border-gray-200 flex items-center justify-center text-gray-400 font-bold text-xl"
        >
          Hier kommt das Burger-Bild hin
        </div>
      </div>
    </div>
  </div>
</template>
