<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
    story = await useStoryblok(`verein/vereinsstaette`, { version: 'draft' })
} catch (e) {
    console.error('Storyblok-Story "verein/vereinsstaette" konnte nicht geladen werden.', e)
}
</script>

<template>
    <div class="mb-15">

        <div class="w-full py-13 bg-[#032650] text-center px-4">
            <h1 class="text-3xl font-black text-white uppercase tracking-wider">
                {{ story?.content.title || 'Vereinsstätte und Vereinsheim' }}
            </h1>
        </div>

        <div class="max-w-6xl w-[95%] mx-auto mt-15 px-4">

            <div class="relative w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-10 text-gray-800">
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
                    class="text-[#032650] text-2xl 3xl:text-3xl font-black mt-0 uppercase tracking-wide mb-4 text-center">
                    <span class="inline-block border-b-[3px] border-[#032650] pb-1">Vereinsstätte & Vereinsheim</span>
                </h2>

                <p
                    class="mb-10 text-lg 2xl:text-xl font-medium text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
                    Sasbachrieder Str. 93, 77880 Sasbach
                </p>

                <div class="border-t-2 border-gray-200 pt-8">
                    <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
                        Spielstätte
                    </h3>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        <div v-if="story?.content.images?.length" class="space-y-4">
                            <figure v-if="story.content.images[0]">
                                <img v-if="story.content.images[0].image?.filename"
                                    :src="story.content.images[0].image.filename"
                                    :alt="story.content.images[0].title || 'Spielstätte'"
                                    class="w-full h-[260px] object-cover rounded-xl shadow-sm border-2 border-gray-200" />
                                <figcaption v-if="story.content.images[0].title"
                                    class="mt-2 text-sm text-gray-700 font-semibold text-center">
                                    {{ story.content.images[0].title }}
                                </figcaption>
                            </figure>

                            <div v-if="story.content.images.length > 1" class="grid grid-cols-2 gap-4">
                                <figure v-for="(bild, index) in story.content.images.slice(1)" :key="index">
                                    <img v-if="bild.image?.filename" :src="bild.image.filename"
                                        :alt="bild.title || 'Spielstätte'"
                                        class="w-full h-[130px] object-cover rounded-xl shadow-sm border-2 border-gray-200" />
                                    <figcaption v-if="bild.title"
                                        class="mt-2 text-xs text-gray-700 font-semibold text-center">
                                        {{ bild.title }}
                                    </figcaption>
                                </figure>
                            </div>
                        </div>

                        <div class="pt-2 lg:pt-0 lg:mt-2">
                            <p class="mb-4 text-base font-medium text-gray-700 leading-relaxed">
                                Unsere Spiel- und Trainingsfläche misst 20x40m, mit Holzbanden an den
                                Längsseiten und Rundungen nach aktuellem Regelwerk. Ein 5m hoher
                                Maschendraht-Fangzaun sorgt für einen guten Spielfluss. Für den Stilmat
                                Evo-R Sportbelag eignen sich am besten Rollen der Härte 74A.
                            </p>
                            <div
                                class="bg-blue-50 border-l-4 border-[#032650] p-4 rounded-xl text-[#032650] font-bold text-sm">
                                Nutzungshinweis: Schlägertape an Inline-Skates und Schlägerblättern ist
                                untersagt.
                            </div>
                        </div>
                    </div>
                </div>

                <div class="border-t-2 border-gray-200 mt-16 pt-8">
                    <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
                        Vereinsheim
                    </h3>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        <img v-if="story?.content.bildVereinsheim?.filename"
                            :src="story.content.bildVereinsheim.filename" alt="Vereinsheim"
                            class="w-full h-[260px] object-cover rounded-xl shadow-sm border-2 border-gray-200" />

                        <p class="text-base font-medium text-gray-700 leading-relaxed pt-2 lg:pt-0 lg:mt-2">
                            Direkt neben der Spielfläche steht unser Vereinsheim – umgebaut aus
                            Baucontainern und mit fest installierter Heizung, sodass auch bei kaltem Wetter
                            ein komfortables Umziehen vor Ort möglich ist.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
