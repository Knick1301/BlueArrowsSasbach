<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed } from 'vue'

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
    story = await useStoryblok(`events/burgerista`, { version: STORYBLOK_VERSION })
} catch (e) {
    console.error('Storyblok-Story "events/burgerista" konnte nicht geladen werden.', e)
}

const aktuelleTermine = computed(() => {
    if (!story?.value?.content?.dates) return []
    const jetzt = new Date().getTime()

    return [...story.value.content.dates]
        .filter((termin: { datum: string }) => new Date(termin.datum).getTime() >= jetzt)
        .sort((a: { datum: string }, b: { datum: string }) => new Date(a.datum).getTime() - new Date(b.datum).getTime())
})
</script>

<template>
    <div class="mb-15">


        <div class="w-full py-13 bg-[#032650] text-center px-4">
            <h1 class="text-3xl font-black text-white uppercase tracking-wider">
                {{ story?.content.title || '#Blueburgerista' }}
            </h1>
        </div>

        <div class="max-w-[1400px] w-[95%] mx-auto mt-15 px-4 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

            <div class="w-full lg:hidden">
                <img v-if="story?.content.bild?.filename" :src="story.content.bild.filename" alt="Blueburgerista Burger"
                    class="w-full h-[340px] sm:h-[420px] object-cover rounded-xl shadow-md border-2 border-gray-100" />

                <div v-else
                    class="w-full h-[340px] sm:h-[420px] bg-gray-100 rounded-xl shadow-md border-2 border-gray-200 flex items-center justify-center text-gray-400 font-bold text-xl">
                    Hier kommt das Burger-Bild hin 🍔
                </div>
            </div>

            <div
                class="relative w-full lg:w-3/5 bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-10 text-gray-800 flex flex-col h-full">
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

                <h2
                    class="text-[#032650] text-3xl font-black mt-0 uppercase tracking-wide mb-4 border-b-[3px] border-[#032650] inline-block pb-1 w-fit">
                    Unser Burger Catering
                </h2>

                <p class="mb-6 text-lg font-medium text-gray-700 leading-relaxed">
                    <span class="font-bold text-[#032650]">#Blueburgerista</span> ist die eigens geschaffene Marke der
                    Blue Arrows Sasbach, unter welcher wir euch während diversen Veranstaltungen mit feinsten Burgern
                    verwöhnen möchten.
                </p>

                <p class="mb-8 text-lg font-medium text-gray-700 leading-relaxed">
                    Egal ob bei unseren Heimspielen, auf lokalen Märkten oder für dein eigenes Event gemietet – wir
                    bringen den Geschmack direkt zu euch!
                </p>

                <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-2">
                    Nächste Einsatztermine
                </h3>
                <div class="mb-6">
                    <div v-if="aktuelleTermine.length > 0">
                        <div v-for="(termin, index) in aktuelleTermine" :key="index"
                            class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-6 py-3 border-b-2 border-gray-200">
                            <span class="text-[#032650] font-bold shrink-0 text-lg">
                                {{ new Date(termin.datum).toLocaleDateString('de-DE', {
                                    weekday: 'long', day: '2-digit',
                                    month: 'long', year: 'numeric'
                                }) }}
                            </span>
                            <span class="text-gray-600 font-medium sm:text-right min-w-0 sm:flex-1">
                                <span v-if="termin.uhrzeit">🕒 {{ termin.uhrzeit }}</span>
                                <span v-if="termin.uhrzeit && termin.standort"> · </span>
                                <span v-if="termin.standort">📍 {{ termin.standort }}</span>
                            </span>
                        </div>
                    </div>

                    <p v-else class="text-gray-600 font-medium">
                        Aktuell stehen keine neuen Termine fest. Schaut bald wieder vorbei!
                    </p>
                </div>

                <div class="mt-auto">
                    <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-2">
                        Kontakt
                    </h3>
                    <p class="text-gray-600 font-medium mb-5">
                        Interesse an einem Catering für dein Event? Einfach unverbindlich anfragen:
                    </p>

                    <div class="flex items-center gap-4 mb-5">
                        <img loading="lazy" decoding="async" src="../assets/DanielBuehler.jpg" alt="Daniel Bühler"
                            class="w-24 aspect-[3/4] object-cover object-top rounded-lg border-2 border-[#032650] shadow-sm shrink-0" />
                        <div class="flex flex-col">
                            <span class="text-[#032650] font-bold">Daniel Bühler</span>
                            <span class="text-gray-500 text-sm font-medium whitespace-nowrap">0178 / 47 44 1 44</span>
                        </div>
                    </div>

                    <a href="mailto:info@bluearrows.de"
                        class="block text-center bg-[#032650] text-white py-2 px-4 rounded font-bold hover:bg-blue-900 transition-colors text-sm">
                        Kontakt aufnehmen
                    </a>
                </div>
            </div>

            <div class="w-full lg:w-2/5 h-full sticky top-32 hidden lg:block">
                <img v-if="story?.content.bild?.filename" :src="story.content.bild.filename" alt="Blueburgerista Burger"
                    class="w-full h-[400px] lg:h-[600px] object-cover rounded-xl shadow-xl border-2 border-gray-100" />

                <div v-else
                    class="w-full h-[400px] lg:h-[600px] bg-gray-100 rounded-xl shadow-xl border-2 border-gray-200 flex items-center justify-center text-gray-400 font-bold text-xl">
                    Hier kommt das Burger-Bild hin 🍔
                </div>
            </div>

        </div>
    </div>
</template>