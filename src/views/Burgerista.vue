<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { computed } from 'vue'

const story = await useStoryblok(`events/burgerista`, { version: 'draft' })


const aktuelleTermine = computed(() => {
    if (!story.value?.content?.dates) return []
    const jetzt = new Date().getTime()

    return [...story.value.content.dates]
        .filter((termin: any) => new Date(termin.datum).getTime() >= jetzt)
        .sort((a: any, b: any) => new Date(a.datum).getTime() - new Date(b.datum).getTime())
})
</script>

<template>
    <div class="mb-15">


        <div class="w-full py-13 bg-[#032650] text-center px-4">
            <h1 class="text-3xl font-black text-white uppercase tracking-wider">
                {{ story?.content.title || '#Blueburgerista' }}
            </h1>
        </div>

        <div class="max-w-[1400px] mx-auto mt-10 px-4 flex flex-col xl:flex-row gap-10 xl:gap-16 items-start">

            <div
                class="w-full xl:w-3/5 bg-white rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.1)] border-t-[5px] border-[#032650] p-6 md:p-10 text-gray-800 flex flex-col h-full">
                <h2 class="text-[#032650] text-3xl font-black mt-0 uppercase tracking-wide mb-6">
                    Unser Burger Catering
                </h2>

                <p class="mb-6 text-lg font-medium text-gray-700 leading-relaxed">
                    <span class="font-bold text-[#032650]">#Blueburgerista</span> ist die eigens geschaffene Marke der
                    Blue Arrows Sasbach, unter welcher wir euch während diversen Veranstaltungen mit feinsten Burgern
                    verwöhnen möchten.
                </p>

                <p class="mb-10 text-lg font-medium text-gray-700 leading-relaxed">
                    Egal ob bei unseren Heimspielen, auf lokalen Märkten oder für dein eigenes Event gemietet – wir
                    bringen den Geschmack direkt zu euch!
                </p>




                <div class="bg-gray-50 border-l-4 border-[#032650] p-6 rounded-xl mt-auto">
                    <h3 class="font-bold text-[#032650] text-2xl mb-4 flex items-center gap-3 uppercase tracking-wide">
                        Nächste Einsatztermine
                    </h3>

                    <div v-if="aktuelleTermine.length > 0" class="space-y-4">
                        <div v-for="(termin, index) in aktuelleTermine" :key="index"
                            class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div class="font-black text-[#032650] text-lg mb-1">
                                {{ new Date(termin.datum).toLocaleDateString('de-DE', {
                                    weekday: 'long', day: '2-digit',
                                    month: 'long', year: 'numeric'
                                }) }}
                            </div>
                            <div class="text-gray-700 font-bold flex flex-col sm:flex-row sm:gap-4">
                                <span v-if="termin.uhrzeit">🕒 {{ termin.uhrzeit }}</span>
                                <span v-if="termin.uhrzeit && termin.standort"
                                    class="hidden sm:inline text-gray-300">|</span>
                                <span v-if="termin.standort">📍 {{ termin.standort }}</span>
                            </div>
                        </div>
                    </div>

                    <p v-else class="text-gray-600 font-medium text-lg">
                        Aktuell stehen keine neuen Termine fest. Schaut bald wieder vorbei!
                    </p>
                </div>
                <div class="bg-gray-50 p-5 rounded-xl border border-gray-200 mt-10">
                    <p class="mb-4 text-[#032650] font-bold">Interesse an einem Catering für dein Event? Einfach
                        unverbindlich anfragen:</p>
                    <div class="flex items-center gap-4">
                        <img src="../assets/DanielBuehler.jpg" alt="Daniel Bühler"
                            class="w-25 h-35 rounded-full border-2 border-[#032650] shadow-sm object-cover object-top" />
                        <div class="flex flex-col">
                            <span class="text-[#032650] font-black text-xl leading-tight">Daniel Bühler</span>
                            <span class="text-gray-600 font-bold text-base">0178 / 47 44 1 44</span>


                            <a href="mailto:info@bluearrows.de"
                                class="text-center bg-[#032650] text-white py-2 px-4 rounded mt-4 font-bold hover:bg-blue-900 transition-colors text-sm">
                                Kontakt aufnehmen
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-full xl:w-2/5 h-full sticky top-32 hidden xl:block">
                <img v-if="story?.content.bild?.filename" :src="story.content.bild.filename" alt="Blueburgerista Burger"
                    class="w-full h-[400px] xl:h-[600px] object-cover rounded-xl shadow-xl border-2 border-gray-100" />

                <div v-else
                    class="w-full h-[400px] xl:h-[600px] bg-gray-100 rounded-xl shadow-xl border-2 border-gray-200 flex items-center justify-center text-gray-400 font-bold text-xl">
                    Hier kommt das Burger-Bild hin 🍔
                </div>
            </div>

        </div>
    </div>
</template>