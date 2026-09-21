<script setup lang="ts">
import { useStoryblokApi } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed, ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import DecoratedCard from '@/components/DecoratedCard.vue'

type RawDate = Record<string, string | undefined>

interface TerminEintrag {
    id: string
    kategorie: string
    titel: string
    start: Date
    tag: number
    monat: string
    beschreibung: string
    to: RouteLocationRaw
}

const storyblokApi = useStoryblokApi()

const ladeDates = async (slug: string): Promise<RawDate[]> => {
    try {
        const { data } = await storyblokApi.get(`cdn/stories/${slug}`, { version: STORYBLOK_VERSION })
        return (data.story.content.dates as RawDate[] | undefined) ?? []
    } catch (e) {
        console.error(`Storyblok-Story "${slug}" konnte nicht geladen werden.`, e)
        return []
    }
}

const [discoRaw, burgerRaw, ferienRaw] = await Promise.all([
    ladeDates('events/inlinedisco'),
    ladeDates('events/burgerista'),
    ladeDates('skating/schuleferien'),
])

const parseDatum = (wert: string | undefined): Date | null => {
    if (!wert) return null
    const datum = new Date(wert.replace(' ', 'T'))
    return isNaN(datum.getTime()) ? null : datum
}

const feld = (raw: RawDate, ...keys: string[]) => keys.map((key) => raw[key]).find((wert) => wert)

const heute = new Date()
heute.setHours(0, 0, 0, 0)

const monatKurz = (datum: Date) =>
    datum.toLocaleDateString('de-DE', { month: 'short' }).replace('.', '')
const wochentag = (datum: Date) => datum.toLocaleDateString('de-DE', { weekday: 'long' })
const uhrzeitVon = (datum: Date) =>
    datum.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })

const eventTermin = (
    raw: RawDate,
    index: number,
    kategorie: string,
    to: RouteLocationRaw,
    fallbackTitel: string,
): TerminEintrag | null => {
    const start = parseDatum(feld(raw, 'date', 'datum'))
    if (!start || start < heute) return null

    const uhrzeit = feld(raw, 'time', 'uhrzeit')
    const ort = feld(raw, 'location', 'standort')
    const beschreibung = [wochentag(start), uhrzeit ? `${uhrzeit} Uhr` : '', ort ?? '']
        .filter(Boolean)
        .join(' · ')

    return {
        id: `${kategorie}-${index}`,
        kategorie,
        titel: feld(raw, 'title', 'titel') ?? fallbackTitel,
        start,
        tag: start.getDate(),
        monat: monatKurz(start),
        beschreibung,
        to,
    }
}

const ferienTermin = (raw: RawDate, index: number): TerminEintrag | null => {
    const start = parseDatum(raw.ferienDatumStart)
    const ende = parseDatum(raw.ferienDatumEnde) ?? start
    if (!start || !ende || ende < heute) return null

    const zeitraum = `${start.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })} – ${ende.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}`

    return {
        id: `Ferienprogramm-${index}`,
        kategorie: 'Ferienprogramm',
        titel: 'Ferienprogramm',
        start,
        tag: start.getDate(),
        monat: monatKurz(start),
        beschreibung: `${zeitraum} · ${uhrzeitVon(start)} bis ${uhrzeitVon(ende)} Uhr`,
        to: { name: 'schuleFerien' },
    }
}

const alleTermine: TerminEintrag[] = [
    ...discoRaw.map((raw, i) => eventTermin(raw, i, 'Inline Disco', { name: 'inlinedisco' }, 'Inline Disco')),
    ...burgerRaw.map((raw, i) => eventTermin(raw, i, 'Burgerista', { name: 'burgerista' }, 'Burgerista')),
    ...ferienRaw.map((raw, i) => ferienTermin(raw, i)),
]
    .filter((termin): termin is TerminEintrag => termin !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime())

const kategorien = ['Inline Disco', 'Burgerista', 'Ferienprogramm'].filter((kategorie) =>
    alleTermine.some((termin) => termin.kategorie === kategorie),
)

const auswahl = ref('Alle')

const gruppen = computed(() => {
    const gruppiert = new Map<string, { label: string; eintraege: TerminEintrag[] }>()
    for (const termin of alleTermine) {
        if (auswahl.value !== 'Alle' && termin.kategorie !== auswahl.value) continue
        const key = `${termin.start.getFullYear()}-${termin.start.getMonth()}`
        if (!gruppiert.has(key)) {
            gruppiert.set(key, {
                label: termin.start.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }),
                eintraege: [],
            })
        }
        gruppiert.get(key)!.eintraege.push(termin)
    }
    return [...gruppiert.values()]
})
</script>

<template>
    <div class="mb-15">

        <div class="w-full py-13 bg-[#032650] text-center px-4">
            <h1 class="text-3xl font-black text-white uppercase tracking-wider">Termine</h1>
        </div>

        <div class="max-w-4xl w-[95%] mx-auto mt-15 px-4">

            <DecoratedCard>
                <div v-if="kategorien.length > 1" class="flex flex-wrap justify-center gap-2 mb-8">
                    <button v-for="option in ['Alle', ...kategorien]" :key="option" type="button"
                        :aria-pressed="auswahl === option" @click="auswahl = option" :class="[
                            'px-3 py-1 text-sm font-medium rounded-full transition-colors cursor-pointer',
                            auswahl === option
                                ? 'bg-[#032650] text-white shadow-sm'
                                : 'border border-[#032650] text-[#032650] hover:bg-[#032650] hover:text-white',
                        ]">
                        {{ option }}
                    </button>
                </div>

                <template v-if="gruppen.length">
                    <div v-for="(gruppe, index) in gruppen" :key="gruppe.label"
                        :class="index > 0 ? 'border-t-2 border-gray-200 mt-8 pt-8' : ''">
                        <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-4">
                            {{ gruppe.label }}
                        </h3>

                        <div class="flex flex-col gap-3">
                            <router-link v-for="termin in gruppe.eintraege" :key="termin.id" :to="termin.to"
                                class="group flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4 hover:-translate-y-1 hover:shadow-md transition-all">
                                <div
                                    class="shrink-0 w-14 py-2 rounded-lg bg-[#032650] text-white text-center leading-none">
                                    <span class="block text-2xl font-black">{{ termin.tag }}</span>
                                    <span class="block text-xs font-bold uppercase tracking-wide mt-1">
                                        {{ termin.monat }}
                                    </span>
                                </div>

                                <div class="min-w-0 flex-1 flex flex-col gap-1">
                                    <span
                                        class="inline-block bg-blue-50 text-[#032650] text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full w-fit">
                                        {{ termin.kategorie }}
                                    </span>
                                    <p class="text-base font-black text-[#032650] uppercase tracking-wide">
                                        {{ termin.titel }}
                                    </p>
                                    <p class="text-sm font-medium text-gray-600">
                                        {{ termin.beschreibung }}
                                    </p>
                                </div>

                                <span aria-hidden="true"
                                    class="shrink-0 text-[#032650] font-bold transition-transform group-hover:translate-x-1">&rarr;</span>
                            </router-link>
                        </div>
                    </div>
                </template>

                <div v-else
                    class="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4 py-12">
                    Aktuell stehen keine Termine fest. Schaut bald wieder vorbei!
                </div>
            </DecoratedCard>
        </div>
    </div>
</template>
