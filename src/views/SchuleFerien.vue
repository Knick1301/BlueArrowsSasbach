<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { computed } from 'vue'

const story = await useStoryblok(`skating/schuleferien`, { version: 'draft' })

const aktuelleTermine = computed(() => {
    if (!story.value?.content?.dates) return []
    const jetzt = new Date().getTime()

    return [...story.value.content.dates]
        .filter((termin: any) => new Date(termin.ferienDatumEnde).getTime() >= jetzt)
        .sort((a: any, b: any) => new Date(a.ferienDatumStart).getTime() - new Date(b.ferienDatumStart).getTime())
})
</script>

<template>
    <div class="mb-15">

        <div class="w-full py-13 bg-[#032650] text-center px-4">
            <h1 class="text-3xl font-black text-white uppercase tracking-wider">
                {{ story?.content.title || 'Schule & Kindergarten Kooperationen & Ferien' }}
            </h1>
        </div>


        <div class="max-w-[1400px] mx-auto mt-15 px-4 flex flex-col xl:flex-row gap-10 xl:gap-16 items-start">


            <div class="w-full xl:w-2/5 h-full sticky top-32 hidden  xl:block">
                <img v-if="story?.content.bild?.filename" :src="story.content.bild.filename" alt="Schule & Ferien Bild"
                    class="w-full h-[300px] md:h-[500px] xl:h-full object-cover rounded-xl shadow-lg border-2 border-gray-200" />
            </div>

            <div
                class="w-full xl:w-3/5 bg-white rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.1)] border-t-[5px] border-[#032650] p-6 md:p-10 text-gray-800 flex flex-col h-full">
                <h2
                    class="text-[#032650] text-2xl 2xl:text-3xl font-black mt-0 uppercase text-center tracking-wide mb-4">
                    Skating-Angebote
                </h2>

                <p
                    class="mb-10 text-lg 2xl:text-xl font-medium text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
                    Die Nachwuchsförderung liegt den Blue Arrows Sasbach besonders am Herzen.
                    Neben unserer regulären Laufschule bieten wir spezielle Programme für Schulen,
                    Kindergärten und die schulfreie Zeit an.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

                    <div class="bg-blue-50 p-6 md:p-6 rounded-3xl border border-gray-100">
                        <h3 class="text-[#032650] text-2xl font-black mt-0 uppercase text-center tracking-wide mb-2">
                            Kooperationen
                        </h3>
                        <p class="text-gray-600 text-lg font-medium mb-4">
                            Schule & Kindergarten
                        </p>
                        <p class="mb-6 text-base font-medium text-gray-700 leading-relaxed">
                            Ob im Rahmen von Projekttagen, Sport-AGs
                            oder als besonderes Ausflugsziel – wir kooperieren gerne mit lokalen Schulen und
                            Kindergärten, um Kindern die Freude an der Bewegung auf Rollen zu vermitteln.
                        </p>
                        <ul
                            class="space-y-2 mb-8 text-[#032650] font-bold text-base list-disc list-inside marker:text-[#032650]">
                            <li>Ausrüstung (Inliner, Schoner) kann gestellt werden</li>
                            <li>Betreuung durch erfahrene Trainer</li>
                            <li>Spielerischer Einstieg für alle Altersklassen</li>
                        </ul>
                    </div>


                    <div class="bg-blue-50 p-6 md:p-6 rounded-3xl border border-gray-100 flex flex-col h-full">
                        <h3 class="text-[#032650]  text-2xl font-black mt-0 text-center uppercase tracking-wide mb-2">
                            Ferienprogramm
                        </h3>
                        <p class="text-gray-600 text-lg font-medium mb-4">
                            Ferienspaß bei den Blue Arrows
                        </p>
                        <p class="mb-6 text-base font-medium text-gray-700 leading-relaxed">
                            In den Schulferien bieten wir regelmäßig spezielle Inline-Kurse an. Egal ob absolute
                            Anfänger, die das Bremsen lernen wollen, oder Fortgeschrittene, die ihre Technik am
                            Schläger verbessern möchten – bei unserem Ferienprogramm steht der Spaß im Vordergrund!
                        </p>
                        <div
                            class="bg-gray-50 border-l-4 border-[#032650] p-4 rounded-xl text-[#032650] font-medium text-base mt-auto">
                            <span class="font-bold block mb-1">Aktuelle Termine:</span>

                            <span v-if="aktuelleTermine.length > 0">
                                <span v-for="(termin, index) in aktuelleTermine" :key="index"
                                    class="block mb-2 border-b border-gray-200 pb-2 last:border-b-0">
                                    <span class="font-bold text-[#032650]">
                                        {{ new Date(termin.ferienDatumStart).toLocaleDateString('de-DE') }} –
                                        {{ new Date(termin.ferienDatumEnde).toLocaleDateString('de-DE') }}
                                    </span>
                                    <span class="text-gray-600 block text-sm mt-1">
                                        {{ new Date(termin.ferienDatumStart).toLocaleTimeString('de-DE', {
                                            hour:
                                                '2-digit', minute: '2-digit'
                                        }) }} Uhr
                                        bis
                                        {{ new Date(termin.ferienDatumEnde).toLocaleTimeString('de-DE', {
                                            hour:
                                                '2-digit', minute: '2-digit'
                                        }) }} Uhr
                                    </span>
                                </span>
                            </span>

                            <span v-else class="text-gray-600">
                                Die Termine für das kommende Ferienprogramm werden rechtzeitig hier und in unseren News
                                bekannt gegeben.
                            </span>
                        </div>
                    </div>
                </div>

                <p class="mb-10 text-xl font-bold text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
                    Interesse an einer Kooperation oder Fragen zum Ferienprogramm?
                </p>

                <div class="bg-gray-50 p-5 rounded-xl border border-gray-200 mt-auto">

                    <div class="flex items-center gap-4">
                        <img src="../assets/DanielBuehler.jpg" alt="Daniel Bühler"
                            class="w-25 h-35 rounded-full border-2 border-[#032650] shadow-sm object-cover object-top" />
                        <div class="flex flex-col">
                            <span class="text-[#032650] font-black text-xl leading-tight">Daniel Bühler</span>
                            <span class="text-gray-600 font-bold text-base">0178 / 47 44 1 44</span>

                            <a href="https://forms.cloud.microsoft/pages/responsepage.aspx?id=0zjPOmDwmE6Fom6vADXC9_fd0gqtyfFIk3ESRMdyEo1UQkhaNjNWOEVTSE9YTllVU0NVSEpZS0RQWS4u&route=shorturl"
                                target="_blank"
                                class="text-center bg-[#032650] text-white py-2 rounded mt-4 font-bold hover:bg-blue-800 transition-colors text-sm">
                                Kontakt
                            </a>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    </div>
</template>