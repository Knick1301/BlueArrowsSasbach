<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed } from 'vue'
import { useLightbox } from '@/composables/useLightbox'

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
  story = await useStoryblok(`events/inlinedisco`, { version: STORYBLOK_VERSION })
} catch (e) {
  console.error('Storyblok-Story "events/inlinedisco" konnte nicht geladen werden.', e)
}

interface DiscoTermin {
  date: string
  title: string
  time?: string
}

const { open: openLightbox } = useLightbox()

const aktuelleTermine = computed(() => {
  if (!story?.value?.content?.dates) return []
  const jetzt = new Date().getTime()

  return [...(story.value.content.dates as DiscoTermin[])]
    .filter((termin) => new Date(termin.date).getTime() >= jetzt)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})
</script>

<template>
  <div class="mb-15">
    <div class="w-full py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">
        {{ story?.content.title || 'Inline Disco' }}
      </h1>
    </div>

    <div
      class="max-w-[1400px] w-[95%] mx-auto mt-15 px-4 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start"
    >
      <div class="w-full lg:hidden">
        <img
          v-if="story?.content.image?.filename"
          :src="story.content.image.filename"
          alt="Inline Disco"
          class="w-full h-[340px] sm:h-[420px] object-cover rounded-xl shadow-md border-2 border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
          @click="openLightbox(story.content.image.filename)"
        />
        <div
          v-else
          class="w-full h-[340px] sm:h-[420px] bg-gray-100 rounded-xl shadow-md border-2 border-gray-200 flex items-center justify-center text-gray-400 font-bold text-xl"
        >
          Hier kommt ein Bild hin
        </div>
      </div>

      <div class="w-full lg:w-2/5 h-full sticky top-32 hidden lg:block">
        <img
          v-if="story?.content.image?.filename"
          :src="story.content.image.filename"
          alt="Inline Disco"
          class="w-full h-[400px] lg:h-[600px] object-cover rounded-xl shadow-lg border-2 border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
          @click="openLightbox(story.content.image.filename)"
        />
        <div
          v-else
          class="w-full h-[400px] lg:h-[600px] bg-gray-100 rounded-xl shadow-lg border-2 border-gray-200 flex items-center justify-center text-gray-400 font-bold text-xl"
        >
          Hier kommt ein Bild hin
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
          class="text-[#032650] text-2xl 3xl:text-3xl font-black mt-0 uppercase text-center tracking-wide mb-4 border-b-[3px] border-[#032650] inline-block pb-1 mx-auto w-fit"
        >
          Disco auf Rollen
        </h2>

        <p
          class="mb-10 text-lg 2xl:text-xl font-medium text-gray-700 leading-relaxed text-center max-w-2xl mx-auto"
        >
          Wir verwandeln unsere Hockeyarena in eine rollende Tanzfläche – mit Musik, Licht und jeder
          Menge Spaß auf Rollen. Egal ob Anfänger oder alter Hase, für Jung und Alt ist bei unserer
          Inline Disco etwas dabei.
        </p>

        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 md:divide-x-2 md:divide-gray-200 border-t-2 border-gray-200 pt-8 mb-8"
        >
          <div class="md:pr-8">
            <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
              Programm
            </h3>
            <p class="text-gray-600 font-semibold mb-4">Musik, Licht & gute Laune</p>
            <p class="mb-5 md:mb-10 text-base font-medium text-gray-700 leading-relaxed">
              DJ, Discolicht und eine geräumige Fläche zum Skaten und Tanzen – bei uns kommt echtes
              Rollschuhdisco-Feeling auf.
            </p>
            <ul
              class="space-y-2 text-[#032650] font-bold text-base list-disc list-inside marker:text-[#032650]"
            >
              <li>DJ & Lichtshow</li>
              <li>Essen & Getränke vor Ort</li>
              <li>Für alle Alters- und Könnensstufen</li>
            </ul>
          </div>

          <div class="mt-6 md:mt-0 md:pl-8 flex flex-col h-full">
            <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
              Ausrüstung
            </h3>
            <p class="text-gray-600 font-semibold mb-4">Kein eigenes Equipment? Kein Problem</p>
            <p class="mb-5 text-base font-medium text-gray-700 leading-relaxed">
              Inliner und Schutzausrüstung können bei uns vor Ort ausgeliehen werden. Eigene Inliner
              sind natürlich auch jederzeit willkommen.
            </p>
            <div
              class="bg-blue-50 border-l-4 border-[#032650] p-4 rounded-xl text-[#032650] font-medium text-base mt-auto"
            >
              <span class="font-bold block mb-1">Nächste Termine:</span>

              <span v-if="aktuelleTermine.length > 0">
                <span
                  v-for="(termin, index) in aktuelleTermine"
                  :key="index"
                  class="block mb-2 border-b border-gray-200 pb-2 last:border-b-0"
                >
                  <span class="font-bold text-[#032650] block">
                    {{ termin.title }}
                  </span>
                  <span class="text-gray-600 block text-sm mt-1">
                    {{
                      new Date(termin.date).toLocaleDateString('de-DE', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                    }}
                    <span v-if="termin.time"> · {{ termin.time }} Uhr</span>
                  </span>
                </span>
              </span>

              <span v-else class="text-gray-600">
                Aktuell stehen keine neuen Termine fest. Schaut bald wieder vorbei!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
