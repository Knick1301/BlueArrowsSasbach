<script setup lang="ts">
import { useStoryblok, useStoryblokApi } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import GameCard from '@/components/GameCard.vue'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const modules = [Navigation]

const selectedTeam = ref('Alle')

const spieleChipsRow = ref<HTMLElement | null>(null)
const spieleChipsExtraHeight = ref(44)
let chipsResizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (spieleChipsRow.value) {
    chipsResizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) spieleChipsExtraHeight.value = entry.contentRect.height + 16
    })
    chipsResizeObserver.observe(spieleChipsRow.value)
  }
})

onBeforeUnmount(() => {
  chipsResizeObserver?.disconnect()
})

interface StoryblokLink {
  linktype: string
  cached_url?: string
  url?: string
}

interface GamesBlok {
  _uid: string
  component: string
  date: string
  hometeam?: string
  homeTeam?: string
  awayteam?: string
  awayTeam?: string
  homeLogo?: { filename: string }
  awayLogo?: { filename: string }
  venue?: string
  team: string
}

interface StoryblokBlok {
  _uid: string
  component: string
  [key: string]: unknown
}

interface Story {
  uuid: string
  name: string
  full_slug: string
  content: {
    title?: string
    image?: { filename: string }
    body?: StoryblokBlok[]
    [key: string]: unknown
  }
}

interface TeaserBlok {
  _uid: string
  component: string
  headline: string
  subline?: string
}

interface CardBlok {
  _uid: string
  component: string
  title: string
  image?: {
    filename: string
  }
  link?: StoryblokLink
}

const teamOrder = ['Herren', 'Junioren', 'Jugend', 'Schüler', 'Bambini']

const storyblokApi = useStoryblokApi()

const story = await useStoryblok('home', { version: STORYBLOK_VERSION })

const { data: newsData } = await storyblokApi.get('cdn/stories', {
  version: STORYBLOK_VERSION,
  starts_with: 'aktuelles/news/',
  is_startpage: false,
  sort_by: 'content.date:desc',
})

const { data: allStoriesData } = await storyblokApi.get('cdn/stories', {
  version: STORYBLOK_VERSION,
  per_page: 100,
})

const GAME_COMPONENTS = new Set(['Games', 'NextGame', 'games', 'game'])

const isBlokArray = (value: unknown): value is StoryblokBlok[] =>
  Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null && 'component' in value[0]

const extractGames = (bloks: StoryblokBlok[] | undefined, teamName: string): GamesBlok[] => {
  const games: GamesBlok[] = []
  if (!bloks) return games

  for (const blok of bloks) {
    if (GAME_COMPONENTS.has(blok.component)) {
      games.push({ ...blok, team: (blok.team as string) || teamName } as GamesBlok)
    }
    for (const key in blok) {
      if (isBlokArray(blok[key])) {
        games.push(...extractGames(blok[key] as StoryblokBlok[], teamName))
      }
    }
  }
  return games
}

const nextGames = computed(() => {
  const games: GamesBlok[] = []
  const stories = (allStoriesData?.stories ?? []) as Story[]

  for (const storyItem of stories) {
    const currentTeamName = storyItem.name
    if (!storyItem.content) continue

    if (storyItem.content.body) {
      games.push(...extractGames(storyItem.content.body, currentTeamName))
    }
    for (const key in storyItem.content) {
      if (key === 'body') continue
      const field = storyItem.content[key]
      if (isBlokArray(field)) {
        games.push(...extractGames(field, currentTeamName))
      }
    }
  }
  return games
})

const teamOptions = computed(() => {
  const now = new Date()

  const upcomingGames = nextGames.value.filter((g) => new Date(g.date) >= now)

  const teams = [...new Set(upcomingGames.map((g) => g.team))]

  const sortedTeams = teams.sort((a, b) => {
    let indexA = teamOrder.indexOf(a)
    let indexB = teamOrder.indexOf(b)

    if (indexA === -1) indexA = 99
    if (indexB === -1) indexB = 99

    return indexA - indexB
  })

  return ['Alle', ...sortedTeams]
})

const newsCards = computed(() => {
  const stories = (newsData?.stories ?? []) as Story[]

  return stories.map((newsItem) => ({
    _uid: newsItem.uuid,
    title: newsItem.content.title ?? '',
    image: newsItem.content.image,
    link: {
      linktype: 'story',
      cached_url: newsItem.full_slug,
    } satisfies StoryblokLink,
  }))
})

const teaser = computed(() =>
  (story.value?.content.body as StoryblokBlok[] | undefined)?.find(
    (blok): blok is StoryblokBlok & TeaserBlok => blok.component === 'teaser',
  ),
)

const teamCards = computed(
  () =>
    (story.value?.content.body as StoryblokBlok[] | undefined)?.filter(
      (blok): blok is StoryblokBlok & CardBlok => blok.component === 'TeamCard',
    ) || [],
)

const getUrl = (link: StoryblokLink | undefined): string => {
  if (!link) return '#'
  if (link.linktype === 'story' && link.cached_url) {
    return link.cached_url.startsWith('/') ? link.cached_url : '/' + link.cached_url
  }
  return link.url || '#'
}

const filteredGames = computed(() => {
  const now = new Date()
  return nextGames.value
    .filter((g) => {
      const gameDate = new Date(g.date)
      return !isNaN(gameDate.getTime()) && gameDate >= now
    })
    .filter((g) => selectedTeam.value === 'Alle' || g.team === selectedTeam.value)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4)
})
</script>

<template v-if="story && story.content">
  <div class="mainPicture w-full flex items-center h-[25vh] xl:h-[43vh] m-0 p-0">
    <h1 v-if="teaser"
      class="text-white text-[5vmin] font-extrabold leading-loose ml-[10vmin] drop-shadow-[2px_2px_8px_rgba(255,255,255,0.2)]"
      v-editable="teaser">
      {{ teaser.headline }}
      <br v-if="teaser.subline" />
      {{ teaser.subline }}
    </h1>
  </div>

  <div class="p-6 pt-0 flex-grow flex flex-col">
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start"
      :style="{ '--chips-extra': spieleChipsExtraHeight + 'px' }">

      <div
        class="xl:col-span-6 xl:sticky xl:top-32 xl:row-span-2 xl:h-auto min-[1550px]:col-span-4! min-[1550px]:row-span-1! min-[1550px]:h-full! flex flex-col h-full order-2 xl:order-1">
        <h2 class="font-bold text-[#032650] border-b-4 border-[#032650] inline-block mb-8 mt-4 text-2xl self-start">
          Unsere Teams
        </h2>

        <div
          class="grid grid-cols-2 gap-3 min-[1550px]:auto-rows-fr min-[1550px]:h-[calc(clamp(150px,19vh,300px)+var(--chips-extra,44px))]">
          <router-link v-for="team in teamCards" :key="team._uid" :to="getUrl(team.link)" v-editable="team"
            class="bg-white rounded-xl shadow-sm border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-all flex flex-col min-[1550px]:flex-row min-[1550px]:items-center overflow-hidden active:scale-95">
            <img :src="team.image?.filename"
              class="aspect-[600/348] w-full h-auto min-[1550px]:h-full min-[1550px]:w-auto object-cover shrink-0 border-b min-[1550px]:border-b-0 min-[1550px]:border-r border-gray-100"
              alt="Team Image" />
            <div
              class="text-sm lg:text-base font-bold text-[#032650] flex items-center justify-center p-2 text-center min-h-[40px] flex-grow min-w-0">
              <span class="line-clamp-2">{{ team.title }}</span>
            </div>
          </router-link>
        </div>
      </div>

      <div
        class="xl:col-span-6 min-[1550px]:col-span-5! min-[1650px]:col-span-4! flex flex-col xl:pl-4 h-full order-1 xl:order-2">
        <h2
          class="font-bold text-[#032650] border-b-4 border-[#032650] inline-block mb-8 xl:mx-8 mt-4 text-2xl self-start">
          <router-link to="/aktuelles/news" class="hover:text-blue-800 transition-colors">Aktuelle News</router-link>
        </h2>

        <div class="relative w-full h-auto min-[1550px]:h-[calc(clamp(150px,19vh,300px)+var(--chips-extra,44px))] px-8">
          <template v-if="newsCards.length > 0">
            <button
              class="news-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 text-[#032650] hover:scale-110 transition-transform cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <Swiper :modules="modules" :space-between="16" :auto-height="true" :breakpoints="{
              0: { slidesPerView: 1 },
              500: { slidesPerView: 2 },
              900: { slidesPerView: 2 },
              1550: { slidesPerView: 2, autoHeight: false },
            }" :navigation="{ prevEl: '.news-prev', nextEl: '.news-next' }"
              class="w-full h-auto min-[1550px]:h-full pb-4">
              <swiper-slide v-for="news in newsCards" :key="news._uid">
                <router-link :to="getUrl(news.link)" v-editable="news"
                  class="bg-white w-full h-full rounded-xl shadow-sm border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-all flex flex-col overflow-hidden active:scale-95">
                  <img :src="news.image?.filename"
                    class="aspect-[600/348] w-full h-auto object-cover border-b border-gray-100" alt="News Image" />
                  <div
                    class=" text-sm md:text-base font-bold text-[#032650] flex items-center justify-center p-2 text-center flex-grow">
                    <span class="line-clamp-2">{{ news.title }}</span>
                  </div>
                </router-link>
              </swiper-slide>
            </Swiper>

            <button
              class="news-next absolute right-0 top-1/2 -translate-y-1/2 z-10 text-[#032650] hover:scale-110 transition-transform cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </template>

          <div v-else
            class="w-full h-full flex items-center justify-center text-[#032650] font-medium text-center px-4">
            Aktuell keine News verfügbar.
          </div>
        </div>
      </div>

      <div class="xl:col-span-6 min-[1550px]:col-span-3! min-[1650px]:col-span-4! flex flex-col xl:pl-4 h-full order-3">
        <div class="xl:px-8">
          <h2
            class="font-bold text-[#032650] border-b-4 border-[#032650] inline-block mb-8 mt-4 text-2xl self-start xl:ml-1">
            Nächste Spiele
          </h2>

          <div ref="spieleChipsRow" class="flex flex-nowrap gap-2 mb-4 pl-1 overflow-x-auto">
            <template v-if="teamOptions.length > 1">
              <button v-for="option in teamOptions" :key="option" @click="selectedTeam = option" :class="[
                'shrink-0 px-3 py-1 text-sm font-medium rounded-full transition-colors cursor-pointer',
                selectedTeam === option
                  ? 'bg-[#032650] text-white shadow-sm'
                  : 'border border-[#032650] text-[#032650] hover:bg-[#032650] hover:text-white',
              ]">
                {{ option }}
              </button>
            </template>
            <button v-else class="shrink-0 px-3 py-1 text-sm font-medium rounded-full invisible"
              aria-hidden="true">Alle</button>
          </div>
        </div>

        <div
          class="relative w-full px-8 h-auto min-[1550px]:max-[1799px]:min-h-[clamp(150px,19vh,300px)] min-[1550px]:max-[1799px]:max-h-[calc(clamp(150px,19vh,300px)+18px)] min-[1800px]:h-[clamp(150px,19vh,300px)]!">
          <template v-if="filteredGames.length > 0">
            <button
              class="swiper-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 text-[#032650] hover:scale-110 transition-transform cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <swiper :modules="modules" :space-between="16" :auto-height="true" :breakpoints="{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1280: { slidesPerView: 2, autoHeight: false },
              1550: { slidesPerView: 1, autoHeight: false },
              1800: { slidesPerView: 2, autoHeight: false }
            }" :navigation="{ prevEl: '.swiper-prev-custom', nextEl: '.swiper-next-custom' }"
              :key="filteredGames.length"
              class="w-full h-auto min-[1550px]:max-[1799px]:min-h-full min-[1800px]:h-full! overflow-hidden">
              <swiper-slide v-for="game in filteredGames" :key="game._uid">
                <GameCard :date="game.date" :home-team="game.hometeam || game.homeTeam || ''"
                  :away-team="game.awayteam || game.awayTeam || ''" :homeLogo="game.homeLogo?.filename"
                  :awayLogo="game.awayLogo?.filename" :venue="game.venue" :team="game.team" v-editable="game"
                  class="shadow-sm border border-gray-200 rounded-xl hover:-translate-y-1 hover:shadow-md transition-all" />
              </swiper-slide>
            </swiper>

            <button
              class="swiper-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 text-[#032650] hover:scale-110 transition-transform cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </template>

          <div v-else
            class="w-full h-full flex items-center justify-center text-[#032650] font-bold text-center px-4 text-lg">
            Aktuell keine Spiele geplant.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mainPicture {
  background-image:
    linear-gradient(to right, rgba(2, 23, 49, 0.95) 30%, rgba(14, 112, 231, 0) 70%),
    url(@/assets/team.png);
  background-size: cover;
  color: rgb(3, 38, 80);
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #032650 !important;
  transform: scale(0.4);
  font-weight: bold;
}

:deep(.swiper) {
  overflow: visible !important;
  clip-path: inset(-100px -3px -100px -3px);
  width: 100%;
  height: 100%;
}

:deep(.swiper-autoheight .swiper-wrapper) {
  align-items: stretch;
}

:deep(.swiper-autoheight .swiper-slide) {
  height: 100%;
}

.master-card-shadow {
  background-color: white;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.master-card-shadow:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.3);
}

.swiper-button-disabled {
  opacity: 0.2;
  cursor: not-allowed;
  pointer-events: none;
  filter: grayscale(100%);
}
</style>