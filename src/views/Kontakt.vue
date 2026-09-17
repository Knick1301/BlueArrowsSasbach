<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

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

const address = computed(() => story?.value?.content.address || 'Sasbachrieder Str. 93, 77880 Sasbach')
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

            <div
                class="relative w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6 px-4 md:p-10 md:px-6 text-gray-800">
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

                <p
                    class="mb-10 text-lg 2xl:text-xl font-medium text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
                    {{ story?.content.intro || `Du hast eine Frage, möchtest mit dem Verein in Kontakt treten oder
                    suchst einen bestimmten Ansprechpartner? Hier findest du alle wichtigen Kontaktmöglichkeiten der
                    Blue Arrows Sasbach.` }}
                </p>

                <h2
                    class="text-[#032650] text-2xl 3xl:text-3xl font-black mt-0 uppercase tracking-wide mb-6 text-center">
                    <span class="inline-block border-b-[3px] border-[#032650] pb-1">Kontakt</span>
                </h2>

                <div class="pt-2">
                    <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-5">
                        Anschrift
                    </h3>

                    <p
                        class="block mb-6 text-lg 2xl:text-xl font-medium text-gray-700 leading-relaxed text-center w-fit mx-auto">
                        Sasbachrieder Str. 93, 77880 Sasbach
                    </p>

                    <a :href="mapsUrl" target="_blank" class="block w-150 max-w-full mx-auto group">
                        <div class="relative">
                            <img v-if="story?.content.mapsImage?.filename" :src="story.content.mapsImage.filename"
                                alt="Luftbild Vereinsstätte Blue Arrows Sasbach"
                                class="w-full h-64 object-cover rounded-xl border-2 border-gray-200 shadow-sm group-hover:opacity-90 transition-opacity" />
                            <div v-else
                                class="w-full h-64 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4">
                                Hier kommt ein Kartenausschnitt hin
                            </div>
                            <span
                                class="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#032650] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                    stroke="currentColor" class="w-4 h-4 shrink-0">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
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
                            <a :href="`mailto:${email}`"
                                class="inline-block bg-white text-[#032650] px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors text-sm">
                                {{ email }}
                            </a>
                            <a v-if="phone" :href="`tel:${phone}`"
                                class="inline-block bg-white text-[#032650] px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors text-sm">
                                {{ phone }}
                            </a>
                        </div>
                    </div>
                </div>

                <div id="vorstand" class="border-t-2 border-gray-200 mt-10 lg:mt-15 pt-8 scroll-mt-28">
                    <h2
                        class="text-[#032650] text-2xl 3xl:text-3xl font-black mt-0 uppercase tracking-wide mb-6 text-center">
                        <span class="inline-block border-b-[3px] border-[#032650] pb-1">Vorstand</span>
                    </h2>

                    <div v-if="vorstand.length" class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div v-for="person in vorstand" :key="person._uid"
                            class="flex flex-row items-stretch min-h-32 sm:min-h-52 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all">
                            <div class="relative w-24 h-auto sm:w-32 lg:w-40 shrink-0 bg-gray-200">
                                <img v-if="person.image?.filename" :src="person.image.filename" :alt="person.name"
                                    class="absolute inset-0 w-full h-full object-cover" />
                                <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-10 h-10 sm:w-14 sm:h-14">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </div>
                            </div>
                            <div
                                class="flex flex-col justify-center min-w-0 flex-1 px-4 py-3 sm:px-5 sm:py-4 gap-1 sm:gap-1.5">
                                <p class="text-base font-black text-[#032650] uppercase tracking-wide">
                                    {{ person.name }}
                                </p>
                                <span v-if="person.role"
                                    class="inline-block bg-blue-50 text-[#032650] text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full w-fit">
                                    {{ person.role }}
                                </span>
                                <div class="flex flex-col gap-1 mt-1 min-w-0">
                                    <a v-if="person.email" :href="`mailto:${person.email}`"
                                        class="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="2" stroke="currentColor" class="w-4 h-4 shrink-0">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                        E-Mail schreiben
                                    </a>
                                    <a v-if="person.phone" :href="`tel:${person.phone}`"
                                        class="flex items-center gap-1.5 text-sm text-gray-500 font-medium hover:text-[#032650] transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="2" stroke="currentColor" class="w-4 h-4 shrink-0">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97a1.125 1.125 0 0 0 .417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                        </svg>
                                        <span>{{ person.phone }}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else
                        class="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4 py-12">
                        Hier kommen Vorstandsmitglieder hin
                    </div>
                </div>

                <div class="border-t-2 border-gray-200 mt-10 lg:mt-15 pt-8">
                    <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-5">
                        Weitere Ansprechpartner
                    </h3>

                    <div v-if="weitereAnsprechpartner.length" class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div v-for="person in weitereAnsprechpartner" :key="person._uid"
                            class="flex flex-row items-stretch min-h-32 sm:min-h-52 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all">
                            <div class="relative w-24 h-auto sm:w-32 lg:w-40 shrink-0 bg-gray-200">
                                <img v-if="person.image?.filename" :src="person.image.filename" :alt="person.name"
                                    class="absolute inset-0 w-full h-full object-cover" />
                                <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-10 h-10 sm:w-14 sm:h-14">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </div>
                            </div>
                            <div
                                class="flex flex-col justify-center min-w-0 flex-1 px-4 py-3 sm:px-5 sm:py-4 gap-1 sm:gap-1.5">
                                <p class="text-base font-black text-[#032650] uppercase tracking-wide">
                                    {{ person.name }}
                                </p>
                                <span v-if="person.role"
                                    class="inline-block bg-blue-50 text-[#032650] text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full w-fit">
                                    {{ person.role }}
                                </span>
                                <div class="flex flex-col gap-1 mt-1 min-w-0">
                                    <a v-if="person.email" :href="`mailto:${person.email}`"
                                        class="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="2" stroke="currentColor" class="w-4 h-4 shrink-0">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                        E-Mail schreiben
                                    </a>
                                    <a v-if="person.phone" :href="`tel:${person.phone}`"
                                        class="flex items-center gap-1.5 text-sm text-gray-500 font-medium hover:text-[#032650] transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="2" stroke="currentColor" class="w-4 h-4 shrink-0">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97a1.125 1.125 0 0 0 .417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                        </svg>
                                        <span>{{ person.phone }}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else
                        class="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4 py-12">
                        Hier kommen weitere Ansprechpartner hin
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
