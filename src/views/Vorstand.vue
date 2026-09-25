<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed } from 'vue'
import { setPageMeta } from '@/utils/seo'
import DecoratedCard from '@/components/DecoratedCard.vue'
import PersonCard from '@/components/PersonCard.vue'

interface KontaktpersonBlok {
  _uid: string
  component: string
  name: string
  role?: string
  categorie?: 'vorstand' | 'sonstiges' | ''
  image?: { filename: string }
  email?: string
  phone?: string
}

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
  story = await useStoryblok(`verein/vorstand`, { version: STORYBLOK_VERSION })
} catch (e) {
  console.error('Storyblok-Story "verein/vorstand" konnte nicht geladen werden.', e)
}

const title = computed(() => story?.value?.content.title || 'Vorstand')
setPageMeta({ title: title.value })

const ansprechpartner = computed(
  () => (story?.value?.content.personen as KontaktpersonBlok[] | undefined) ?? [],
)

const vorstand = computed(() => ansprechpartner.value.filter((p) => p.categorie !== 'sonstiges'))
const weitereAnsprechpartner = computed(() =>
  ansprechpartner.value.filter((p) => p.categorie === 'sonstiges'),
)
</script>

<template>
  <div class="mb-15">
    <div class="w-full py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">{{ title }}</h1>
    </div>

    <div class="max-w-6xl w-[95%] mx-auto mt-15 px-5">
      <DecoratedCard content-class="p-6 px-4 md:p-10 md:px-6">
        <h2 class="text-[#032650] text-2xl font-black mt-0 uppercase tracking-wide mb-6 text-center">
          <span class="inline-block border-b-[3px] border-[#032650] pb-1">Unser Vorstand</span>
        </h2>

        <div v-if="vorstand.length" class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <PersonCard v-for="person in vorstand" :key="person._uid" :person="person" />
        </div>

        <div v-else
          class="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4 py-12">
          Hier kommen Vorstandsmitglieder hin
        </div>

        <div class="border-t-2 border-gray-200 mt-10 lg:mt-15 pt-8">
          <h3 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-5">
            Weitere Ansprechpartner
          </h3>

          <div v-if="weitereAnsprechpartner.length" class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <PersonCard v-for="person in weitereAnsprechpartner" :key="person._uid" :person="person" />
          </div>

          <div v-else
            class="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-lg text-center px-4 py-12">
            Hier kommen weitere Ansprechpartner hin
          </div>
        </div>
      </DecoratedCard>
    </div>
  </div>
</template>
