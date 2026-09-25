<script setup lang="ts">
import { renderRichText, useStoryblokApi, type StoryblokRichTextNode } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { formatDate, resizeImage } from '@/utils/methods.ts'
import NewsCard from '@/components/NewsCard.vue'

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
const stories = ref<NewsStory[]>([])

const fetchAllNews = async () => {
  const perPage = 100
  let page = 1
  const all: NewsStory[] = []

  try {
    while (true) {
      const response = await storyblokApi.get('cdn/stories', {
        version: STORYBLOK_VERSION,
        starts_with: 'aktuelles/news/',
        is_startpage: false,
        sort_by: 'content.date:desc',
        per_page: perPage,
        page,
      })
      all.push(...response.data.stories)
      if (all.length >= response.total || response.data.stories.length === 0) break
      page++
    }
    stories.value = all
  } catch (e) {
    console.error('Storyblok-Stories "aktuelles/news" konnten nicht geladen werden.', e)
  }
}

await fetchAllNews()

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

const mainYear = computed(() => {
  const first = news.value[0]
  return first ? new Date(first.date).getFullYear() : new Date().getFullYear()
})

const mainYearNews = computed(() => {
  return news.value.filter((item) => new Date(item.date).getFullYear() === mainYear.value)
})

const pastYears = computed(() => {
  const groups = new Map<number, typeof news.value>()
  for (const item of news.value) {
    const year = new Date(item.date).getFullYear()
    if (year === mainYear.value) continue
    if (!groups.has(year)) groups.set(year, [])
    groups.get(year)!.push(item)
  }
  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, items }))
})

const openYears = ref<Set<number>>(new Set())
const toggleYear = (year: number) => {
  const next = new Set(openYears.value)
  if (next.has(year)) next.delete(year)
  else next.add(year)
  openYears.value = next
}

const YEAR_INITIAL_LIMIT = 3
const yearLimits = ref<Map<number, number>>(new Map())

const getYearLimit = (year: number) => yearLimits.value.get(year) ?? YEAR_INITIAL_LIMIT

const displayedYearItems = (year: number, items: typeof news.value) => {
  const limit = getYearLimit(year)
  const visible = items.slice(0, limit)
  const count = visible.length
  const c = columns.value
  if (c > 1 && count > c && count % c === 1 && items.length > limit) {
    return visible.slice(0, count - 1)
  }
  return visible
}

const yearHasMore = (year: number, total: number) => total > getYearLimit(year)

const loadMoreYear = (year: number) => {
  const next = new Map(yearLimits.value)
  next.set(year, getYearLimit(year) + columns.value)
  yearLimits.value = next
}

const loadLessYear = (year: number) => {
  const next = new Map(yearLimits.value)
  next.set(year, Math.max(YEAR_INITIAL_LIMIT, getYearLimit(year) - columns.value))
  yearLimits.value = next
}

const latestNews = computed(() => {
  return mainYearNews.value.length > 0 ? mainYearNews.value[0] : null
})

const olderNews = computed(() => {
  return mainYearNews.value.length > 1 ? mainYearNews.value.slice(1, visibleLimit.value) : []
})

const hasMoreNews = computed(() => {
  return mainYearNews.value.length > visibleLimit.value
})

const displayedOlderNews = computed(() => {
  const count = olderNews.value.length
  const c = columns.value
  if (c > 1 && count > c && count % c === 1 && hasMoreNews.value) {
    return olderNews.value.slice(0, count - 1)
  }
  return olderNews.value
})

const loadMore = () => {
  visibleLimit.value += columns.value
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
            class="bg-white text-[#032650] text-base font-bold px-2.5 py-1 rounded-md tracking-wide shrink-0">
            {{ latestNews.score }}
          </span>
        </div>

        <h2 class="text-3xl lg:text-4xl font-black leading-tight mb-4">
          {{ latestNews.title }}
        </h2>

        <div class="text-gray-200 text-base mb-7 line-clamp-5 flex-grow break-words"
          v-html="renderRichText(latestNews.content)"></div>

        <span class="inline-flex items-center gap-1.5 text-white font-bold text-base mt-auto shrink-0">
          Weiterlesen
          <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">&rarr;</span>
        </span>
      </div>
    </router-link>

    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-[calc(95%-2rem)] md:w-[80%] max-w-[1300px] mx-auto mb-10">
      <NewsCard v-for="newsItem in displayedOlderNews" :key="newsItem._uid" :slug="newsItem.slug"
        :title="newsItem.title" :date="newsItem.date" :image="newsItem.image" :content="newsItem.content"
        :score="newsItem.score" />
    </div>

    <div v-if="hasMoreNews || visibleLimit > 4" class="flex flex-wrap justify-center gap-4 mb-4">
      <button v-if="visibleLimit > 4" @click="loadLess"
        class="bg-white border-2 border-[#032650] text-[#032650] px-8 py-3 rounded-full font-bold hover:bg-[#032650] hover:text-white transition-colors cursor-pointer shadow-sm">
        Weniger News anzeigen
      </button>
      <button v-if="hasMoreNews" @click="loadMore"
        class="bg-white border-2 border-[#032650] text-[#032650] px-8 py-3 rounded-full font-bold hover:bg-[#032650] hover:text-white transition-colors cursor-pointer shadow-sm">
        Weitere News laden
      </button>
    </div>

    <div v-if="pastYears.length" class="w-[calc(95%-2rem)] md:w-[80%] max-w-[1300px] mx-auto mt-8 space-y-3">
      <div v-for="group in pastYears" :key="group.year"
        class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button @click="toggleYear(group.year)"
          class="w-full flex items-center justify-between gap-4 px-6 py-4 text-left cursor-pointer hover:bg-gray-50 transition-colors">
          <span class="text-[#032650] font-black text-lg uppercase tracking-wide">
            News {{ group.year }}
          </span>
          <span class="flex items-center gap-3 text-gray-400 shrink-0">
            <span class="text-sm font-bold">{{ group.items.length }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
              stroke="currentColor"
              :class="['w-4 h-4 transition-transform', openYears.has(group.year) ? 'rotate-180' : '']">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </button>

        <div v-if="openYears.has(group.year)" class="p-6 pt-2">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-4">
            <NewsCard v-for="newsItem in displayedYearItems(group.year, group.items)" :key="newsItem._uid"
              :slug="newsItem.slug" :title="newsItem.title" :date="newsItem.date" :image="newsItem.image"
              :content="newsItem.content" :score="newsItem.score" />
          </div>

          <div v-if="yearHasMore(group.year, group.items.length) || getYearLimit(group.year) > YEAR_INITIAL_LIMIT"
            class="flex flex-wrap justify-center gap-4">
            <button v-if="getYearLimit(group.year) > YEAR_INITIAL_LIMIT" @click="loadLessYear(group.year)"
              class="bg-white border-2 border-[#032650] text-[#032650] px-6 py-2.5 rounded-full font-bold hover:bg-[#032650] hover:text-white transition-colors cursor-pointer shadow-sm text-sm">
              Weniger News anzeigen
            </button>
            <button v-if="yearHasMore(group.year, group.items.length)" @click="loadMoreYear(group.year)"
              class="bg-white border-2 border-[#032650] text-[#032650] px-6 py-2.5 rounded-full font-bold hover:bg-[#032650] hover:text-white transition-colors cursor-pointer shadow-sm text-sm">
              Weitere News laden
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
