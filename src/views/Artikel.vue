<script setup lang="ts">
import { renderRichText, useStoryblok } from '@storyblok/vue'
import { formatDate } from '@/utils/methods.ts'
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = route.params.slug

const story = await useStoryblok(`aktuelles/news/${slug}`, { version: 'draft' })
</script>

<template>
  <div v-if="story" class="pb-20">
    <div class="w-full py-13 bg-[#032650] text-center px-4 relative flex items-center justify-center min-h-[120px]">
      <router-link to="/aktuelles/news"
        class="absolute left-4 md:left-10 text-white font-bold hover:text-gray-300 flex items-center gap-2 transition-colors">
        <span>&larr;</span> Zurück
      </router-link>

      <h1 class="text-3xl font-black text-white uppercase tracking-wider px-20">
        {{ story.content.title }}
      </h1>

      <span v-if="story.content.score"
        class="absolute right-4 md:right-10 bg-white text-[#032650] text-xl font-black px-4 py-1.5 rounded-lg shadow-sm">
        {{ story.content.score }}
      </span>
    </div>

    <div class="w-[90%] max-w-4xl mx-auto mt-10">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">

        <img v-if="story.content.image?.filename" :src="story.content.image.filename" alt="Artikel Bild"
          class="w-full aspect-[600/348] h-auto object-cover shrink-0" />

        <div class="p-6 md:p-10 lg:p-12">
          <p
            class="text-gray-500 font-bold uppercase tracking-wider text-sm mb-8 text-center border-b border-gray-200 pb-4 inline-block w-full">
            {{ formatDate(story.content.date) }}
          </p>

          <div class="prose prose-lg md:prose-xl max-w-none text-gray-800"
            v-html="renderRichText(story.content.content)">
          </div>
        </div>

      </div>
    </div>
  </div>

  <div v-else class="text-center py-20 text-xl font-bold text-[#032650]">
    Artikel wird geladen...
  </div>
</template>