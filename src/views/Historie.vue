<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed } from 'vue'
import basLogo from '@/assets/BASlogo.png'
import DecoratedCard from '@/components/DecoratedCard.vue'

interface MeilensteinBlok {
    _uid: string
    component: string
    jahr: string
    title: string
    beschreibung?: string
    image?: { filename: string }
    typ?: string
    meister?: boolean
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

const meisterschaften = computed(() =>
    meilensteine.value.filter((eintrag) => istErfolg(eintrag) && eintrag.meister),
)
</script>

<template>
    <div class="mb-15">

        <div class="w-full py-13 bg-[#032650] text-center px-4">
            <h1 class="text-3xl font-black text-white uppercase tracking-wider">
                {{ story?.content.title || 'Geschichte & Erfolge' }}
            </h1>
        </div>

        <div class="max-w-6xl w-[95%] mx-auto mt-15 px-4">

            <DecoratedCard>
                <h2
                    class="text-[#032650] text-2xl 3xl:text-3xl font-black mt-0 uppercase tracking-wide mb-4 text-center">
                    <span class="inline-block border-b-[3px] border-[#032650] pb-1">Vereinsgeschichte</span>
                </h2>

                <p
                    class="mb-8 text-lg 2xl:text-xl font-medium text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
                    {{ story?.content.intro || `Von der Gründung bis heute – die wichtigsten Meilensteine und Erfolge
                    der Blue Arrows Sasbach im Überblick.` }}
                </p>

                <h2 v-if="meisterschaften.length"
                    class="text-[#B8860B] text-2xl 3xl:text-3xl font-black mt-0 uppercase tracking-wide mb-4 text-center">
                    <span class="inline-block border-b-[3px] border-[#B8860B] pb-1">Erfolge</span>
                </h2>

                <div v-if="meisterschaften.length" class="flex flex-wrap justify-center gap-3 mb-10">
                    <div v-for="erfolg in meisterschaften" :key="`banner-${erfolg._uid}`"
                        class="bg-[#032650] w-30 p-1 shadow-sm"
                        style="clip-path: polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%);">
                        <div class="h-full bg-white p-[2px]"
                            style="clip-path: polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%);">
                            <div class="relative h-full overflow-hidden bg-[#032650] text-white text-center pt-5 pb-30 px-2 flex flex-col items-center justify-center"
                                style="clip-path: polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%);">
                                <img :src="basLogo" alt=""
                                    class="absolute inset-2 mt-17 m-auto w-25 h-25 object-contain opacity-85 pointer-events-none" />
                                <span class="relative block text-xs font-bold uppercase tracking-wide text-yellow-100">
                                    {{ erfolg.jahr }}
                                </span>
                                <span class="relative block text-xs font-black leading-tight mt-1">
                                    {{ erfolg.title }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="meilensteine.length">

                    <h2
                        class="text-[#032650] text-2xl 3xl:text-3xl font-black mt-0 uppercase tracking-wide mb-6 text-center">
                        <span class="inline-block border-b-[3px] border-[#032650] pb-1">Geschichte</span>
                    </h2>

                    <div class="md:hidden relative pl-8">
                        <div class="absolute left-[9px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
                        <div class="space-y-8">
                            <div v-for="eintrag in meilensteine" :key="`mobile-${eintrag._uid}`" class="relative">
                                <div class="absolute -left-8 top-1 w-[19px] h-[19px] rounded-full border-4 border-white shadow-sm"
                                    :class="istErfolg(eintrag) ? 'bg-[#B8860B]' : 'bg-[#032650]'">
                                </div>
                                <span class="block text-sm font-black uppercase tracking-widest mb-1"
                                    :class="istErfolg(eintrag) ? 'text-[#B8860B]' : 'text-[#032650]'">
                                    {{ eintrag.jahr }}
                                </span>
                                <h3 class="font-bold text-lg mb-1"
                                    :class="istErfolg(eintrag) ? 'text-[#B8860B]' : 'text-gray-900'">
                                    {{ eintrag.title }}
                                </h3>
                                <p v-if="eintrag.beschreibung" class="text-gray-700 leading-relaxed">
                                    {{ eintrag.beschreibung }}
                                </p>
                                <img v-if="eintrag.image?.filename" :src="eintrag.image.filename" :alt="eintrag.title"
                                    class="mt-3 w-full max-w-[140px] rounded-lg border border-gray-200 shadow-sm" />
                            </div>
                        </div>
                    </div>

                    <!-- Desktop: Zickzack, Erfolg rechts / Meilenstein links -->
                    <div class="hidden md:block relative">
                        <div class="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-0.5 bg-gray-200"></div>

                        <div class="space-y-10">
                            <div v-for="eintrag in meilensteine" :key="`desktop-${eintrag._uid}`"
                                class="grid grid-cols-[1fr_auto_1fr] gap-x-6 items-start">

                                <div v-if="!istErfolg(eintrag)" class="text-right">
                                    <span
                                        class="block text-sm font-black uppercase tracking-widest text-[#032650] mb-1">
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
                                        class="mt-3 w-full max-w-[140px] rounded-lg border border-gray-200 shadow-sm ml-auto" />
                                </div>
                                <div v-else></div>

                                <div class="relative z-10 flex justify-center py-1">
                                    <div class="w-[19px] h-[19px] rounded-full border-4 border-white shadow-sm"
                                        :class="istErfolg(eintrag) ? 'bg-[#B8860B]' : 'bg-[#032650]'">
                                    </div>
                                </div>

                                <div v-if="istErfolg(eintrag)" class="text-left">
                                    <span
                                        class="block text-sm font-black uppercase tracking-widest text-[#B8860B] mb-1">
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
                </div>

                <div v-else
                    class="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4 py-12">
                    Hier entsteht der Zeitstrahl der Vereinsgeschichte
                </div>
            </DecoratedCard>
        </div>
    </div>
</template>
