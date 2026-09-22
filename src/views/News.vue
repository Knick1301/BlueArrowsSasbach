<script setup lang="ts">
import { renderRichText, useStoryblokApi, type StoryblokRichTextNode } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { formatDate, resizeImage } from '@/utils/methods.ts'

const storyblokApi = useStoryblokApi()

interface NewsStory {
  uuid: string
  slug: string
  content: {
    title: string
    date: string
    image?: { filename: string }[]
    content: StoryblokRichTextNode
    score?: string
  }
}

const visibleLimit = ref(4)
const fetchedOlderCount = ref(0)
const totalCount = ref(0)
const stories = ref<NewsStory[]>([])

// Lädt genau so viele Stories nach, wie aktuell sichtbar sein sollen (Hero + Grid zusammen),
// nicht alle auf einmal - "Weitere News laden" fragt gezielt mehr an statt nur mehr anzuzeigen.
const ensureLoaded = async (totalNeeded: number) => {
  if (totalNeeded <= fetchedOlderCount.value + 1 && stories.value.length > 0) return

  try {
    const response = await storyblokApi.get('cdn/stories', {
      version: STORYBLOK_VERSION,
      starts_with: 'aktuelles/news/',
      is_startpage: false,
      sort_by: 'content.date:desc',
      per_page: totalNeeded,
      page: 1,
    })
    stories.value = response.data.stories
    totalCount.value = response.total
    fetchedOlderCount.value = Math.max(0, stories.value.length - 1)
  } catch (e) {
    console.error('Storyblok-Stories "aktuelles/news" konnten nicht geladen werden.', e)
  }
}

await ensureLoaded(visibleLimit.value)

const getColumns = () => {
  if (typeof window === 'undefined') return 3
  if (window.matchMedia('(min-width: 1280px)').matches) return 3
  if (window.matchMedia('(min-width: 768px)').matches) return 2
  return 1
}

const columns = ref(getColumns())
const updateColumns = () => {
  columns.value = getColumns()
}

let mqlMd: MediaQueryList | undefined
let mqlXl: MediaQueryList | undefined

onMounted(() => {
  mqlMd = window.matchMedia('(min-width: 768px)')
  mqlXl = window.matchMedia('(min-width: 1280px)')
  mqlMd.addEventListener('change', updateColumns)
  mqlXl.addEventListener('change', updateColumns)
})

onBeforeUnmount(() => {
  mqlMd?.removeEventListener('change', updateColumns)
  mqlXl?.removeEventListener('change', updateColumns)
})

const news = computed(() => {
  return stories.value.map((story) => ({
    _uid: story.uuid,
    slug: story.slug,
    title: story.content.title,
    date: story.content.date,
    image: story.content.image?.[0],
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

const hasMoreNews = computed(() => {
  return totalCount.value > visibleLimit.value
})

const displayedOlderNews = computed(() => {
  const count = olderNews.value.length
  const c = columns.value
  if (c > 1 && count > c && count % c === 1 && hasMoreNews.value) {
    return olderNews.value.slice(0, count - 1)
  }
  return olderNews.value
})

const loadMore = async () => {
  visibleLimit.value += columns.value
  await ensureLoaded(visibleLimit.value)
}

const loadLess = () => {
  visibleLimit.value -= columns.value
  if (visibleLimit.value < 4) visibleLimit.value = 4
}
</script>

<template>
  <div class="bg-gray-100 min-h-screen pb-10">
    <div class="w-full py-13 bg-[#032650] text-center px-4 mb-15">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">Aktuelle News</h1>
    </div>

    <router-link v-if="latestNews" :to="`/aktuelles/news/${latestNews.slug}`"
      class="group w-[calc(95%-2rem)] md:w-[80%] max-w-[1300px] mx-auto rounded-xl overflow-hidden mb-12 flex flex-col md:flex-row shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
      <div class="md:w-1/2 w-full relative aspect-[600/348] shrink-0 min-h-0">
        <img v-if="latestNews.image?.filename" :src="resizeImage(latestNews.image.filename, 900)" fetchpriority="high"
          alt="News Image" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center"></div>
      </div>

      <div class="md:w-1/2 w-full p-8 lg:p-10 flex flex-col bg-[#004a87] text-white">
        <div class="flex items-center justify-between mb-2">
          <span class="flex items-center gap-2 text-gray-300 font-bold text-sm uppercase tracking-wider gap-2">
            {{ formatDate(latestNews.date) }}
          </span>

          <span v-if="latestNews.score"
            class="bg-white text-[#032650] text-md font-bold px-2.5 py-1 rounded-md tracking-wide shrink-0">
            {{ latestNews.score }}
          </span>
        </div>

        <h2 class="text-3xl lg:text-4xl font-black leading-tight mb-4">
          {{ latestNews.title }}
        </h2>

        <div class="text-gray-200 text-md mb-7 line-clamp-5 flex-grow break-words"
          v-html="renderRichText(latestNews.content)"></div>

        <span class="inline-flex items-center gap-1.5 text-white font-bold text-md mt-auto shrink-0">
          Weiterlesen
          <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">&rarr;</span>
        </span>
      </div>
    </router-link>

    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-[calc(95%-2rem)] md:w-[80%] max-w-[1300px] mx-auto mb-10">
      <router-link v-for="newsItem in displayedOlderNews" :key="newsItem._uid" :to="`/aktuelles/news/${newsItem.slug}`"
        class="group bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-md shadow-sm h-full">
        <div class="w-full aspect-[600/348] shrink-0 min-h-0">
          <img loading="lazy" decoding="async" v-if="newsItem.image?.filename"
            :src="resizeImage(newsItem.image.filename, 600)" alt="News Image" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center"></div>
        </div>

        <div class="p-5 pt-3 flex flex-col flex-grow">
          <div class="flex items-center justify-between mb-2">
            <span class="flex items-center text-[#032650] font-bold text-sm uppercase tracking-wider gap-2">
              {{ formatDate(newsItem.date) }}
            </span>

            <span v-if="newsItem.score"
              class="bg-[#032650] text-white text-sm font-bold px-2.5 py-1 rounded-md tracking-wide shrink-0">
              {{ newsItem.score }}
            </span>
          </div>

          <h3 class="text-xl font-black text-gray-900 leading-tight mb-3">
            {{ newsItem.title }}
          </h3>

          <div class="text-gray-700 text-md mb-4 line-clamp-2 font-medium flex-grow break-words"
            v-html="renderRichText(newsItem.content)"></div>

          <span class="inline-flex items-center gap-1.5 text-[#032650] font-bold text-sm mt-auto">
            Weiterlesen
            <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">&rarr;</span>
          </span>
        </div>
      </router-link>
    </div>

    <div v-if="hasMoreNews || visibleLimit > 4" class="flex flex-wrap justify-center gap-4">
      <button v-if="visibleLimit > 4" @click="loadLess"
        class="bg-white border-2 border-[#032650] text-[#032650] px-8 py-3 rounded-full font-bold hover:bg-[#032650] hover:text-white transition-colors cursor-pointer shadow-sm">
        Weniger News anzeigen
      </button>
      <button v-if="hasMoreNews" @click="loadMore"
        class="bg-white border-2 border-[#032650] text-[#032650] px-8 py-3 rounded-full font-bold hover:bg-[#032650] hover:text-white transition-colors cursor-pointer shadow-sm">
        Weitere News laden
      </button>
    </div>
  </div>
</template>
