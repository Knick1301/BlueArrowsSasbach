<script setup lang="ts">
import { renderRichText, useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { formatDate } from '@/utils/methods.ts'
import { useRoute } from 'vue-router'
import DecoratedCard from '@/components/DecoratedCard.vue'

const route = useRoute()
const slug = route.params.slug

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
  story = await useStoryblok(`aktuelles/news/${slug}`, { version: STORYBLOK_VERSION })
} catch (e) {
  console.error(`Storyblok-Story "aktuelles/news/${slug}" konnte nicht geladen werden.`, e)
}
</script>

<template>
  <div v-if="story" class="pb-20">
    <div class="w-full py-[54px] bg-[#032650] text-center px-4 relative flex items-center justify-center">
      <router-link to="/aktuelles/news"
        class="absolute left-4 md:left-10 inline-flex items-center leading-none gap-1.5 text-white font-bold hover:text-gray-300 transition-colors text-sm">
        <span class="inline-block leading-none">&larr;</span>
        <span class="leading-none">Zurück</span>
      </router-link>

      <h1 class="text-2xl font-black text-white uppercase tracking-wider truncate px-20 md:px-28">
        <span class="md:hidden">News</span>
        <span class="hidden md:inline">{{ story.content.title }}</span>
      </h1>

      <span v-if="story.content.score"
        class="hidden md:inline-block absolute right-4 md:right-10 bg-white text-[#032650] text-base font-black px-3 py-1 rounded-lg shadow-sm leading-none">
        {{ story.content.score }}
      </span>
    </div>

    <div class="w-[95%] max-w-4xl mx-auto mt-10">
      <DecoratedCard content-class="flex flex-col">

        <img v-if="story.content.image?.filename" :src="story.content.image.filename" alt="Artikel Bild"
          class="w-full aspect-[600/348] h-auto object-cover shrink-0 rounded-t-xl" />

        <div class="md:hidden px-6 pt-5 pb-5 border-b border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[#032650] font-bold text-sm uppercase tracking-wider">
              {{ formatDate(story.content.date) }}
            </span>
            <span v-if="story.content.score"
              class="bg-[#032650] text-white text-sm font-bold px-2.5 py-1 rounded-md tracking-wide shrink-0">
              {{ story.content.score }}
            </span>
          </div>
          <h2 class="text-2xl font-black text-gray-900 leading-tight">
            {{ story.content.title }}
          </h2>
        </div>

        <div class="px-6 pb-6 pt-4 md:p-10 lg:p-12">
          <p
            class="hidden md:inline-block text-gray-500 font-bold uppercase tracking-wider text-sm mb-8 text-center border-b border-gray-200 pb-4 w-full">
            {{ formatDate(story.content.date) }}
          </p>

          <div
            class="prose prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 prose-lg md:prose-xl max-w-none text-gray-800 prose-h4:mt-8 prose-h4:mb-2 prose-h5:mt-8 prose-h5:mb-2 prose-h6:mt-8 prose-h6:mb-2 prose-h4:text-[#032650] prose-h5:text-[#032650] prose-h6:text-[#032650] prose-h4:font-black prose-h5:font-black prose-h6:font-black"
            v-html="renderRichText(story.content.content)">
          </div>
        </div>

      </DecoratedCard>
    </div>
  </div>

  <div v-else class="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
    <h1 class="text-2xl font-black text-[#032650] uppercase tracking-wide mb-4">
      Artikel nicht gefunden
    </h1>
    <p class="text-gray-600 mb-6 max-w-md">
      Dieser Artikel existiert nicht oder wurde entfernt.
    </p>
    <router-link to="/aktuelles/news"
      class="inline-block bg-[#032650] text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors text-sm">
      Zu den News
    </router-link>
  </div>
</template>