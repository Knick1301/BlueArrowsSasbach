<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import DecoratedCard from '@/components/DecoratedCard.vue'
import PersonCard from '@/components/PersonCard.vue'

interface KontaktpersonBlok {
  _uid: string
  component: string
  name: string
  role?: string
  categorie: 'vorstand' | 'sonstiges'
  image?: { filename: string }
  email?: string
  phone?: string
}

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
  story = await useStoryblok(`verein/kontakt`, { version: STORYBLOK_VERSION })
} catch (e) {
  console.error('Storyblok-Story "verein/kontakt" konnte nicht geladen werden.', e)
}

const route = useRoute()

const scrollToHash = async () => {
  if (!route.hash) return
  await nextTick()
  document.querySelector(route.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(scrollToHash)
watch(() => route.hash, scrollToHash)

const ansprechpartner = computed(
  () => (story?.value?.content.kontakt as KontaktpersonBlok[] | undefined) ?? [],
)
const vorstand = computed(() => ansprechpartner.value.filter((p) => p.categorie === 'vorstand'))
const weitereAnsprechpartner = computed(() =>
  ansprechpartner.value.filter((p) => p.categorie === 'sonstiges'),
)

const address = computed(
  () => story?.value?.content.address || 'Sasbachrieder Str. 93, 77880 Sasbach',
)
const email = computed(() => story?.value?.content.email || 'info@bluearrows.de')
const phone = computed(() => story?.value?.content.phone || '')
const mapsUrl = computed(
  () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.value)}`,
)
</script>

<template>
  <div class="mb-15">
    <div class="w-full py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">
        {{ story?.content.title || 'Kontakt' }}
      </h1>
    </div>

    <div class="max-w-6xl w-[95%] mx-auto mt-15 px-5">
      <DecoratedCard content-class="p-6 px-4 md:p-10 md:px-6">
        <h2
          class="text-[#032650] text-2xl 3xl:text-3xl font-black mt-0 uppercase tracking-wide mb-4 text-center"
        >
          <span class="inline-block border-b-[3px] border-[#032650] pb-1">So erreichst du uns</span>
        </h2>

        <p
          class="mb-10 text-lg 2xl:text-xl font-medium text-gray-700 leading-relaxed text-center max-w-2xl mx-auto"
        >
          {{
            story?.content.intro ||
            `Du hast eine Frage, möchtest mit dem Verein in Kontakt treten oder
                    suchst einen bestimmten Ansprechpartner? Hier findest du alle wichtigen Kontaktmöglichkeiten der
                    Blue Arrows Sasbach.`
          }}
        </p>

        <div class="pt-2">
          <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-5 text-center">
            Anschrift
          </h3>

          <p
            class="block mb-6 text-lg 2xl:text-xl font-medium text-gray-700 leading-relaxed text-center w-fit mx-auto"
          >
            Sasbachrieder Str. 93, 77880 Sasbach
          </p>

          <a :href="mapsUrl" target="_blank" class="block w-150 max-w-full mx-auto group">
            <div class="relative">
              <img
                v-if="story?.content.mapsImage?.filename"
                :src="story.content.mapsImage.filename"
                alt="Luftbild Vereinsstätte Blue Arrows Sasbach"
                class="w-full h-64 object-cover rounded-xl border-2 border-gray-200 shadow-sm group-hover:opacity-90 transition-opacity"
              />
              <div
                v-else
                class="w-full h-64 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4"
              >
                Hier kommt ein Kartenausschnitt hin
              </div>
              <span
                class="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#032650] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="w-4 h-4 shrink-0"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                Maps
              </span>
            </div>
            <p class="mt-1.5 text-[11px] text-gray-400 text-center">
              Datenquelle: LGL, www.lgl-bw.de
            </p>
          </a>
        </div>

        <div class="border-t-2 border-gray-200 mt-10 lg:mt-15 pt-8">
          <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-5">
            E-Mail &amp; Telefon
          </h3>

          <div class="bg-[#004a87] text-white rounded-xl p-6 md:p-8 text-center">
            <p class="mb-6 font-medium leading-relaxed max-w-xl mx-auto">
              Wir freuen uns über jede Nachricht – egal ob Frage, Anregung oder Anliegen.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                :href="`mailto:${email}`"
                class="inline-block bg-white text-[#032650] px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors text-sm"
              >
                {{ email }}
              </a>
              <a
                v-if="phone"
                :href="`tel:${phone}`"
                class="inline-block bg-white text-[#032650] px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors text-sm"
              >
                {{ phone }}
              </a>
            </div>
          </div>
        </div>

        <div id="vorstand" class="border-t-2 border-gray-200 mt-10 lg:mt-15 pt-8 scroll-mt-28">
          <h2
            class="text-[#032650] text-2xl 3xl:text-3xl font-black mt-0 uppercase tracking-wide mb-6 text-center"
          >
            <span class="inline-block border-b-[3px] border-[#032650] pb-1">Vorstand</span>
          </h2>

          <div v-if="vorstand.length" class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <PersonCard v-for="person in vorstand" :key="person._uid" :person="person" />
          </div>

          <div
            v-else
            class="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4 py-12"
          >
            Hier kommen Vorstandsmitglieder hin
          </div>
        </div>

        <div class="border-t-2 border-gray-200 mt-10 lg:mt-15 pt-8">
          <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-5">
            Weitere Ansprechpartner
          </h3>

          <div v-if="weitereAnsprechpartner.length" class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <PersonCard
              v-for="person in weitereAnsprechpartner"
              :key="person._uid"
              :person="person"
            />
          </div>

          <div
            v-else
            class="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4 py-12"
          >
            Hier kommen weitere Ansprechpartner hin
          </div>
        </div>
      </DecoratedCard>
    </div>
  </div>
</template>
