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
  <div class="bg-gray-50 min-h-screen pb-10">


    <div class="w-full py-13 bg-[#032650] text-center px-4 mb-10">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">Aktuelle News</h1>
    </div>

    <div v-if="latestNews"
      class="relative w-[90%] lg:w-[80%] mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-12 flex flex-col md:flex-row transition-all hover:shadow-md">


      <div class="md:w-1/2 w-full relative">
        <img v-if="latestNews.image?.filename" :src="latestNews.image.filename" alt="News Image"
          class="w-full h-[300px] md:h-full object-cover" />
        <div v-else class="w-full h-[300px] md:h-full bg-gray-200 flex items-center justify-center">

        </div>

        <span v-if="latestNews.score"
          class="absolute top-4 right-4 bg-[#032650] text-white text-lg font-black px-4 py-1.5 rounded-lg shadow-md">
          {{ latestNews.score }}
        </span>
      </div>

      <div class="md:w-1/2 w-full p-8 lg:p-10 flex flex-col">

        <span class="text-[#032650] font-bold text-sm uppercase tracking-wider mb-2">
          {{ formatDate(latestNews.date) }}
        </span>

        <h2 class="text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-6">
          {{ latestNews.title }}
        </h2>

        <div class="text-gray-600 text-lg mb-8 line-clamp-6 flex-grow break-words"
          v-html="renderRichText(latestNews.content)"></div>

        <router-link :to="`/aktuelles/news/${latestNews.slug}`"
          class="bg-[#032650] text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-800 transition-colors mt-auto w-full text-center block text-lg">
          Ganzen Artikel lesen
        </router-link>
      </div>
    </div>


    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-[90%] lg:w-[80%] mx-auto mb-12">
      <div v-for="newsItem in olderNews" :key="newsItem._uid"
        class="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-md">


        <div class="relative w-full h-[220px]">
          <img v-if="newsItem.image?.filename" :src="newsItem.image.filename" alt="News Image"
            class="w-full h-full object-cover" />
          <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center"></div>

          <span v-if="newsItem.score"
            class="absolute top-3 right-3 bg-[#032650] text-white text-sm font-black px-3 py-1 rounded-lg shadow-md">
            {{ newsItem.score }}
          </span>
        </div>


        <div class="p-6 flex flex-col flex-grow">

          <span class="text-[#032650] font-bold text-xs uppercase tracking-wider mb-2">
            {{ formatDate(newsItem.date) }}
          </span>

          <h3 class="text-xl font-black text-gray-900 leading-tight mb-4">
            {{ newsItem.title }}
          </h3>


          <div class="text-gray-600 text-sm mb-6 line-clamp-4 flex-grow break-words"
            v-html="renderRichText(newsItem.content)"></div>

          <router-link :to="`/aktuelles/news/${newsItem.slug}`"
            class="bg-gray-100 text-[#032650] border border-gray-200 px-4 py-3 rounded-lg font-bold hover:bg-[#032650] hover:text-white transition-colors mt-auto w-full text-center block text-sm">
            Artikel lesen
          </router-link>
        </div>
      </div>
    </div>


    <div v-if="hasMoreNews" class="text-center mb-10">
      <button @click="loadMore"
        class="bg-white border-2 border-[#032650] text-[#032650] px-8 py-3 rounded-full font-bold hover:bg-[#032650] hover:text-white transition-colors cursor-pointer shadow-sm">
        Weitere News laden
      </button>
    </div>

  </div>
</template>