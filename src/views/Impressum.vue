<script setup lang="ts">
import { renderRichText, useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
  story = await useStoryblok(`impressum`, { version: STORYBLOK_VERSION })
} catch (e) {
  console.error('Storyblok-Story "impressum" konnte nicht geladen werden.', e)
}
</script>

<template>
  <div class="mb-15">
    <div class="w-full py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">
        {{ story?.content.title || 'Impressum' }}
      </h1>
    </div>

    <div class="max-w-4xl w-[95%] mx-auto mt-15 px-4">
      <div
        class="relative w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6 px-4 md:p-10 text-gray-800"
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

        <div
          v-if="story?.content.content"
          class="prose prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 prose-lg max-w-none text-gray-800 prose-h5:mt-10 prose-h5:mb-3 prose-h5:text-[#032650] prose-h5:font-black prose-h5:uppercase prose-h5:tracking-widest [&_h5_strong]:text-[#032650] [&_h5_strong]:font-black"
          v-html="renderRichText(story.content.content)"
        ></div>

        <template v-else>
          <div class="space-y-1 mb-8">
            <p class="font-bold text-[#032650]">Inlinehockey Club Blue Arrows Sasbach e. V.</p>
            <p>Bühler Straße 25</p>
            <p>77880 Sasbach</p>
            <p>Telefon: 0178 / 47 44 1 44</p>
            <p>
              E-Mail:
              <a href="mailto:mail@bluearrows.de" class="text-blue-600 hover:underline"
                >mail@bluearrows.de</a
              >
            </p>
            <p>
              Internet:
              <a
                href="https://www.bluearrows.de"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline"
                >www.bluearrows.de</a
              >
            </p>
          </div>

          <div class="border-t-2 border-gray-200 pt-6 mb-8">
            <h2 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
              Vertretungsberechtigter Vorstand
            </h2>
            <p>Daniel Bühler (1. Vorsitzender), Manuel Bauer (2. Vorsitzender)</p>
            <p class="mt-2">Registergericht: Amtsgericht Mannheim</p>
            <p>Registernummer: VR 220380</p>
          </div>

          <div class="border-t-2 border-gray-200 pt-6 mb-8">
            <h2 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
              Inhaltlich Verantwortlicher gemäß § 18 Absatz 2 MStV
            </h2>
            <p>Daniel Bühler</p>
            <p>Bühler Straße 25</p>
            <p>77880 Sasbach</p>
            <p>Telefon: 0178 / 47 44 1 44</p>
            <p>
              E-Mail:
              <a href="mailto:mail@bluearrows.de" class="text-blue-600 hover:underline"
                >mail@bluearrows.de</a
              >
            </p>
          </div>

          <div class="border-t-2 border-gray-200 pt-6 mb-8">
            <h2 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
              Haftungshinweis
            </h2>
            <p class="leading-relaxed">
              Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte
              externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren
              Betreiber verantwortlich.
            </p>
          </div>

          <div class="border-t-2 border-gray-200 pt-6">
            <h2 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
              Dienstanbieter
            </h2>
            <p>Inlinehockey Club Blue Arrows Sasbach e.V. / www.bluearrows.de</p>
            <p>Bühler Straße 25, 77880 Sasbach</p>
            <p>Tel.: 0178 / 47 44 1 44</p>
            <p>
              E-Mail:
              <a href="mailto:mail@bluearrows.de" class="text-blue-600 hover:underline"
                >mail@bluearrows.de</a
              >
            </p>
            <p>Vorsitzender: Daniel Bühler</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
