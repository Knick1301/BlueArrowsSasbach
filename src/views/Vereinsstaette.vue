<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
  story = await useStoryblok(`verein/vereinsstaette`, { version: STORYBLOK_VERSION })
} catch (e) {
  console.error('Storyblok-Story "verein/vereinsstaette" konnte nicht geladen werden.', e)
}
</script>

<template>
  <div class="mb-15">
    <div class="w-full py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">
        {{ story?.content.title || 'Spielstätte und Vereinsheim' }}
      </h1>
    </div>

    <div class="max-w-6xl w-[95%] mx-auto mt-15 px-4">
      <div
        class="relative w-full bg-white rounded-xl border border-gray-200 shadow-sm px-4 md:px-6 p-6 md:p-10 text-gray-800"
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

        <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-5 text-center">
          Anschrift
        </h3>

        <p
          class="block mb-6 text-lg 2xl:text-xl font-medium text-gray-700 leading-relaxed text-center w-fit mx-auto"
        >
          Sasbachrieder Str. 93, 77880 Sasbach
        </p>

        <a
          href="https://www.google.com/maps/search/?api=1&query=Sasbachrieder+Str.+93,+77880+Sasbach"
          target="_blank"
          class="block w-full md:w-150 max-w-full mx-auto mb-10 lg:mb-15 group"
        >
          <div class="relative">
            <img
              v-if="story?.content.mapsImage?.filename"
              :src="story.content.mapsImage.filename"
              alt="Luftbild Vereinsstätte Blue Arrows Sasbach"
              class="w-full h-64 object-cover rounded-xl border-2 border-gray-200 shadow-sm group-hover:opacity-90 transition-opacity"
            />
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

        <div class="border-t-2 border-gray-200 pt-8">
          <h2
            class="text-[#032650] text-2xl 3xl:text-3xl font-black mt-0 uppercase tracking-wide mb-6 text-center"
          >
            <span class="inline-block border-b-[3px] border-[#032650] pb-1">Spielstätte</span>
          </h2>

          <div
            class="rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm border border-gray-200"
          >
            <div
              v-if="story?.content.images?.length"
              class="md:w-1/2 w-full p-3 md:p-4 space-y-2 bg-gray-50"
            >
              <figure v-if="story.content.images[0]">
                <img
                  v-if="story.content.images[0].image?.filename"
                  :src="story.content.images[0].image.filename"
                  :alt="story.content.images[0].title || 'Spielstätte'"
                  class="w-full aspect-[600/348] object-cover rounded-lg"
                />
                <figcaption
                  v-if="story.content.images[0].title"
                  class="mt-1.5 text-xs text-gray-500 font-semibold text-center"
                >
                  {{ story.content.images[0].title }}
                </figcaption>
              </figure>

              <div v-if="story.content.images.length > 1" class="grid grid-cols-2 gap-2">
                <figure v-for="(bild, index) in story.content.images.slice(1)" :key="index">
                  <img
                    loading="lazy"
                    decoding="async"
                    v-if="bild.image?.filename"
                    :src="bild.image.filename"
                    :alt="bild.title || 'Spielstätte'"
                    class="w-full aspect-[600/348] object-cover rounded-lg"
                  />
                  <figcaption
                    v-if="bild.title"
                    class="mt-1 text-xs text-gray-500 font-semibold text-center"
                  >
                    {{ bild.title }}
                  </figcaption>
                </figure>
              </div>
            </div>

            <div
              v-else
              class="md:w-1/2 w-full aspect-[600/348] md:aspect-auto bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4"
            >
              Hier kommen Bilder der Spielstätte hin
            </div>

            <div
              class="md:w-1/2 w-full p-6 md:p-8 flex flex-col justify-center bg-[#004a87] text-white"
            >
              <p class="mb-4 text-base font-medium leading-relaxed">
                Unsere Spiel- und Trainingsfläche misst 20x40m, mit Holzbanden an den Längsseiten
                und Rundungen nach aktuellem Regelwerk. Ein 5m hoher Maschendraht-Fangzaun sorgt für
                einen guten Spielfluss. Für den Stilmat Evo-R Sportbelag eignen sich am besten
                Rollen der Härte 74A.
              </p>
              <div class="bg-white text-[#032650] p-4 rounded-lg font-bold text-sm mt-5">
                Nutzungshinweis: Schlägertape an Inline-Skates und Schlägerblättern ist untersagt.
              </div>
            </div>
          </div>
        </div>

        <div class="border-t-2 border-gray-200 mt-10 lg:mt-15 pt-8">
          <h2
            class="text-[#032650] text-2xl 3xl:text-3xl font-black mt-0 uppercase tracking-wide mb-6 text-center"
          >
            <span class="inline-block border-b-[3px] border-[#032650] pb-1">Vereinsheim</span>
          </h2>

          <div
            class="rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm border border-gray-200"
          >
            <div class="md:w-1/2 w-full relative aspect-[600/348] shrink-0 min-h-0">
              <img
                v-if="story?.content.bildVereinsheim?.filename"
                :src="story.content.bildVereinsheim.filename"
                alt="Vereinsheim"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4"
              >
                Hier kommt ein Bild vom Vereinsheim hin
              </div>
            </div>

            <div
              class="md:w-1/2 w-full p-6 md:p-8 flex flex-col justify-center bg-[#004a87] text-white"
            >
              <p class="text-base font-medium leading-relaxed">
                Direkt neben der Spielfläche steht unser Vereinsheim – umgebaut aus Baucontainern
                und mit fest installierter Heizung, sodass auch bei kaltem Wetter ein komfortables
                Umziehen vor Ort möglich ist.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
