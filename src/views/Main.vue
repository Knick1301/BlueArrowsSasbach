<script setup lang="ts">
import { useStoryblok, useStoryblokApi } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed, ref } from 'vue'
import GameCard from '@/components/GameCard.vue'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const modules = [Navigation]

const selectedTeam = ref('Alle')

interface StoryblokLink {
  linktype: string
  cached_url?: string
  url?: string
}

interface GamesBlok {
  _uid: string
  component: string
  date: string
  hometeam: string
  awayteam: string
  homeLogo?: { filename: string }
  awayLogo?: { filename: string }
  venue?: string
  team: string
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

const extractGames = (bloks: any[], teamName: string): any[] => {
  let games: any[] = []
  if (!bloks || !Array.isArray(bloks)) return games

  for (const blok of bloks) {
    if (blok.component === 'Games' || blok.component === 'NextGame' || blok.component === 'games' || blok.component === 'game') {
      games.push({ ...blok, team: blok.team || teamName })
    }
    for (const key in blok) {
      if (Array.isArray(blok[key]) && blok[key].length > 0 && typeof blok[key][0] === 'object' && blok[key][0].component) {
        games.push(...extractGames(blok[key], teamName))
      }
    }
  }
  return games
}

const nextGames = computed(() => {
  let games: any[] = []
  if (allStoriesData && allStoriesData.stories) {
    allStoriesData.stories.forEach((storyItem: any) => {
      const currentTeamName = storyItem.name

      if (storyItem.content) {
        if (storyItem.content.body) {
          games.push(...extractGames(storyItem.content.body, currentTeamName))
        }
        for (const key in storyItem.content) {
          const field = storyItem.content[key]
          if (Array.isArray(field) && field.length > 0 && typeof field[0] === 'object' && field[0].component) {
            if (key !== 'body') {
              games.push(...extractGames(field, currentTeamName))
            }
          }
        }
      }
    })
  }
  return games
})

const teamOptions = computed(() => {
  const now = new Date()

  const upcomingGames = nextGames.value.filter((g: any) => new Date(g.date) >= now)

  const teams = [...new Set<string>(upcomingGames.map((g: any) => g.team as string))]

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
  if (!newsData || !newsData.stories) return []

  return newsData.stories.map((newsItem: any) => ({
    _uid: newsItem.uuid,
    title: newsItem.content.title,
    image: newsItem.content.image,
    link: {
      linktype: 'story',
      cached_url: newsItem.full_slug
    }
  }))
})

const teaser = computed(() =>
  story.value?.content.body.find((blok: any): blok is TeaserBlok => blok.component === 'teaser'),
)

const teamCards = computed(
  () =>
    story.value?.content.body.filter(
      (blok: any): blok is CardBlok => blok.component === 'TeamCard',
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
    .filter((g: any) => {
      const gameDate = new Date(g.date)
      return !isNaN(gameDate.getTime()) && gameDate >= now
    })
    .filter((g: any) => selectedTeam.value === 'Alle' || g.team === selectedTeam.value)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
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
    <div class="grid grid-cols-1 sm:gap-10 xl:grid-cols-12 xl:gap-8 items-stretch">

      <div class="xl:col-span-4 col-span-1 flex flex-col h-full order-2 xl:order-1">
        <h2 class="font-bold text-[#032650] border-b-4 border-[#032650] inline-block mb-8 mt-4 text-2xl self-start">
          Unsere Teams
        </h2>

        <div
          class="flex flex-wrap xl:flex-nowrap h-auto xl:h-[clamp(150px,23vh,350px)] mt-auto justify-between gap-y-4 xl:gap-y-0">
          <router-link v-for="team in teamCards" :key="team._uid" :to="getUrl(team.link)" v-editable="team"
            class="bg-white w-[48%] xl:w-[23%] rounded-t-xl rounded-b-lg master-card-shadow hover:-translate-y-1 transition-all flex flex-col overflow-hidden active:scale-95">
            <img :src="team.image?.filename" class="aspect-video xl:h-[80%] w-full object-cover" alt="Team Image" />
            <div
              class="text-sm xl:text-lg font-bold text-[#032650] flex items-center justify-center h-[20%] text-center">
              {{ team.title }}
            </div>
          </router-link>
        </div>
      </div>

      <div class="xl:col-span-4 col-span-1 flex flex-col xl:pl-4 h-full order-1 xl:order-2">
        <h2
          class="font-bold text-[#032650] border-b-4 border-[#032650] inline-block mb-8 xl:mx-8 mt-4 text-2xl self-start">
          <router-link to="/aktuelles/news" class="hover:text-blue-800 transition-colors">Aktuelle News</router-link>
        </h2>

        <div class="mt-auto relative w-full h-[clamp(150px,23vh,350px)] px-8">
          <template v-if="newsCards.length > 0">
            <button
              class="news-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 text-[#032650] hover:scale-110 transition-transform cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <Swiper :modules="modules" :space-between="16" :breakpoints="{
              0: { slidesPerView: 1 },
              1280: { slidesPerView: 2 }
            }" :navigation="{
              prevEl: '.news-prev',
              nextEl: '.news-next',
            }" class="w-full h-full pb-4">
              <swiper-slide v-for="news in newsCards" :key="news._uid">
                <router-link :to="getUrl(news.link)" v-editable="news"
                  class="bg-white w-full h-full rounded-t-xl rounded-b-lg master-card-shadow hover:-translate-y-1 transition-all flex flex-col overflow-hidden active:scale-95">
                  <img :src="news.image?.filename" class="h-[80%] w-full object-cover" alt="News Image" />
                  <div
                    class="text-sm xl:text-lg font-bold text-[#032650] flex items-center justify-center p-2 text-center flex-grow">
                    {{ news.title }}
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

      <div class="xl:col-span-4 col-span-1 flex flex-col xl:pl-4 h-full order-3">
        <div class="xl:px-8">
          <h2
            class="font-bold text-[#032650] border-b-4 border-[#032650] inline-block mb-6 mt-4 text-2xl self-start xl:ml-1">
            Nächste Spiele
          </h2>

          <div v-if="teamOptions.length > 1" class="mt-auto flex flex-wrap gap-2 mb-4 pl-1">
            <button v-for="option in teamOptions" :key="option" @click="selectedTeam = option" :class="[
              'px-3 py-1 text-sm font-medium rounded-full transition-colors cursor-pointer',
              selectedTeam === option
                ? 'bg-[#032650] text-white shadow-sm'
                : 'border border-[#032650] text-[#032650] hover:bg-[#032650] hover:text-white',
            ]">
              {{ option }}
            </button>
          </div>
        </div>

        <div class="relative w-full mt-auto px-8 h-[clamp(150px,20vh,220px)]">
          <template v-if="filteredGames.length > 0">
            <button
              class="swiper-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 text-[#032650] hover:scale-110 transition-transform cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <swiper :modules="modules" :space-between="16" :breakpoints="{
              0: { slidesPerView: 1 },
              1280: { slidesPerView: 2 }
            }" :navigation="{
              prevEl: '.swiper-prev-custom',
              nextEl: '.swiper-next-custom',
            }" :key="filteredGames.length" class="w-full h-full overflow-hidden">
              <swiper-slide v-for="game in filteredGames" :key="game._uid">
                <GameCard :date="game.date" :home-team="game.hometeam || game.homeTeam"
                  :away-team="game.awayteam || game.awayTeam" :homeLogo="game.homeLogo?.filename"
                  :awayLogo="game.awayLogo?.filename" :venue="game.venue" :team="game.team" v-editable="game"
                  class="master-card-shadow" />
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