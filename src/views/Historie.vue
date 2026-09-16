<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed } from 'vue'

interface MeilensteinBlok {
    _uid: string
    component: string
    jahr: string
    title: string
    beschreibung?: string
    image?: { filename: string }
    typ?: string
}

function istErfolg(eintrag: MeilensteinBlok): boolean {
    return eintrag.typ?.toLowerCase() === 'erfolg'
}

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
    story = await useStoryblok(`historie/geschichte`, { version: STORYBLOK_VERSION })
} catch (e) {
    console.error('Storyblok-Story "historie/geschichte" konnte nicht geladen werden.', e)
}

const meilensteine = computed(() => {
    const list = (story?.value?.content.meilensteine as MeilensteinBlok[] | undefined) ?? []
    return [...list].sort((a, b) => parseInt(a.jahr) - parseInt(b.jahr))
})
</script>

<template>
    <div class="mb-15">

        <div class="w-full py-13 bg-[#032650] text-center px-4">
            <h1 class="text-3xl font-black text-white uppercase tracking-wider">
                {{ story?.content.title || 'Historie & Erfolge' }}
            </h1>
        </div>

        <div class="max-w-6xl w-[95%] mx-auto mt-15 px-4">

            <div
                class="relative w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6 px-4 md:p-10 text-gray-800">
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
                    <span class="inline-block border-b-[3px] border-[#032650] pb-1">Historie &amp; Erfolge</span>
                </h2>

                <p
                    class="mb-10 text-lg 2xl:text-xl font-medium text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
                    {{ story?.content.intro || `Von der Gründung bis heute – die wichtigsten Meilensteine und Erfolge
                    der Blue Arrows Sasbach im Überblick.` }}
                </p>

                <div v-if="meilensteine.length" class="relative">
                    <div class="hidden md:block absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-0.5 bg-gray-200">
                    </div>

                    <div class="space-y-10">
                        <div v-for="eintrag in meilensteine" :key="eintrag._uid"
                            class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-x-6 items-start">

                            <div v-if="!istErfolg(eintrag)" class="text-left md:text-right">
                                <span class="block text-sm font-black uppercase tracking-widest text-[#032650] mb-1">
                                    {{ eintrag.jahr }}
                                </span>
                                <h3 class="font-bold text-lg text-gray-900 mb-1">
                                    {{ eintrag.title }}
                                </h3>
                                <p v-if="eintrag.beschreibung" class="text-gray-700 leading-relaxed">
                                    {{ eintrag.beschreibung }}
                                </p>
                                <img v-if="eintrag.image?.filename" :src="eintrag.image.filename"
                                    :alt="eintrag.title"
                                    class="mt-3 w-full max-w-[140px] rounded-lg border border-gray-200 shadow-sm md:ml-auto" />
                            </div>
                            <div v-else></div>

                            <div class="relative z-10 flex justify-center py-1">
                                <div class="w-[19px] h-[19px] rounded-full border-4 border-white shadow-sm"
                                    :class="istErfolg(eintrag) ? 'bg-[#B8860B]' : 'bg-[#032650]'">
                                </div>
                            </div>

                            <div v-if="istErfolg(eintrag)" class="text-left">
                                <span class="block text-sm font-black uppercase tracking-widest text-[#B8860B] mb-1">
                                    {{ eintrag.jahr }}
                                </span>
                                <h3 class="font-bold text-lg text-[#B8860B] mb-1">
                                    {{ eintrag.title }}
                                </h3>
                                <p v-if="eintrag.beschreibung" class="text-gray-700 leading-relaxed">
                                    {{ eintrag.beschreibung }}
                                </p>
                                <img v-if="eintrag.image?.filename" :src="eintrag.image.filename"
                                    :alt="eintrag.title"
                                    class="mt-3 w-full max-w-[140px] rounded-lg border border-gray-200 shadow-sm" />
                            </div>
                            <div v-else></div>
                        </div>
                    </div>
                </div>

                <div v-else
                    class="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4 py-12">
                    Hier entsteht der Zeitstrahl der Vereinsgeschichte
                </div>
            </div>
        </div>
    </div>
</template>
