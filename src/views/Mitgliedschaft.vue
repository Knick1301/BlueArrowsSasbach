<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
  story = await useStoryblok(`verein/mitgliedschaft`, { version: STORYBLOK_VERSION })
} catch (e) {
  console.error('Storyblok-Story "verein/mitgliedschaft" konnte nicht geladen werden.', e)
}

const beitraege = [
  { stufe: 'Passives Mitglied', preis: '10 €' },
  { stufe: 'Aktives Mitglied bis 12 Jahre (Bambini- & Schülerliga)', preis: '75 €' },
  { stufe: 'Aktives Mitglied bis 18 Jahre (Jugend- & Juniorenliga)', preis: '110 €' },
  { stufe: 'Aktives Mitglied ab 18 Jahre & Herren', preis: '185 €' },
  { stufe: 'Aktives Mitglied Herren Ligakader', preis: '190 €' },
]

const downloads = [
  {
    titel: 'Mitgliedsantrag Einzelperson',
    url: 'https://www.bluearrows.de/fileadmin/user_upload/downloads/Mitgliedsantrag_Blue_Arrows_2026.pdf',
  },
  {
    titel: 'Mitgliedsantrag Familienmitgliedschaft',
    url: 'https://www.bluearrows.de/fileadmin/user_upload/downloads/Mitgliedsantrag_Familie_Blue_Arrows.pdf',
  },
  {
    titel: 'Sporttauglichkeitsbescheinigung für Spielerpassantrag (Nachwuchs)',
    url: 'https://www.bluearrows.de/fileadmin/user_upload/downloads/Sporttauglichkeitsbescheinigung_Vorlage.pdf',
  },
  {
    titel: 'Vereinssatzung (Stand 27.02.2022)',
    url: 'https://www.bluearrows.de/fileadmin/user_upload/downloads/Verein_-_Satzung_2022.pdf',
  },
]
</script>

<template>
  <div class="mb-15">
    <div class="w-full py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">
        {{ story?.content.title || 'Werde Teil des Teams' }}
      </h1>
    </div>

    <div class="max-w-5xl w-[95%] mx-auto mt-15 px-4">
      <div
        class="relative w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-10 text-gray-800"
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
          class="text-[#032650] text-2xl font-black mt-0 uppercase tracking-wide mb-4 text-center"
        >
          <span class="inline-block border-b-[3px] border-[#032650] pb-1"
            >Werde Teil des Teams</span
          >
        </h2>

        <p
          class="mb-8 text-lg 2xl:text-xl font-medium text-gray-700 leading-relaxed text-center max-w-2xl mx-auto"
        >
          Mitglied bei den Blue Arrows werden ist ganz einfach. Schon für einen Jahresbeitrag von
          10,- € ist eine passive Mitgliedschaft möglich. Also ran an die Formulare und bei der
          Geschäftsstelle einwerfen.
        </p>

        <h3 class="text-gray-500 text-sm font-black uppercase tracking-widest mb-2">
          Deine Vorteile als Mitglied
        </h3>
        <ul
          class="mb-8 space-y-2 text-[#032650] font-bold text-base list-disc list-inside marker:text-[#032650]"
        >
          <li>Aktive Teilnahme am Spielbetrieb (Liga & Turniere)</li>
          <li>Mitsprache- und Stimmrecht in der Mitgliederversammlung</li>
          <li>Recht, eigene Anträge einzubringen</li>
          <li>Teilnahme an allen Vereinsveranstaltungen</li>
        </ul>

        <h3 class="text-gray-500 text-sm font-black uppercase tracking-widest mb-2">
          Mitgliedsbeitrag (pro Jahr)
        </h3>
        <div class="mb-8">
          <div
            v-for="beitrag in beitraege"
            :key="beitrag.stufe"
            class="flex justify-between items-baseline gap-6 py-3 border-b-2 border-gray-200 last:border-b-0"
          >
            <span class="text-[#032650] font-bold">{{ beitrag.stufe }}</span>
            <span class="text-gray-600 font-medium shrink-0">{{ beitrag.preis }}</span>
          </div>
        </div>

        <h3
          class="text-[#032650] text-sm font-black uppercase tracking-widest mb-2 border-t-2 border-gray-200 pt-8"
        >
          Formulare & Downloads
        </h3>
        <p class="text-gray-600 font-medium mb-4">
          Bitte ausgefüllt einreichen bei: Daniel Bühler, Bühler Straße 25, 77880 Sasbach
        </p>
        <div>
          <div
            v-for="download in downloads"
            :key="download.url"
            class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 py-3 border-b-2 border-gray-200 last:border-b-0"
          >
            <span class="text-[#032650] font-bold hyphens-auto">{{ download.titel }}</span>
            <a
              :href="download.url"
              target="_blank"
              class="text-center border-2 border-[#032650] text-[#032650] px-4 py-1.5 rounded font-bold hover:bg-[#032650] hover:text-white transition-colors text-sm shrink-0"
            >
              PDF öffnen
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
