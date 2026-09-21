<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { getUrl, type StoryblokLink } from '@/utils/methods.ts'
import { computed } from 'vue'

interface SponsorBlok {
    _uid: string
    component: string
    name: string
    logo?: { filename: string }
    link?: StoryblokLink
    role?: string
}

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
    story = await useStoryblok(`verein/sponsoren`, { version: STORYBLOK_VERSION })
} catch (e) {
    console.error('Storyblok-Story "verein/sponsoren" konnte nicht geladen werden.', e)
}

const sponsorHref = (sponsor: SponsorBlok): string | undefined => {
    const url = getUrl(sponsor.link)
    return url !== '#' ? url : undefined
}

const hauptsponsoren = computed(() => (story?.value?.content.hauptsponsoren as SponsorBlok[] | undefined) ?? [])
const sponsoren = computed(() => (story?.value?.content.sponsoren as SponsorBlok[] | undefined) ?? [])
</script>

<template>
    <div class="mb-15">

        <div class="w-full py-13 bg-[#032650] text-center px-4">
            <h1 class="text-3xl font-black text-white uppercase tracking-wider">
                {{ story?.content.title || 'Sponsoren' }}
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
                    <span class="inline-block border-b-[3px] border-[#032650] pb-1">Unsere Sponsoren</span>
                </h2>

                <p
                    class="mb-10 text-lg 2xl:text-xl font-medium text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
                    {{ story?.content.intro || `Ohne die Unterstützung unserer Sponsoren wäre der Spielbetrieb der Blue
                    Arrows Sasbach nicht möglich.Wir bedanken uns herzlich für das Vertrauen und die Partnerschaft.` }}
                </p>

                <div class="border-t-2 border-gray-200 pt-8">
                    <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-5">
                        Hauptsponsoren
                    </h3>

                    <div v-if="hauptsponsoren.length" class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <a v-for="sponsor in hauptsponsoren" :key="sponsor._uid" :href="sponsorHref(sponsor)"
                            :target="sponsorHref(sponsor) ? '_blank' : undefined"
                            :rel="sponsorHref(sponsor) ? 'noopener noreferrer' : undefined"
                            class="flex flex-col items-center justify-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-6 hover:-translate-y-1 hover:shadow-md transition-all active:scale-95">
                            <img loading="lazy" decoding="async" v-if="sponsor.logo?.filename" :src="sponsor.logo.filename" :alt="sponsor.name"
                                class="w-full h-32 object-contain" />
                            <div class="w-full flex flex-col items-center justify-center min-h-[2.5rem]">
                                <p
                                    class="text-base font-black text-[#032650] uppercase tracking-wide text-center break-words line-clamp-2">
                                    {{ sponsor.name }}
                                </p>
                            </div>
                            <span v-if="sponsor.role"
                                class="block w-full text-sm font-bold text-gray-500 uppercase tracking-wider text-center break-words">
                                {{ sponsor.role }}
                            </span>
                        </a>
                    </div>

                    <div v-else
                        class="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4 py-12">
                        Hier kommen unsere Hauptsponsoren hin
                    </div>
                </div>

                <div class="border-t-2 border-gray-200 mt-10 lg:mt-15 pt-8">
                    <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-5">
                        Unsere Sponsoren
                    </h3>

                    <div v-if="sponsoren.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <a v-for="sponsor in sponsoren" :key="sponsor._uid" :href="sponsorHref(sponsor)"
                            :target="sponsorHref(sponsor) ? '_blank' : undefined"
                            :rel="sponsorHref(sponsor) ? 'noopener noreferrer' : undefined"
                            class="flex flex-col items-center justify-start gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 hover:-translate-y-1 hover:shadow-md transition-all active:scale-95">
                            <img loading="lazy" decoding="async" v-if="sponsor.logo?.filename" :src="sponsor.logo.filename" :alt="sponsor.name"
                                class="w-full h-20 object-contain" />
                            <div class="w-full flex flex-col items-center justify-center min-h-[2rem]">
                                <p class="text-sm font-bold text-[#032650] text-center break-words line-clamp-2 ">
                                    {{ sponsor.name }}
                                </p>
                            </div>
                            <span v-if="sponsor.role"
                                class="block w-full text-xs font-bold text-gray-500 uppercase text-center break-words tracking-wider">
                                {{ sponsor.role }}
                            </span>
                        </a>
                    </div>

                    <div v-else
                        class="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4 py-12">
                        Hier kommen weitere Sponsoren hin
                    </div>
                </div>

                <div class="border-t-2 border-gray-200 mt-10 lg:mt-15 pt-8">
                    <div class="bg-[#004a87] text-white rounded-xl p-6 md:p-8 text-center">
                        <h3 class="text-lg md:text-xl font-black uppercase tracking-wide mb-2">
                            Werde Sponsor
                        </h3>
                        <p class="mb-6 font-medium leading-relaxed max-w-xl mx-auto">
                            Du möchtest die Blue Arrows Sasbach unterstützen und als Sponsor auftreten? Wir freuen
                            uns über jede Form der Unterstützung für unseren Spielbetrieb.
                        </p>
                        <a href="mailto:info@bluearrows.de"
                            class="inline-block bg-white text-[#032650] px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors text-sm">
                            Kontakt aufnehmen
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
