<script setup lang="ts">
import { renderRichText, useStoryblokApi } from '@storyblok/vue'
import { computed, ref } from 'vue'
import { formatDate } from '@/utils/methods.ts'

const storyblokApi = useStoryblokApi()

const { data } = await storyblokApi.get('cdn/stories', {
  version: 'draft',
  starts_with: 'aktuelles/news/',
  is_startpage: false,
  sort_by: 'content.date:desc',
})

const visibleLimit = ref(5)

const news = computed(() => {
  return data.stories.map((story: any) => ({
    _uid: story.uuid,
    slug: story.slug,
    title: story.content.title,
    date: story.content.date,
    image: story.content.image,
    content: story.content.content,
    score: story.content.score,
  }))
})

const latestNews = computed(() => {
  return news.value.length > 0 ? news.value[0] : null
})

const olderNews = computed(() => {
  return news.value.length > 1 ? news.value.slice(1, visibleLimit.value) : []
})

const loadMore = () => {
  visibleLimit.value += 4
}

const hasMoreNews = computed(() => {
  return news.value.length > visibleLimit.value
})
</script>

<template>
  <div>
    <div class="w-full py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">Aktuelle News</h1>
    </div>

    <div v-if="latestNews"
      class="relative w-[80%] mx-auto py-6 px-6 my-10 mb-10 bg-white rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.3)] min-w-0">
      <span v-if="latestNews.score"
        class="absolute top-6 right-6 bg-[#032650] text-white text-lg font-black px-4 py-1.5 rounded-xl shadow-md">
        {{ latestNews.score }}
      </span>

      <h2 class="text-2xl font-bold mb-4 pr-24">
        <span class="text-[#032650] border-b-[3px] border-[#032650] inline-block">
          {{ latestNews.title }}
        </span>
      </h2>

      <p class="text-gray-600 mb-4">{{ formatDate(latestNews.date) }}</p>

      <div class="flex flex-col md:flex-row gap-6 min-w-0">
        <img v-if="latestNews.image?.filename" :src="latestNews.image.filename" alt="News Image"
          class="w-full md:w-1/2 h-auto max-h-[400px] rounded-xl object-cover border-2 border-gray-300 shadow-md" />

        <div class="w-full md:w-1/2 flex flex-col gap-4 min-w-0">
          <div
            class="text-gray-800 bg-gray-50 border-l-[5px] border-l-[#032650] border border-gray-200 rounded-xl p-3 pt-2 pb-0 line-clamp-[13] flex-grow break-words min-w-0"
            v-html="renderRichText(latestNews.content)"></div>

          <router-link :to="`/aktuelles/news/${latestNews.slug}`"
            class="bg-[#032650] text-white px-6 py-2 rounded font-bold hover:bg-blue-800 transition-colors self-start mt-auto w-full text-center block">
            Artikel lesen
          </router-link>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 w-[80%] mx-auto py-4 mb-8">
      <div v-for="newsItem in olderNews" :key="newsItem._uid"
        class="relative bg-white rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.3)] p-4 flex flex-col min-w-0">
        <span v-if="newsItem.score"
          class="absolute top-4 right-4 bg-[#032650] text-white text-sm font-black px-3 py-1 rounded-xl shadow-md">
          {{ newsItem.score }}
        </span>

        <h3 class="text-xl text-[#032650] font-bold mb-2 pr-20">{{ newsItem.title }}</h3>
        <p class="text-gray-600 mb-4">{{ formatDate(newsItem.date) }}</p>

        <div class="flex flex-col md:flex-row gap-6 h-full min-w-0">
          <img v-if="newsItem.image?.filename" :src="newsItem.image.filename" alt="News Image"
            class="xl:w-2/5 h-[200px] w-full rounded-xl object-cover border-2 border-gray-300 shadow-md" />

          <div class="xl:w-3/5 w-full flex flex-col gap-3 min-w-0">
            <div
              class="text-gray-800 bg-gray-50 border-l-[5px] border-l-[#032650] border border-gray-200 rounded-xl p-3 pt-2 pb-0 line-clamp-6 flex-grow break-words min-w-0"
              v-html="renderRichText(newsItem.content)"></div>

            <router-link :to="`/aktuelles/news/${newsItem.slug}`"
              class="text-sm bg-[#032650] text-white px-4 py-2 rounded font-bold hover:bg-blue-800 transition-colors self-start mt-auto w-full text-center block">
              Ganzen Artikel lesen
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div v-if="hasMoreNews" class="text-center mb-10">
        <button @click="loadMore"
          class="bg-[#032650] text-white px-6 py-2 rounded font-bold hover:bg-blue-800 transition-colors cursor-pointer">
          Mehr laden
        </button>
      </div>
    </div>
  </div>
</template>
